1. Work on Forgot password functionality:
    right now there is nothing for that, so if there is a password that needs to be changed, i just add the admin person on the supabase again

2. ZORCH FARMS — TODO Admin Dashboard: Dynamic Logged-in Admin Name

Priority: Low / Later Area: ADMIN APP + SUPABASE

Goal Replace the hardcoded “Welcome back, Admin” text on the Admin
Dashboard with the name of the admin who is currently logged in.

Expected result If Joshua logs in: “Welcome back, Joshua”

If another authorized admin logs in: “Welcome back, [their name]”

The name must be dynamic and tied to the currently authenticated
Supabase user.

IMPLEMENTATION PLAN

1.  Identify the existing authentication setup

-   Find the file that handles Supabase authentication/login in the
    admin app.
-   Find the auth provider/context or other mechanism that tracks the
    currently logged-in user.
-   Find the Dashboard component containing “Welcome back, Admin”.
-   Do not replace or refactor the existing authentication system if it
    is already working.

2.  Supabase — Create an admin profile table Create a
    public.admin_profiles table containing at minimum:

-   id: uuid
-   full_name: text
-   email: text (optional/recommended)
-   created_at: timestamptz

The admin_profiles.id should correspond to auth.users.id.

Relationship: auth.users.id -> admin_profiles.id

3.  Add the admin profile For every authorized admin who should access
    the dashboard:

-   Create their profile record.
-   Use the same UUID as their Supabase Auth user.
-   Store the name that should appear in the dashboard.

Example: id = authenticated user’s UUID full_name = “Joshua” email =
admin’s email

4.  RLS / Security Keep admin profile information protected. Add an RLS
    policy allowing an authenticated user to read their own profile:

id = auth.uid()

Do not make the entire admin_profiles table publicly readable.

Also ensure this does not weaken the existing admin
authorization/authentication policies.

5.  Admin app — Retrieve the current user Use the existing Supabase
    authentication setup to obtain the currently authenticated user.

Conceptually: supabase.auth.getUser()

Then use the authenticated user’s ID to retrieve the matching
admin_profiles record.

6.  Keep profile data in the existing auth structure Prefer adding the
    profile/name to the existing authentication context/provider rather
    than querying Supabase separately inside every dashboard component.

For example: useAuth() -> user -> profile -> profile.full_name

Do not create unnecessary duplicate auth logic.

7.  Update the Dashboard greeting Replace: “Welcome back, Admin”

With: “Welcome back, {profile.full_name}”

Include a safe fallback such as: “Welcome back, Admin”

if the profile cannot be loaded or the name is unavailable.

8.  Future improvement — activity attribution Once admin profiles are
    available, consider improving the existing activity history so
    actions can eventually identify which admin performed them.

Example: “Rice updated — by Joshua”

This is optional and should be treated as a separate future task.

FILES / AREAS TO CHECK

ADMIN APP: - Existing Supabase/auth provider or auth context -
Login/authentication component - Dashboard page/component - Supabase
client/lib file

SUPABASE: - auth.users - public.admin_profiles - RLS policies

IMPORTANT CONSTRAINTS

-   Admin side only.
-   Do not modify the customer frontend.
-   Do not break the existing authentication.
-   Do not hardcode one person’s name into the Dashboard.
-   Do not expose admin profile information publicly.
-   Do not change product/catalog/request functionality.
-   Do not change existing Supabase product tables unless necessary.
-   Preserve the existing admin UI/design.

TESTING CHECKLIST

[ ] Existing admin login still works. [ ] Logged-in admin sees their own
name. [ ] Logging in as another admin shows that admin’s name. [ ]
Unauthenticated users cannot access the admin dashboard. [ ] RLS
prevents unauthorized profile access. [ ] Dashboard still works if a
profile/name is temporarily unavailable. [ ] npm run build succeeds. [ ]
No customer frontend files were unnecessarily changed.
