# 列印版面固定尺寸修改指南（交接文件）

> 來源專案：fuyu-academic-forest（富宇學森），commit `9f86662`，版本 1.0.112
> 適用對象：使用相同「平面圖列印（含面積圖卡/基本資料卡）」架構的建案展示專案

## 一、要解決的問題

列印平面圖時，**基本資料卡**與**各戶面積圖卡**在不同電腦上印出來大小、位置不一致。
原因：每台電腦的瀏覽器會記住各自的列印對話框設定（紙張 A4/A3、邊界、縮放比例、頁首頁尾），
而列印頁版面使用「視窗相對單位」排版，列印時會依這些設定**重新排版**，圖卡因此跑版。

## 二、根本原因（程式面）

列印頁 HTML 產生器（通常叫 `buildPrintPageHtml`，位於平面圖頁的內嵌 script）的 CSS 有：

```css
@page { size: A3 landscape; margin: 5mm 8mm; }   /* 邊界受使用者對話框「邊界」選項影響 */
body { height: 100vh; display: flex; ... }        /* 100vh = 紙張高度－邊界，隨設定變動 */
.print-image-wrap img { max-width: 100%; ... }    /* 100% 隨紙張寬度變動 */
```

`100vh` / `max-width:100%` 在列印時是相對「紙張大小－邊界」計算的，
所以紙張、邊界、縮放任何一項不同，整個版面就重排。

## 三、修改方法：改成「固定實體尺寸紙張畫布」

核心觀念：整個版面鎖進一張固定 **420mm × 297mm**（A3 橫式）的 `.print-sheet` 裡，
完全不用視窗相對單位。這樣使用者不管怎麼調縮放/邊界/紙張，都只會**整張等比縮放**，
圖卡相對圖面的位置與比例永遠不變。

### 修改 1：列印頁 CSS（在 buildPrintPageHtml 的 `<style>` 內）

**修改前：**
```css
@page { size: A3 landscape; margin: 5mm 8mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 100%; background: #fff; }
body {
    font-family: 'Noto Sans TC', 'Microsoft JhengHei', sans-serif;
    color: #3d3628; height: 100vh; display: flex; flex-direction: column;
    overflow: hidden; -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
```

**修改後：**
```css
@page { size: A3 landscape; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { background: #fff; overflow: hidden; }
body {
    font-family: 'Noto Sans TC', 'Microsoft JhengHei', sans-serif;
    color: #3d3628;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
/* 固定實體尺寸紙張畫布（A3 橫式 420×297mm）：版面不隨各電腦的紙張/邊界/縮放設定重排，
   列印縮放只會等比縮放整張紙，圖卡相對位置與尺寸恆定 */
.print-sheet {
    width: 420mm; height: 297mm; padding: 5mm 8mm;
    display: flex; flex-direction: column;
    overflow: hidden; background: #fff;
}
```

重點：
- `@page margin` 改為 **0**，原本的頁面邊界（5mm 8mm）改成 `.print-sheet` 的 **padding**。
  這讓使用者對話框的「邊界」選項失效，瀏覽器頁首頁尾（網址/日期）也印不出來。
- body 上原本的 `height:100vh; display:flex; flex-direction:column` 移到 `.print-sheet`。
- 其餘卡片樣式（`.pu-card`、`.pi-card` 用 `cqw` + `%` 定位）**不用動**——
  它們相對圖面容器定位，本來就會跟著圖面等比縮放。

### 修改 2：列印頁 body 結構（同一產生器的 HTML 部分）

把 `<body>` 裡的全部內容（header、main/stage、footer）包進一層：

```html
<body>
<div class="print-sheet">
    <header class="print-header">...</header>
    <main class="print-stage">...</main>
    <footer class="print-disclaimer">...</footer>
</div>
...（autoPrint 分支的 style/script）...
</body>
```

### 修改 3：自動列印視窗的螢幕預覽（autoPrint 分支，可選但建議）

固定 420mm 寬的畫布在 1200px 的彈出視窗裡會超出，加上「螢幕限定」的等比縮放置中，
只影響螢幕觀感、不影響列印：

```html
<style>
    /* 螢幕上將整張 A3 畫布等比縮放置中顯示（僅影響螢幕預覽，不影響列印） */
    @media screen {
        body {
            background: #4b4b4b; min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
        }
        .print-sheet {
            transform: scale(var(--fit-scale, 1));
            transform-origin: center center;
            box-shadow: 0 8px 40px rgba(0,0,0,0.45);
        }
    }
    @media print {
        .print-sheet { transform: none !important; }
    }
</style>
<script>
    const img = document.querySelector('img');
    const sheet = document.querySelector('.print-sheet');
    function fitScreen() {
        const s = Math.min(window.innerWidth / sheet.offsetWidth, window.innerHeight / sheet.offsetHeight, 1);
        sheet.style.setProperty('--fit-scale', s.toFixed(4));
    }
    fitScreen();
    window.addEventListener('resize', fitScreen);
    function fireAutoPrint() { setTimeout(() => { window.print(); window.close(); }, 300); }
    if (img.complete) { fireAutoPrint(); } else { img.onload = fireAutoPrint; }
</script>
```

（原本的 autoPrint script 只有最後兩行 fireAutoPrint 邏輯，保留即可。）

注意：若產生器是巢狀 template literal，`</script>` 要寫成 `<\/script>`。

## 四、不需要動的部分

- 圖卡座標資料（如 `printLayout4_14F`）與 `cqw`/`%` 定位系統：原樣保留。
- Debug「A3 排版檢視器」：iframe 尺寸 1587×1123px 恰等於 420×297mm @96dpi，
  固定畫布在螢幕上渲染尺寸相同，所見即所得拖曳排版完全不受影響。
- 若紙張規格不同（例如 A4 橫式），畫布尺寸改 `297mm × 210mm`，
  檢視器基準改 1123×794px，其餘邏輯相同。

## 五、驗證方式

1. 開平面圖燈箱 → 列印 → 包含面積，進入列印預覽。
2. 在預覽中切換「縮放」（100% ↔ 80%）與「紙張」（A3 ↔ A4）：
   整張版面應**等比縮放**，圖卡相對圖面**不位移、不變形**。
3. 確認只有一頁（不會多出空白第二頁）。
4. Debug 排版檢視器開啟後拖曳卡片、匯出座標功能正常。
5. 若專案有內嵌 JS 語法檢查習慣，跑一次確認巢狀 template literal 無誤。

## 六、參考 diff

完整改動可在來源專案執行 `git show 9f86662 -- floor-plan.html` 查看。
