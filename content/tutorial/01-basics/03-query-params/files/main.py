from litestar import Litestar, get
from litestar.params import FromQuery

ITEMS = ["litestar", "msgspec", "advanced-alchemy", "sqlspec", "polyfactory"]


@get("/items")
async def list_items(limit: FromQuery[int]) -> dict[str, object]:
    # TODO: accept an optional `q` that filters ITEMS, and require limit > 0
    return {"items": ITEMS[:limit]}


app = Litestar([list_items])
