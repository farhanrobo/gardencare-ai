-- GardenCare AI — Supabase schema (prototype, no sign-in)
--
-- Design: the browser NEVER talks to Supabase directly.
-- All access goes through the app's server route (/api/cloud) which uses the
-- server-only secret key (SUPABASE_SECRET_KEY on the server / Vercel env).
--
-- RLS is enabled on every table with NO public policies, and the anon /
-- authenticated roles are explicitly revoked — the publishable/anon keys can
-- read or write nothing at all.

create table if not exists public.plants (
  id text primary key,
  device_id uuid not null,
  name text not null,
  species text not null default '',
  location text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  is_demo boolean not null default false
);

create table if not exists public.scans (
  id text primary key,
  device_id uuid not null,
  created_at timestamptz not null,
  image text not null default '',
  thumb text not null default '',
  file_name text,
  plant_id text,
  class_id integer not null,
  confidence double precision not null,
  alternatives jsonb not null default '[]'::jsonb,
  is_demo boolean not null default false
);

create table if not exists public.problem_reports (
  id text primary key,
  device_id uuid not null,
  problem_type text not null,
  location text not null default '',
  description text not null default '',
  image text,
  status text not null default 'reported',
  created_at timestamptz not null,
  is_demo boolean not null default false
);

create index if not exists plants_device_created_idx
  on public.plants (device_id, created_at desc);
create index if not exists scans_device_created_idx
  on public.scans (device_id, created_at desc);
create index if not exists problem_reports_device_created_idx
  on public.problem_reports (device_id, created_at desc);

alter table public.plants enable row level security;
alter table public.scans enable row level security;
alter table public.problem_reports enable row level security;

-- Deny-by-default: no policies are created, and public roles are revoked.
-- (The service role used by the server route bypasses RLS by design.)
revoke all on public.plants from anon, authenticated;
revoke all on public.scans from anon, authenticated;
revoke all on public.problem_reports from anon, authenticated;
