self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Mengarahkan lalu lintas jaringan langsung ke server Vercel/Firebase
  e.respondWith(fetch(e.request));
});