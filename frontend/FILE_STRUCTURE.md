# FarmQuest - New File Structure

```
frontend/
├── app/
│   ├── (auth)/                          # Auth routes (no nav menu)
│   │   ├── welcome/
│   │   │   └── page.jsx                 # /welcome
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.jsx             # /auth/login
│   │   │   ├── signup/
│   │   │   │   └── page.jsx             # /auth/signup
│   │   │   ├── verify/
│   │   │   │   └── page.jsx             # /auth/verify
│   │   │   ├── farmer-type/
│   │   │   │   └── page.jsx             # /auth/farmer-type
│   │   │   ├── farm-details/
│   │   │   │   └── page.jsx             # /auth/farm-details
│   │   │   └── permissions/
│   │   │       └── page.jsx             # /auth/permissions
│   │   └── admin/
│   │       └── login/
│   │           └── page.jsx             # /admin/login
│   │
│   ├── (protected)/                     # Farmer routes (with nav)
│   │   ├── layout.jsx                   # Shared layout + nav menu
│   │   ├── dashboard/
│   │   │   └── page.jsx                 # /dashboard
│   │   ├── quests/
│   │   │   ├── page.jsx                 # /quests
│   │   │   └── [id]/
│   │   │       └── page.jsx             # /quests/[id]?step=X
│   │   ├── community/
│   │   │   └── page.jsx                 # /community
│   │   ├── rewards/
│   │   │   └── page.jsx                 # /rewards
│   │   ├── profile/
│   │   │   └── page.jsx                 # /profile
│   │   ├── settings/
│   │   │   └── page.jsx                 # /settings
│   │   └── impact/
│   │       └── page.jsx                 # /impact
│   │
│   ├── (admin)/                         # Admin routes (with admin nav)
│   │   ├── layout.jsx                   # Shared admin layout
│   │   └── admin/
│   │       ├── dashboard/
│   │       │   └── page.jsx             # /admin/dashboard
│   │       ├── farmers/
│   │       │   └── page.jsx             # /admin/farmers
│   │       ├── quests/
│   │       │   └── page.jsx             # /admin/quests
│   │       ├── verification/
│   │       │   └── page.jsx             # /admin/verification
│   │       └── rewards/
│   │           └── page.jsx             # /admin/rewards
│   │
│   ├── layout.jsx                       # Root layout
│   ├── page.jsx                         # / (redirects based on auth)
│   └── globals.css
│
├── components/                          # All UI components (unchanged)
│   ├── auth/
│   ├── farmer/
│   ├── admin/
│   ├── quests/
│   └── shared/
│
├── constants/                           # App constants (unchanged)
│   ├── app.js
│   └── quests.js
│
├── lib/                                 # Utilities (unchanged)
└── ROUTING.md                           # This documentation
```

## Key Changes from Old Structure

### Before (State-based routing)
- ❌ Single `page.jsx` with 450+ lines
- ❌ All screens loaded at once
- ❌ No URL-based navigation
- ❌ No browser back/forward support
- ❌ Hard to maintain and debug

### After (File-based routing)
- ✅ Each route in its own file
- ✅ Automatic code splitting
- ✅ URL-based navigation
- ✅ Browser back/forward works
- ✅ Easy to maintain and extend
- ✅ Shared layouts for navigation
- ✅ Protected routes with auth checks

## Route Groups Explained

### `(auth)` - Authentication Routes
- No navigation menu
- Public access (no auth required)
- Clean URLs without "auth" prefix for welcome page

### `(protected)` - Farmer Routes
- Requires authentication
- Shows farmer navigation menu (via layout.jsx)
- Redirects to /welcome if not authenticated

### `(admin)` - Admin Routes
- Requires admin authentication
- Shows admin navigation menu (via layout.jsx)
- Redirects to /dashboard if not admin
- Redirects to /welcome if not authenticated

## How It Works

1. **Root page (/)**: Checks auth and redirects appropriately
2. **Route groups**: Organize routes without affecting URLs
3. **Layouts**: Provide shared UI (nav menu) for route groups
4. **Dynamic routes**: `[id]` for quest details
5. **Query params**: `?step=intro` for quest flow steps
6. **Client components**: All pages use "use client" for interactivity
7. **localStorage**: Persists auth and user data
