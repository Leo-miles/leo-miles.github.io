-- 产品智库 V3 / Supabase schema（与当前 index.html 字段保持一致）
-- Supabase Dashboard -> SQL Editor -> 粘贴全文 -> Run
-- 不要把 Secret/Service key 写入网页或 GitHub。

create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('user','admin','superadmin');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  role public.user_role not null default 'user',
  muted boolean not null default false,
  phone_or_contact text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories(
  id text primary key,
  name text not null unique,
  icon text,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into public.categories(id,name,icon,description,sort_order) values
('new','新品资料','✦','新产品首发与立项',10),
('electronics','电子产品','▣','消费电子与小家电',20),
('home','家居生活','⌂','家居与日用',30),
('beauty','个护美妆','◌','个护与美容',40),
('outdoor','户外休闲','◒','户外与旅行',50),
('other','其他','＋','其他产品',60)
on conflict(id) do nothing;

create table if not exists public.products(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  model text,
  category text references public.categories(id) on delete set null,
  price text,
  desc text,
  specs text,
  selling text,
  published boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_media(
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  media_type text not null check(media_type in('image','video')),
  storage_path text not null,
  public_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.comments(
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages(
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  contact_way text not null,
  body text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.moderation_logs(
  id uuid primary key default gen_random_uuid(),
  operator_id uuid references public.profiles(id) on delete set null,
  target_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  reason text,
  created_at timestamptz not null default now()
);

create or replace function public.resolve_role(p_username text)
returns public.user_role language sql immutable as $$
  select case
    when lower(p_username)='leo' then 'superadmin'::public.user_role
    when lower(p_username) in('user1','user2','user3','user4','user5','user6','user7','user8','user9','user10') then 'admin'::public.user_role
    else 'user'::public.user_role
  end
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
declare uname text;
begin
  uname:=coalesce(new.raw_user_meta_data->>'username',split_part(new.email,'@',1));
  insert into public.profiles(id,username,role)
  values(new.id,uname,public.resolve_role(uname))
  on conflict(id) do update set username=excluded.username,role=excluded.role;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.current_role()
returns public.user_role language sql stable security definer set search_path=public as $$
  select role from public.profiles where id=auth.uid();
$$;
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select coalesce(public.current_role() in('admin','superadmin'),false);
$$;
create or replace function public.is_superadmin()
returns boolean language sql stable security definer set search_path=public as $$
  select coalesce(public.current_role()='superadmin',false);
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.comments enable row level security;
alter table public.contact_messages enable row level security;
alter table public.moderation_logs enable row level security;

-- profiles
 drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles for select using(auth.uid()=id or public.is_admin());
drop policy if exists profiles_self_insert on public.profiles;
create policy profiles_self_insert on public.profiles for insert with check(auth.uid()=id);
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles for update using(auth.uid()=id) with check(auth.uid()=id);
drop policy if exists profiles_super_update on public.profiles;
create policy profiles_super_update on public.profiles for update using(public.is_superadmin()) with check(public.is_superadmin());

-- categories
 drop policy if exists categories_read on public.categories;
create policy categories_read on public.categories for select using(true);
drop policy if exists categories_manage on public.categories;
create policy categories_manage on public.categories for all using(public.is_superadmin()) with check(public.is_superadmin());

-- products
 drop policy if exists products_read on public.products;
create policy products_read on public.products for select using(published=true or public.is_admin());
drop policy if exists products_insert on public.products;
create policy products_insert on public.products for insert with check(public.is_admin() and created_by=auth.uid());
drop policy if exists products_update on public.products;
create policy products_update on public.products for update using(public.is_admin()) with check(public.is_admin());
drop policy if exists products_delete on public.products;
create policy products_delete on public.products for delete using(public.is_admin());

-- media
 drop policy if exists media_read on public.product_media;
create policy media_read on public.product_media for select using(true);
drop policy if exists media_manage on public.product_media;
create policy media_manage on public.product_media for all using(public.is_admin()) with check(public.is_admin());

-- comments
 drop policy if exists comments_read on public.comments;
create policy comments_read on public.comments for select using(true);
drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments for insert with check(auth.uid()=author_id and not exists(select 1 from public.profiles p where p.id=auth.uid() and p.muted));
drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments for delete using(auth.uid()=author_id or public.is_admin());

-- contact messages
 drop policy if exists contact_insert on public.contact_messages;
create policy contact_insert on public.contact_messages for insert with check(auth.uid()=author_id);
drop policy if exists contact_read on public.contact_messages;
create policy contact_read on public.contact_messages for select using(public.is_admin() or auth.uid()=author_id);
drop policy if exists contact_update on public.contact_messages;
create policy contact_update on public.contact_messages for update using(public.is_admin()) with check(public.is_admin());
drop policy if exists contact_delete on public.contact_messages;
create policy contact_delete on public.contact_messages for delete using(public.is_admin());

-- moderation logs
 drop policy if exists logs_super_read on public.moderation_logs;
create policy logs_super_read on public.moderation_logs for select using(public.is_superadmin());
drop policy if exists logs_super_insert on public.moderation_logs;
create policy logs_super_insert on public.moderation_logs for insert with check(public.is_superadmin());

-- storage bucket and policies
insert into storage.buckets(id,name,public) values('product-media','product-media',true) on conflict(id) do update set public=true;
drop policy if exists product_media_public_read on storage.objects;
create policy product_media_public_read on storage.objects for select using(bucket_id='product-media');
drop policy if exists product_media_admin_insert on storage.objects;
create policy product_media_admin_insert on storage.objects for insert with check(bucket_id='product-media' and public.is_admin());
drop policy if exists product_media_admin_update on storage.objects;
create policy product_media_admin_update on storage.objects for update using(bucket_id='product-media' and public.is_admin());
drop policy if exists product_media_admin_delete on storage.objects;
create policy product_media_admin_delete on storage.objects for delete using(bucket_id='product-media' and public.is_admin());

-- Data API grants
grant select on public.categories to anon,authenticated;
grant select on public.products to anon,authenticated;
grant select,insert,delete on public.product_media to authenticated;
grant select on public.product_media to anon;
grant select,insert,delete on public.comments to authenticated;
grant select,insert,update,delete on public.contact_messages to authenticated;
grant select,update,delete on public.profiles to authenticated;
grant select,insert on public.moderation_logs to authenticated;
