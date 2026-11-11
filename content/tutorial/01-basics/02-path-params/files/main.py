from litestar import Litestar, get


@get("/items/{item_id:int}")
async def read_item(item_id: int) -> dict[str, object]:
    # TODO: accept an optional `q` query parameter and return it too
    return {"item_id": item_id}


app = Litestar([read_item])
