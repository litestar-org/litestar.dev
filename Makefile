.PHONY: page

clean:
	rm -rf page/_build

page: clean
	sphinx-build -M html page page/_build/ -a -j auto -W --keep-going


serve:
	sphinx-autobuild page page/_build/ -j auto --pre-build="make clean"
