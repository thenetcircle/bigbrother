# Welcome to Makefile of Bigbrother

watch-be:
	FLASK_APP=bigbrother FLASK_DEBUG=1 pipenv run python -m flask run

watch-fe:
	cd watchdog && npm run dev

test:
	@echo "test"

.PHONY: test