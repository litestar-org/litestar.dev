copyright = "2023 - Starlite API"  # noqa: A001

html_theme = "starlite_sphinx_theme"

exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

templates_path = ["_templates"]

html_static_path = ["_static"]
html_show_sourcelink = False
html_sidebars = {"**": []}
html_additional_pages = {"index": "landing-page.html"}
nitpicky = True

html_theme_options = {
    "use_page_nav": False,
    "show_prev_next": False,
    "github_repo_name": "starlite",
    "extra_navbar_items": {
        "Docs": "https://docs.starliteproject.dev",
        "Community": {
            "Contributing": {
                "description": "Learn how to contribute to the Starlite project",
                "link": "/contributing",
                "icon": "contributing",
            },
            "Code of Conduct": {
                "description": "Review the etiquette for interacting with the Starlite community",
                "link": "/coc",
                "icon": "coc",
            },
        },
        "About": {
            "Starlite Organization": {
                "description": "Details about the Starlite organization",
                "link": "about/organization",
                "icon": "org",
            },
            "Releases": {
                "description": "View the release history for Starlite",
                "link": "about/starlite-releases",
                "icon": "releases",
            },
        },
        "Help": "https://github.com/orgs/starlite-api/discussions",
    },
}

html_context = {
    "code_sample": True,
    "info_cards": [
        {
            "title": "Fully featured",
            "content": (
                "Everything that's needed to build modern APIs, from data serialization and validation to websockets, "
                "ORM integration, session management, authentication and more"
            ),
            "icon": None,
            "link": None,
        },
        {
            "title": "Fast",
            "content": (
                "Starlite puts great emphasis on developer experience and performance: It's one of the fastest "
                "ASGI frameworks and developing with it is just as fast"
            ),
            "icon": None,
            "link": "https://docs.starliteproject.dev/latest/benchmarks",
        },
        {
            "title": "(a)synchronous",
            "content": (
                "Asynchronous at heart, but with synchronous execution not as a second class citizen: "
                "Synchronous applications run without performance penalties"
            ),
            "icon": None,
            "link": None,
        },
        {
            "title": "Community driven",
            "content": (
                "Developed by a community of volunteers, and led by a team of maintainers, Starlite is a "
                "community project at heart"
            ),
            "icon": None,
            "link": "https://starliteproject.dev/about/organization.html",
        },
        {
            "title": "Opinionated yet flexible",
            "content": "Developed to encourage best practices, but flexible enough to stay out of your way",
            "icon": None,
            "link": None,
        },
        {
            "title": "Scalable",
            "content": (
                "Bottom-up architecture makes it easy to develop modular and decoupled code, allowing "
                "applications to scale easily, both in development and deployment"
            ),
            "icon": None,
            "link": None,
        },
    ],
    "feature_cards": [
        {
            "title": "Data Validation And Parsing",
            "content": "Leverage power of type hints to define how data should be validated, parsed and serialized",
            "link": "https://docs.starliteproject.dev/2/usage/dto.html",
        },
        {
            "title": "Open Ecosystem",
            "content": (
                "Define schemas and models for validation with standard types such as dataclasses, libraries like "
                "Pydantic, or integrate your own"
            ),
        },
        {
            "title": "OpenAPI",
            "content": (
                "Automatically generated OpenAPI schemas help to document APIs and integrate with the frontend via "
                "TypeScript schema generation"
            ),
            "link": "https://docs.starliteproject.dev/2/usage/openapi.html",
        },
        {
            "title": "Interactive API documentation",
            "content": (
                "Interactively explore your APIs through Swagger, Redoc or Stoplight Elements, powered by OpenAPI"
            ),
        },
        {
            "title": "Middlewares",
            "content": (
                "Handle rate-limiting, CORS, CSRF, compression, logging and many more common tasks with Litestar's "
                "built-in middlewares"
            ),
            "link": "https://docs.starliteproject.dev/2/usage/middleware/builtin-middleware.html",
        },
        {
            "title": "Data Stores",
            "content": (
                "Interfaces for various key/value stores that seamlessly integrate with "
                "your application and third party extensions"
            ),
            "link": "https://docs.starliteproject.dev/2/usage/stores.html",
        },
        {
            "title": "ORM Integration",
            "content": (
                "First-class SQLAlchemy support let's you use your models for validation and serialization directly,"
                " reducing code duplication"
            ),
            "link": "https://docs.starliteproject.dev/2/usage/plugins/sqlalchemy.html",
        },
        {
            "title": "Dependency Injection",
            "content": (
                "Powerful dependency injection on all application layers, aides in code decoupling and reduces "
                "repetition"
            ),
            "link": "https://docs.starliteproject.dev/2/usage/dependency-injection.html",
        },
        {
            "title": "Caching",
            "content": "Response caching with minimal configuration and overhead to speed up response times",
            "link": "https://docs.starliteproject.dev/2/usage/caching.html",
        },
        {
            "title": "WebSockets",
            "content": (
                "Easy to used WebSockets integration, featuring high and low-level APIs and support for automatic data "
                "validation and serialization"
            ),
            "link": "https://docs.starliteproject.dev/2/usage/websockets.html",
        },
        {
            "title": "Runtime safety through strict validation",
            "content": (
                "Litestar is strictly typed, and user supplied functions are meticulously validated to minimize "
                "runtime errors"
            ),
            "link": "https://docs.starliteproject.dev/2/usage/route-handlers.html",
        },
        {
            "title": "Authentication And Authorization",
            "content": (
                "Session and JWT based authentication and utilities at your disposal to start building your "
                "authentication layer"
            ),
            "link": "https://docs.starliteproject.dev/2/usage/security.html",
        },
    ],
    "announcement": {
        "title": "Litestar 2.0.0alpha3 is available",
        "description": "Check out the latest release here",
        "link": "https://github.com/starlite-api/starlite/releases/tag/v2.0.0alpha1",
    },
    "project_name": "Litestar",
    "project_tagline": "Effortlessly create performant APIs",
    "project_description_short": "The powerful, lightweight and flexible ASGI framework",
}
