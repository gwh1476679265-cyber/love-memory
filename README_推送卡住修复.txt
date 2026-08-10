Phase 4.1：Web Push 卡住修复

只需要把 script.js 覆盖到 GitHub cloud 分支根目录并 push。
CloudBase 会自动构建部署。

改动：
1. 通知权限、Service Worker、Push订阅、CloudBase保存分别显示进度。
2. 每一步都加超时，不会无限卡住。
3. 检测跨域 iframe、微信/QQ内置浏览器、非HTTPS。
4. 如果 PushManager.subscribe 超时，会明确提示换浏览器/网络。
5. Service Worker 改用 /sw.js + scope /，避免路径偏移。
