self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { title: "PrestaCerto" };

  const options = {
    body: data.body || "Nova notificação",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    tag: data.tag || "prestacerto-notification",
    requireInteraction: data.requireInteraction || false,
    data: {
      url: data.url || "/dashboard",
    },
  };

  event.waitUntil(self.registration.showNotification(data.title || "PrestaCerto", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus().then(() => clientList[0].navigate(event.notification.data.url));
        }
        return clients.openWindow(event.notification.data.url);
      })
  );
});
