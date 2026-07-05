# SharePlate

Share More. Waste Less. Feed Hope. A civic-tech platform connecting food donors, NGOs, volunteers, and administrators to rescue surplus food and distribute it to people in need.

## Run & Operate

- **Frontend** — `artifacts/web: web` workflow runs `cd ../../frontend && npm run dev` on a Replit-assigned port. The `artifacts/web/` dir exists only so the shared proxy routes `/` to the frontend; all app code lives in `frontend/`.
- **Backend** — `Backend API` workflow: `cd backend && sh -c 'python3 -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}'`, listening on port 8000. Not routed through the proxy; accessible directly on localhost:8000 (or via the Vite `/pyapi` proxy from the frontend).
- Install backend deps: `pip install -r backend/requirements.txt`
- Install frontend deps: `cd frontend && npm install`
- Install pnpm workspace deps (mockup sandbox / api-server): `pnpm install` at repo root

## Stack

- **Frontend:** React 18 + Vite, React Router v6, Context API, Tailwind CSS, Axios, Recharts, lucide-react. Auth wired to backend. All dashboards connected to live `GET /analytics/me` API and live donation CRUD endpoints.
- **Backend:** FastAPI + SQLAlchemy 2 + PostgreSQL (Replit-managed, `DATABASE_URL`), JWT auth (python-jose + bcrypt), Pydantic v2 schemas, role-based access control (Donor / NGO / Volunteer / Admin).

## Secrets / Env Vars

| Secret | Purpose |
|---|---|
| `SESSION_SECRET` | JWT signing key (required) |
| `DATABASE_URL` | Replit-managed PostgreSQL (auto-set) |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps Embed API for location picker / donation map / route map. App degrades gracefully (address cards + "Open in Maps" links) if absent. |

## Where things live

- `frontend/` — React/Vite app (plain npm project, not in the pnpm workspace)
  - `src/api/client.js` — Axios instance with `/pyapi` base URL + JWT interceptor
  - `src/api/auth.js` — `loginUser`, `registerUser`, `getCurrentUser`
  - `src/api/analytics.js` — `getMyAnalytics()` → `GET /analytics/me`
  - `src/api/donations.js` — full CRUD + lifecycle helpers
  - `src/context/AuthContext.jsx` — auth state via Context API + localStorage JWT
  - `src/hooks/useAnalytics.js` — `useAnalytics()` hook (loading / error / refetch)
  - `src/pages/Landing.jsx` — landing page
  - `src/pages/auth/` — Login, Register (admin option removed), ForgotPassword, RoleSelection
  - `src/pages/dashboards/` — DonorDashboard, NgoDashboard, VolunteerDashboard, AdminDashboard (all connected to live API)
  - `src/data/mockData.js` — used only for admin pending-approvals placeholder; everything else is live data
  - `src/components/ui/` — StatCard, StatCardSkeleton, Badge, StatusBadge, RoleBadge, EmptyState, ErrorState, InlineError, Spinner, SkeletonCard
  - `src/components/charts/` — TrendChart (SingleAreaChart, DualAreaChart, SimpleBarChart, ChartCard), DonutChart
  - `src/components/maps/` — LocationPicker, DonationMap, RouteMap (all with graceful fallbacks when API key absent)
  - `tailwind.config.js` — design tokens (primary green #2E7D32, secondary orange #F59E0B) + fadeIn/slide-up animations
  - `vite.config.js` — proxies `/pyapi/*` → `http://localhost:8000/*`

- `backend/` — FastAPI app
  - `main.py` — app entry, CORS, router registration (auth, donations, notifications, analytics)
  - `config.py` — pydantic-settings `Settings`
  - `database.py` — SQLAlchemy engine / SessionLocal / Base / `get_db`
  - `auth.py` — bcrypt, JWT, `get_current_user`, `require_roles` RBAC
  - `models/` — User, NGO, Volunteer, Donation, Assignment, Notification, ImpactMetrics
  - `routers/auth.py` — `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
  - `routers/donations.py` — full CRUD + lifecycle (claim, assign-volunteer, pickup, transit, deliver)
  - `routers/notifications.py` — `GET /notifications`, `PATCH /notifications/{id}/read`
  - `routers/analytics.py` — `GET /analytics/me` (role-dispatched, returns 403 for unknown roles)
  - `services/auth_service.py` — blocks admin self-registration
  - `services/analytics_service.py` — role-specific DB aggregates; delivery trends use `Assignment.completed_at` for accuracy

## User Preferences

- Do not migrate project to monorepo structure — keep `frontend/` + `backend/` layout as-is
- Maps use Google Maps Embed API iframes (no JS SDK / npm package)
- Charts use Recharts only
- Analytics use real DB queries — no mock data for metrics
