# Migration Guide: State-based to File-based Routing

## Summary

Your FarmQuest app has been migrated from **state-based routing** to **Next.js App Router file-based routing**.

## What Changed?

### Old System ❌
- Single `page.jsx` file with all routing logic (450+ lines)
- Used `activeScreen` state to switch between screens
- All code loaded at once
- No real URLs - everything was on `/`
- Browser back button didn't work

### New System ✅
- Each route has its own file
- Real URLs like `/dashboard`, `/quests/soil`, etc.
- Automatic code splitting - faster load times
- Browser back/forward buttons work
- Can bookmark and share specific pages
- Organized into route groups: `(auth)`, `(protected)`, `(admin)`

## File Changes

### Removed
- ❌ Old `app/page.jsx` (450 lines) - replaced with new routing

### Added
- ✅ 20+ new route files in organized folders
- ✅ 2 layout files for shared navigation
- ✅ `ROUTING.md` - complete routing documentation
- ✅ `FILE_STRUCTURE.md` - visual file structure

## URL Mapping

| Old State | New URL |
|-----------|---------|
| `SCREENS.WELCOME` | `/welcome` |
| `SCREENS.PHONE_LOGIN` | `/auth/login` |
| `SCREENS.PHONE_SIGNUP` | `/auth/signup` |
| `SCREENS.OTP_VERIFICATION_LOGIN` | `/auth/verify?type=login` |
| `SCREENS.FARMER_TYPE_SELECTION` | `/auth/farmer-type` |
| `SCREENS.FARM_DETAILS` | `/auth/farm-details` |
| `SCREENS.PERMISSIONS` | `/auth/permissions` |
| `SCREENS.FARMER_DASHBOARD` | `/dashboard` |
| `SCREENS.QUESTS_LIST` | `/quests` |
| `SCREENS.QUEST_INTRO` | `/quests/[id]?step=intro` |
| `SCREENS.QUEST_STEPS` | `/quests/[id]?step=steps` |
| `SCREENS.QUEST_SUBMIT_PROOF` | `/quests/[id]?step=submit` |
| `SCREENS.QUEST_VERIFICATION` | `/quests/[id]?step=verification` |
| `SCREENS.QUEST_REWARD` | `/quests/[id]?step=reward` |
| `SCREENS.QUEST_SUMMARY` | `/quests/[id]?step=summary` |
| `SCREENS.COMMUNITY` | `/community` |
| `SCREENS.REWARDS` | `/rewards` |
| `SCREENS.FARMER_PROFILE` | `/profile` |
| `SCREENS.SETTINGS` | `/settings` |
| `SCREENS.IMPACT_TRACKER` | `/impact` |
| `SCREENS.ADMIN_LOGIN` | `/admin/login` |
| `SCREENS.ADMIN_DASHBOARD` | `/admin/dashboard` |
| `SCREENS.ADMIN_FARMERS` | `/admin/farmers` |
| `SCREENS.ADMIN_QUESTS` | `/admin/quests` |
| `SCREENS.ADMIN_VERIFICATION` | `/admin/verification` |
| `SCREENS.ADMIN_REWARDS` | `/admin/rewards` |

## Component Changes

### No Changes Required! 🎉
All your existing components in `components/` folder work exactly as before. Only the routing mechanism changed.

## localStorage Structure

### Still the same:
- `farmquest_auth` - Authentication status
- `farmquest_userdata` - User profile and progress

### New temporary keys (auto-cleaned):
- `farmquest_temp_farmerType` - During signup flow
- `farmquest_temp_farmDetails` - During signup flow

## Testing the New Routing

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Test these flows:**
   - ✅ Visit `/` - should redirect to `/welcome`
   - ✅ Click "Sign Up" - should go to `/auth/signup`
   - ✅ Complete signup flow - should end at `/dashboard`
   - ✅ Click on a quest - should go to `/quests/[id]`
   - ✅ Use browser back button - should work!
   - ✅ Refresh page - should stay on same page
   - ✅ Bookmark `/dashboard` - should work after login

3. **Test protected routes:**
   - ✅ Visit `/dashboard` without login - should redirect to `/welcome`
   - ✅ Visit `/admin/dashboard` as farmer - should redirect to `/dashboard`

## Benefits You Get

1. **Better UX**
   - Users can bookmark pages
   - Share direct links to quests
   - Browser back/forward works naturally

2. **Better Performance**
   - Code splitting - only load what's needed
   - Faster initial page load
   - Better for mobile users

3. **Better DX (Developer Experience)**
   - Easier to find and edit specific pages
   - Clear file structure
   - Type-safe routing (if you add TypeScript)
   - Easier to add new routes

4. **Better SEO**
   - Each page has its own URL
   - Can add page-specific metadata
   - Better for search engines

## Need Help?

- 📖 Read `ROUTING.md` for complete routing documentation
- 📁 Read `FILE_STRUCTURE.md` for file organization
- 🔍 Check any route file to see the pattern

## Next Steps

1. Test all user flows
2. Update any hardcoded navigation if needed
3. Consider adding page-specific metadata
4. Consider adding loading states
5. Consider adding error boundaries

---

**Note:** The old `page.jsx` has been replaced. If you need to reference the old code, check your git history.
