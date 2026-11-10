---
title: Query parameters
description: Read values from the query string, make them optional, and validate them before your handler runs.
section: First steps
teaches: FromQuery, defaults and constraints
requests:
  - label: GET /items?limit=2
    method: GET
    path: /items?limit=2
  - label: GET /items (no limit)
    method: GET
    path: /items
  - label: GET /items?limit=3&q=spec
    method: GET
    path: /items?limit=3&q=spec
  - label: GET /items?limit=0
    method: GET
    path: /items?limit=0
---

Path parameters are part of the route. Everything else a client sends in the
URL arrives as a **query parameter**, and you declare it by marking an argument
with `FromQuery`:

```python
from litestar.params import FromQuery

@get("/items")
async def list_items(limit: FromQuery[int]) -> dict[str, object]:
    ...
```

That parameter is **required**. A request to `/items` with no query string never
reaches your handler — Litestar answers `400` and says which parameter was
missing. Give it a default to make it optional:

```python
async def list_items(limit: FromQuery[int] = 10) -> ...
```

and use `| None = None` when "not provided" is a meaningful state rather than a
value you can default:

```python
async def list_items(q: FromQuery[str | None] = None) -> ...
```

::callout{icon="i-lucide-info"}
Litestar 3 asks you to be explicit here. An annotation without a default is
required, and an optional parameter says so with `= None` rather than having one
inferred for it.
::

## Constraints belong in the annotation

A limit of `0` is a bad request, not an empty page. Rather than checking it by
hand, declare the constraint and let it be enforced before your code runs:

```python
from typing import Annotated
from litestar.params import QueryParameter

async def list_items(limit: Annotated[int, QueryParameter(gt=0)]) -> ...
```

`gt`, `ge`, `lt`, `le`, `min_length`, `max_length` and `pattern` all work this
way, and all of them land in your OpenAPI schema — so the documented contract
and the enforced one can't drift apart.

## Your turn

The handler requires `limit` but ignores everything else. Two changes:

1. Add an optional `q` that filters the list, returning everything when it's absent.
2. Constrain `limit` so it must be greater than zero.

Run the requests. The last one should turn from `200` with an empty list into a
`400` that explains why.
