-- ============================================================
-- 鱼鱼和獭獭的小屋 · Phase 2
-- CloudBase SQL(PostgreSQL) 共同约定表
-- 在 CloudBase → SQL 型数据库 → 新建查询 中整段执行
-- ============================================================

CREATE TABLE IF NOT EXISTS public.couple_todos (
  id          varchar(64) PRIMARY KEY,
  title       text        NOT NULL,
  done        boolean     NOT NULL DEFAULT false,
  sort_order  integer     NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  varchar(64)
);

-- 记录“谁最后改了这个勾”和修改时间。
CREATE OR REPLACE FUNCTION public.touch_couple_todo()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  NEW.updated_by := auth.uid();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_touch_couple_todo ON public.couple_todos;
CREATE TRIGGER trg_touch_couple_todo
BEFORE UPDATE ON public.couple_todos
FOR EACH ROW EXECUTE FUNCTION public.touch_couple_todo();

-- 先把当前网页里的 25 条约定写入数据库。
INSERT INTO public.couple_todos (id, title, done, sort_order) VALUES
('todo_01_mountain', '一起去爬山 ⛰️', false, 1),
('todo_02_yuyao_drive', '来余姚开车 🚗', false, 2),
('todo_03_hangzhou_flowers', '来杭州送花 💐', true, 3),
('todo_04_yuyao_flowers', '来余姚送花 🌸', false, 4),
('todo_05_dongting3000', '洞庭 3000 里吃饭 🍲', true, 5),
('todo_06_live', '一起看 live 🎵', true, 6),
('todo_07_xiaoheshan', '一起吃小和山 🥞', false, 7),
('todo_08_gongda', '来工大 🏫', true, 8),
('todo_09_purek_rice', '纯 k 卤肉饭 🍚', false, 9),
('todo_10_mix_sauce', '给她调调料 🥢', false, 10),
('todo_11_zhouheiya', '吃周黑鸭 黑鸭煲 🦆', false, 11),
('todo_12_battery', '看电量（下次见面看看🔋）', true, 12),
('todo_13_liangzhu_deer', '良渚小鹿 🦌', false, 13),
('todo_14_muwu_bbq', '木屋烧烤🍢', true, 14),
('todo_15_duck_blood_noodles', '鸭血粉丝（温州瘦肉丸 🥣）', false, 15),
('todo_16_breathing', '胸式呼吸 腹式呼吸 😮‍💨', true, 16),
('todo_17_view_angles', '俯视仰视 👀', false, 17),
('todo_18_hair_tie', '智取发绳 🎀', true, 18),
('todo_19_lawn_concert', '补一个草坪音乐会 🎸', false, 19),
('todo_20_offline_movie', '补一个线下观影 🎬', false, 20),
('todo_21_make_cake', '给她做蛋糕 🍰', false, 21),
('todo_22_draw_picture', '给她画画 🎨', false, 22),
('todo_23_dim_sum', '带我吃点都德', false, 23),
('todo_24_xiaxu_gelato', '吃夏序gelato', false, 24),
('todo_25_watch_website', '线下一起看我们的网站', true, 25)
ON CONFLICT (id) DO NOTHING;

-- 前端只需要“看 + 改 done 勾选”，不开放新增/删除，也不允许改标题和排序。
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.couple_todos TO anon, authenticated;
REVOKE UPDATE, INSERT, DELETE ON public.couple_todos FROM anon, authenticated;
GRANT UPDATE (done) ON public.couple_todos TO anon, authenticated;

-- 开启 PostgreSQL 行级权限。
ALTER TABLE public.couple_todos ENABLE ROW LEVEL SECURITY;

-- 测试阶段：任何拿到匿名登录身份的人都能读取/修改这些约定。
-- 下一步拿到你和女朋友两台设备 UID 后，我们会把这里锁成“只有两个人可改”。
DROP POLICY IF EXISTS couple_todos_read ON public.couple_todos;
CREATE POLICY couple_todos_read ON public.couple_todos
FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS couple_todos_update ON public.couple_todos;
CREATE POLICY couple_todos_update ON public.couple_todos
FOR UPDATE TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 检查结果：应该返回 25 行。
SELECT id, title, done, sort_order, updated_at, updated_by
FROM public.couple_todos
ORDER BY sort_order;
