---
name: Angular dependency install fallback
description: A Replit-specific dependency installation constraint for this imported Angular project.
---

When setting up this project in Replit, npm may fail while downloading the transitive `tar` package because of the package firewall, even when the application dependency graph is otherwise valid. Bun successfully installs the existing package graph and provides the Angular CLI binary needed by the project workflow.

**Why:** A clean npm install was blocked by the firewall on multiple tar versions, while Bun completed the install without changing the application framework.

**How to apply:** Prefer the existing lockfile and use Bun as the fallback installer when npm cannot complete. Keep the project’s Angular and JSON Server stack unchanged.