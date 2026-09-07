-- 产品智库 V3 / Supabase schema
-- 在 Supabase Dashboard -> SQL Editor 中一次性执行。
-- 不要把 Secret/Service key 写入浏览器或 GitHub。

create extension if not exists pgcrypto;

create table if not exists public.product_categories(id uuid primary key default gen_random_uuid(),name text not null unique,icon text not null default '•',description text,sort_order int not null default 0,created_at timestamptz not null default now());
insert into public.product_categories(name,icon,description,sort_order) values
('新品资料','✦','新产品立项与首发资料',10),
('电子产品','▣','消费电子与小家电',20),
('家居生活','⌂','家居、收纳、日用产品',30),
('个护美妆','◌','个护、美容与健康生活',40),
('户外休闲','◒','户外、旅行与休闲产品',50),
('其他','＋','其他产品资料',99)
on conflict(name) do nothing;

create table if not exists public.profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  role text not null default 'user' check(role in('user','admin','superadmin')),
  muted_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create or replace function public.resolve_role(p_username text) returns text language sql immutable as $$
  select case
    when lower(p_username)='leo' then 'superadmin'
    when lower(p_username) in('user1','user2','user3','user4','user5','user6','user7','user8','user9','user10') then 'admin'
    else 'user'
  end
$$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
declare uname text;
begin
  uname:=coalesce(new.raw_user_meta_data->>'username',split_part(new.email,'@',1));
  insert into public.profiles(id,username,role) values(new.id,uname,public.resolve_role(uname))
  on conflict(id) do update set username=excluded.username,role=excluded.role,updated_at=now();
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table if not exists public.products(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  model text,
  category_id uuid references public.product_categories(id) on delete set null,
  price text,
  summary text,
  parameters text,
  selling_points text,
  status text not null default 'draft' check(status in('draft','published')),
  is_featured boolean not null default false,
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
create table if not exists public.contact_messages(
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  body text not null,
  contact text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role in('admin','superadmin'));
$$;
create or replace function public.is_superadmin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='superadmin');
$$;
create or replace function public.is_muted() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and muted_until is not null and muted_until>now());
$$;

alter table public.product_categories enable row level security;
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists categories_read on public.product_categories;
create policy categories_read on public.product_categories for select using(true);
drop policy if exists categories_manage on public.product_categories;
create policy categories_manage on public.product_categories for all using(public.is_superadmin()) with check(public.is_superadmin());

drop policy if exists profile_self_read on public.profiles;
create policy profile_self_read on public.profiles for select using(auth.uid()=id or public.is_superadmin());
drop policy if exists profile_super_manage on public.profiles;
create policy profile_super_manage on public.profiles for all using(public.is_superadmin()) with check(public.is_superadmin());

drop policy if exists products_read on public.products;
create policy products_read on public.products for select using(status='published' or public.is_admin());
drop policy if exists products_insert on public.products;
create policy products_insert on public.products for insert with check(public.is_admin() and created_by=auth.uid());
drop policy if exists products_update on public.products;
create policy products_update on public.products for update using(public.is_admin()) with check(public.is_admin());
drop policy if exists products_delete on public.products;
create policy products_delete on public.products for delete using(public.is_admin());

drop policy if exists media_read on public.product_media;
create policy media_read on public.product_media for select using(true);
drop policy if exists media_manage on public.product_media;
create policy media_manage on public.product_media for all using(public.is_admin()) with check(public.is_admin());

drop policy if exists messages_insert on public.contact_messages;
create policy messages_insert on public.contact_messages for insert with check(auth.uid()=user_id and not public.is_muted());
drop policy if exists messages_read on public.contact_messages;
create policy messages_read on public.contact_messages for select using(public.is_admin() or auth.uid()=user_id);
drop policy if exists messages_delete on public.contact_messages;
create policy messages_delete on public.contact_messages for delete using(public.is_admin());

insert into storage.buckets(id,name,public) values('product-media','product-media',true) on conflict(id) do update set public=true;
drop policy if exists product_storage_read on storage.objects;
create policy product_storage_read on storage.objects for select using(bucket_id='product-media');
drop policy if exists product_storage_insert on storage.objects;
create policy product_storage_insert on storage.objects for insert with check(bucket_id='product-media' and public.is_admin());
drop policy if exists product_storage_update on storage.objects;
create policy product_storage_update on storage.objects for update using(bucket_id='product-media' and public.is_admin());
drop policy if exists product_storage_delete on storage.objects;
create policy product_storage_delete on storage.objects for delete using(bucket_id='product-media' and public.is_admin());

grant select on public.product_categories to anon,authenticated;
grant select on public.products to anon,authenticated;
grant select on public.product_media to anon,authenticated;
grant select,insert,delete on public.contact_messages to authenticated;
grant select on public.profiles to authenticated;
grant insert,update,delete on public.products to authenticated;
grant insert,update,delete on public.product_media to authenticated;
grant update,delete on public.profiles to authenticated;
