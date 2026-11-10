from litestar import Litestar, get


@get("/")
async def index() -> dict[str, str]:
    # TODO: this chapter is a draft — its exercise hasn't been written yet.
    return {"chapter": "not written yet"}


app = Litestar([index])
