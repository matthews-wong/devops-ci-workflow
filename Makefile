.PHONY: install test lint lint-actions validate

install:
	npm ci

test:
	npm test

lint:
	npm run lint

lint-actions:
	npm run lint:actions

validate: lint lint-actions test
