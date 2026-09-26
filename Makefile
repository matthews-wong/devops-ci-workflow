.PHONY: install test test-coverage lint lint-actions validate

install:
	npm ci --ignore-scripts

test:
	npm test

test-coverage:
	npm run test:coverage

lint:
	npm run lint

lint-actions:
	npm run lint:actions

validate: lint lint-actions test-coverage
