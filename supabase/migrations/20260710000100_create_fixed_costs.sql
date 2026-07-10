-- 家計簿アプリ 固定費スキーマ
-- fixed_costs: 家賃・光熱費など毎月固定でかかる費用。transactions と同様に
-- 1ユーザー1行のオーナーシップを RLS で強制する。

create table public.fixed_costs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  category text not null check (category in ('rent', 'utility', 'other')),
  label text,
  amount numeric(12, 0) not null check (amount > 0),
  created_at timestamptz not null default now()
);

create index fixed_costs_user_idx
  on public.fixed_costs (user_id);

alter table public.fixed_costs enable row level security;

create policy "fixed_costs_select_own" on public.fixed_costs
  for select using (auth.uid() = user_id);
create policy "fixed_costs_insert_own" on public.fixed_costs
  for insert with check (auth.uid() = user_id);
create policy "fixed_costs_update_own" on public.fixed_costs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "fixed_costs_delete_own" on public.fixed_costs
  for delete using (auth.uid() = user_id);
