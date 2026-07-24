-- Panel Admin needs a way to distinguish admin accounts. Defaults to false;
-- grant it manually per-account (there's no self-service admin signup).
alter table profiles add column is_admin boolean not null default false;
