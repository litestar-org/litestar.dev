.PHONY: page

install:
	pre-commit install
	pdm install
	npm install

lint:
	uv run pre-commit run --all-files

clean:
	rm -rf page/_build

build-assets:
	npx tailwindcss -i page/index.css -o page/_static/index.css

page: clean build-assets
	uv run sphinx-build -M html page page/_build/ -a -j auto -W --keep-going

serve:
	uv run sphinx-autobuild page page/_build/ -j auto --pre-build="make clean build-assets" --watch=tailwind.config.js --ignore=page/_static/index.css
