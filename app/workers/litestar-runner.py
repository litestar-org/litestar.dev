"""Runs a tutorial step's code against the real Litestar app, inside Pyodide.

There is no HTTP server here. An ASGI application is just an async callable, so
requests are handed to it in-process through ``httpx.ASGITransport`` — the same
path Litestar's own test client takes, minus the threads Pyodide can't provide.

This module is loaded verbatim by both the browser worker and the Node smoke
test, so CI exercises the code that actually ships.
"""

from __future__ import annotations

import asyncio
import contextlib
import importlib
import json
import logging.handlers
import pathlib
import shutil
import sys
import traceback
from typing import Any

WORKDIR = pathlib.Path("/home/pyodide/app")
BASE_URL = "http://litestar.local"


def install_shim() -> None:
    """Make Litestar's defaults survive a runtime with no threads.

    Pyodide's main thread cannot spawn threads, and Litestar's default logging
    config starts a ``QueueListener`` thread. Neutering the listener keeps the
    logging config valid while dropping the background drain.
    """
    logging.handlers.QueueListener.start = lambda self: None  # type: ignore[method-assign]
    logging.handlers.QueueListener.stop = lambda self: None  # type: ignore[method-assign]

    # Bytecode caches would survive between runs and shadow edited code.
    sys.dont_write_bytecode = True

    WORKDIR.mkdir(parents=True, exist_ok=True)
    if str(WORKDIR) not in sys.path:
        sys.path.insert(0, str(WORKDIR))


@contextlib.asynccontextmanager
async def lifespan(app: Any) -> Any:
    """Drive the ASGI lifespan protocol without threads.

    ``litestar.testing`` clients rely on an anyio blocking portal, which needs a
    worker thread. Pumping the protocol over two queues keeps startup and
    shutdown hooks working on a single-threaded event loop.
    """
    receive: asyncio.Queue[dict[str, Any]] = asyncio.Queue()
    send: asyncio.Queue[dict[str, Any]] = asyncio.Queue()
    task = asyncio.ensure_future(
        app({"type": "lifespan", "asgi": {"version": "3.0"}}, receive.get, send.put)
    )

    await receive.put({"type": "lifespan.startup"})
    message = await send.get()
    if message["type"] == "lifespan.startup.failed":
        raise RuntimeError(message.get("message") or "ASGI startup failed")

    try:
        yield
    finally:
        await receive.put({"type": "lifespan.shutdown"})
        with contextlib.suppress(Exception):
            await asyncio.wait_for(send.get(), timeout=5)
        with contextlib.suppress(Exception):
            await asyncio.wait_for(task, timeout=5)


def _reset_user_modules() -> None:
    """Forget previously imported step modules so edits take effect.

    Packages shipped by a step (``controllers/``) are namespace packages with no
    ``origin``, so their search locations are checked too — otherwise a stale
    package would shadow the freshly written files.
    """
    workdir = str(WORKDIR)
    for name, module in list(sys.modules.items()):
        spec = getattr(module, "__spec__", None)
        origin = getattr(spec, "origin", None)
        locations = list(getattr(spec, "submodule_search_locations", None) or [])

        if (isinstance(origin, str) and origin.startswith(workdir)) or any(
            isinstance(location, str) and location.startswith(workdir)
            for location in locations
        ):
            del sys.modules[name]
    importlib.invalidate_caches()


def load_app(files: dict[str, str], entrypoint: str = "main.py") -> Any:
    """Write the step's files to the virtual FS and import its ``app``.

    The whole workdir is recreated each run: a file the reader removed (or one
    left by a previous step) must not linger and keep satisfying an import.
    """
    if WORKDIR.exists():
        shutil.rmtree(WORKDIR)
    WORKDIR.mkdir(parents=True, exist_ok=True)

    for filename, source in files.items():
        target = WORKDIR / filename
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(source)

    _reset_user_modules()
    module = importlib.import_module(entrypoint.removesuffix(".py"))

    app = getattr(module, "app", None)
    if app is None:
        raise AttributeError(
            f"{entrypoint} must define an `app` variable, e.g. `app = Litestar([index])`"
        )
    return app


async def run(payload: str) -> str:
    """Execute a step and return its responses as JSON.

    ``payload`` is ``{"files": {name: source}, "requests": [...]}``. Errors in
    the user's own code come back as ``{"error": ...}`` rather than raising, so
    the UI can show a traceback instead of a broken button.
    """
    request = json.loads(payload)
    files: dict[str, str] = request["files"]
    requests: list[dict[str, Any]] = request.get("requests") or []

    try:
        app = load_app(files, request.get("entrypoint", "main.py"))
    except Exception:
        return json.dumps({"error": traceback.format_exc(limit=3), "phase": "load"})

    import httpx

    results: list[dict[str, Any]] = []
    try:
        async with (
            lifespan(app),
            httpx.AsyncClient(
                transport=httpx.ASGITransport(app=app, raise_app_exceptions=False),
                base_url=BASE_URL,
            ) as client,
        ):
            for spec in requests:
                response = await client.request(
                    spec.get("method", "GET"),
                    spec["path"],
                    json=spec.get("body"),
                )
                results.append(
                    {
                        "label": spec.get("label")
                        or f"{spec.get('method', 'GET')} {spec['path']}",
                        "status": response.status_code,
                        "contentType": response.headers.get("content-type", ""),
                        "body": response.text,
                    }
                )
    except Exception:
        return json.dumps(
            {
                "error": traceback.format_exc(limit=5),
                "phase": "request",
                "results": results,
            }
        )

    return json.dumps({"results": results})
