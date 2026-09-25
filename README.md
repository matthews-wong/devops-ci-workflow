# CI Workflow Template

[![CI](https://github.com/matthews-wong/devops-ci-workflow/actions/workflows/ci.yml/badge.svg)](https://github.com/matthews-wong/devops-ci-workflow/actions/workflows/ci.yml)

A minimal, dependency-free Node.js project scaffold paired with a lean GitHub
Actions pipeline. It is meant as a compact reference for wiring up continuous
integration on a new repository: lint the workflow files themselves, run tests
across Node versions, and fail loudly when something breaks.

## Project layout

```
.github/workflows/ci.yml                     # syntax checks + tests + actionlint on push / PR
.github/workflows/dependabot-auto-merge.yml  # auto-merges green patch/minor Dependabot PRs
.github/workflows/labeler.yml                # path-based PR labels
.github/dependabot.yml                       # weekly updates for actions and npm dependencies
.github/ISSUE_TEMPLATE/                      # bug report and feature request forms
scripts/check-syntax.mjs                     # globs src/ and test/ for the lint script
src/helpers.js                               # sample dependency-free module
test/helpers.test.js                         # tests using the built-in node:test runner
test/config.test.js                          # guards metadata files (.nvmrc, package.json) against drift
test/check-syntax.test.js                    # covers the syntax-check script's file discovery
package.json                                 # test/lint scripts + engines contract
Makefile                                     # install/test/lint/validate targets for local use
CONTRIBUTING.md                              # commit, branch, and PR conventions
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

Validate the workflow YAML offline with [actionlint](https://github.com/rhysd/actionlint)
(installed separately — it's not an npm dependency):

```bash
npm run lint:actions
```

Or run lint and coverage-checked tests together with a single command:

```bash
npm run validate
```

The same targets are available through `make` (`make test`, `make lint`,
`make validate`, ...) for anyone who prefers not to remember npm script names.

## Pipeline

On every push to `main` and on pull requests, four jobs run:

- `lint` — a syntax check of every file under `src/` and `test/` (discovered by
  glob, so a new file can't slip past unchecked), a coverage-threshold run of
  the suite (`node --test`'s built-in coverage, gated at 100%
  lines/branches/functions on `src/`), and `npm audit` at a high severity
  threshold — so a typo, an untested branch, and a known vulnerable dependency
  all fail in seconds. Coverage and audit output are also written to the job
  summary, so a failure's detail is visible without opening the raw log.
- `test` — the suite on the current supported Node LTS lines (20, 22, 24),
  each on both `ubuntu-latest` and `windows-latest`, reading dependencies from
  the committed lockfile. Failing tests block the merge; errors are never
  masked with `|| true`.
- `actionlint` — validates the workflow definitions themselves. The actionlint
  binary is downloaded pinned to a release and verified against the release
  checksum before it runs, so a tampered or truncated download never reaches
  the runner.
- `dependency-review` — on pull requests only, fails if a newly introduced
  dependency carries a high-severity advisory, catching a supply-chain
  problem before it merges rather than after Dependabot notices it.

Dependabot opens weekly update PRs for the pinned actions and npm metadata so
the template does not drift from current releases; a separate auto-merge
workflow merges those PRs itself once CI is green, as long as the bump isn't a
major version. A path-based labeler also tags every PR (`ci`, `docs`, `tests`,
`source`, `dependencies`) so triage doesn't depend on reading the diff first.

## Design decisions

**Three separate jobs instead of one.** `lint`, `test`, and `actionlint` could
run as sequential steps in a single job, but splitting them means a failure
reports which concern broke instead of just "the CI job failed" — a red
`actionlint` check on a PR that only touched `src/` immediately points at a
workflow-file problem instead of the source change. It also lets the fast
`lint` and `actionlint` jobs report back well before the slower `test` matrix
finishes, since GitHub Actions runs independent jobs in parallel by default.

**Credentials and install scripts are locked down even with zero
dependencies today.** Every checkout sets `persist-credentials: false` and
every `npm ci` runs with `--ignore-scripts`, so neither a compromised step nor
a future dependency's install hook can reach the runner's scoped
`GITHUB_TOKEN` or execute arbitrary code before a human reviews it. It costs
nothing while the template stays dependency-free and pays for itself the
moment a real dependency is added.