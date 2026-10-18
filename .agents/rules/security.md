# Security Rules & Engineering Standards

## 1. Authentication
- Rely exclusively on Supabase Auth backed by HTTP-only, secure, same-site cookies managed via `@supabase/ssr`.
- Never trust client-side pseudo-auth flags (e.g., `sessionStorage`, `localStorage`).
- Password hashes and secret verification must never execute in the browser.

## 2. Authorization
- Authentication answers "Who are you?"; Authorization answers "What are you permitted to do?".
- Authorization decisions must be made on the server (Server Actions, Route Handlers) and enforced at the database layer (Row Level Security).
- Never trust user-submitted roles, `user_id`, or `owner_id` from client state or query parameters.

## 3. Supabase Row Level Security (RLS)
- Every private table must enable RLS (`ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`).
- Default policy is DENY.
- Write explicit, separate policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
- Never use wide-open policies like `FOR ALL USING (true) WITH CHECK (true)` on private data.
- Never disable RLS to resolve application bugs.

## 4. Next.js Server & Client Boundary
- Default to React Server Components (RSC).
- Use `'use client'` only when strictly necessary for client interactivity (DOM events, hooks, browser-specific APIs).
- Guard server-side Supabase client and sensitive modules with `import 'server-only'`.
- Never import server-only modules into Client Components.

## 5. SSG & Documentation Security
- Fumadocs public documentation (`/docs/**`) must remain purely Static Site Generated (SSG).
- Never invoke `cookies()`, `headers()`, or private user Supabase queries in shared layouts or static content paths.
- Never embed user-specific or private data into `generateStaticParams()`, `generateMetadata()`, or pre-rendered HTML.

## 6. Environment Variables & Secret Handling
- Variables prefixed with `NEXT_PUBLIC_` are bundled into client JavaScript and must be treated as public.
- Never place service roles, database passwords, or private API keys in `NEXT_PUBLIC_` variables.
- Maintain `.env.example` with variable names only (no secret values).
- All `.env*` files with real credentials must be ignored by Git.

## 7. Audit Logging
- Audit logs must be structured, server-generated, and immutable.
- Regular users must not have permissions to edit or delete audit logs.
- Never record sensitive information (passwords, tokens, credentials, PII) in audit log metadata.

## 8. Input Validation
- Validate all incoming request bodies, form data, and route parameters on the server using strict schemas.
- Reject unexpected fields. Never pass raw client JSON directly into database queries.

## 9. Storage Security
- Private files must be stored in private Supabase Storage buckets.
- Implement explicit storage RLS policies checking caller identity against file paths (`{user_id}/*`).
- Never rely on obscure or random filenames as a security mechanism.

## 10. Server Actions & Route Handlers
- Every private Server Action and Route Handler must execute:
  1. User authentication verification.
  2. Input schema validation.
  3. Authorization/permission verification.
  4. RLS-guarded database mutation.
