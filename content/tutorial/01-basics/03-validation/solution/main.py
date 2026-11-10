from typing import Annotated

import msgspec
from litestar import Litestar, post


class Todo(msgspec.Struct):
    title: Annotated[str, msgspec.Meta(min_length=1)]
    done: bool = False


@post("/todos")
async def create_todo(data: Todo) -> Todo:
    return data


app = Litestar([create_todo])
