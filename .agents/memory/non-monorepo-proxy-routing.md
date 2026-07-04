---
name: Non-artifact frontend + shared proxy routing
description: Why a plain (non-artifact) workflow's app is unreachable at "/" through the shared proxy, and how to fix it without adding real app code to artifacts/.
---

When a project's app code intentionally lives outside the pnpm-workspace/artifact structure (e.g. user mandates a plain `frontend/` + `backend/` + `database/` layout, no `artifacts/`), a plain Replit workflow (`configureWorkflow`, no `.replit-artifact/artifact.toml`) can still bind a port and respond fine to direct `curl localhost:<port>`.

**Why it still shows blank in Preview/Canvas:** the platform's shared reverse proxy (port 80) only forwards paths that are explicitly registered in some `.replit-artifact/artifact.toml`'s `[[services]].paths`. A workflow with no artifact.toml has no proxy registration, so `/` 404s through the proxy even though the process itself is healthy.

**How to apply:** create a minimal "routing-only" artifact (`createArtifact` with `artifactType: "react-vite"`, `previewPath: "/"`), then immediately delete all of its scaffolded application files (src/, package.json, vite.config, tsconfig, etc.) so only `.replit-artifact/artifact.toml` remains. Edit that toml via `verifyAndReplaceArtifactToml` so `services.development.run` and `services.production.build`/`publicDir` point at the real app directory instead of the scaffolded `@workspace/<slug>` package — e.g. `run = "cd ../../frontend && npm run dev"` (paths in artifact.toml are relative to the artifact's own directory, not repo root). Then remove the old plain workflow to avoid a redundant duplicate dev server. This satisfies "proxy requires an artifact.toml" while keeping 100% of real app code inside the user-mandated folder.
