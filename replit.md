# Taskly on Replit

## Run locally in Replit

Use the `Start application` workflow, which runs:

```bash
bun run dev
```

This starts the Angular development server on port 5000 and the local JSON Server API on port 3000. Angular proxies `/api/*` requests to the API, so frontend services should use the relative `/api` base URL rather than `localhost`.

## Useful checks

```bash
bun run typecheck
bun run build:ci
```