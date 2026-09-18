/* 自毀版 Service Worker：本站已停用離線快取（改由瀏覽器 HTTP 快取處理）。
   舊版安裝在更新到此檔後會清除所有 Cache Storage 並移除自身註冊；
   頁面端 js/pwa-register.js 也會同步做同樣的清理（雙保險）。 */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));
    await self.registration.unregister();
    console.log('[SW] 已清除所有快取並移除 Service Worker');
  })());
});
