# 第三步：GitHub → CloudBase 自动部署 + 已打开网页发现新版本

这一步解决两件事：

1. 以后不再手工整包上传 CloudBase。
2. 女朋友一直开着网页不刷新时，网站发布新版本后会出现“小屋有新变化啦 / 点击更新”。

## 推荐结构：同一个 GitHub 仓库，新建 `cloudbase` 分支

不要动目前给 GitHub Pages 使用的 `main` 分支。

从 `main` 新建一个 `cloudbase` 分支，把你目前已经在 CloudBase 测试成功的**完整网站文件夹**放进这个分支，再用本包中的 6 个文件覆盖：

- `index.html`
- `script.js`
- `style.css`
- `cloudbase-config.js`
- `build.js`
- `package.json`

你的 `images/` 应继续使用压缩后的 WebP + `images/thumbs/` 版本。

## CloudBase 中绑定 GitHub

进入：静态网站托管 → 新建部署 → Git 仓库 → 个人仓库。

授权 GitHub 后：

- 仓库：你现在的小屋仓库
- 分支：`cloudbase`
- 安装命令：留空
- 构建命令：`npm run build`
- 构建产物目录：`dist`
- 部署路径：`/`

部署一次并确认网站正常。

以后流程只有：

改本地文件 → commit → push 到 `cloudbase` → CloudBase 自动部署。

## 为什么需要 build.js

每次 CloudBase 因 Git push 重新构建时，`build.js` 会：

- 自动生成新的 `site-version.json`
- 自动给 `style.css` / `script.js` / `cloudbase-config.js` 换一个新版本参数
- 把可部署的网站文件输出到 `dist/`

这样浏览器不会长期卡在旧 JS/CSS。

网站本身每 60 秒轻量检查一次 `site-version.json`。发现版本不同后只提示，不强制刷新，避免她正在看照片时突然被打断。

## 第一次建议

在 `cloudbase` 分支中可以把旧的 `images/*.jpg` 删除，只保留压缩的 `.webp` 和 `images/thumbs/*.webp`，避免 Git 仓库和 CloudBase 构建包越来越大。
