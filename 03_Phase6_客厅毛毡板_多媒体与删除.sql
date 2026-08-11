-- ============================================================
-- 鱼鱼和獭獭的小屋 · Phase 6
-- 客厅毛毡板（文字 / 图片 / 语音）+ 删除便利贴 + 删除约定
--
-- 执行顺序：先执行本 SQL，再部署新版 index.html / script.js / style.css。
-- 本 SQL 不触碰访问提醒 / push_subscriptions / visit_logs。
-- ============================================================

BEGIN;

-- 1) 留言表增加多媒体字段；旧的 3 条文字留言会自动继续按 text 展示。
ALTER TABLE public.couple_messages
  ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS media_path text,
  ADD COLUMN IF NOT EXISTS media_file_id text,
  ADD COLUMN IF NOT EXISTS media_name text,
  ADD COLUMN IF NOT EXISTS media_mime text,
  ADD COLUMN IF NOT EXISTS media_duration integer;

UPDATE public.couple_messages
SET content_type = 'text'
WHERE content_type IS NULL OR content_type = '';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'couple_messages_content_type_check'
      AND conrelid = 'public.couple_messages'::regclass
  ) THEN
    ALTER TABLE public.couple_messages
      ADD CONSTRAINT couple_messages_content_type_check
      CHECK (content_type IN ('text', 'image', 'audio'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'couple_messages_media_duration_check'
      AND conrelid = 'public.couple_messages'::regclass
  ) THEN
    ALTER TABLE public.couple_messages
      ADD CONSTRAINT couple_messages_media_duration_check
      CHECK (media_duration IS NULL OR (media_duration >= 0 AND media_duration <= 3600));
  END IF;
END $$;

-- 2) 两张业务表开放 DELETE 给当前前端使用的 anon 角色。
GRANT DELETE ON TABLE public.couple_todos TO anon;
GRANT DELETE ON TABLE public.couple_messages TO anon;

DROP POLICY IF EXISTS couple_todos_delete ON public.couple_todos;
CREATE POLICY couple_todos_delete
ON public.couple_todos
FOR DELETE
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS couple_messages_delete ON public.couple_messages;
CREATE POLICY couple_messages_delete
ON public.couple_messages
FOR DELETE
TO anon, authenticated
USING (true);

-- 3) 创建专门给毛毡板附件使用的 PG 云存储 Bucket。
--    15MB 上限；真正允许的扩展名仍由下面 storage.objects RLS 再限制一层。
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

-- 4) PG 云存储的 anon / authenticated 默认已有表级 ALL；只需要 RLS。
--    仅开放 love-house-board Bucket，并限制为 board/ 目录和图片/语音扩展名。
DROP POLICY IF EXISTS love_house_board_select ON storage.objects;
CREATE POLICY love_house_board_select
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'love-house-board'
  AND path_tokens[1] = 'board'
);

DROP POLICY IF EXISTS love_house_board_insert ON storage.objects;
CREATE POLICY love_house_board_insert
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'love-house-board'
  AND path_tokens[1] = 'board'
  AND lower(storage.extension(name)) IN (
    'jpg','jpeg','png','webp','gif','heic','heif',
    'm4a','mp4','mp3','wav','webm','ogg','aac','caf'
  )
);

DROP POLICY IF EXISTS love_house_board_delete ON storage.objects;
CREATE POLICY love_house_board_delete
ON storage.objects
FOR DELETE
TO anon, authenticated
USING (
  bucket_id = 'love-house-board'
  AND path_tokens[1] = 'board'
);

COMMIT;

-- ============================================================
-- 执行后验证：业务表删除权限、字段、Bucket、Storage Policy
-- ============================================================
SELECT
  has_table_privilege('anon', 'public.couple_todos', 'DELETE') AS anon_todos_delete,
  has_table_privilege('anon', 'public.couple_messages', 'DELETE') AS anon_messages_delete,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='couple_messages' AND column_name='content_type'
  ) AS messages_has_content_type,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='couple_messages' AND column_name='media_path'
  ) AS messages_has_media_path,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='couple_messages' AND column_name='media_file_id'
  ) AS messages_has_media_file_id,
  EXISTS (
    SELECT 1 FROM storage.buckets WHERE id='love-house-board'
  ) AS storage_bucket_exists,
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects' AND policyname='love_house_board_insert'
  ) AS storage_insert_policy_exists,
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects' AND policyname='love_house_board_delete'
  ) AS storage_delete_policy_exists;
