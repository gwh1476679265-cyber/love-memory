-- ============================================================
-- 鱼鱼和獭獭的小屋 · Phase 5
-- 1) 允许双方创建新的“我们的约定”
-- 2) 新建客厅留言板 couple_messages
--
-- 在 CloudBase → SQL 型数据库 → 新建查询 中整段执行一次。
-- 已有约定和打勾状态不会被清空。
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- A. 共同约定：保留原来的读取/打勾权限，并新增“创建约定”权限
-- ------------------------------------------------------------

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.couple_todos TO anon, authenticated;
GRANT UPDATE (done) ON public.couple_todos TO anon, authenticated;
GRANT INSERT (id, title, done, sort_order) ON public.couple_todos TO anon, authenticated;

ALTER TABLE public.couple_todos ENABLE ROW LEVEL SECURITY;

-- 已有读取/更新策略如果之前存在，继续保留；这里重新声明确保一致。
DROP POLICY IF EXISTS couple_todos_read ON public.couple_todos;
CREATE POLICY couple_todos_read ON public.couple_todos
FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS couple_todos_update ON public.couple_todos;
CREATE POLICY couple_todos_update ON public.couple_todos
FOR UPDATE TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 新建约定只能以“未完成”状态创建，标题最长 80 字。
DROP POLICY IF EXISTS couple_todos_insert ON public.couple_todos;
CREATE POLICY couple_todos_insert ON public.couple_todos
FOR INSERT TO anon, authenticated
WITH CHECK (
  done = false
  AND char_length(btrim(title)) BETWEEN 1 AND 80
  AND sort_order > 0
);

-- ------------------------------------------------------------
-- B. 客厅留言板
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.couple_messages (
  id          varchar(80)  PRIMARY KEY,
  body        text         NOT NULL,
  created_at  timestamptz  NOT NULL DEFAULT now(),
  created_by  varchar(128) NOT NULL,
  CONSTRAINT couple_messages_body_length
    CHECK (char_length(btrim(body)) BETWEEN 1 AND 300)
);

CREATE INDEX IF NOT EXISTS idx_couple_messages_created_at
ON public.couple_messages (created_at ASC);

GRANT SELECT ON public.couple_messages TO anon, authenticated;
GRANT INSERT (id, body, created_by) ON public.couple_messages TO anon, authenticated;
REVOKE UPDATE, DELETE ON public.couple_messages FROM anon, authenticated;

ALTER TABLE public.couple_messages ENABLE ROW LEVEL SECURITY;

-- 两个人都能看到留言。
DROP POLICY IF EXISTS couple_messages_read ON public.couple_messages;
CREATE POLICY couple_messages_read ON public.couple_messages
FOR SELECT TO anon, authenticated
USING (true);

-- 只能以“当前登录匿名身份”的 UID 写入 created_by，避免伪装成另一台设备。
DROP POLICY IF EXISTS couple_messages_insert ON public.couple_messages;
CREATE POLICY couple_messages_insert ON public.couple_messages
FOR INSERT TO anon, authenticated
WITH CHECK (
  created_by = auth.uid()::text
  AND char_length(btrim(body)) BETWEEN 1 AND 300
);

COMMIT;

-- 检查：原约定应该仍在；留言表初始可以是 0 行。
SELECT count(*) AS todo_count FROM public.couple_todos;
SELECT count(*) AS message_count FROM public.couple_messages;
