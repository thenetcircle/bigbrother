.PHONY: all test install watch watch-agent

all: test

test:
	pipenv run python -m unittest discover -s tests

install:
	pipenv run pip install -e .

watch:
	FLASK_APP=bigbrother.web FLASK_DEBUG=1 BB_CONFIG=$(PWD)/config.sample.yaml pipenv run python -m flask run

watch-agent:
	cd agent && npm run dev
