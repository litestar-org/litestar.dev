from litestar import Litestar, get


@get("/")
async def index() -> dict[str, str]:
    # TODO: return a greeting instead of an empty dict
    return {}


app = Litestar([index])
