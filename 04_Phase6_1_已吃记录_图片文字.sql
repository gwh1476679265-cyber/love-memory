-- ============================================================
-- 鱼鱼和獭獭的小屋 · Phase 6.1
-- 卧室“已吃！”：图片 + 文字云端记录
--
-- 本 SQL 只新增已吃记录表和对应权限，不修改：
-- couple_todos / couple_messages / visit_logs / push_subscriptions。
-- 毛毡板现有 Bucket 继续复用 love-house-board。
-- ============================================================

BEGIN;

-- 1) “已吃！”记录表
CREATE TABLE IF NOT EXISTS public.couple_eaten_places (
  id text PRIMARY KEY,
  body text NOT NULL,
  image_path text,
  image_file_id text,
  image_name text,
  image_mime text,
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.couple_eaten_places ENABLE ROW LEVEL SECURITY;

-- 文本和 deviceId 的基础约束
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'couple_eaten_places_body_check'
      AND conrelid = 'public.couple_eaten_places'::regclass
  ) THEN
    ALTER TABLE public.couple_eaten_places
      ADD CONSTRAINT couple_eaten_places_body_check
      CHECK (char_length(btrim(body)) BETWEEN 1 AND 300);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'couple_eaten_places_created_by_check'
      AND conrelid = 'public.couple_eaten_places'::regclass
  ) THEN
    ALTER TABLE public.couple_eaten_places
      ADD CONSTRAINT couple_eaten_places_created_by_check
      CHECK (char_length(btrim(created_by)) BETWEEN 8 AND 128);
  END IF;
END $$;

-- 2) 前端 anon / authenticated 可读、可新增
GRANT SELECT, INSERT ON TABLE public.couple_eaten_places TO anon, authenticated;

DROP POLICY IF EXISTS couple_eaten_places_read ON public.couple_eaten_places;
CREATE POLICY couple_eaten_places_read
ON public.couple_eaten_places
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS couple_eaten_places_insert ON public.couple_eaten_places;
CREATE POLICY couple_eaten_places_insert
ON public.couple_eaten_places
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(btrim(body)) BETWEEN 1 AND 300
  AND char_length(btrim(created_by)) BETWEEN 8 AND 128
  AND (
    image_path IS NULL
    OR image_path LIKE 'board/eaten/%'
  )
);

-- 3) 继续复用 Phase 6 的附件 Bucket；不存在时补建
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit
)
VALUES (
  'love-house-board',
  'love-house-board',
  false,
  15728640
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit;

-- 4) 给 board/eaten/ 单独补一组最小 Storage RLS。
--    即使 Phase 6 的 board/ 通用 Policy 已经存在，也不会冲突。
DROP POLICY IF EXISTS love_house_eaten_select ON storage.objects;
CREATE POLICY love_house_eaten_select
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'love-house-board'
  AND path_tokens[1] = 'board'
  AND path_tokens[2] = 'eaten'
);

DROP POLICY IF EXISTS love_house_eaten_insert ON storage.objects;
CREATE POLICY love_house_eaten_insert
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'love-house-board'
  AND path_tokens[1] = 'board'
  AND path_tokens[2] = 'eaten'
  AND lower(storage.extension(name)) IN (
    'jpg','jpeg','png','webp','gif','heic','heif'
  )
);

-- 保存数据库失败时，前端会尝试清理刚上传的孤立图片。
DROP POLICY IF EXISTS love_house_eaten_delete ON storage.objects;
CREATE POLICY love_house_eaten_delete
ON storage.objects
FOR DELETE
TO anon, authenticated
USING (
  bucket_id = 'love-house-board'
  AND path_tokens[1] = 'board'
  AND path_tokens[2] = 'eaten'
);

COMMIT;

-- ============================================================
-- 执行后验证：下面应全部为 t
-- ============================================================
SELECT
  to_regclass('public.couple_eaten_places') IS NOT NULL AS eaten_table_exists,
  has_table_privilege('anon', 'public.couple_eaten_places', 'SELECT') AS anon_eaten_select,
  has_table_privilege('anon', 'public.couple_eaten_places', 'INSERT') AS anon_eaten_insert,
  EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname='public' AND c.relname='couple_eaten_places' AND c.relrowsecurity
  ) AS eaten_rls_enabled,
  EXISTS (
    SELECT 1 FROM storage.buckets WHERE id='love-house-board'
  ) AS storage_bucket_exists,
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects' AND policyname='love_house_eaten_insert'
  ) AS eaten_storage_insert_policy_exists,
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects' AND policyname='love_house_eaten_select'
  ) AS eaten_storage_select_policy_exists;
