# Security Policy & Architecture Guide

**Project:** UTEHub TechDocs (`doc.utehub.vn`)  
**Status:** Phase 2 - Security Foundation  
**Version:** 1.0.0

---

## 1. Threat Model & Trust Boundaries

The system identifies three primary trust boundaries:
1. **Public Client (Untrusted):** Web browser visitors viewing public documentation. Any code running in the browser (JavaScript, localStorage, sessionStorage) can be inspected, manipulated, or bypassed.
2. **Server Edge / Next.js Runtime (Trusted):** React Server Components, Server Actions, Route Handlers, and Middleware running on Vercel infrastructure.
3. **Database & Storage Core (Authoritative):** Supabase PostgreSQL, Auth service, and Storage buckets guarded strictly by Row Level Security (RLS).

```
[ Browser / Untrusted Client ]
         │ (HTTPS / Public Key Only)
         ▼
[ Next.js Server / Trusted Runtime ]
         │ (Session Cookies / RLS Context)
         ▼
[ Supabase PostgreSQL + Auth / Authoritative ]
```

---

## 2. Public vs. Private Data Classification

* **Public Content (SSG):**
  * Markdown/MDX documentation files (`/docs/**`), layout configurations, public navigation tree, search index, and static assets.
  * Rendered via Static Site Generation (SSG). Zero user authentication required.
* **Private / Administrative Data (Guarded by RLS):**
  * Faculty & departmental unit ratings, criteria weights, audit logs, administrative settings.
  * Must never be embedded into static builds, HTML pre-renders, or public client bundles.
  * Sourced exclusively via authenticated server/client calls governed by RLS.

---

## 3. Authentication & Authorization Strategy

### Authentication
* **Provider:** Supabase Auth with secure, HTTP-only, SameSite session cookies managed via `@supabase/ssr`.
* **Prohibited:** Client-side SHA-256 hash checks and `sessionStorage`-based login flags are strictly legacy/pseudo-auth mechanisms slated for complete replacement in Phase 3.

### Authorization Matrix
* Access decisions are determined on the server and enforced by PostgreSQL RLS.
* Role-based access control (RBAC):
  * **Public Visitor:** Can read public docs (`/docs/**`).
  * **Evaluator / Editor:** Can read units, submit evaluations within assigned scope.
  * **System Admin:** Can manage evaluation periods, criteria, unit ratings, and view audit trails.

---

## 4. Row Level Security (RLS) Policy

* Every private table must enable RLS: `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`.
* **Default Deny:** If no policy matches, all operations are rejected.
* Distinct policies are required for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
* Permissive policies like `FOR ALL USING (true)` on private tables are strictly prohibited.

---

## 5. LocalStorage & Client Storage Policy

| Data Category | Allowed in Client Storage? | Permitted Scope |
|---|---|---|
| Passwords, Session tokens, Secret keys | **NEVER** | Forbidden |
| Role / Permissions (`admin`, `evaluator`) | **NEVER** | Forbidden |
| Supabase URL & Anon Key | **DEPRECATED** | Deprecated in Phase 2; removed in Phase 3 |
| Unsaved feedback drafts, UI preferences | **YES** | Local drafts, theme preference, read state |

---

## 6. Static Site Generation (SSG) Security

* Documentation routes (`/docs/**`) must remain 100% static.
* Never call `cookies()`, `headers()`, or user-specific queries inside root layouts or public pages.
* Dynamic features (like interactive rating tools or admin views) must reside in isolated authenticated route groups or client boundaries that do not de-optimize SSG.

---

## 7. Audit Logging Standard

* Audit records must be recorded in an immutable `audit_logs` table.
* Audit schemas must contain: `id`, `actor_id`, `action`, `entity_type`, `entity_id`, `metadata`, and `created_at`.
* **Forbidden in Audit Logs:** Passwords, authentication tokens, session cookies, service role keys, or sensitive student PII.

---

## 8. Incident Response & Credential Rotation

> [!WARNING]
> **Legacy Credential Exposure Notice:**  
> Legacy admin credential exposed in Git history (commit `11d86b3ae7785890c694381d2b150b93728afec0`) — must not be reused.

* Any credential committed to version control or printed in client logs is classified as **COMPROMISED**.
* Compromised keys or passwords must be rotated immediately in Supabase Cloud and Vercel project settings.
* Never attempt to obscure compromised credentials by merely deleting files or editing recent commits without rotating the actual upstream secret.
