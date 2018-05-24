.PHONY: all test

all: test

test:
	pipenv run python -m unittest discover -s tests

watch:
	FLASK_APP=bigbrother FLASK_DEBUG=1 BB_CONFIG=$(PWD)/config.sample.yaml pipenv run python -m flask run

watch-agent:
	cd agent && npm run dev
