-- 관리자(인증된 사용자) 전용 RLS 정책
-- Supabase SQL Editor에서 실행

create policy "posts_admin_read"   on posts for select to authenticated using (true);
create policy "posts_admin_insert" on posts for insert to authenticated with check (true);
create policy "posts_admin_update" on posts for update to authenticated using (true) with check (true);
create policy "posts_admin_delete" on posts for delete to authenticated using (true);
