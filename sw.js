
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

messaging.onBackgroundMessage((payload) => {
  const title =
    payload.data?.title ||
    payload.notification?.title ||
    "KDP DOKU SIGN";

  const options = {
    body:
      payload.data?.body ||
      payload.notification?.body ||
      "Ada pemberitahuan dokumen baru.",
    icon: "/logo.png",
    data: {
      url: payload.data?.url || "/"
    }
  };

  return self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || "/",
    self.location.origin
  ).href;

  event.waitUntil(
    self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      return self.clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
