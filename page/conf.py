from datetime import datetime

# -- Environmental Data ------------------------------------------------------
suppress_warnings = ["config.cache"]

# -- Project information -----------------------------------------------------
current_year = datetime.now().year  # noqa: DTZ005
copyright = f"{current_year}, Litestar Organization"  # noqa: A001

# -- Config -------------------------------------------------------------------
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]
nitpicky = True

# -- Style configuration -----------------------------------------------------
html_theme = "litestar_sphinx_theme"
html_title = "Litestar Framework"
pygments_style = "lightbulb"
todo_include_todos = True

html_static_path = ["_static"]
templates_path = ["_templates"]

html_show_sourcelink = False
html_copy_source = False
html_additional_pages = {"index": "landing-page.html"}

html_theme_options = {
    "logo_target": "/",
    "github_repo_name": "litestar",
    "navigation_with_keys": True,
    "use_page_nav": False,
    "nav_links": [  # TODO(provinzkraut): I need a guide on extra_navbar_items and its magic :P  # noqa: TD003, FIX002
        {"title": "Home", "url": "index"},
        {
            "title": "Community",
            "children": [
                {
                    "title": "Contributing",
                    "summary": "Learn how to contribute to the Type Lens project",
                    "url": "https://docs.litestar.dev/latest/contribution-guide.html",
                    "icon": "contributing",
                },
                {
                    "title": "Code of Conduct",
                    "summary": "Review the etiquette for interacting with the Litestar community",
                    "url": "https://github.com/litestar-org/.github?tab=coc-ov-file",
                    "icon": "coc",
                },
                {
                    "title": "Security",
                    "summary": "Overview of Litestar's security protocols",
                    "url": "https://github.com/litestar-org/.github?tab=coc-ov-file#security-ov-file",
                    "icon": "coc",
                },
            ],
        },
        {
            "title": "About",
            "children": [
                {
                    "title": "Litestar Organization",
                    "summary": "Details about the Litestar organization",
                    "url": "https://litestar.dev/about/organization",
                    "icon": "org",
                },
                {
                    "title": "Releases",
                    "summary": "Explore the release process, versioning, and deprecation policy for Litestar",
                    "url": "releases",
                    "icon": "releases",
                },
            ],
        },
        {
            "title": "Release notes",
            "children": [
                {
                    "title": "1.x Changelog",
                    "url": "changelog",
                    "summary": "All changes in the 1.x series",
                },
            ],
        },
        {
            "title": "Help",
            "children": [
                {
                    "title": "Discord Help Forum",
                    "summary": "Dedicated Discord help forum",
                    "url": "https://discord.gg/litestar",
                    "icon": "coc",
                },
                {
                    "title": "GitHub Discussions",
                    "summary": "GitHub Discussions",
                    "url": "https://github.com/litestar-org/dtos/discussions",
                    "icon": "coc",
                },
                {
                    "title": "Stack Overflow",
                    "summary": "We monitor the <code><b>litestar</b></code> tag on Stack Overflow",
                    "url": "https://stackoverflow.com/questions/tagged/litestar",
                    "icon": "coc",
                },
            ],
        },
        {"title": "Sponsor", "url": "https://github.com/sponsors/Litestar-Org", "icon": "heart"},
    ],
}

html_context = {
    "source_type": "github",
    "source_user": "litestar-org",
    "source_repo": "litestar",
    "code_sample": True,
    "info_cards": [
        {
            "title": "Fully-featured",
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
                "Litestar puts great emphasis on developer experience and performance: It's one of the fastest "
                "ASGI frameworks and developing with it is just as fast"
            ),
            "icon": None,
            "link": "https://docs.litestar.dev/latest/benchmarks",
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
    ],
    "feature_cards": [
        {
            "title": "Data Validation And Parsing",
            "content": "Leverage the power of type hints to define how data should be validated, parsed and serialized",
            "link": "https://docs.litestar.dev/2/usage/dto/index.html",
        },
        {
            "title": "Open Ecosystem",
            "content": (
                "Define schemas and models for validation with standard types such as dataclasses, libraries like "
                "Pydantic, msgspec, attr, or integrate your own"
            ),
            "link": "https://docs.litestar.dev/2/usage/applications.html",
        },
        {
            "title": "OpenAPI",
            "content": (
                "Automatically generated OpenAPI schemas help to document APIs and integrate with the frontend via "
                "TypeScript schema generation"
            ),
            "link": "https://docs.litestar.dev/2/usage/openapi/index.html",
        },
        {
            "title": "Interactive API Documentation",
            "content": (
                "Interactively explore your APIs through Swagger, Redoc or Stoplight Elements, powered by OpenAPI"
            ),
            "link": "https://docs.litestar.dev/2/usage/openapi/ui_plugins.html",
        },
        {
            "title": "Middlewares",
            "content": (
                "Handle rate-limiting, CORS, CSRF, compression, logging and many more common tasks with Litestar's "
                "built-in middlewares"
            ),
            "link": "https://docs.litestar.dev/2/usage/middleware/builtin-middleware.html",
        },
        {
            "title": "Data Stores",
            "content": (
                "Interfaces for various key/value stores that seamlessly integrate with "
                "your application and third party extensions"
            ),
            "link": "https://docs.litestar.dev/2/usage/stores.html",
        },
        {
            "title": "ORM Integration",
            "content": (
                "First-class SQLAlchemy support let's you use your models for validation and serialization directly,"
                " reducing code duplication"
            ),
            "link": "https://docs.litestar.dev/2/usage/databases/sqlalchemy/index.html",
        },
        {
            "title": "Dependency Injection",
            "content": (
                "Powerful dependency injection on all application layers, aides in code decoupling and reduces "
                "repetition"
            ),
            "link": "https://docs.litestar.dev/2/usage/dependency-injection.html",
        },
        {
            "title": "Caching",
            "content": "Response caching with minimal configuration and overhead to speed up response times",
            "link": "https://docs.litestar.dev/2/usage/caching.html",
        },
        {
            "title": "WebSockets",
            "content": (
                "Easy to use WebSockets integration, featuring high- and low-level APIs and support for automatic data "
                "validation and serialization"
            ),
            "link": "https://docs.litestar.dev/2/usage/websockets.html",
        },
        {
            "title": "Runtime Safety Through Strict Validation",
            "content": (
                "Litestar is strictly typed and user supplied functions are meticulously validated to minimize "
                "runtime errors"
            ),
            "link": "https://docs.litestar.dev/2/usage/routing/handlers.html",
        },
        {
            "title": "Authentication And Authorization",
            "content": (
                "Session and JWT based authentication and utilities at your disposal to start building your "
                "authentication layer with ease"
            ),
            "link": "https://docs.litestar.dev/2/usage/security/index.html",
        },
    ],
    "announcement": {
        "title": "Litestar 2.12.1 has been released!",
        "description": "Check it out here",
        "link": "https://docs.litestar.dev/latest/release-notes/changelog.html#2.14.0",
    },
    "project_name": "Litestar",
    "project_url": "https://litestar.dev",
    "project_github_url": "https://github.com/litestar-org/litestar",
    "project_tagline": "Effortlessly build performant APIs",
    "project_description_short": "The powerful, lightweight and flexible ASGI framework",
}
