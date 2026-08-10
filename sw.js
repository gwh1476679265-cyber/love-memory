self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {
    data = { body: event.data ? event.data.text() : '' };
  }

  const title = data.title || '鱼鱼和獭獭的小屋 ♡';
  const options = {
    body: data.body || '小屋有新的动静啦。',
    icon: data.icon || './pwa-icon-192.png',
    badge: data.badge || './pwa-icon-192.png',
    tag: data.tag || 'love-house-visit',
    renotify: true,
    data: {
      url: data.url || './'
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
