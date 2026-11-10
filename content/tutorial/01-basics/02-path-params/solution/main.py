from litestar import Litestar, get


@get("/items/{item_id:int}")
async def read_item(item_id: int, q: str | None = None) -> dict[str, object]:
    return {"item_id": item_id, "q": q}


app = Litestar([read_item])
