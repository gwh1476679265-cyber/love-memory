# 第二步：CloudBase PostgreSQL 共同打勾（已确认版）

你刚才执行 `SELECT VERSION();` 的结果是 **PostgreSQL 17.10**，所以现在路线已经确定：

**CloudBase 静态网站 → CloudBase JS SDK → 匿名用户身份 → PostgreSQL `couple_todos` 表 → 两台设备近实时同步。**

CloudBase PostgreSQL 的 Web SDK 使用 `app.rdb()` 访问表；PG 当前没有文档数据库那种 `watch()` 实时订阅，所以本版本在“关于芸芸”页面停留时每 4 秒同步一次，点击勾选则立即写入云端。

## 1. 创建表和权限

CloudBase → SQL 型数据库 → 新建查询。

打开 `01_创建共同约定表.sql`，**整段复制执行**。

最后应该看到 25 行约定。脚本会：

- 创建 `public.couple_todos`
- 写入现在网站里的 25 条约定
- 开启 RLS
- 允许匿名/已登录前端读取
- 只允许修改 `done` 这一列
- 禁止前端新增、删除和修改标题

如果重复执行也没关系，初始化数据使用了 `ON CONFLICT DO NOTHING`。

## 2. 确认匿名登录

CloudBase → 身份认证 → 登录/注册配置，确认 **匿名登录** 已开启。

每台手机第一次访问都会得到自己的匿名 UID。这个 UID 后面用来把修改权限锁成“只有你和她”。

## 3. 配置安全域名

CloudBase → 环境配置 → 安全配置，把你现在实际访问的网站域名加入安全域名。

如果你之后看到 CORS / permission_denied，一般先检查这里。安全域名修改后可能需要几分钟生效。

## 4. 填写环境 ID

打开 `cloudbase-config.js`：

```js
window.LOVE_HOUSE_CLOUD = {
  envId: "YOUR_CLOUDBASE_ENV_ID",
  region: "ap-shanghai",
  table: "couple_todos",
  pollMs: 4000
};
```

把 `YOUR_CLOUDBASE_ENV_ID` 换成控制台里的**完整环境 ID**。注意不是页面顶部显示的简称/环境名称。

如果你的环境地域不是上海，也把 `region` 改成控制台实际地域。

不要把 SecretId、SecretKey 或 service_role API Key 写进网页。

## 5. 覆盖静态托管的 4 个文件

上传到 CloudBase 静态网站根目录并覆盖：

- `index.html`
- `script.js`
- `style.css`
- `cloudbase-config.js`

图片、WebP、音乐、生日贺卡、贴纸都不用重新上传。

> 本版本把 CloudBase JS SDK 固定到 `2.27.1`，不要改回 `/latest/`。官方目前 `/latest/` 已指向 v3，而这套代码按 v2 API 编写，固定版本更稳定。

## 6. 测试

1. 手机 A 打开网站，进入“关于边芸芸的一切” → “我们的约定”。
2. 手机 B / 电脑也打开同一页面。
3. A 点一条未完成约定。
4. A 应立即显示勾选并保存。
5. B 最迟约 4 秒自动变成相同状态。
6. 两边刷新后，勾选仍然存在。

同步条正常会显示：

> 云端同步已连接 · 约 4 秒自动同步一次 ♡

## 7. 测试成功后

两台设备各点一次“复制设备ID”，把两个 UID 保存下来。

下一步我们会把 PostgreSQL RLS 从“匿名访问者都能改”收紧为：

- 任何访客：可以看
- 只有你和她两个 UID：可以修改 `done`
- 其他人即使知道网址，也无法改动
