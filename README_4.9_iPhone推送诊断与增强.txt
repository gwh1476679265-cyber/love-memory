Phase 4.9 — iPhone 推送可靠性增强

这版解决两个问题：
1. 之前“测试提醒已发送”只代表云函数请求成功，没有检查真正的 Web Push 投递结果。
2. iOS 18.4+ 增加 Declarative Web Push。新版服务端统一发送兼容的标准 JSON；新版 WebKit 可直接兜底显示，旧浏览器继续由 sw.js 显示。

需要更新：
A. GitHub cloud 分支根目录：
   - script.js
   - sw.js
B. CloudBase 云函数 love-house-notify：
   - 上传 love-house-notify-function-phase4.9.zip 覆盖代码
   - 原来的 VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY / VAPID_SUBJECT 环境变量保持不变

测试：
1. 等 GitHub -> CloudBase 自动部署成功。
2. iPhone 从主屏幕“小屋”打开通知设置。
3. 点测试后，状态会明确显示“云端已接受 N 条推送”或具体失败状态码。
4. 点测试后回到桌面或锁屏，再下拉通知中心查看。
5. 如果显示“云端已接受 1 条”仍完全没有通知：
   iPhone 设置 -> 通知 -> 找到小屋 -> 确认允许通知、锁定屏幕、通知中心、横幅都开启，并检查是否开启定时摘要/专注模式。
