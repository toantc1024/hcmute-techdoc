# Database Design & Migration Rules

## 1. Schema Naming & Conventions
- Table names and column names must be `snake_case` in lowercase.
- Table names must be pluralized (e.g., `organizational_units`, `unit_ratings`, `audit_logs`).
- Foreign key columns must follow `{singular_referenced_table}_id` (e.g., `unit_id`, `actor_id`).

## 2. Keys & Integrity Constraints
- Every table must have a surrogate Primary Key: `id uuid DEFAULT gen_random_uuid() PRIMARY KEY` or a natural primary key when domain-specific.
- Always declare `FOREIGN KEY` constraints with explicit `ON DELETE` rules (`RESTRICT`, `CASCADE`, or `SET NULL`).
- Apply `NOT NULL` constraints on all non-optional columns.
- Use `CHECK` constraints to enforce business domain validity (e.g., `score >= 0 AND score <= 100`, `weight > 0`).
- Use `UNIQUE` constraints to enforce data uniqueness (e.g., unique unit code, unique criterion slug).

## 3. Timestamps & Auditability
- Every entity table must contain:
  - `created_at timestamptz DEFAULT now() NOT NULL`
  - `updated_at timestamptz DEFAULT now() NOT NULL`
- Use database triggers to automatically update `updated_at` on modification.
- Critical operations must write structured audit events into the `audit_logs` table.

## 4. Indexing Strategy
- Index every foreign key column to optimize joins.
- Index columns frequently filtered or sorted in queries (e.g., `status`, `unit_id`, `created_at`).
- Use partial or compound indexes where appropriate to optimize common query patterns.

## 5. Row Level Security (RLS)
- Every table containing non-public or privileged data must explicitly enable RLS:
  ```sql
  ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;
  ```
- Define explicit granular policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
- Follow the principle of Least Privilege. Never expose wide-open write policies to anonymous roles.

## 6. Migrations Management
- All database modifications must be recorded as timestamped SQL migration files under `supabase/migrations/`.
- File naming format: `YYYYMMDDHHMMSS_<descriptive_action>.sql`.
- Migrations must be idempotent and backward-compatible whenever possible.
- **Destructive Operations**: `DROP TABLE`, `DROP DATABASE`, `TRUNCATE`, or unconditional `DELETE` are strictly forbidden on production without explicit human authorization.
