# Contributing

## Local development

Install the locked dependencies and start the frontend with its JSON API:

```bash
bun install --frozen-lockfile
bun run dev
```

The Angular application runs on port 5000 and the local JSON API runs on port 3000.

## Checks before opening a pull request

```bash
bun run typecheck
bun run build:ci
bun run test:ci
```

Pull requests and pushes to `main` or `master` run the same checks in GitHub Actions.

## Commit and release convention

Use [Conventional Commits](https://www.conventionalcommits.org/) so releases can be calculated automatically:

- `fix: ...` creates a patch release
- `feat: ...` creates a minor release
- `feat!: ...` or `BREAKING CHANGE:` creates a major release
- `docs:`, `chore:`, `refactor:`, `test:`, and `ci:` do not create a release by themselves

The release workflow opens a release pull request from changes merged to `main` or `master`. Merging that release pull request updates `package.json`, creates a `v<version>` Git tag, and publishes the GitHub release.