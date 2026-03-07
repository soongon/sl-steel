-- ============================================================
-- 블로그 썸네일 → Cloudinary URL 전환
-- ============================================================

update posts set thumbnail_url = 'https://res.cloudinary.com/dpwpptrhe/image/upload/f_auto,q_auto,w_800/blog/warehouse-rebar.jpg'
where slug = 'rebar-buyout-guide';

update posts set thumbnail_url = 'https://res.cloudinary.com/dpwpptrhe/image/upload/f_auto,q_auto,w_800/blog/facility-truck-wide.jpg'
where slug = 'crane-truck-site-prep';

update posts set thumbnail_url = 'https://res.cloudinary.com/dpwpptrhe/image/upload/f_auto,q_auto,w_800/blog/warehouse-large.jpg'
where slug = 'sl-steel-infrastructure';
