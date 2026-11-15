alter table public.profiles add column phone text;
alter table public.profiles add column whatsapp_opt_in boolean not null default true;

create type public.notification_type as enum ('vencimento','reuniao','aviso','pagamento');
create type public.notification_status as enum ('pendente','enviando','enviado','entregue','lido','falhou');

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type notification_type not null,
  to_phone text not null,
  body text not null,
  status notification_status not null default 'pendente',
  twilio_sid text unique,
  error text,
  attempts integer not null default 0,
  dedupe_key text unique,
  scheduled_for timestamptz not null default now(),
  sent_at timestamptz,
  delivered_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
grant select on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "notif read" on public.notifications for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create index notifications_pending_idx on public.notifications (status, scheduled_for);

create table public.live_meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  link text,
  announced_at timestamptz,
  reminder_sent_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.live_meetings to authenticated;
grant all on public.live_meetings to service_role;
alter table public.live_meetings enable row level security;
create policy "meet read" on public.live_meetings for select to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_active_subscription(auth.uid()));
create policy "meet admin" on public.live_meetings for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, restaurant_name, email, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'restaurant_name', new.email, new.raw_user_meta_data->>'phone');
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end $$;