.PHONY: page

install:
	uv sync
	npm install
	pre-commit install

lint:
	uv run pre-commit run --all-files

ifeq ($(OS),Windows_NT)
clean:
	if exist page\_build rmdir /s /q page\_build
else
clean:
	rm -rf page/_build
endif

build-assets:
	npx tailwindcss -i page/index.css -o page/_static/index.css

page: clean build-assets
	uv run sphinx-build -M html page page/_build/ -a -j auto -W --keep-going

serve:
	uv run sphinx-autobuild page page/_build/ -j auto --pre-build="make clean build-assets" --watch=tailwind.config.js --ignore=page/_static/index.css
