-- Product Intelligence Hub / Supabase schema
create extension if not exists pgcrypto;
create type public.user_role as enum ('user','admin','superadmin');
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  role public.user_role not null default 'user',
  muted boolean not null default false,
  phone_or_contact text,
  note text,
  created_at timestamptz not null default now()
);
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null,
  sort_order int not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), name text not null, model text,
  category_id uuid references public.categories(id) on delete set null, price text,
  description text, specs text, selling_points text, published boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.product_media (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  media_type text not null check (media_type in ('image','video')), storage_path text not null,
  sort_order int not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade, body text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(), author_id uuid references public.profiles(id) on delete set null,
  contact_way text not null, body text not null, handled boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.moderation_logs (
  id uuid primary key default gen_random_uuid(), operator_id uuid references public.profiles(id) on delete set null,
  target_user_id uuid references public.profiles(id) on delete set null, action text not null, reason text,
  created_at timestamptz not null default now()
);
insert into public.categories(slug,name,sort_order) values
('new','新品资料',10),('electronics','电子产品',20),('home','家居生活',30),('beauty','个护美妆',40),('outdoor','户外休闲',50),('other','其他',60)
on conflict (slug) do nothing;
create or replace function public.current_role() returns public.user_role language sql stable as $$
  select role from public.profiles where id = auth.uid();
$$;
create or replace function public.is_admin() returns boolean language sql stable as $$
  select coalesce(public.current_role() in ('admin','superadmin'), false);
$$;
create or replace function public.is_superadmin() returns boolean language sql stable as $$
  select coalesce(public.current_role() = 'superadmin', false);
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.comments enable row level security;
alter table public.contact_messages enable row level security;
alter table public.moderation_logs enable row level security;

create policy "profiles_self_read" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles_self_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_super_update" on public.profiles for update using (public.is_superadmin()) with check (public.is_superadmin());
create policy "categories_public_read" on public.categories for select using (true);
create policy "categories_admin_write" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "products_public_read" on public.products for select using (published = true or public.is_admin());
create policy "products_admin_write" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "media_public_read" on public.product_media for select using (exists(select 1 from public.products p where p.id=product_id and (p.published=true or public.is_admin())));
create policy "media_admin_write" on public.product_media for all using (public.is_admin()) with check (public.is_admin());
create policy "comments_public_read" on public.comments for select using (true);
create policy "comments_user_insert" on public.comments for insert with check (auth.uid() = author_id and not exists(select 1 from public.profiles p where p.id=auth.uid() and p.muted));
create policy "comments_self_delete" on public.comments for delete using (auth.uid() = author_id or public.is_admin());
create policy "contact_self_insert" on public.contact_messages for insert with check (auth.uid() = author_id);
create policy "contact_admin_read" on public.contact_messages for select using (public.is_admin());
create policy "contact_admin_update" on public.contact_messages for update using (public.is_admin()) with check (public.is_admin());
create policy "logs_super_read" on public.moderation_logs for select using (public.is_superadmin());
create policy "logs_super_insert" on public.moderation_logs for insert with check (public.is_superadmin());

-- Create a Supabase Storage bucket named product-media.
-- Recommended paths: products/<product-id>/images/* and products/<product-id>/videos/*.
-- Upload/delete policies should allow admins only; public read can be enabled for published media.