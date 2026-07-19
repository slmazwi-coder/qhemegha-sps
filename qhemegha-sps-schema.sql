-- Qhemegha SPS — Supabase schema (phase 1)
-- Run this in the Supabase SQL editor after creating the project.

create type staff_role as enum ('admin', 'editor');
create type application_status as enum ('pending', 'approved', 'rejected');

create table staff_users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role staff_role not null default 'editor',
  created_at timestamptz not null default now()
);

create table pages (
  slug text primary key, -- 'home' | 'about' | 'academics' | 'contact'
  title text not null,
  body jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references staff_users(id)
);

create table news_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  image_url text,
  published_at timestamptz not null default now(),
  created_by uuid references staff_users(id)
);

create table staff_directory (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_title text not null,
  photo_url text,
  display_order int not null default 0
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  learner_name text not null,
  learner_dob date,
  grade_applying_for text not null,
  parent_name text not null,
  parent_contact text not null,
  parent_email text,
  address text,
  supporting_docs text[], -- storage URLs
  status application_status not null default 'pending',
  internal_notes text,
  submitted_at timestamptz not null default now()
);

-- Row Level Security
alter table staff_users enable row level security;
alter table pages enable row level security;
alter table news_items enable row level security;
alter table staff_directory enable row level security;
alter table applications enable row level security;

-- Public read access to content tables
create policy "public read pages" on pages for select using (true);
create policy "public read news" on news_items for select using (true);
create policy "public read staff directory" on staff_directory for select using (true);

-- Public can submit applications, but not read them
create policy "public insert applications" on applications for insert with check (true);

-- Authenticated staff (any role) can read/write content tables
create policy "staff manage pages" on pages for all
  using (exists (select 1 from staff_users where id = auth.uid()))
  with check (exists (select 1 from staff_users where id = auth.uid()));

create policy "staff manage news" on news_items for all
  using (exists (select 1 from staff_users where id = auth.uid()))
  with check (exists (select 1 from staff_users where id = auth.uid()));

create policy "staff manage directory" on staff_directory for all
  using (exists (select 1 from staff_users where id = auth.uid()))
  with check (exists (select 1 from staff_users where id = auth.uid()));

create policy "staff manage applications" on applications for select
  using (exists (select 1 from staff_users where id = auth.uid()));
create policy "staff update applications" on applications for update
  using (exists (select 1 from staff_users where id = auth.uid()));

-- Only admin role can manage staff_users
create policy "staff read own row" on staff_users for select
  using (id = auth.uid());
create policy "admin manage staff users" on staff_users for all
  using (exists (select 1 from staff_users su where su.id = auth.uid() and su.role = 'admin'))
  with check (exists (select 1 from staff_users su where su.id = auth.uid() and su.role = 'admin'));
