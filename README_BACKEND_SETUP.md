# LeoMiles Product Intelligence Hub v4

这是一个纯 GitHub Pages 前端 + Supabase 后端的产品资料库。

## 当前结构

- `index.html`：唯一前端应用，不再叠加旧版本补丁。
- `supabase/schema.sql`：最终业务表结构说明。
- Supabase migration `rebuild_product_hub_v4_2`：已在项目中执行，用于重建业务表、RLS、Storage 和 Auth profile trigger。

## Supabase

Project: `zzkujghfxbjafvmlkwqz`
URL: `https://zzkujghfxbjafvmlkwqz.supabase.co`

前端只使用 publishable key，不包含 service role / secret key。

## 主要表

`profiles`、`categories`、`products`、`product_media`、`comments`、`contact_messages`、`moderation_logs`

## 权限

- 访客：浏览已发布产品、搜索、查看图片和视频。
- 普通用户：登录、评论、提交联系/需求信息。
- 管理员：发布、编辑、删除产品，上传/管理媒体。
- 超级管理员：全部管理权限，并可处理用户状态。

## 产品字段

名称、型号、分类、供应商、价格、MOQ、交期、包装/装箱、自定义参数、卖点、说明，以及充电宝电芯/组装/其他成本和总成本。

## 媒体

产品编辑器支持拖拽、文件选择和 Ctrl+V 粘贴图片；文件进入 `product-media` Storage，再通过 `product_media` 表绑定到产品。

## 发布流程

1. 先保存产品记录。
2. 再上传媒体。
3. 最后写入媒体绑定记录。
4. 任一步出错都会在页面显示明确错误，不会静默失败。

## 现有账号

为了不让重建后用户因为密码未知而无法登录，本次保留了 Supabase Auth 中已有账号，只重建业务数据和角色资料。
现有账号登录框仍支持直接填写账号名，例如 `leo`、`user1`，系统会内部映射到原有账号邮箱格式。
