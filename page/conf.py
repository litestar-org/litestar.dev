html_theme = "starlite_sphinx_theme"

exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

templates_path = ["_templates"]

html_static_path = ["_static"]
html_show_sourcelink = False
html_sidebars = {"**": []}
html_additional_pages = {"index": "landing-page.html"}
nitpicky = True
html_favicon = "favicon.png"


html_theme_options = {
    "use_page_nav": False,
    "show_prev_next": False,
    "github_repo_name": "starlite",
    "navbar_persistent": ["theme-switcher"],
    "footer_start": [],
    "footer_end": [],
    "extra_navbar_items": {
        "Documentation": "https://docs.starliteproject.dev",
        "Community": {
            "Contribution Guide": "https://docs.starliteproject.dev/latest/contribution-guide",
            "Code of Conduct": "https://github.com/starlite-api/.github/blob/main/CODE_OF_CONDUCT.md",
        },
        "About": {
            "Organization": "about/organization",
            "Releases": "about/starlite-releases",
        },
        "Release notes": {
            "2.0 migration guide": "https://docs.starliteproject.dev/2/release-notes/migration_guide_2.html",
            "2.x Changelog": "https://docs.starliteproject.dev/2/release-notes/changelog.html",
            "1.x Changelog": "https://docs.starliteproject.dev/1/release-notes/changelog.html",
        },
    },
}
