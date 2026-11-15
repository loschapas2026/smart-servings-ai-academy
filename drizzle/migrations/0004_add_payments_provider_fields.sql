alter table public.subscriptions
  add column if not exists stripe_subscription_id text,
  add column if not exists stripe_customer_id text,
  add column if not exists price_id text,
  add column if not exists environment text not null default 'sandbox',
  add column if not exists current_period_start timestamptz,
  add column if not exists cancel_at_period_end boolean not null default false;

create unique index if not exists subscriptions_stripe_subscription_id_key
  on public.subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

create index if not exists subscriptions_user_env_created_idx
  on public.subscriptions (user_id, environment, created_at desc);

alter table public.payments
  add column if not exists stripe_invoice_id text,
  add column if not exists stripe_charge_id text,
  add column if not exists environment text not null default 'sandbox';

create unique index if not exists payments_stripe_invoice_id_key
  on public.payments (stripe_invoice_id)
  where stripe_invoice_id is not null;