.PHONY: install test lint lint-actions validate

install:
	npm ci --ignore-scripts

test:
	npm test

lint:
	npm run lint

lint-actions:
	npm run lint:actions

validate: lint lint-actions test
