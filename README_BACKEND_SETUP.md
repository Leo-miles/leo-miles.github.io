# 产品智库 V3 后端接入说明

## 架构

- 前端：GitHub Pages（`index.html`）
- Auth：Supabase Auth
- 数据库：Supabase Postgres
- 图片/视频：Supabase Storage
- 权限：RLS + `profiles.role`
- 角色：`user` / `admin` / `superadmin`

GitHub Pages 只能托管静态页面，无法安全地永久保存账号、图片和视频。因此生产环境要把数据移到后端。

## 管理员

固定账号按需求设计为：

- 超级管理员：`Leo`
- 管理员：`User1` ~ `User10`

请不要把管理员密码写入网页源码。管理员应在 Supabase Auth 中一次性创建，之后账号会长期存在于后台，不需要重新注册。

## 一次性初始化

1. 创建 Supabase 项目。
2. 执行 `supabase/schema.sql`。
3. 在 Authentication → Users 创建 `Leo`、`User1`…`User10`。
4. 在 `public.profiles` 将 `Leo` 设为 `superadmin`，其余设为 `admin`。
5. 创建 Storage bucket：`product-media`。
6. 把前端接入 Supabase Auth / Postgres / Storage。

浏览器端只能使用公开 `anon` key；不要把 `service_role` key 写进 `index.html`。

## 产品资料

每个产品包含：名称、型号、分类、价格、简介、参数、卖点、多张图片、视频、发布状态、创建人和更新时间。

销售端支持分类浏览、关键词搜索、一键复制图片以及批量下载兜底。

## 权限

普通用户：查看已发布产品、留言、联系我们。

管理员：新增、编辑、删除产品、上传图片和视频、查看留言。

超级管理员：以上全部权限 + 查看账号资料 + 禁言/解除禁言 + 管理管理员权限 + 审核/删除内容。

## 当前版本说明

当前 `index.html` 已完成界面重构、角色 UI、产品资料录入、分类、搜索、图片/视频选择、用户管理、留言中心等前端能力，并保留无后端预览模式。

要满足“普通用户注册一次永久保存”“Leo 与 User1-User10 固定存在”“图片视频永久保存”等生产要求，还需要完成 Supabase 的一次性连接。