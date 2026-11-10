from litestar import Litestar, get


@get("/")
async def index() -> dict[str, str]:
    return {"chapter": "not written yet"}


app = Litestar([index])
