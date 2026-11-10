from litestar import Controller, get


class GreetController(Controller):
    path = "/greet"

    # TODO: add an `excited: bool = False` query parameter
    @get("/{name:str}")
    async def greet(self, name: str) -> dict[str, str]:
        return {"message": f"Hello, {name}"}
