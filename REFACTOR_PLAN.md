# Refactoring Plan: FarmStellar Project Layout

This plan proposes a cleaner, more modular structure without deleting functionality.

## 🛑 Phase 1: Safety Rules
- No business logic changes.
- All imports will be updated automatically.
- No files deleted until final cleanup.

## 🏗 Backend Restructuring

### Current State:
The backend root is cluttered with configuration folders, controllers, models, and many utility scripts. AI models are scattered (`model/`, `cotton/`).

### Proposed State:
We will introduce a `src` directory to house the application core and a `scripts` directory for utilities.

```
backend/
├── index.js                # Entry point (Imports updated)
├── package.json
├── .env
├── scripts/                # MOVED: data seeding & check scripts
│   ├── seed_quests.js
│   ├── check_env.js
│   ├── create_admin_user.js
│   └── ... (all other root .js files)
└── src/                    # NEW: Application Source
    ├── config/             # MOVED: config/
    ├── controllers/        # MOVED: controllers/
    ├── middleware/         # MOVED: middleware/
    ├── models/             # MOVED: models/
    ├── routes/             # MOVED: routes/
    ├── services/           # MOVED: services/
    ├── utils/              # MOVED: utils/
    └── ai/                 # NEW: AI Logic Grouping
        ├── verification/   # MOVED: from 'model/' (Generic Quest AI)
        └── cotton/         # MOVED: from 'cotton/' (Cotton Disease AI)
```

**Key Moves:**
- `backend/model/` -> `backend/src/ai/verification/` (Clearer naming)
- `backend/cotton/` -> `backend/src/ai/cotton/`
- Root scripts -> `backend/scripts/`

## 🎨 Frontend Restructuring

### Current State:
Components are mostly organized, but some functional components (`sidebar.jsx`, `welcome-screen.jsx`) are loose in `components/`. Providers are also scattered.

### Proposed State:
Group components by **Feature** and **Type**.

```
frontend/
├── app/                    # Next.js App Router (Unchanged)
└── components/
    ├── ui/                 # ShadCN UI (Unchanged)
    ├── features/           # NEW: Feature-specific logic
    │   ├── admin/          # MOVED: Admin dashboards & screens
    │   ├── auth/           # MOVED: Login/Signup screens
    │   ├── farmer/         # MOVED: Farmer dashboard & profile
    │   └── quests/         # MOVED: Quest widgets & lists
    ├── layout/             # NEW: Layout components
    │   ├── sidebar.jsx
    │   ├── navbar.jsx (if any)
    │   └── theme-provider.jsx
    └── shared/             # Reusable, non-feature components
        ├── welcome-screen.jsx
        └── ...
```

**Key Moves:**
- `components/sidebar.jsx` -> `components/layout/sidebar.jsx`
- `components/*-login-screen.jsx` -> `components/features/auth/`
- `components/theme-provider.jsx` -> `components/layout/`

## ✅ Next Steps
1. Approve this plan.
2. I will execute the **Backend** refactor first.
3. I will verify the backend server starts.
4. I will execute the **Frontend** refactor.
5. I will verify the frontend build.

**Please reply "APPROVE" to proceed with Phase 3 (Execution).**
