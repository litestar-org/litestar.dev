from litestar import Litestar, get


@get("/")
async def index() -> dict[str, str]:
    return {"hello": "litestar"}


app = Litestar([index])
