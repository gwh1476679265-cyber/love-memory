恋爱小屋三文件修正版（毛毡板自动伸展）

本版基于用户最新提供的 index.html、script.js、style.css。

修改内容：
- 毛毡板容器高度改为根据便利贴实际行数自然增长。
- 移除毛毡板固定 max-height，取消容器内部滚动。
- 保留现有三列排布、便利贴样式、云端同步和上传逻辑。
- index.html 中更新 CSS/JS 资源版本参数，避免浏览器继续使用旧缓存。
- 不改卧室、厨房功能；本次只处理毛毡板尺寸行为。

部署：覆盖网站目录中的 index.html、script.js、style.css。script.js 内容保持原样。
