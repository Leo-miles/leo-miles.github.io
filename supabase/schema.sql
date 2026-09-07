-- LeoMiles Product Intelligence Hub v4
-- Canonical schema. Apply with Supabase migrations rather than importing blindly.
-- Business tables are rebuilt separately in migration rebuild_product_hub_v4_2.

create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  role text not null default 'user' check (role in ('user','admin','superadmin')),
  muted boolean not null default false,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  model text,
  category_id uuid references public.categories(id) on delete set null,
  supplier text,
  price numeric(12,2),
  moq integer,
  delivery text,
  carton text,
  parameters jsonb not null default '{}'::jsonb,
  selling_points jsonb not null default '[]'::jsonb,
  description text,
  published boolean not null default true,
  created_by uuid not null references public.profiles(id) on delete restrict,
  uploader_nickname text,
  kit_price numeric(12,2),
  cell_model text,
  cell_count integer,
  actual_cell_capacity integer,
  cell_price numeric(12,2),
  assembly_fee numeric(12,2),
  other_cost numeric(12,2),
  total_cost numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  media_type text not null check (media_type in ('image','video')),
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  contact_way text,
  body text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.moderation_logs (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- See the applied migration for RLS policies, indexes, Auth profile trigger and Storage policies.