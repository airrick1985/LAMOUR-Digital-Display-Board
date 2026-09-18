# 部署指南

**更新時間**: 2026-09-18

## 概述

本站是純靜態網站，推送到 GitHub `main` 分支後由 GitHub Actions（`.github/workflows/deploy.yml`）自動部署到 GitHub Pages。**沒有 build 步驟**，改什麼就推什麼。

```
修改檔案（HTML / CSS / JS / 圖片）
    ↓
git add . → git commit → git push origin main
    ↓
GitHub Actions 自動部署（約 1–2 分鐘）
    ↓
使用者下次開啟 / 重新整理即看到新版
```

網站網址：https://airrick1985.github.io/LAMOUR-Digital-Display-Board/
部署狀態：https://github.com/airrick1985/LAMOUR-Digital-Display-Board/actions

---

## 發布步驟

```bash
git add .
git commit -m "發布網站更新：<說明改了什麼>"
git push origin main

# 或一行
npm run deploy
```

詳細指令與常見場景見 [發布指令.md](發布指令.md)。

---

## 使用者如何拿到更新

本站**不使用 Service Worker、離線快取或資源清單**（2026-09-18 起移除），只依靠瀏覽器一般的 HTTP 快取：

- GitHub Pages 回應 `Cache-Control: max-age=600`，所有檔案最多快取 10 分鐘。
- 使用者重新整理（或 10 分鐘後再開啟）就會拿到新版；已安裝的 PWA 也一樣。
- 所有裝置行為一致，沒有「舊安裝 vs 新安裝」的差別。

### 舊安裝的殘留清理

2026-09-18 之前安裝的 PWA 會有舊的 Service Worker 與 Cache Storage。現在的 `sw.js` 是自毀版，`js/pwa-register.js` 是清理腳本：舊裝置下次開啟網站時會自動移除 Service Worker、清空快取與 `localStorage` 的舊清單，不需要逐台處理。

若要確認：DevTools → Application → Service Workers 與 Cache Storage 都應為空。

---

## 相關檔案

| 檔案 | 用途 |
|------|------|
| `.github/workflows/deploy.yml` | 推送 `main` 後自動部署到 GitHub Pages |
| `manifest.json` | PWA 安裝資訊（名稱、圖示） |
| `sw.js` | 自毀版 Service Worker，只用來清除舊安裝殘留 |
| `js/pwa-register.js` | 隱藏初次載入畫面；清除舊 SW / 快取 / 清單 |
| `js/spa-router.js` | 站內切頁（SPA），切頁時顯示載入畫面 |

---

## 故障排查

### 推送後網站沒變

1. 到 Actions 頁面確認 "Deploy to GitHub Pages" 是綠色 ✅。
2. 等 1–2 分鐘部署完成，再等最多 10 分鐘讓 HTTP 快取過期，或直接強制重新整理（Ctrl+F5 / Cmd+Shift+R）。
3. 仍看不到：DevTools → Application → Service Workers 確認為空；若有殘留，點 Unregister 後重新整理。

### 某頁載入很慢

- 先看 DevTools → Network，找出最大的幾個請求；本站圖片以 `.webp` 為主，單張超過 1MB 就值得再壓縮。
- 平面規劃頁的環景圖（`assets/images/layout/2-4F.webp` 等，7–17MB）只在點擊樓層時載入；1F 熱點燈箱的 3D 圖只在開啟燈箱時載入。

### 資源 404

- 確認檔案已 `git add` 並推送（`git status` 應為乾淨）。
- 路徑大小寫要與檔名完全一致（GitHub Pages 區分大小寫）。
