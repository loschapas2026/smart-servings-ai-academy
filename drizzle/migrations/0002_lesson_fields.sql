alter table public.contents add column position integer not null default 0;
alter table public.contents add column thumbnail_url text;
alter table public.contents add column duration text;