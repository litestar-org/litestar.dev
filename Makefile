.PHONY: page

page:
	rm -rf page/_build
	sphinx-build -M html page page/_build/ -a -j auto -W --keep-going
