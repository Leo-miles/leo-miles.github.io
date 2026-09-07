-- 一次性修复当前网站的 Supabase 登录与产品上传结构
-- 在 Supabase Dashboard -> SQL Editor 执行一次即可。
-- 不要把 Service/Secret key 放入网页。

-- 1) 修复旧账号可能没有 profiles 的情况
insert into public.profiles(id, username, role)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'username', split_part(u.email,'@',1)),
  public.resolve_role(coalesce(u.raw_user_meta_data->>'username', split_part(u.email,'@',1)))
from auth.users u
where coalesce(u.raw_user_meta_data->>'username', split_part(u.email,'@',1)) is not null
on conflict (id) do update
set username=excluded.username,
    role=excluded.role;

-- 2) 给当前网站使用的 products 补齐成本字段（已有则不会重复创建）
alter table public.products add column if not exists kit_price numeric default 0;
alter table public.products add column if not exists cell_model text;
alter table public.products add column if not exists cell_count numeric default 0;
alter table public.products add column if not exists actual_cell_capacity numeric default 0;
alter table public.products add column if not exists cell_price numeric default 0;
alter table public.products add column if not exists assembly_fee numeric default 0;
alter table public.products add column if not exists other_cost numeric default 0;
alter table public.products add column if not exists total_cost numeric default 0;
alter table public.products add column if not exists uploader_nickname text;

-- 3) 提供安全的“补建当前用户资料”函数
create or replace function public.ensure_my_profile()
returns public.profiles
language plpgsql
security definer
set search_path=public
as $$
declare
  uid uuid := auth.uid();
  uname text;
  result_row public.profiles;
begin
  if uid is null then
    raise exception '未登录';
  end if;

  select coalesce(raw_user_meta_data->>'username', split_part(email,'@',1))
    into uname
  from auth.users
  where id=uid;

  if uname is null or uname='' then
    raise exception '无法确定当前用户名';
  end if;

  insert into public.profiles(id,username,role)
  values(uid,uname,public.resolve_role(uname))
  on conflict(id) do update
    set username=excluded.username,
        role=excluded.role
  returning * into result_row;

  return result_row;
end;
$$;

grant execute on function public.ensure_my_profile() to authenticated;

-- 4) 确保函数本身能安全读取 profiles，不依赖客户端绕过 RLS
revoke all on function public.ensure_my_profile() from public;
grant execute on function public.ensure_my_profile() to authenticated;
