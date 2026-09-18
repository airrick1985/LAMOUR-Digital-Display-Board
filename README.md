# 富宇樂慕 LAMOUR

> 建案電子銷售表板 — 預見未來，選定這隅綻放

## 簡介

專為銷售人員設計的建案數位展示工具，以 50 吋以上大電視（4K、16:9）為主要展示載體，透過高質感視覺設計與流暢動畫，輔助銷售人員向客戶介紹「富宇樂慕」建案。可安裝為 PWA，也可打包成 Windows 桌面應用（Electron）。

## 網址

| 平台 | 網址 | 用途 |
|------|------|------|
| Cloudflare Pages | https://lamour-digital-display-board.pages.dev/ | 現場正式使用（PWA 用此網址安裝） |
| GitHub Pages | https://airrick1985.github.io/LAMOUR-Digital-Display-Board/ | 備援 |

## 技術

- 純 HTML5 + CSS3 + Vanilla JavaScript，無建置步驟
- 站內切頁採 SPA（`js/spa-router.js`），全站共用頂部 Dock 式導覽列（`js/topbar.js`）
- Pannellum 360° 環景（本機版 `assets/pannellum/`）
- Google Maps（基地位置頁）
- Canvas 粒子特效（螢火蟲、飛鳥、游標花瓣）
- 平面圖列印：固定 A3 實體尺寸畫布
- 不使用 Service Worker / 離線快取；更新依 HTTP 快取（Cloudflare 上 HTML/JS/CSS 每次確認、圖片快取 1 天）

## 頁面

| 導覽列 | 頁面 | 檔案 |
|--------|------|------|
| 首頁 | Hero | `index.html` |
| 品牌介紹 | 富宇機構 | `brand-fuyu.html` |
| 品牌介紹 | 建築團隊 | `brand-team.html` |
| 基本資料 | 基本資料 | `basic-info.html` |
| 地段環境 | 全景 | `panorama.html` |
| 地段環境 | 360°環景 | `location.html` |
| 地段環境 | Google 地圖 | `google-map.html` |
| 建築規劃 | 外觀 3D | `exterior-3d.html` |
| 建築規劃 | 公設 3D | `public-3d.html` |
| 建築規劃 | 景觀 3D | `landscape-3d.html` |
| 建築規劃 | 平面規劃 | `floor-plan.html` |
| 建材設備 | 建材設備 | `materials.html` |
| 工法介紹 | 工法介紹 | `construction.html` |
| — | 即將推出 | `coming-soon.html` |

## 發布

推送到 `main` 後，Cloudflare Pages 與 GitHub Pages 各自自動部署（約 1–2 分鐘）：

```bash
git add .
git commit -m "發布網站更新：<說明改了什麼>"
git push origin main
```

詳見 `ignore/docs/DEPLOYMENT.md`、`ignore/docs/發布指令.md`（內部文件，不發布）。

## 本機開發

```bash
npm install
npm run dev            # 本機靜態伺服器
npm run electron-dev   # Electron 開發模式
npm run electron-build-win   # 打包 Windows EXE（輸出 dist/）
```

## 資料夾結構

```
LAMOUR-Digital-Display-Board/
├── *.html                # 各頁面（見上表）
├── css/                  # variables / global / topbar / hero + 各頁專屬樣式
├── js/
│   ├── topbar.js         # 全站導覽列、BGM、全螢幕、閒置回首頁
│   ├── spa-router.js     # 站內切頁
│   ├── pwa-register.js   # 隱藏載入畫面；清除舊安裝殘留的 SW / 快取
│   ├── basic-info-data.js# 基本資料共用資料檔
│   ├── fireflies.js / birds.js / cursor-petals.js / animations.js / hero-video.js
├── assets/
│   ├── images/           # 3D 示意圖、地段、layout/（平面圖與樓層環景）、geology/、equipment/、construction method/
│   ├── icons/            # PWA 圖示
│   ├── pannellum/        # 360° 環景函式庫
│   ├── sound/            # BGM
│   └── video/            # 首頁背景影片
├── electron/             # Windows 桌面版（main.js / preload.js）
├── scripts/              # 打包與圖示產生工具
├── ignore/               # 內部文件（已 gitignore，不發布）
├── manifest.json         # PWA 安裝資訊
├── sw.js                 # 自毀版 Service Worker（僅清除舊安裝）
├── _headers / _redirects # Cloudflare Pages 快取與路由規則
└── .github/workflows/    # GitHub Pages 部署
```

## 授權

Private — 富宇建設 ／ designed by ANXI
