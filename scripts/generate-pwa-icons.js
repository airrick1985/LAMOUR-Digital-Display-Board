#!/usr/bin/env node

/**
 * PWA 圖示生成腳本
 *
 * 用途：
 * - 由單一來源圖檔生成 PWA 安裝所需的全套圖示
 * - 產出 any 與 maskable 兩種用途的 192 / 512 PNG
 * - 產出 iOS 用的 apple-touch-icon（不透明背景）
 * - 產出多尺寸 favicon.ico（16/32/48/64/128/256）
 *
 * 用法：
 *   node scripts/generate-pwa-icons.js                       // 使用預設來源
 *   node scripts/generate-pwa-icons.js path/to/my-icon.png   // 指定來源
 *
 * 來源建議：512×512 以上的正方形 PNG（去背或不去背皆可）。
 * 也支援 .ico / .webp / .jpg，其中 .ico 會先在 Windows 上轉成 PNG 再處理。
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'assets', 'icons');

// 預設來源（依序尋找第一個存在的檔案）
const DEFAULT_SOURCES = [
  'assets/icons/source.png',
  'assets/icons/source.ico',
  'assets/icons/source.webp'
];

// maskable 圖示的背景色，與 manifest 的 theme_color 一致
const BG = '#4A5759';
// maskable 安全區：內容只佔畫布 78%，四周留白供系統裁切成圓形／圓角
const MASKABLE_RATIO = 0.78;
// apple-touch-icon 內容佔比
const APPLE_RATIO = 0.86;

const ICO_SIZES = [16, 32, 48, 64, 128, 256];

function resolveSource() {
  const arg = process.argv[2];
  if (arg) {
    const p = path.isAbsolute(arg) ? arg : path.join(ROOT, arg);
    if (!fs.existsSync(p)) {
      throw new Error(`找不到來源圖檔：${p}`);
    }
    return p;
  }
  for (const rel of DEFAULT_SOURCES) {
    const p = path.join(ROOT, rel);
    if (fs.existsSync(p)) return p;
  }
  throw new Error(
    `找不到來源圖檔。請將圖示放到 ${DEFAULT_SOURCES[0]}，` +
    `或執行：node scripts/generate-pwa-icons.js <你的圖檔路徑>`
  );
}

/** sharp 不支援讀取 .ico，先用 Windows 的 System.Drawing 轉成 PNG */
function icoToPng(icoPath) {
  const tmp = path.join(os.tmpdir(), `pwa-icon-src-${process.pid}.png`);
  const ps = [
    'Add-Type -AssemblyName System.Drawing;',
    `$i = New-Object System.Drawing.Icon('${icoPath}', 256, 256);`,
    `$i.ToBitmap().Save('${tmp}', [System.Drawing.Imaging.ImageFormat]::Png)`
  ].join(' ');
  execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', ps]);
  return tmp;
}

/** 將 PNG buffer 陣列封裝成 ICO 檔（Vista 以後支援 PNG-in-ICO） */
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);            // reserved
  header.writeUInt16LE(1, 2);            // type: icon
  header.writeUInt16LE(pngs.length, 4);  // image count

  const dir = Buffer.alloc(pngs.length * 16);
  let offset = header.length + dir.length;

  pngs.forEach(({ size, data }, i) => {
    const o = i * 16;
    dir[o] = size >= 256 ? 0 : size;     // width（256 以 0 表示）
    dir[o + 1] = size >= 256 ? 0 : size; // height
    dir[o + 2] = 0;                      // palette
    dir[o + 3] = 0;                      // reserved
    dir.writeUInt16LE(1, o + 4);         // color planes
    dir.writeUInt16LE(32, o + 6);        // bits per pixel
    dir.writeUInt32LE(data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });

  return Buffer.concat([header, dir, ...pngs.map(p => p.data)]);
}

/** 產生方形圖示：先把來源等比縮到內容區，再置中貼到畫布上 */
async function square(srcBuffer, size, { ratio = 1, background = null } = {}) {
  const inner = Math.round(size * ratio);
  const content = await sharp(srcBuffer)
    .resize(inner, inner, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background || { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: content, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function main() {
  let srcPath = resolveSource();
  let cleanup = null;

  if (path.extname(srcPath).toLowerCase() === '.ico') {
    if (process.platform !== 'win32') {
      throw new Error('.ico 來源目前只支援在 Windows 上轉換，請改提供 PNG 來源');
    }
    const converted = icoToPng(srcPath);
    console.log(`  .ico 來源已轉為 PNG：${converted}`);
    cleanup = converted;
    srcPath = converted;
  }

  const srcBuffer = fs.readFileSync(srcPath);
  const meta = await sharp(srcBuffer).metadata();
  console.log(`來源：${path.relative(ROOT, path.resolve(srcPath))} (${meta.width}×${meta.height})`);
  if (Math.min(meta.width, meta.height) < 512) {
    console.warn('  ⚠ 來源短邊小於 512px，放大到 512 圖示可能模糊，建議換更高解析度的原始檔');
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const write = (name, buf) => {
    fs.writeFileSync(path.join(OUT_DIR, name), buf);
    console.log(`  ✓ assets/icons/${name} (${(buf.length / 1024).toFixed(1)} KB)`);
  };

  // purpose: any —— 保留透明背景
  write('icon-192.png', await square(srcBuffer, 192));
  write('icon-512.png', await square(srcBuffer, 512));

  // purpose: maskable —— 填滿品牌色並預留安全區
  const maskOpts = { ratio: MASKABLE_RATIO, background: BG };
  write('icon-maskable-192.png', await square(srcBuffer, 192, maskOpts));
  write('icon-maskable-512.png', await square(srcBuffer, 512, maskOpts));

  // iOS 主畫面圖示（不支援透明，必須填底色）
  write('apple-touch-icon.png', await square(srcBuffer, 180, { ratio: APPLE_RATIO, background: BG }));

  // 多尺寸 favicon.ico
  const icoPngs = [];
  for (const size of ICO_SIZES) {
    icoPngs.push({ size, data: await square(srcBuffer, size) });
  }
  const ico = buildIco(icoPngs);
  fs.writeFileSync(path.join(ROOT, 'favicon.ico'), ico);
  console.log(`  ✓ favicon.ico (${ICO_SIZES.join('/')}, ${(ico.length / 1024).toFixed(1)} KB)`);

  if (cleanup) fs.unlinkSync(cleanup);
  console.log('\n完成。接著執行 npm run generate-manifest 更新資源清單與快取版本。');
}

main().catch(err => {
  console.error(`\n生成失敗：${err.message}`);
  process.exit(1);
});
