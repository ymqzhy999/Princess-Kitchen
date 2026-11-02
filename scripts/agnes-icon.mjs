#!/usr/bin/env node
/**
 * Agnes 生成 App 图标（1:1），并导出 Web / Android 需要的多尺寸 PNG。
 *
 * 用法：
 *   node scripts/agnes-icon.mjs            # 用内置提示词，写 public/icons/*
 *   node scripts/agnes-icon.mjs --prompt "..." --out public/icons
 *
 * Key 读取顺序同 agnes-image.mjs：AGNES_API_KEY / .agnes-key
 */
import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

dns.setDefaultResultOrder('ipv4first');

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const ENDPOINT = 'https://apihub.agnes-ai.com/v1/images/generations';
const SIZES = [1024, 512, 192, 180, 152, 120, 96, 72, 48];

const PROMPT =
  'flat vector mobile app icon, rounded square with pink gradient background from soft blush to deep rose, ' +
  'a creamy white heart in the center topped with a tiny golden crown, minimal thick clean shapes, ' +
  'soft glossy highlight, centered composition, generous padding, no text, no letters, no words, ' +
  'high contrast, crisp edges, app store icon style';

const args = process.argv.slice(2);
const option = (name) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};

function loadKey() {
  if (process.env.AGNES_API_KEY?.trim()) return process.env.AGNES_API_KEY.trim();
  for (const candidate of [path.join(rootDir, '.agnes-key'), path.join(scriptDir, '.agnes-key')]) {
    if (fs.existsSync(candidate)) return fs.readFileSync(candidate, 'utf8').trim();
  }
  console.error('缺少 API Key：设置 AGNES_API_KEY 或在仓库根目录放 .agnes-key 文件。');
  process.exit(1);
}

/** 盒式滤波缩放：PNG RGBA → 目标尺寸 PNG */
function resizePng(png, size) {
  const scale = png.width / size;
  const out = new PNG({ width: size, height: size });
  for (let y = 0; y < size; y += 1) {
    const y0 = Math.floor(y * scale);
    const y1 = Math.min(png.height, Math.max(y0 + 1, Math.floor((y + 1) * scale)));
    for (let x = 0; x < size; x += 1) {
      const x0 = Math.floor(x * scale);
      const x1 = Math.min(png.width, Math.max(x0 + 1, Math.floor((x + 1) * scale)));
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let n = 0;
      for (let sy = y0; sy < y1; sy += 1) {
        for (let sx = x0; sx < x1; sx += 1) {
          const i = (sy * png.width + sx) * 4;
          r += png.data[i];
          g += png.data[i + 1];
          b += png.data[i + 2];
          a += png.data[i + 3];
          n += 1;
        }
      }
      const o = (y * size + x) * 4;
      out.data[o] = Math.round(r / n);
      out.data[o + 1] = Math.round(g / n);
      out.data[o + 2] = Math.round(b / n);
      out.data[o + 3] = Math.round(a / n);
    }
  }
  return PNG.sync.write(out);
}

async function main() {
  const key = loadKey();
  const outDir = path.resolve(rootDir, option('out') ?? 'public/icons');
  const prompt = `${option('prompt') ?? PROMPT}`;
  fs.mkdirSync(outDir, { recursive: true });

  console.log('Agnes agnes-image-2.1-flash · 1K 1:1 · 生成图标…');
  const startedAt = Date.now();
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'agnes-image-2.1-flash',
      prompt,
      size: '1K',
      ratio: '1:1',
      extra_body: { response_format: 'url' },
    }),
    signal: AbortSignal.timeout(300_000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  const url = JSON.parse(text).data?.[0]?.url;
  if (!url) throw new Error(`响应没有 url：${text.slice(0, 200)}`);

  const imgRes = await fetch(url, { signal: AbortSignal.timeout(300_000) });
  if (!imgRes.ok) throw new Error(`下载失败 HTTP ${imgRes.status}`);
  const bytes = Buffer.from(await imgRes.arrayBuffer());

  const png = bytes[0] === 0x89 ? PNG.sync.read(bytes) : null;
  if (!png) throw new Error('返回的不是 PNG，无法导出多尺寸');
  console.log(`拿到 ${png.width}×${png.height} PNG，用时 ${((Date.now() - startedAt) / 1000).toFixed(1)}s`);

  fs.writeFileSync(path.join(outDir, 'icon-source.png'), bytes);
  for (const size of SIZES) {
    const buf = size === png.width ? PNG.sync.write(png) : resizePng(png, size);
    fs.writeFileSync(path.join(outDir, `icon-${size}.png`), buf);
    console.log(`  icon-${size}.png  ${Math.round(buf.length / 1024)}KB`);
  }
  console.log(`\n完成，输出目录：${path.relative(rootDir, outDir)}`);
}

await main();
