create type public.app_role as enum ('admin','user');
create type public.content_type as enum ('video','artigo','prompt','download');
create type public.sub_status as enum ('ativa','pendente','cancelada','inadimplente');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  restaurant_name text,
  active_session_id uuid,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  plan text not null check (plan in ('mensal','semestral','anual')),
  status sub_status not null default 'pendente',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.subscriptions to authenticated;
grant all on public.subscriptions to service_role;
alter table public.subscriptions enable row level security;

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  amount numeric(10,2) not null,
  status text not null default 'pago',
  description text,
  paid_at timestamptz not null default now()
);
grant select, insert, update, delete on public.payments to authenticated;
grant all on public.payments to service_role;
alter table public.payments enable row level security;

create table public.contents (
  id uuid primary key default gen_random_uuid(),
  type content_type not null,
  title text not null,
  summary text,
  body text,
  video_url text,
  file_url text,
  category text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.contents to authenticated;
grant all on public.contents to service_role;
alter table public.contents enable row level security;

create table public.content_progress (
  user_id uuid not null,
  content_id uuid not null references public.contents(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, content_id)
);
grant select, insert, delete on public.content_progress to authenticated;
grant all on public.content_progress to service_role;
alter table public.content_progress enable row level security;

create or replace function public.has_active_subscription(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.subscriptions where user_id = _user_id and status = 'ativa'
    and (current_period_end is null or current_period_end > now()))
$$;

-- policies
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "own profile insert" on public.profiles for insert to authenticated with check (id = auth.uid());

create policy "own roles read" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create policy "sub read" on public.subscriptions for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "sub admin write" on public.subscriptions for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "pay read" on public.payments for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "pay admin write" on public.payments for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "content read" on public.contents for select to authenticated using (
  public.has_role(auth.uid(),'admin') or (published and public.has_active_subscription(auth.uid())));
create policy "content admin write" on public.contents for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "progress own" on public.content_progress for select to authenticated using (user_id = auth.uid());
create policy "progress insert" on public.content_progress for insert to authenticated with check (user_id = auth.uid());
create policy "progress delete" on public.content_progress for delete to authenticated using (user_id = auth.uid());

-- single session
create or replace function public.claim_session(_session uuid)
returns void language sql security definer set search_path = public as $$
  update public.profiles set active_session_id = _session where id = auth.uid()
$$;
create or replace function public.is_current_session(_session uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select active_session_id = _session from public.profiles where id = auth.uid()), false)
$$;

-- signup: profile + role (first user becomes admin)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, restaurant_name)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'restaurant_name');
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

insert into public.contents (type, title, summary, body, video_url, category) values
('video','IA para restaurantes: por onde começar','O primeiro passo para usar IA no seu negócio.','Nesta aula você entende o que a IA pode fazer pelo seu restaurante hoje.','https://www.youtube.com/embed/aircAruvnKk','Fundamentos'),
('artigo','5 dores do restaurante que a IA resolve','Atendimento, cardápio, estoque, marketing e financeiro.','1. Atendimento no WhatsApp\n2. Cardápio que vende\n3. Estoque previsível\n4. Marketing diário\n5. Financeiro organizado',null,'Fundamentos'),
('prompt','Descrição irresistível de prato','Prompt para criar descrições de cardápio.','Você é um especialista em gastronomia e copywriting. Escreva uma descrição de até 40 palavras para o prato [NOME DO PRATO], com ingredientes [INGREDIENTES], destacando sabor, textura e origem. Tom: [TOM].',null,'Cardápio'),
('prompt','Resposta a avaliação negativa','Responda críticas com elegância.','Aja como gerente do restaurante [NOME]. Responda com empatia e profissionalismo à avaliação abaixo, reconheça o problema, ofereça solução e convide o cliente a voltar:\n[AVALIAÇÃO]',null,'Atendimento'),
('download','Planilha de ficha técnica','Modelo para custo de pratos.',null,null,'Gestão');