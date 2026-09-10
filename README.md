# CI Workflow Template

[![CI](https://github.com/matthews-wong/devops-ci-workflow/actions/workflows/ci.yml/badge.svg)](https://github.com/matthews-wong/devops-ci-workflow/actions/workflows/ci.yml)

A minimal, dependency-free Node.js project scaffold paired with a lean GitHub
Actions pipeline. It is meant as a compact reference for wiring up continuous
integration on a new repository: lint the workflow files themselves, run tests
across Node versions, and fail loudly when something breaks.

## Project layout

```
.github/workflows/ci.yml   # syntax checks + tests + actionlint on push / PR
.github/dependabot.yml     # weekly updates for actions and npm dependencies
src/helpers.js              # sample dependency-free module
test/helpers.test.js        # tests using the built-in node:test runner
package.json                # test/lint scripts + engines contract
```

## Local usage

Run the tests with the Node built-in test runner (no install step needed):

```bash
npm test
```

Syntax-check the sources and tests without any linter dependency:

```bash
npm run lint
```

Validate the workflow YAML offline with [actionlint](https://github.com/rhysd/actionlint):

```bash
actionlint .github/workflows/ci.yml
```

Or run lint and tests together with a single command:

```bash
npm run validate
```

## Pipeline

On every push to `main` and on pull requests, three jobs run:

- `lint` — a syntax check of the sources and tests using `node --check`,
  followed by `npm audit` at a high severity threshold, so a typo or a known
  vulnerable dependency both fail in seconds.
- `test` — the suite on the current supported Node LTS lines (20, 22, 24),
  reading dependencies from the committed lockfile. Failing tests block the
  merge; errors are never masked with `|| true`.
- `actionlint` — validates the workflow definitions themselves. The actionlint
  binary is downloaded pinned to a release and verified against the release
  checksum before it runs, so a tampered or truncated download never reaches
  the runner.

Dependabot opens weekly update PRs for the pinned actions and npm metadata so
the template does not drift from current releases.

## Design decisions

**Three separate jobs instead of one.** `lint`, `test`, and `actionlint` could
run as sequential steps in a single job, but splitting them means a failure
reports which concern broke instead of just "the CI job failed" — a red
`actionlint` check on a PR that only touched `src/` immediately points at a
workflow-file problem instead of the source change. It also lets the fast
`lint` and `actionlint` jobs report back well before the slower `test` matrix
finishes, since GitHub Actions runs independent jobs in parallel by default.