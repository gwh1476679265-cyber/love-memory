-- ============================================================
-- 鱼鱼和獭獭的小屋 · Phase 5.1 修复
-- 目的：
-- 1) 客厅留言板 / 卧室约定改为 Publishable Key（anon）直连 PostgreSQL；
-- 2) 不再依赖浏览器匿名登录 session；
-- 3) 留言的“我 / TA”使用每台设备自己的 deviceId 区分。
--
-- 这段 SQL 可以重复执行，不会删除已有约定、勾选或留言。
-- ============================================================

BEGIN;

GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 共同约定：anon / authenticated 都可读、打勾、创建。
GRANT SELECT ON public.couple_todos TO anon, authenticated;
GRANT UPDATE (done) ON public.couple_todos TO anon, authenticated;
GRANT INSERT (id, title, done, sort_order) ON public.couple_todos TO anon, authenticated;

ALTER TABLE public.couple_todos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS couple_todos_read ON public.couple_todos;
CREATE POLICY couple_todos_read ON public.couple_todos
FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS couple_todos_update ON public.couple_todos;
CREATE POLICY couple_todos_update ON public.couple_todos
FOR UPDATE TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS couple_todos_insert ON public.couple_todos;
CREATE POLICY couple_todos_insert ON public.couple_todos
FOR INSERT TO anon, authenticated
WITH CHECK (
  done = false
  AND char_length(btrim(title)) BETWEEN 1 AND 80
  AND sort_order > 0
);

-- 留言板：双方可读、可新增，但仍不允许网页直接修改/删除历史留言。
GRANT SELECT ON public.couple_messages TO anon, authenticated;
GRANT INSERT (id, body, created_by) ON public.couple_messages TO anon, authenticated;
REVOKE UPDATE, DELETE ON public.couple_messages FROM anon, authenticated;

ALTER TABLE public.couple_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS couple_messages_read ON public.couple_messages;
CREATE POLICY couple_messages_read ON public.couple_messages
FOR SELECT TO anon, authenticated
USING (true);

-- Phase 5.1：created_by 改为浏览器本地生成的 deviceId。
-- Publishable Key 请求属于 anon 身份，没有每台设备独立的 auth.uid()，
-- 所以不能再要求 created_by = auth.uid()。
DROP POLICY IF EXISTS couple_messages_insert ON public.couple_messages;
CREATE POLICY couple_messages_insert ON public.couple_messages
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(btrim(body)) BETWEEN 1 AND 300
  AND char_length(btrim(created_by)) BETWEEN 8 AND 128
);

COMMIT;

SELECT count(*) AS todo_count FROM public.couple_todos;
SELECT count(*) AS message_count FROM public.couple_messages;
