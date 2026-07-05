# SharePlate

Share More. Waste Less. Feed Hope. A civic-tech platform connecting food donors, NGOs, volunteers, and administrators to rescue surplus food and distribute it to people in need.

## Run & Operate

- **Frontend** — `artifacts/web: web` workflow runs `cd ../../frontend && npm run dev` on a Replit-assigned port. The `artifacts/web/` dir exists only so the shared proxy routes `/` to the frontend; all app code lives in `frontend/`.
- **Backend** — `Backend API` workflow: `cd backend && sh -c 'python3 -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}'`, listening on port 8000. Not routed through the proxy; accessible directly on localhost:8000 (or via the Vite `/pyapi` proxy from the frontend).
- Install backend deps: `pip install -r backend/requirements.txt`
- Install frontend deps: `cd frontend && npm install`
- Install pnpm workspace deps (mockup sandbox / api-server): `pnpm install` at repo root

## Stack

- **Frontend:** React 18 + Vite, React Router v6, Context API, Tailwind CSS, Axios, lucide-react. Auth is wired to the backend (login, register, `/auth/me`). Role dashboards display mock data from `frontend/src/data/mockData.js` and are not yet wired to the live API.
- **Backend:** FastAPI + SQLAlchemy 2 + PostgreSQL (Replit-managed, `DATABASE_URL`), JWT auth (python-jose + bcrypt), Pydantic v2 schemas, role-based access control (Donor / NGO / Volunteer / Admin).

## Where things live

- `frontend/` — React/Vite app (plain npm project, not in the pnpm workspace)
  - `src/api/client.js` — Axios instance with `/pyapi` base URL + JWT interceptor
  - `src/api/auth.js` — `loginUser`, `registerUser`, `getCurrentUser` API helpers
  - `src/context/AuthContext.jsx` — auth state (login, register, logout, initializing) via Context API + localStorage JWT
  - `src/pages/Landing.jsx` — landing page (hero, stats, features, how it works)
  - `src/pages/auth/` — Login, Register, ForgotPassword, RoleSelection
  - `src/pages/dashboards/` — DonorDashboard, NgoDashboard, VolunteerDashboard, AdminDashboard (mock data only)
  - `src/data/mockData.js` — mock stats, donations, NGOs, volunteers, etc. used by dashboards
  - `tailwind.config.js` — design tokens (primary green #2E7D32, secondary orange #F59E0B, 16px radius)
  - `vite.config.js` — proxies `/pyapi/*` → `http://localhost:8000/*`
- `backend/` — FastAPI app
  - `main.py` — app entry, CORS, router registration, `Base.metadata.create_all` on startup
  - `config.py` — pydantic-settings `Settings` (reads `DATABASE_URL`, `SESSION_SECRET`)
  - `database.py` — SQLAlchemy engine / SessionLocal / Base / `get_db`
  - `auth.py` — bcrypt hashing, JWT create/decode, `get_current_user`, `require_roles` RBAC factory
  - `models/` — User (role enum: donor/ngo/volunteer/admin), NGO, Volunteer, Donation, Assignment, Notification, ImpactMetrics
  - `routers/auth.py` — `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
  - `routers/donations.py` — full CRUD + lifecycle endpoints (claim, assign-volunteer, pickup, transit, deliver)
  - `routers/notifications.py` — `GET /notifications`, `PATCH /notifications/{id}/read`
  - `services/auth_service.py` — register/login/token business logic; blocks admin self-registration
- `database/` — reserved for future migrations
- `artifacts/`, `lib/`, `scripts/` — Replit workspace scaffolding; not used for SharePlate app code

## Architecture decisions

- Plain `frontend/` + `backend/` layout instead of pnpm monorepo. Only `artifacts/web` exists as a routing-only artifact to make the frontend reachable via the shared proxy.
- Public registration only allows `donor`, `ngo`, `volunteer` roles (server-side enforced). Admin accounts must be provisioned separately.
- Frontend auth is integrated with the backend; dashboards still use mock data (not wired to donations/notifications APIs yet).

## User preferences

- Do not use the pnpm monorepo/artifact structure for SharePlate. All application code lives in `frontend/`, `backend/`, `database/`.
- Backend must be FastAPI + PostgreSQL + SQLAlchemy + JWT, plain Python.
- Dashboard data integration with the live backend is deferred.

## Gotchas

- The shared reverse proxy only routes paths registered via `.replit-artifact/artifact.toml`. `Backend API` workflow has no artifact.toml and is only reachable on localhost:8000 (or via the Vite `/pyapi` proxy in dev).
- Screenshot/preview tooling: use `artifactDirName: "web"` (the `artifacts/web` dir), not `frontend/`.
- Python workflow `$PORT` must be expanded inside `sh -c '...'` — bare `--port $PORT` in the workflow command is not shell-expanded and uvicorn will fail.
- Do not use passlib's `CryptContext` with bcrypt 5.x — use the `bcrypt` package directly (see `backend/auth.py`).
