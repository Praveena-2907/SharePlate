# SharePlate

Share More. Waste Less. Feed Hope. A civic-tech platform connecting food donors, NGOs, volunteers, and administrators to rescue surplus food and distribute it to people in need.

## Run & Operate

- The frontend is served through a routing-only artifact registered at `artifacts/web` (previewPath `/`). Its workflow (`artifacts/web: web`) runs `cd ../../frontend && npm run dev` on port 22333 — this just launches the real app in `frontend/`, nothing else.
- `artifacts/web/` contains ONLY `.replit-artifact/artifact.toml` — no application code. It exists purely so the platform's shared reverse proxy (which only routes paths registered via `artifact.toml`) forwards `/` to the frontend dev server. All real app code still lives exclusively in `frontend/`.
- `cd frontend && npm run build` — production build (also what the artifact's production config invokes)
- The backend runs via a plain workflow named `Backend API`: `cd backend && sh -c 'python3 -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}'`, listening on port 8000. It is NOT registered with an `artifact.toml`, so it is not reachable through the shared proxy at `/` — access it directly (e.g. `localhost:8000/...` from bash, or the workflow's own port). This is intentional per user's explicit "backend-only, no artifacts" requirement.
- Backend deps: `cd backend && pip install -r requirements.txt`.

## Stack

- Frontend: React + Vite, React Router, Context API, Tailwind CSS, lucide-react. Dashboards still use mock data only (`frontend/src/data/mockData.js`) — not yet wired to the backend.
- Backend: FastAPI + SQLAlchemy + PostgreSQL (Replit-managed, `DATABASE_URL`), JWT auth (python-jose) + bcrypt password hashing, Pydantic v2 schemas, role-based access control (Donor/NGO/Volunteer/Admin).

## Where things live

- `frontend/` — the entire frontend app (plain project, not a pnpm workspace/monorepo package)
  - `src/pages/Landing.jsx` — landing page
  - `src/pages/auth/` — Login, Register, ForgotPassword, RoleSelection
  - `src/pages/dashboards/` — DonorDashboard, NgoDashboard, VolunteerDashboard, AdminDashboard
  - `src/context/AuthContext.jsx` — mock auth state (user, role, login, logout) via Context API + localStorage
  - `src/data/mockData.js` — all mock data (stats, donations, ngos, volunteers, pendingApprovals, impactTimeline, activityFeed)
  - `tailwind.config.js` — design system tokens (primary green #2E7D32, secondary orange #F59E0B, status colors, 16px radius)
- `backend/` — FastAPI backend foundation (plain Python project, no monorepo/artifact structure)
  - `main.py` — app entrypoint, CORS, router registration, creates tables on startup via `Base.metadata.create_all`
  - `config.py` — pydantic-settings `Settings` (reads `DATABASE_URL`; reuses the existing `SESSION_SECRET` env secret as the JWT signing key)
  - `database.py` — SQLAlchemy engine/SessionLocal/Base/`get_db`
  - `auth.py` — bcrypt password hashing (direct `bcrypt` calls, not passlib — see Gotchas), JWT create/decode, `get_current_user`, `require_roles(*roles)` RBAC dependency factory
  - `models/` — User (role enum: donor/ngo/volunteer/admin), NGO, Volunteer, Donation, Assignment, Notification, ImpactMetrics
  - `schemas/` — Pydantic request/response models per entity
  - `services/auth_service.py` — register/login business logic
  - `routers/auth.py` — `POST /auth/register`, `POST /auth/login` (only endpoints implemented so far, per explicit scope)
  - `requirements.txt` — pinned dependency versions
- `database/` — currently empty, reserved by the user for future use (e.g. migrations)
- `artifacts/`, `lib/`, `scripts/` (workspace root) — default Replit workspace scaffolding; explicitly NOT used for SharePlate. Do not add SharePlate code there.

## Architecture decisions

- The user explicitly required a plain `frontend/` + `backend/` + `database/` layout instead of the default pnpm monorepo/artifact system. Neither the frontend nor the backend use the `createArtifact` system for their code; only a routing-only `artifacts/web` exists to make the frontend reachable via the shared proxy.
- Backend foundation scope is intentionally limited: only `/auth/register` and `/auth/login` are implemented. Notifications, maps, analytics, and cross-role workflow logic (e.g. assignment matching) are explicitly deferred.
- Frontend still uses mock data only — it has not been wired up to call the new backend yet (not requested).

## Product

- Landing page (hero, features, how it works, stats, footer)
- Auth pages: Login, Register, Forgot Password, Role Selection (Donor / NGO / Volunteer / Admin)
- Role-specific dashboards with mock data for each of the four roles
- Backend: JWT-based register/login foundation with RBAC scaffolding for the same four roles; no other endpoints yet

## User preferences

- Do not use the pnpm monorepo/artifact structure (no `artifacts/`, `lib/`, `packages/`, workspaces) for SharePlate. All application code must live only in `frontend/`, `backend/`, `database/`.
- Backend must be FastAPI + PostgreSQL + SQLAlchemy + JWT, plain Python (no Node/TypeScript backend).
- Frontend dashboards use mock data only for now — no requirement yet to integrate them with the live backend.

## Gotchas

- The shared reverse proxy only routes paths registered via `.replit-artifact/artifact.toml`. A plain workflow (no artifact.toml) can bind a port and work over curl directly, but the Preview pane/proxy will 404 for it. That's why `artifacts/web` exists for the frontend; the `Backend API` workflow deliberately has no artifact.toml and is only reachable directly on its port.
- Screenshot/preview tooling needs `artifact_dir_name` — use `web` for this project (the `artifacts/web` dir), even though the real frontend code lives in `frontend/`.
- Python workflow commands must expand `$PORT` inside `sh -c '...${PORT:-default}'` — a bare `--port $PORT` in the workflow command does not get expanded and uvicorn fails with "Option '--port' requires an argument."
- Do not use passlib's `CryptContext` with modern `bcrypt` (5.x) — passlib 1.7.4 is unmaintained and its bcrypt backend probe crashes with `ValueError: password cannot be longer than 72 bytes`. Hash/verify passwords with the `bcrypt` package directly instead (see `backend/auth.py`).
- Backend workflow env rebuilds (`installLanguagePackages` / workflow restart for Python) intermittently time out on "environment rebuild" in this project — if that happens, `pip install <pkg>` directly via bash works as an immediate unblock, then retry the workflow separately later.

## Pointers

- N/A — this project intentionally does not use the pnpm workspace structure described in the `pnpm-workspace` skill.
