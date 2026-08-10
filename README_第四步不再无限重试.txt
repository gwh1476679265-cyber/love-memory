Phase 4.3 修复：

问题确认：你已经到第 4/4 步，说明通知权限、Service Worker、PushSubscription 都成功了。报错发生在“把订阅保存到 CloudBase”这一环。上一版误把第 4 步的 scope 报错当成 Service Worker 异常，所以每次都会注销 Service Worker，造成无限重来。

本版改动：
1. 第 4 步不再清理 Service Worker。
2. 不再使用 CloudBase Web SDK 的 app.callFunction() 调用 love-house-notify。
3. 改用 CloudBase 官方 HTTP API + 当前匿名登录 access_token 调用普通云函数。

操作：
只需要把 script.js 覆盖到 GitHub cloud 分支根目录，commit + push。sw.js 没有功能性变化，可不替换。
部署后重新打开 ?notify=setup，点击开启访问提醒。

如果第 4 步仍失败，页面会直接显示真正的 CloudBase HTTP/权限/函数错误，不会再循环清理。
