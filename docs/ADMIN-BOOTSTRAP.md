# Initial Admin Bootstrap Guide

**Project:** UTEHub TechDocs (`doc.utehub.vn`)  
**Phase:** 3A - Database & Pre-flight  
**Objective:** Safely provision the initial System Administrator account without backdoors or client-side bypasses.  

---

## 1. Problem Statement

When the normalized schema and strict RLS policies are applied, regular authenticated users are strictly forbidden from assigning or escalating their own roles (`user_roles` write access requires `public.is_admin()`). 

If no administrator exists yet, a chicken-and-egg problem arises:
- Users cannot promote themselves to admin.
- Only an admin can promote other users to admin.

**Prohibited Anti-Patterns:**
* ❌ Automatic "First registered user becomes Admin" (Vulnerable to race conditions and registration squatting).
* ❌ Hardcoded admin email or UUID in application source code.
* ❌ Embedding a `SUPABASE_SERVICE_ROLE_KEY` in frontend code to bootstrap roles.

---

## 2. Recommended Production Bootstrap Procedure

The initialization of the primary administrator must be an **out-of-band, trusted operation** conducted via the **Supabase Cloud Dashboard** or **SQL Editor** by the authorized project owner.

### Step 1: Create the User in Supabase Auth
1. Log in to your Supabase Cloud Dashboard: [app.supabase.com](https://app.supabase.com).
2. Select the **UTEHub TechDocs** project.
3. Navigate to **Authentication** → **Users**.
4. Click **Invite User** or **Add User** (Create User):
   * Enter the designated institutional administrator email (e.g., `admin-techdocs@utehub.vn`).
   * Set a strong, unique initial password or send an invitation link.
5. Once created, copy the generated **User UID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

---

### Step 2: Grant Admin Role via Supabase SQL Editor
1. In the Supabase Dashboard, navigate to the **SQL Editor** tab.
2. Run the following idempotent provisioning script (replace `<PASTE_USER_UID_HERE>` with the real User UID from Step 1):

```sql
-- Ensure profile exists
INSERT INTO public.profiles (id, email, full_name)
SELECT 
    id, 
    email, 
    'System Administrator'
FROM auth.users
WHERE id = '<PASTE_USER_UID_HERE>'
ON CONFLICT (id) DO NOTHING;

-- Grant admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('<PASTE_USER_UID_HERE>', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Log audit bootstrap event
INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
VALUES (
    '<PASTE_USER_UID_HERE>',
    'ADMIN_BOOTSTRAP',
    'user_roles',
    '<PASTE_USER_UID_HERE>',
    '{"reason": "Initial manual out-of-band administrator provisioning"}'::jsonb
);
```

3. Click **RUN**. The account now has authoritative administrator privileges enforced at the database layer.

---

### Step 3: Verification
Verify that the admin role is correctly recognized:
```sql
SELECT 
    u.id, 
    u.email, 
    r.role, 
    public.is_admin() AS is_current_caller_admin
FROM auth.users u
JOIN public.user_roles r ON u.id = r.user_id
WHERE u.id = '<PASTE_USER_UID_HERE>';
```

---

## 3. Subsequent Administrator Provisioning

Once the primary administrator is bootstrapped:
* The primary administrator can assign `admin` or `evaluator` roles to other registered users directly through the authenticated admin UI via Server Actions or Supabase queries, as permitted by the `user_roles` RLS policy (`public.is_admin() = true`).
* No further manual SQL execution is required for daily user management.
