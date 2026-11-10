---
title: Validating request bodies
description: Declare a msgspec Struct and get parsing, validation and typed error responses for free.
section: First steps
teaches: msgspec Structs and typed 400s
requests:
  - label: POST /todos
    method: POST
    path: /todos
    body:
      title: Write the tutorial
  - label: POST /todos (empty title)
    method: POST
    path: /todos
    body:
      title: ''
  - label: POST /todos (wrong type)
    method: POST
    path: /todos
    body:
      title: 123
---

To accept a request body, annotate a parameter named `data`. Litestar reads its
type to decide how to decode and validate the payload:

```python
class Todo(msgspec.Struct):
    title: str
    done: bool = False


@post("/todos")
async def create_todo(data: Todo) -> Todo:
    return data
```

[msgspec](https://jcristharif.com/msgspec/) is Litestar's default serializer,
and it's a large part of why the framework is fast — validation happens in C
while decoding, not in a second pass over the data. A payload whose `title` is a
number never reaches your handler; the client gets a `400` describing exactly
which field failed.

Constraints go in the annotation rather than in handwritten checks:

```python
from typing import Annotated

title: Annotated[str, msgspec.Meta(min_length=1)]
```

Those constraints are enforced on the way in _and_ published in your OpenAPI
schema, so the docs can't drift from the behaviour.

## Your turn

Right now an empty title is accepted. Constrain `title` with
`msgspec.Meta(min_length=1)` and run the requests again — the second one should
turn from `201` into a `400`.
