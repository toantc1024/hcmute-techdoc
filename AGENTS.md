<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# UTEHub TechDocs Engineering & Security Rules

## Core Principles
1. **SECURITY FIRST**: Security and authorization controls must be enforced at the database (RLS) and server layer, never purely on the client.
2. **SERVER FIRST**: Default to React Server Components and Server Actions. Limit Client Components (`'use client'`) to interactive UI.
3. **RLS ALWAYS**: Row Level Security is mandatory on every private table. Default deny.
4. **LEAST PRIVILEGE**: Client connections use anonymous/publishable keys under RLS. Privileged `service_role` is banned unless a documented server-only justification exists.
5. **NO SECRET IN CLIENT**: Never expose private API keys, database secrets, or service role credentials to client bundles or `NEXT_PUBLIC_` variables.
6. **NO PRIVATE DATA IN STATIC BUILD**: Public documentation pages must remain statically generated (SSG). Never inject private user data, cookies, or user tokens into static builds or shared layouts.

## Invariant Security Rules
- **Rule 1**: RLS is mandatory for all private tables.
- **Rule 2**: Never disable RLS to fix application bugs or routing errors.
- **Rule 3**: Never trust client authorization (`localStorage.role`, client query params, or client state).
- **Rule 4**: Never use `localStorage` or `sessionStorage` as authoritative authentication or authorization.
- **Rule 5**: Never expose server secrets or private credentials in Git or client-side code.
- **Rule 6**: Never add `service_role` without a documented justification approved in architecture review.
- **Rule 7**: Never put private user data into static generation (`generateStaticParams`, `generateMetadata`, build artifacts).
- **Rule 8**: Never make public docs dynamic solely for auth. Fumadocs `/docs/**` must remain static SSG.
- **Rule 9**: All private mutations require authentication + authorization + schema validation.
- **Rule 10**: Database schema changes must use migrations tracked in `supabase/migrations/`.
- **Rule 11**: Never execute destructive database operations (`DROP TABLE`, `TRUNCATE`, unconditional `DELETE`) without explicit human approval.
- **Rule 12**: Legacy admin credential exposed in Git history (`11d86b3ae7785890c694381d2b150b93728afec0`) is compromised and must never be reused.
- **Rule 13**: Audit logs must never contain secrets, tokens, or plaintext passwords.
- **Rule 14**: New data entities require an explicit authorization matrix (Read/Create/Update/Delete) before implementation.
- **Rule 15**: Keep all code files strictly under 300 lines for high maintainability and modularity.

