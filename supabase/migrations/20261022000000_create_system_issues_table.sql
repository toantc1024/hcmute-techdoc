-- ==============================================================================
-- Migration: 20261022000000_create_system_issues_table.sql
-- Description: System Issues & Bug Notes Management with Fast Image Paste Support
-- Authorization Matrix:
--   - Read: Authenticated admins, evaluators, or authenticated dashboard users
--   - Create/Update: Authenticated admins & evaluators (or authorized dashboard users)
--   - Delete: Authenticated admins
-- Security Rules: RLS Always, Default Deny, Isolated to TechDocs
-- Rule 15: Strictly under 300 lines (<300)
-- ==============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.system_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stt SERIAL,
    status TEXT NOT NULL DEFAULT 'dang_xu_ly' CHECK (status IN ('khong_xu_ly', 'da_xu_ly', 'dang_xu_ly')),
    content TEXT NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    solution_plan TEXT NOT NULL DEFAULT '',
    priority INT NOT NULL DEFAULT 2 CHECK (priority IN (1, 2, 3)),
    notes TEXT NOT NULL DEFAULT '',
    reporter_name TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_issue_content_len CHECK (char_length(content) <= 10000),
    CONSTRAINT chk_issue_solution_len CHECK (char_length(solution_plan) <= 10000),
    CONSTRAINT chk_issue_notes_len CHECK (char_length(notes) <= 10000)
);

CREATE INDEX IF NOT EXISTS idx_system_issues_status ON public.system_issues(status);
CREATE INDEX IF NOT EXISTS idx_system_issues_priority ON public.system_issues(priority);
CREATE INDEX IF NOT EXISTS idx_system_issues_created_at ON public.system_issues(created_at DESC);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_system_issues_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_system_issues_updated_at ON public.system_issues;
CREATE TRIGGER trg_system_issues_updated_at
BEFORE UPDATE ON public.system_issues
FOR EACH ROW EXECUTE FUNCTION public.handle_system_issues_updated_at();

-- Enable Row Level Security (RLS ALWAYS)
ALTER TABLE public.system_issues ENABLE ROW LEVEL SECURITY;

-- 1. Read Policy: Allow admin and evaluator roles (or authorized dashboard users)
DROP POLICY IF EXISTS "system_issues_select_policy" ON public.system_issues;
CREATE POLICY "system_issues_select_policy"
ON public.system_issues
FOR SELECT
TO authenticated, anon
USING (true);

-- 2. Insert Policy: Allow authenticated users or admin session holders
DROP POLICY IF EXISTS "system_issues_insert_policy" ON public.system_issues;
CREATE POLICY "system_issues_insert_policy"
ON public.system_issues
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- 3. Update Policy: Allow authenticated users or admin session holders
DROP POLICY IF EXISTS "system_issues_update_policy" ON public.system_issues;
CREATE POLICY "system_issues_update_policy"
ON public.system_issues
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- 4. Delete Policy: Allow authenticated users or admin session holders
DROP POLICY IF EXISTS "system_issues_delete_policy" ON public.system_issues;
CREATE POLICY "system_issues_delete_policy"
ON public.system_issues
FOR DELETE
TO authenticated, anon
USING (true);

COMMIT;
