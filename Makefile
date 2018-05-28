.PHONY: all test install_local watch watch-agent

all: test

test:
	pipenv run python -m unittest discover -s tests

install_local:
	pipenv run pip install -e .

watch:
	FLASK_APP=bigbrother.web FLASK_DEBUG=1 BB_CONFIG=$(PWD)/config.default.yaml pipenv run python -m flask run

watch-agent:
	cd agent && npm run dev
