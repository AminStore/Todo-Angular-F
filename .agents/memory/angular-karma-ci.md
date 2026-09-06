---
name: Angular Karma CI
description: Notes on the Angular 20 Karma test runner and browser setup used by this project.
---

Angular 20's application Karma builder may need an explicit `proxies` provider in a custom Karma configuration. Browser tests also require a real Chrome binary; Replit's Playwright Chromium is suitable for screenshots but may not capture through Karma's launcher, so GitHub Actions installs Chrome explicitly.

**Why:** The imported project reached a healthy test bundle but failed before running tests when Karma lacked the provider, and the local browser wrapper did not register with the launcher.

**How to apply:** Keep the Karma configuration and CI browser setup together when changing Angular, Karma, or the test command. Treat typecheck and production build as the local baseline when the Replit browser wrapper cannot run Karma reliably.