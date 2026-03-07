-- ============================================================
-- 블로그 썸네일 → Cloudinary URL 전환
-- ============================================================

update posts set thumbnail_url = 'https://res.cloudinary.com/dpwpptrhe/image/upload/f_auto,q_auto,w_800/warehouse-rebar_otithw'
where slug = 'rebar-buyout-guide';

update posts set thumbnail_url = 'https://res.cloudinary.com/dpwpptrhe/image/upload/f_auto,q_auto,w_800/facility-truck-wide_fjwvbo'
where slug = 'crane-truck-site-prep';

update posts set thumbnail_url = 'https://res.cloudinary.com/dpwpptrhe/image/upload/f_auto,q_auto,w_800/warehouse-large_zvbeur'
where slug = 'sl-steel-infrastructure';
