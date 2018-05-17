# Welcome to Makefile of Bigbrother

watch:
	FLASK_APP=bigbrother FLASK_DEBUG=1 pipenv run python -m flask run

watch-agent:
	cd agent && npm run dev

test:
	pipenv run python -m unittest discover -s tests

.PHONY: test