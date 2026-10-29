-- ARM / INSIGHT — Supabase schema (educational CCP prototype)
-- Run this once in: Supabase Dashboard → SQL Editor → New query → Run

-- Single shared workspace document (matches browser localStorage shape)
create table if not exists public.workspaces (
  id text primary key default 'default',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Optional: keep a readable history of saved investigations
create table if not exists public.cases (
  id text primary key,
  workspace_id text not null default 'default',
  name text not null,
  asset text not null default '',
  notes text not null default '',
  policy text not null default 'Safety first',
  evidence jsonb not null default '{}'::jsonb,
  records jsonb not null default '{}'::jsonb,
  kb jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.tickets (
  id text primary key,
  workspace_id text not null default 'default',
  fault text,
  name text not null,
  action text not null,
  severity text not null,
  asset text not null default '',
  status text not null default 'Open',
  updated_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;
alter table public.cases enable row level security;
alter table public.tickets enable row level security;

-- Open policies for the academic demo (no login). Tighten before any real plant use.
drop policy if exists "anon read workspaces" on public.workspaces;
drop policy if exists "anon write workspaces" on public.workspaces;
drop policy if exists "anon update workspaces" on public.workspaces;
drop policy if exists "anon read cases" on public.cases;
drop policy if exists "anon write cases" on public.cases;
drop policy if exists "anon update cases" on public.cases;
drop policy if exists "anon delete cases" on public.cases;
drop policy if exists "anon read tickets" on public.tickets;
drop policy if exists "anon write tickets" on public.tickets;
drop policy if exists "anon update tickets" on public.tickets;
drop policy if exists "anon delete tickets" on public.tickets;

create policy "anon read workspaces" on public.workspaces for select to anon using (true);
create policy "anon write workspaces" on public.workspaces for insert to anon with check (true);
create policy "anon update workspaces" on public.workspaces for update to anon using (true) with check (true);

create policy "anon read cases" on public.cases for select to anon using (true);
create policy "anon write cases" on public.cases for insert to anon with check (true);
create policy "anon update cases" on public.cases for update to anon using (true) with check (true);
create policy "anon delete cases" on public.cases for delete to anon using (true);

create policy "anon read tickets" on public.tickets for select to anon using (true);
create policy "anon write tickets" on public.tickets for insert to anon with check (true);
create policy "anon update tickets" on public.tickets for update to anon using (true) with check (true);
create policy "anon delete tickets" on public.tickets for delete to anon using (true);

-- Seed empty default workspace so first sync can update
insert into public.workspaces (id, data)
values (
  'default',
  '{"format":"arm-insight-v2","kb":null,"cases":[],"tickets":[]}'::jsonb
)
on conflict (id) do nothing;
