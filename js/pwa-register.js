/* PWA Service Worker 已停用。
   本檔只做兩件事：
   1. 隱藏初次載入的 loading 畫面（SPA 切頁的 loading 由 spa-router.js 自行控制）
   2. 清除舊版安裝殘留的 Service Worker、Cache Storage 與資源清單，
      讓所有裝置回到「純網路 + 瀏覽器 HTTP 快取」的相同行為。 */

(function () {
  const overlay = document.getElementById('pwa-loading-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    setTimeout(() => overlay.remove(), 500);
  }

  try { localStorage.removeItem('asset-manifest'); } catch (e) { /* ignore */ }

  if (window.caches && typeof caches.keys === 'function') {
    caches.keys()
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(results => {
        if (results.some(Boolean)) console.log('[PWA] 已清除舊版 Cache Storage');
      })
      .catch(() => { /* ignore */ });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then(regs => Promise.all(regs.map(reg => reg.unregister())))
      .then(results => {
        if (results.some(Boolean)) console.log('[PWA] 已移除舊版 Service Worker');
      })
      .catch(() => { /* ignore */ });
  }
})();
