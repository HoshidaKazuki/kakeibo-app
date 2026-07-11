create table if not exists public.shared_app_state (
  id integer primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at_shared_app_state()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_set_updated_at_shared_app_state on public.shared_app_state;
create trigger trg_set_updated_at_shared_app_state
before update on public.shared_app_state
for each row execute function public.set_updated_at_shared_app_state();

create table if not exists public.login_audit_logs (
  id bigserial primary key,
  login_id text not null,
  success boolean not null,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.app_event_logs (
  id bigserial primary key,
  event_type text not null,
  level text not null,
  message text not null,
  meta jsonb not null default '{}'::jsonb,
  login_id text,
  created_at timestamptz not null default now()
);

alter table public.shared_app_state disable row level security;
alter table public.login_audit_logs disable row level security;
alter table public.app_event_logs disable row level security;
