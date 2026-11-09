import msgspec
from litestar import Litestar, post


class Todo(msgspec.Struct):
    # TODO: reject an empty title with msgspec.Meta(min_length=1)
    title: str
    done: bool = False


@post("/todos")
async def create_todo(data: Todo) -> Todo:
    return data


app = Litestar([create_todo])
