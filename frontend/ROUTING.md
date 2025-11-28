# FarmQuest Routing Structure

This document explains the complete routing architecture of the FarmQuest application.

## Route Groups

The app uses Next.js 13+ App Router with **route groups** (folders in parentheses) to organize routes without affecting the URL structure:

- `(auth)` - Authentication and onboarding routes (no navigation menu)
- `(protected)` - Farmer-only routes (with farmer navigation menu)
- `(admin)` - Admin-only routes (with admin navigation menu)

## Complete Route Map

### Public Routes (No Auth Required)

```
/                           → Root page (redirects based on auth status)
/welcome                    → Welcome screen with login/signup options
```

### Authentication Flow

```
/auth/login                 → Phone number login
/auth/signup                → Phone number signup
/auth/verify?phone=X&type=Y → OTP verification
/auth/farmer-type           → Select farmer experience level
/auth/farm-details          → Enter farm information
/auth/permissions           → Grant app permissions
```

### Admin Authentication

```
/admin/login                → Admin passkey login
```

### Protected Farmer Routes

```
/dashboard                  → Farmer dashboard (home)
/quests                     → Browse all quests
/quests/[id]                → Quest detail page
  ?step=intro               → Quest introduction
  ?step=steps               → Quest steps/instructions
  ?step=submit              → Submit proof
  ?step=verification        → Verification status
  ?step=reward              → Reward screen
  ?step=summary             → Learning summary
/community                  → Community features
/rewards                    → Rewards and achievements
/profile                    → Farmer profile
/settings                   → App settings
/impact                     → Impact tracker
```

### Protected Admin Routes

```
/admin/dashboard            → Admin dashboard
/admin/farmers              → Manage farmers
/admin/quests               → Manage quests
/admin/verification         → Review submissions
/admin/rewards              → Manage rewards
```

## Authentication Flow

### New User Signup
1. `/welcome` → Click "Sign Up"
2. `/auth/signup` → Enter phone number
3. `/auth/verify?phone=X&type=signup` → Enter OTP
4. `/auth/farmer-type` → Select beginner/pro
5. `/auth/farm-details` → Enter farm info
6. `/auth/permissions` → Grant permissions
7. `/dashboard` → Redirected to dashboard

### Returning User Login
1. `/welcome` → Click "Login"
2. `/auth/login` → Enter phone number
3. `/auth/verify?phone=X&type=login` → Enter OTP
4. `/dashboard` → Redirected to dashboard

### Admin Login
1. `/welcome` → Click "Admin Login"
2. `/admin/login` → Enter passkey
3. `/admin/dashboard` → Redirected to admin dashboard

## Quest Flow

1. `/dashboard` → Click on a quest
2. `/quests/[id]?step=intro` → Read quest intro
3. `/quests/[id]?step=steps` → View quest steps
4. `/quests/[id]?step=submit` → Submit proof (photo/video)
5. `/quests/[id]?step=verification` → Wait for verification
6. `/quests/[id]?step=reward` → Receive XP and badges
7. `/quests/[id]?step=summary` → View learning summary
8. `/dashboard` → Return to dashboard

## Protected Route Logic

### Farmer Routes (`(protected)` group)
- Checks `farmquest_auth` in localStorage
- If not authenticated → redirect to `/welcome`
- Loads user data from `farmquest_userdata`
- Shows farmer navigation menu

### Admin Routes (`(admin)` group)
- Checks `farmquest_auth` in localStorage
- Verifies `userType === "admin"`
- If not admin → redirect to `/dashboard`
- If not authenticated → redirect to `/welcome`
- Shows admin navigation menu

## Data Persistence

### localStorage Keys
- `farmquest_auth` - Authentication status and user type
  ```json
  { "userType": "farmer" | "admin", "authenticated": true }
  ```

- `farmquest_userdata` - User profile and progress
  ```json
  {
    "phone": "string",
    "name": "string",
    "farmerType": "beginner" | "pro",
    "farmDetails": { ... },
    "permissions": { ... },
    "xp": number,
    "level": number,
    "completedQuests": ["quest-id"],
    "badges": ["badge-name"]
  }
  ```

- Temporary signup data (cleared after completion):
  - `farmquest_temp_farmerType`
  - `farmquest_temp_farmDetails`

## Navigation Patterns

### Using `useRouter()` (Client-side)
```javascript
import { useRouter } from "next/navigation"

const router = useRouter()
router.push("/dashboard")      // Navigate to route
router.replace("/welcome")     // Replace current route
router.back()                  // Go back
```

### Using Links (Recommended for static links)
```javascript
import Link from "next/link"

<Link href="/quests">View Quests</Link>
```

## Benefits of This Structure

✅ **URL-based navigation** - Users can bookmark and share links
✅ **Browser back/forward** - Works naturally
✅ **Code splitting** - Each route loads only what it needs
✅ **SEO friendly** - Proper URLs for each page
✅ **Type-safe routing** - TypeScript support
✅ **Organized code** - Each route in its own file
✅ **Shared layouts** - Navigation menu shared across route groups
✅ **Protected routes** - Authentication checks in layouts

## Migration Notes

The old state-based routing system has been replaced with proper Next.js App Router. The old `page.jsx` with all the screen state management is no longer needed.

All screen components remain the same - only the routing mechanism has changed.
