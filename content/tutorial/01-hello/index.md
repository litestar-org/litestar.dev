---
title: Your first route
description: Build a Litestar app with a single route handler and watch it answer a request — all inside your browser.
section: Introduction
teaches: routing and type-driven responses
requests:
  - label: GET /
    method: GET
    path: /
---

Litestar applications are built from **route handlers**: ordinary async functions
decorated to describe the HTTP method and path they answer.

```python
@get("/")
async def index() -> dict[str, str]:
    return {"hello": "litestar"}
```

Two things are doing real work here. The `@get("/")` decorator registers the
function for `GET` requests to `/`. The `-> dict[str, str]` return annotation is
not decoration — Litestar reads it to decide how to serialize your response, and
it feeds the OpenAPI schema. Litestar leans on your type hints rather than
asking you to repeat yourself in configuration.

Handlers are then passed to the application itself:

```python
app = Litestar([index])
```

The `app` object is what the runner looks for in `main.py`, exactly as an ASGI
server like Granian or Uvicorn would.

::callout{icon="i-lucide-info"}
There's no server here. Your code is compiled to WebAssembly and the request is
handed straight to the ASGI application — the same code path a production
deployment uses.
::

## Your turn

The handler currently returns an empty dict. Return `{"hello": "litestar"}`
instead, then press **Run**.
