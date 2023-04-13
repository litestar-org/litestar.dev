# Contribution guide

welcome to Litestar! We're excited that you're interested in contributing to Litestar.dev. Before you get started,
please read the following guidelines. If you have any questions, feel free to ask in
the [Litestar Discord server](https://discord.gg/X3FJqy8d2j). We're happy to help!

## Setting up the environment

1. Install [Poetry](https://python-poetry.org/) - Run `curl -sSL https://install.python-poetry.org | python3 - ` to
   install poetry.
2. Install [Node.js](https://nodejs.org/en) - `https://nodejs.org/en`.
3. Install [Pre-commit](https://pre-commit.com/) - Run `pip install pre-commit` to install pre-commit hooks.
4. Run `make install` to install Python and Node dependencies.
5. Activate the virtual environment by running `poetry shell`.
6. Run `make serve` to start the development server.

## Tips

Many modern IDEs like PyCharm or VS Code will enable the poetry-managed virtualenv that is created in step 2 for you
automatically.
If your IDE / editor doesn't offer this functionality, then you will need to manually activate the virtualenv yourself.
Otherwise, you may encounter errors or unexpected behaviour when trying to run the commands referenced within this
document.

The easiest way to activate this virtualenv manually is by running `poetry shell`, as described at
`Using your virtual environment <https://python-poetry.org/docs/basic-usage/#using-your-virtual-environment>` in
poetry's documentation.

The rest of this document will assume this environment is active wherever commands are referenced.

## Code contributions

## Workflow

1. Fork the [this repository](https://github.com/litestar-org/litestar.dev) on GitHub by visiting the
   URL [https://github.com/litestar-org/litestar.dev/fork](https://github.com/litestar-org/litestar.dev/fork)
2. Clone your fork of the repository to your local machine using Git.
3. Follow the instructions described in the [above section](#setting-up-the-environment) to set up your environment.
4. Create a new branch and Make your desired changes to the code.
5. (Optional) Run the command `pre-commit run --all-files` to run linters and formatters. This step is not
   necessary, as Git will automatically execute this command before you commit changes. However, you may want to run it
   manually in order to apply fixes.
6. Commit your changes to the Git repository.
7. Push the changes to your fork on GitHub.
8. Open a pull request by visiting your branch on
   GitHub [https://github.com/litestar-org/litestar.dev/branch/your-new-branch-name](https://github.com/litestar-org/litestar.dev/branch/your-new-branch-name).
   In the title of the pull request, describe the changes you made and include the issue number if applicable. You may
   use [Conventional Commits](https://www.conventionalcommits.org/) to structure your commit messages.
   For example,

   - feat: allow provided a config object to extend other configs.
   - fix: handle strings in config extending.
   - docs: correct spelling of CHANGELOG.
   - style: convert tabs to spaces.

9. Wait for the CI to run and for a maintainer to review your changes. If any changes are requested, make them and
   commit them to the same branch. The CI will automatically run again, and the maintainer will review your changes
   again. Repeat this process until your changes are approved.
10. Once your changes have been approved, a maintainer will merge them into the main branch.
11. Congratulations! You've successfully contributed to Litestar!
12. (Optional) Add yourself to the list of contributors in the README.md file. This is not mandatory, but it is greatly
    appreciated. To do so, follow the instructions in
    the [Adding yourself as a contributor](https://allcontributors.org/docs/en/bot/usage).

## Guidelines for writing documentation

- All files should be written in [ReST](https://docutils.sourceforge.io/rst.html),
  [Sphinx](https://www.sphinx-doc.org/en/master/), If you're unfamiliar with any of
  those, [ReStructuredText primer](https://www.sphinx-doc.org/en/master/lib/usage/restructuredtext/basics.html),
  and [Sphinx quickstart](https://www.sphinx-doc.org/en/master/lib/usage/quickstart.html) are recommended reads.
- For css styling, we use [tailwindcss](https://tailwindcss.com/).
- To Run the documentation locally, run the command `make serve`.
- To build the documentation, run the command `make build`.
- To build the documentation and serve it locally, run the command `make serve`.
-
