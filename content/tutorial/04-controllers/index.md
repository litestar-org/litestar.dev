---
title: Organising with controllers
description: Group related handlers into a Controller and split them out of main.py, the way a real project grows.
teaches: splitting handlers out of main.py
requests:
  - label: GET /greet/world
    method: GET
    path: /greet/world
  - label: GET /greet/litestar?excited=true
    method: GET
    path: /greet/litestar?excited=true
---

So far everything has lived in `main.py`. Real projects outgrow that quickly,
and Litestar's answer is the **Controller**: a class that owns a path prefix and
groups the handlers underneath it.

```python
class GreetController(Controller):
    path = "/greet"

    @get("/{name:str}")
    async def greet(self, name: str) -> dict[str, str]:
        return {"message": f"Hello, {name}!"}
```

The class-level `path` is a prefix, so the handler above answers
`/greet/{name}`. Handlers are methods and take `self`; everything you've already
seen — path parameters, query parameters, `data` bodies — works exactly the
same way inside a controller.

Controllers are registered like any other handler:

```python
app = Litestar([GreetController])
```

Because the controller lives in its own module, `main.py` stays small: it wires
the application together and nothing else. That separation is what lets a
Litestar project grow from one file to a package without rewriting it.

::callout{icon="i-lucide-folder-tree"}
This step ships two files. Use the tree on the left to move between them — the
whole folder is written to the virtual filesystem before your app starts, so
imports across modules behave exactly as they would on disk.
::

## Your turn

`controllers/greet.py` already defines `GreetController`, but `main.py` creates
an app with no handlers. Import the controller and register it, then run the
requests.

For the second request to do anything, add an `excited: bool = False` query
parameter to the handler and append an exclamation mark when it's set.
