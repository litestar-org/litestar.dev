from typing import Annotated

from litestar import Litestar, get
from litestar.params import FromQuery, QueryParameter

ITEMS = ["litestar", "msgspec", "advanced-alchemy", "sqlspec", "polyfactory"]


@get("/items")
async def list_items(
    limit: Annotated[int, QueryParameter(gt=0)],
    q: FromQuery[str | None] = None,
) -> dict[str, object]:
    matches = [item for item in ITEMS if q in item] if q else ITEMS
    return {"items": matches[:limit], "q": q}


app = Litestar([list_items])
