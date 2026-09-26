# Contributing

This is a small reference template, but it follows the same conventions as a
larger project so they're worth writing down.

## Commit messages

Commits use [Conventional Commits](https://www.conventionalcommits.org/):
`type(scope): subject`, imperative mood, lower case, no trailing period.

Common types in this repo: `feat`, `fix`, `ci`, `chore`, `docs`, `test`.
Scope is optional and names the area touched, e.g. `ci`, `deps`.

## Branches and pull requests

Branch off `main` with a name that describes the change (`ci/add-cache`,
`docs/update-readme`), not a generic `patch-1`. Open a pull request against
`main` using the template in `.github/pull_request_template.md` — a `What`,
`Why`, and `Testing` section, the last one listing the commands you actually
ran.

## Before opening a PR

Run the same checks CI runs:

```bash
npm run validate   # lint + coverage-gated tests (100% lines/branches/functions on src/)
actionlint         # if you touched .github/workflows/
```

A pull request should be mergeable on its own — keep it to one logical
change, and let CI go green before requesting review.

## Dependency update policy

Dependabot opens weekly PRs for the pinned actions and npm metadata (see
`.github/dependabot.yml`). Patch and minor bumps auto-merge once CI is green —
`.github/workflows/dependabot-auto-merge.yml` enables `--auto --rebase` merge
for anything below a major version. Major bumps are left for a human to review,
since they can carry breaking changes an automated check won't catch.
