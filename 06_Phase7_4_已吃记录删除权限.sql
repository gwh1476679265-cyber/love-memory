-- ============================================================
-- 鱼鱼和獭獭的小屋 · Phase 7.4
-- 卧室“已吃！”记录：补充删除权限
--
-- 只新增 DELETE 权限 / Policy，不修改已有记录。
-- 图片附件的 storage DELETE Policy 在 Phase 6.1 已经存在。
-- ============================================================

BEGIN;

GRANT DELETE ON TABLE public.couple_eaten_places TO anon, authenticated;

DROP POLICY IF EXISTS couple_eaten_places_delete ON public.couple_eaten_places;
CREATE POLICY couple_eaten_places_delete
ON public.couple_eaten_places
FOR DELETE
TO anon, authenticated
USING (true);

COMMIT;

-- 执行后应全部为 t
SELECT
  has_table_privilege('anon', 'public.couple_eaten_places', 'DELETE') AS anon_eaten_delete,
  EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'couple_eaten_places'
      AND policyname = 'couple_eaten_places_delete'
      AND cmd = 'DELETE'
  ) AS eaten_delete_policy_exists,
  EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'love_house_eaten_delete'
      AND cmd = 'DELETE'
  ) AS eaten_storage_delete_policy_exists;
