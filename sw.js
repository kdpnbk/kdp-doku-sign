importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAi5YLZSr-M0yVyfuxgjsgscuTJcQYLFwE",
  authDomain: "kdp-doku-sign.firebaseapp.com",
  projectId: "kdp-doku-sign",
  storageBucket: "kdp-doku-sign.firebasestorage.app",
  messagingSenderId: "397180096578",
  appId: "1:397180096578:web:31823d4f2ce01ed73bdddb"
});

const messaging = firebase.messaging();

// Worker mengirim data-only payload agar notifikasi hanya dibuat satu kali di sini.
messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const title = data.title || payload.notification?.title || "KDP DOKU SIGN";
  const options = {
    body: data.body || payload.notification?.body || "Ada pemberitahuan dokumen baru.",
    icon: "/logo.png",
    badge: "/logo.png",
    data: { url: data.url || "/" },
    tag: data.docId ? `kdp-doc-${data.docId}` : `kdp-${Date.now()}`,
    renotify: false
  };
  return self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
    for (const client of clients) {
      if ("focus" in client) {
        if ("navigate" in client) client.navigate(targetUrl);
        return client.focus();
      }
    }
    return self.clients.openWindow(targetUrl);
  }));
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
// Tidak memasang handler fetch: request aplikasi diteruskan oleh browser secara normal.
