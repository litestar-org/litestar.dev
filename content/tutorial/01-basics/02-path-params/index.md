---
title: Path and query parameters
description: Let Litestar parse, coerce and validate your parameters straight from type annotations.
section: Basics
teaches: coercion, and why /items/abc is a 404
requests:
  - label: GET /items/42
    method: GET
    path: /items/42
  - label: GET /items/42?q=litestar
    method: GET
    path: /items/42?q=litestar
  - label: GET /items/abc
    method: GET
    path: /items/abc
---

Path parameters are declared inline, with their type:

```python
@get("/items/{item_id:int}")
async def read_item(item_id: int) -> dict[str, object]:
    return {"item_id": item_id}
```

The `:int` in the path tells Litestar how to parse the segment, and the matching
`item_id: int` annotation is how the value reaches your function. The type is
part of the route itself, so `/items/abc` doesn't match at all and never reaches
your handler — it comes back as a `404`, which is why the third request below is
worth running.

**Query parameters** need no path syntax. Any handler argument that isn't a path
parameter is read from the query string, and giving it a default makes it
optional:

```python
async def read_item(item_id: int, q: str | None = None) -> dict[str, object]:
```

Without a default it is required, and a request that omits it gets a `400`.

## Your turn

Add an optional `q` query parameter to the handler and include it in the
response. Run the requests and compare `/items/42` with `/items/42?q=litestar`.
