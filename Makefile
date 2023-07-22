.PHONY: page

install:
	pre-commit install
	poetry install
	npm install

clean:
	rm -rf page/_build

build-assets:
	npx tailwindcss -i page/index.css -o page/_static/index.css

page: clean build-assets
	sphinx-build -M html page page/_build/ -a -j auto -W --keep-going

serve:
	sphinx-autobuild page page/_build/ -j auto --pre-build="make clean build-assets" --watch=tailwind.config.js --ignore=page/_static/index.css
