from litestar import Controller, get


class GreetController(Controller):
    path = "/greet"

    @get("/{name:str}")
    async def greet(self, name: str, excited: bool = False) -> dict[str, str]:
        return {"message": f"Hello, {name}{'!' if excited else ''}"}
