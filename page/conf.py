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
            "title": "Data Validation And Serialization",
            "content": (
                "Validation of incoming and serialization of outgoing data, configured with"
                "type hints with support for libraries such as Pydantic or attrs"
            ),
            "link": "https://docs.starliteproject.dev/2/usage/dto.html",
        },
        {
            "title": "OpenAPI",
            "content": (
                "Automatic OpenAPI schemas created based on from route handlers and type annotations, "
                "and options to export them as TypeScript "
            ),
            "link": "https://docs.starliteproject.dev/2/usage/openapi.html",
        },
        {
            "title": "Middlewares",
            "content": (
                "Rate-limiting, CORS, CSRF, client- and server-side sessions, compression, logging and many more "
                "features are all readily available via built in middlewares"
            ),
            "link": "https://docs.starliteproject.dev/2/usage/middleware/builtin-middleware.html",
        },
        {
            "title": "Data Stores",
            "content": (
                "Interfaces for various key/value stores that seamlessly integrate with "
                "features such as server-side sessions or response caching, easily managed and organized into "
                "hierarchical structures"
            ),
            "link": "https://docs.starliteproject.dev/2/usage/stores.html",
        },
        {
            "title": "ORM Integration",
            "content": (
                "First-class SQLAlchemy support via DTO backends and plugins that seamlessly integrates with data"
                "validation and parsing: Models can be returned straight away or used to validate incoming data"
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
            "content": "Response caching with minimal configuration and overhead to speed up applications",
            "link": "https://docs.starliteproject.dev/2/usage/caching.html",
        },
    ],
    "announcement": {
        "title": "Starlite 2.0.0alpha1 is available",
        "description": "Check out the latest release here",
        "link": "https://github.com/starlite-api/starlite/releases/tag/v2.0.0alpha1",
    },
    "project_name": "Starlite",
    "project_tagline": "Effortlessly create performant APIs",
    "project_description_short": "The powerful, lightweight and flexible ASGI framework",
}
