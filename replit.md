# SharePlate

Share More. Waste Less. Feed Hope. A civic-tech platform connecting food donors, NGOs, volunteers, and administrators to rescue surplus food and distribute it to people in need.

## Run & Operate

- The "Start application" workflow runs `cd frontend && npm run dev` on port 5000.
- `cd frontend && npm run build` — production build

## Stack

- React + Vite, React Router, Context API
- Tailwind CSS for styling
- lucide-react for icons
- No backend, no database — frontend uses mock data only (`frontend/src/data/mockData.js`)

## Where things live

- `frontend/` — the entire application (this is a plain project, not a pnpm workspace/monorepo package)
  - `src/pages/Landing.jsx` — landing page
  - `src/pages/auth/` — Login, Register, ForgotPassword, RoleSelection
  - `src/pages/dashboards/` — DonorDashboard, NgoDashboard, VolunteerDashboard, AdminDashboard
  - `src/context/AuthContext.jsx` — mock auth state (user, role, login, logout) via Context API + localStorage
  - `src/data/mockData.js` — all mock data (stats, donations, ngos, volunteers, pendingApprovals, impactTimeline, activityFeed)
  - `tailwind.config.js` — design system tokens (primary green #2E7D32, secondary orange #F59E0B, status colors, 16px radius)
- `backend/` and `database/` — currently empty, reserved by the user for future backend work
- `artifacts/`, `lib/`, `scripts/` — default Replit workspace scaffolding; explicitly NOT used for SharePlate. Do not add SharePlate code there.

## Architecture decisions

- The user explicitly required a plain `frontend/` + `backend/` + `database/` layout instead of the default pnpm monorepo/artifact system. The frontend is run directly via a custom workflow (`cd frontend && npm run dev`), not through the `createArtifact` system.
- Current build is frontend-only with mock data. No API integration, no backend, no persistence beyond localStorage for the mock logged-in user.

## Product

- Landing page (hero, features, how it works, stats, footer)
- Auth pages: Login, Register, Forgot Password, Role Selection (Donor / NGO / Volunteer / Admin)
- Role-specific dashboards with mock data for each of the four roles

## User preferences

- Do not use the pnpm monorepo/artifact structure (no `artifacts/`, `lib/`, `packages/`, workspaces) for SharePlate. All application code must live only in `frontend/`, `backend/`, `database/`.
- No backend/API integration yet — frontend dashboards use mock data only, by explicit request.

## Gotchas

- The frontend is NOT registered as a Replit "artifact" — it's run via a plain workflow bound to port 5000. Screenshot/preview tooling that requires an `artifact_dir_name` won't find it; verify changes via curl/build instead.

## Pointers

- N/A — this project intentionally does not use the pnpm workspace structure described in the `pnpm-workspace` skill.
