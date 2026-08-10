-- Cover photos get force-cropped to a short fixed-height box in ad cards
-- (object-cover), which was cutting off the top of banner-style photos
-- with text near the top. This lets sellers (and admins) pick which part
-- of the cover photo stays visible, stored as a CSS object-position value
-- ("x% y%"). Default is top-center, matching the previous hardcoded
-- object-top fallback, so existing ads don't regress.
alter table ads add column cover_focal_point text not null default '50% 0%';
