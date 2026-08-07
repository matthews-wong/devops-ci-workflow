# CI Workflow Template

A minimal, dependency-free Node.js project scaffold paired with a lean GitHub
Actions pipeline. It is meant as a compact reference for wiring up continuous
integration on a new repository: lint the workflow files themselves, run tests
across Node versions, and fail loudly when something breaks.

## Project layout

```
.github/workflows/ci.yml   # lint workflow files + run tests on push / PR
src/helpers.js              # sample dependency-free module
test/helpers.test.js        # tests using the built-in node:test runner
package.json                # test script + engines contract
```

## Local usage

Run the tests with the Node built-in test runner (no install step needed):

```bash
npm test
```

Validate the workflow YAML offline with [actionlint](https://github.com/rhysd/actionlint):

```bash
actionlint .github/workflows/ci.yml
```

## Pipeline

On every push to `main` and on pull requests, the `test` job runs the suite on
Node 18, 20, and 22, reading dependencies from the committed lockfile. A second
`actionlint` job validates the workflow definitions so a typo in the YAML fails
before it ever reaches a runner. Failing tests block the merge; errors are never
masked with `|| true`.