// Phase 4.2: 让新部署的 Service Worker 尽快进入 activated 状态。
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {
    data = { body: event.data ? event.data.text() : '' };
  }

  // Safari / iOS 18.4+ 支持 Declarative Web Push。
  // 新格式到达较新的 WebKit 时，系统本身就有能力显示兜底通知；
  // 在其他浏览器或旧版 WebKit 中，仍由这里的 Service Worker 正常显示。
  const declarative = data && data.web_push === 8030 && data.notification
    ? data.notification
    : null;

  const title = declarative?.title || data.title || '鱼鱼和獭獭的小屋 ♡';
  const options = {
    body: declarative?.body || data.body || '小屋有新的动静啦。',
    icon: declarative?.icon || data.icon || './pwa-icon-192.png',
    badge: declarative?.badge || data.badge || './pwa-icon-192.png',
    tag: declarative?.tag || data.tag || 'love-house-visit',
    renotify: true,
    data: {
      url: declarative?.navigate || data.url || './'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || './', self.location.origin).href;

  event.waitUntil((async () => {
    const clientsList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientsList) {
      if ('focus' in client) {
        try {
          await client.navigate(targetUrl);
        } catch (_) {}
        return client.focus();
      }
    }
    if (clients.openWindow) return clients.openWindow(targetUrl);
  })());
});
