# System Authorization Matrix & Role Design

**Project:** UTEHub TechDocs (`doc.utehub.vn`)  
**Phase:** 3B-0 - Final Production Migration Gate  
**Security Model:** Role-Based Access Control (RBAC) + Row Level Security (RLS)  

---

## 1. Persona & Role Definitions

| Role | Target Identity | Trust Level | Description |
|---|---|---|---|
| **Anonymous (`anon`)** | Public visitor | **Untrusted** | Reads public documentation (`/docs/**`), public unit catalogs, criteria standards, and published ratings. |
| **Authenticated User** | Any logged-in staff | **Low** | Can view own profile, submit self audit events, read public catalogs. Cannot edit ratings. |
| **Evaluator** | Assessment officer | **Medium** | Can score and update ratings/notes for organizational units (`unit_ratings`, `unit_rating_items`). |
| **Admin** | System Administrator | **High** | Full administrative control over criteria, periods, units, roles, and audit trail inspection. |

---

## 2. Granular CRUD Authorization Matrix (10 Tables)

### Table 1: `profiles`
* **Anonymous:** SELECT: Deny | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Authenticated:** SELECT: `auth.uid() = id` | INSERT: `auth.uid() = id` | UPDATE: `auth.uid() = id` | DELETE: Deny
* **Evaluator:** Same as Authenticated
* **Admin:** SELECT: Allow all | INSERT: Allow all | UPDATE: Allow all | DELETE: Allow all

### Table 2: `user_roles` (Anti-Self-Promotion)
* **Anonymous:** SELECT: Deny | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Authenticated:** SELECT: `auth.uid() = user_id` | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Evaluator:** Same as Authenticated
* **Admin:** SELECT: Allow all | INSERT: Allow all | UPDATE: Allow all | DELETE: Allow all

### Table 3: `organizational_units`
* **Anonymous:** SELECT: Allow all (via table or `public_organizational_units` view) | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Authenticated:** SELECT: Allow all | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Evaluator:** SELECT: Allow all | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Admin:** SELECT: Allow all | INSERT: Allow all | UPDATE: Allow all | DELETE: Allow all

### Table 4: `evaluation_criteria`
* **Anonymous:** SELECT: Allow all | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Authenticated:** SELECT: Allow all | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Evaluator:** SELECT: Allow all | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Admin:** SELECT: Allow all | INSERT: Allow all | UPDATE: Allow all | DELETE: Allow all

### Table 5: `evaluation_periods` (Publication Model)
* **Anonymous:** SELECT: `is_published = true` | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Authenticated:** SELECT: `is_published = true` | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Evaluator:** SELECT: Allow all | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Admin:** SELECT: Allow all | INSERT: Allow all | UPDATE: Allow all | DELETE: Allow all

### Table 6: `unit_ratings` (Header Score)
* **Anonymous:** SELECT: `is_published = true` | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Authenticated:** SELECT: `is_published = true` | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Evaluator:** SELECT: Allow all | INSERT: Deny | UPDATE: Allow all | DELETE: Deny
* **Admin:** SELECT: Allow all | INSERT: Allow all | UPDATE: Allow all | DELETE: Allow all

### Table 7: `unit_rating_items` (Individual Criteria Scores)
* **Anonymous:** SELECT: Parent rating `is_published = true` | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Authenticated:** SELECT: Parent rating `is_published = true` | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Evaluator:** SELECT: Allow all | INSERT: Allow all | UPDATE: Allow all | DELETE: Deny
* **Admin:** SELECT: Allow all | INSERT: Allow all | UPDATE: Allow all | DELETE: Allow all

### Table 8: `doc_sections`
* **Anonymous:** SELECT: Allow all | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Authenticated:** SELECT: Allow all | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Evaluator:** SELECT: Allow all | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Admin:** SELECT: Allow all | INSERT: Allow all | UPDATE: Allow all | DELETE: Allow all

### Table 9: `project_phases`
* **Anonymous:** SELECT: Allow all | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Authenticated:** SELECT: Allow all | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Evaluator:** SELECT: Allow all | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Admin:** SELECT: Allow all | INSERT: Allow all | UPDATE: Allow all | DELETE: Allow all

### Table 10: `audit_logs` (Strict Append-Only Immutability)
* **Anonymous:** SELECT: Deny | INSERT: Deny | UPDATE: Deny | DELETE: Deny
* **Authenticated:** SELECT: Deny | INSERT: `actor_id = auth.uid()` | UPDATE: Deny | DELETE: Deny
* **Evaluator:** SELECT: Deny | INSERT: `actor_id = auth.uid()` | UPDATE: Deny | DELETE: Deny
* **Admin:** SELECT: Allow all | INSERT: `actor_id = auth.uid()` | UPDATE: **DENY ALL** | DELETE: **DENY ALL**

---

## 3. Defense Against Privilege Escalation (Self-Promotion)

1. **Separation of Concerns:** `profiles` only stores presentation metadata (`full_name`, `avatar_url`). The authoritative role is exclusively stored in `user_roles`.
2. **Strict RLS Restriction:** All mutations (`INSERT`, `UPDATE`, `DELETE`) on `user_roles` require `public.is_admin() = true`.
3. **Audit Log Anti-Spoofing:** Client insertions must satisfy `actor_id = auth.uid()`. An authenticated user cannot forge an event under an administrator's or another user's ID.
