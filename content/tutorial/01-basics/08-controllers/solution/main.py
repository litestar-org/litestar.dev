from litestar import Litestar

from controllers.greet import GreetController

app = Litestar([GreetController])
