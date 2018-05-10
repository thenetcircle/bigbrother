# Welcome to Makefile of Bigbrother

dev:
	FLASK_APP=bigbrother FLASK_DEBUG=1 pipenv run python -m flask run & cd watchdog && npm run dev && fg

test:
	@echo "test"

.PHONY: test, dev