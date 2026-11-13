// ===== ชุดที่ 8: ไฟล์ sw.js — เมื่อแก้ไฟล์ของหน้าแอป ให้เปลี่ยน v2 เป็น v3, v4 ... ทุกครั้ง =====
const CACHE = 'lv-shell-v2';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './qr.html',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  // แคชทีละไฟล์ ถ้าไฟล์ใดหาไม่พบ จะไม่ทำให้การติดตั้งทั้งหมดล้มเหลว
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ASSETS.map(a => c.add(a).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // ไม่ยุ่งกับข้อมูลที่ส่งไป Google
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});