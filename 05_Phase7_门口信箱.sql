-- ============================================================
-- 鱼鱼和獭獭的小屋 · Phase 7
-- 门口信箱：两个人写信 / 收信 / 未读状态
--
-- 说明：
-- 1) 继续使用前端长期 deviceId 区分“这台设备”和“另一台设备”。
-- 2) 前端不会在收信页显示本设备自己投递的正文；只有另一台设备会看到并拆信。
-- 3) 当前项目没有真实账号体系，因此这是“小屋内的双方交互规则”，不是账号级加密私信。
-- 4) 本 SQL 不修改 couple_todos / couple_messages / Web Push / visit_logs。
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.couple_letters (
  id text PRIMARY KEY,
  body text NOT NULL,
  occasion text NOT NULL DEFAULT '平常的一天',
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  opened_by text,
  opened_at timestamptz
);

ALTER TABLE public.couple_letters ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'couple_letters_body_check'
      AND conrelid = 'public.couple_letters'::regclass
  ) THEN
    ALTER TABLE public.couple_letters
      ADD CONSTRAINT couple_letters_body_check
      CHECK (char_length(btrim(body)) BETWEEN 1 AND 1200);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'couple_letters_occasion_check'
      AND conrelid = 'public.couple_letters'::regclass
  ) THEN
    ALTER TABLE public.couple_letters
      ADD CONSTRAINT couple_letters_occasion_check
      CHECK (char_length(btrim(occasion)) BETWEEN 1 AND 30);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'couple_letters_created_by_check'
      AND conrelid = 'public.couple_letters'::regclass
  ) THEN
    ALTER TABLE public.couple_letters
      ADD CONSTRAINT couple_letters_created_by_check
      CHECK (char_length(btrim(created_by)) BETWEEN 8 AND 128);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'couple_letters_opened_by_check'
      AND conrelid = 'public.couple_letters'::regclass
  ) THEN
    ALTER TABLE public.couple_letters
      ADD CONSTRAINT couple_letters_opened_by_check
      CHECK (opened_by IS NULL OR char_length(btrim(opened_by)) BETWEEN 8 AND 128);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS couple_letters_created_at_idx
  ON public.couple_letters (created_at DESC);

GRANT SELECT, INSERT, UPDATE ON TABLE public.couple_letters TO anon, authenticated;

DROP POLICY IF EXISTS couple_letters_read ON public.couple_letters;
CREATE POLICY couple_letters_read
ON public.couple_letters
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS couple_letters_insert ON public.couple_letters;
CREATE POLICY couple_letters_insert
ON public.couple_letters
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(btrim(body)) BETWEEN 1 AND 1200
  AND char_length(btrim(occasion)) BETWEEN 1 AND 30
  AND char_length(btrim(created_by)) BETWEEN 8 AND 128
  AND opened_by IS NULL
  AND opened_at IS NULL
);

DROP POLICY IF EXISTS couple_letters_update ON public.couple_letters;
CREATE POLICY couple_letters_update
ON public.couple_letters
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (
  char_length(btrim(body)) BETWEEN 1 AND 1200
  AND char_length(btrim(occasion)) BETWEEN 1 AND 30
  AND char_length(btrim(created_by)) BETWEEN 8 AND 128
  AND (opened_by IS NULL OR char_length(btrim(opened_by)) BETWEEN 8 AND 128)
);

COMMIT;

-- ============================================================
-- 执行后验证：下面应全部为 t
-- ============================================================
SELECT
  to_regclass('public.couple_letters') IS NOT NULL AS letters_table_exists,
  has_table_privilege('anon', 'public.couple_letters', 'SELECT') AS anon_letters_select,
  has_table_privilege('anon', 'public.couple_letters', 'INSERT') AS anon_letters_insert,
  has_table_privilege('anon', 'public.couple_letters', 'UPDATE') AS anon_letters_update,
  EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname='public' AND c.relname='couple_letters' AND c.relrowsecurity
  ) AS letters_rls_enabled,
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='couple_letters' AND policyname='couple_letters_read'
  ) AS letters_read_policy_exists,
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='couple_letters' AND policyname='couple_letters_insert'
  ) AS letters_insert_policy_exists,
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='couple_letters' AND policyname='couple_letters_update'
  ) AS letters_update_policy_exists;
