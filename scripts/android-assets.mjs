#!/usr/bin/env node
/**
 * 把 Agnes 生成的应用图标铺进 Android 资源（mipmap + 启动图），
 * 这样 `npx cap sync android` 之后 Gradle 打出来的 APK 就有自定义图标。
 *
 * 用法：node scripts/android-assets.mjs
 * 依赖：public/icons/icon-1024.png（由 scripts/agnes-icon.mjs 生成）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'res');
const source = path.join(rootDir, 'public', 'icons', 'icon-1024.png');

if (!fs.existsSync(source)) {
  console.error('缺少 public/icons/icon-1024.png，先跑 node scripts/agnes-icon.mjs');
  process.exit(1);
}

const icon = PNG.sync.read(fs.readFileSync(source));

/** 高质量盒式缩放 */
function resize(png, w, h = w) {
  const out = new PNG({ width: w, height: h });
  const sx = png.width / w;
  const sy = png.height / h;
  for (let y = 0; y < h; y += 1) {
    const y0 = Math.floor(y * sy);
    const y1 = Math.max(y0 + 1, Math.min(png.height, Math.floor((y + 1) * sy)));
    for (let x = 0; x < w; x += 1) {
      const x0 = Math.floor(x * sx);
      const x1 = Math.max(x0 + 1, Math.min(png.width, Math.floor((x + 1) * sx)));
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let n = 0;
      for (let yy = y0; yy < y1; yy += 1) {
        for (let xx = x0; xx < x1; xx += 1) {
          const i = (yy * png.width + xx) * 4;
          r += png.data[i];
          g += png.data[i + 1];
          b += png.data[i + 2];
          a += png.data[i + 3];
          n += 1;
        }
      }
      const o = (y * w + x) * 4;
      out.data[o] = Math.round(r / n);
      out.data[o + 1] = Math.round(g / n);
      out.data[o + 2] = Math.round(b / n);
      out.data[o + 3] = Math.round(a / n);
    }
  }
  return out;
}

/** 把 icon 按比例贴到一张纯色画布中央 */
function composeOnCanvas(canvasW, canvasH, iconScale, bg = [255, 247, 249]) {
  const out = new PNG({ width: canvasW, height: canvasH });
  for (let i = 0; i < out.data.length; i += 4) {
    out.data[i] = bg[0];
    out.data[i + 1] = bg[1];
    out.data[i + 2] = bg[2];
    out.data[i + 3] = 255;
  }
  const target = Math.round(Math.min(canvasW, canvasH) * iconScale);
  const scaled = resize(icon, target, target);
  const ox = Math.round((canvasW - target) / 2);
  const oy = Math.round((canvasH - target) / 2);
  for (let y = 0; y < target; y += 1) {
    for (let x = 0; x < target; x += 1) {
      const si = (y * target + x) * 4;
      const di = ((oy + y) * canvasW + ox + x) * 4;
      const a = scaled.data[si + 3] / 255;
      out.data[di] = Math.round(scaled.data[si] * a + out.data[di] * (1 - a));
      out.data[di + 1] = Math.round(scaled.data[si + 1] * a + out.data[di + 1] * (1 - a));
      out.data[di + 2] = Math.round(scaled.data[si + 2] * a + out.data[di + 2] * (1 - a));
      out.data[di + 3] = 255;
    }
  }
  return out;
}

const DENSITIES = [
  ['mdpi', 48, 108],
  ['hdpi', 72, 162],
  ['xhdpi', 96, 216],
  ['xxhdpi', 144, 324],
  ['xxxhdpi', 192, 432],
];

for (const [density, legacy, adaptive] of DENSITIES) {
  const dir = path.join(resDir, `mipmap-${density}`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'ic_launcher.png'), PNG.sync.write(resize(icon, legacy, legacy)));
  fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), PNG.sync.write(resize(icon, legacy, legacy)));
  // adaptive icon 的 foreground：整块铺满 108dp 画布，内容天然落在安全区内
  fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), PNG.sync.write(resize(icon, adaptive, adaptive)));
  console.log(`mipmap-${density}: ic_launcher ${legacy}px · foreground ${adaptive}px`);
}

// 自适应图标背景色：取图标左上角附近的粉色，避免边缘出现白边
const sampleAt = (x, y) => {
  const i = (y * icon.width + x) * 4;
  return [icon.data[i], icon.data[i + 1], icon.data[i + 2]];
};
const [br, bg, bb] = sampleAt(Math.round(icon.width * 0.06), Math.round(icon.height * 0.5));
const hex = `#${[br, bg, bb].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
const colorFile = path.join(resDir, 'values', 'ic_launcher_background.xml');
fs.writeFileSync(
  colorFile,
  `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${hex.toUpperCase()}</color>
</resources>
`,
);
console.log(`adaptive 背景色 ${hex.toUpperCase()}`);

// 启动图：沿用原文件名与分辨率，只换画面
const drawables = fs.readdirSync(resDir).filter((name) => name.startsWith('drawable'));
for (const name of drawables) {
  const file = path.join(resDir, name, 'splash.png');
  if (!fs.existsSync(file)) continue;
  const original = PNG.sync.read(fs.readFileSync(file));
  const composed = composeOnCanvas(original.width, original.height, name.includes('land') ? 0.28 : 0.34);
  fs.writeFileSync(file, PNG.sync.write(composed));
  console.log(`splash ${name}: ${original.width}×${original.height}`);
}

console.log('\nAndroid 图标与启动图已更新，接着跑：pnpm build && npx cap sync android');
