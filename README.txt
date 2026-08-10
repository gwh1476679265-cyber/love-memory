Phase 4.4：第 4/4 步 scope=null 修复

原因：上一版虽然改成 HTTP API 调用云函数，但在真正发起 fetch 前又调用了一次 CloudBase auth.getSession() 来读取 access_token。当前 Web SDK 2.27.x 在你的浏览器环境里，这个“第二次读取会话”会抛出 Cannot read properties of null (reading 'scope')，因此 HTTP 请求其实根本没有发出去。

本版修改：
1. 匿名登录初始化时就缓存 access_token；
2. 第 4/4 步直接复用缓存 token，不再调用 getSession()；
3. 普通访客访问记录也复用同一个 token；
4. 只有 visit 云函数真正成功后才写入本地 20 分钟冷却。

操作：
只需把 script.js 覆盖 GitHub cloud 分支根目录并 push，等待 CloudBase 自动部署。
然后重新打开 网站/?notify=setup 测试。
