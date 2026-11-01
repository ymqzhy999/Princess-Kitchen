#!/usr/bin/env node
/**
 * Agnes 生图脚本 —— 给 Princess Kitchen 补菜品实拍图。
 *
 * 用法：
 *   AGNES_API_KEY=sk-xxx node scripts/agnes-image.mjs            # 只生成缺图的菜
 *   node scripts/agnes-image.mjs --only=dish_004,dish_006        # 只生成指定菜
 *   node scripts/agnes-image.mjs --only=dish_004 --force         # 覆盖重生成
 *   node scripts/agnes-image.mjs --list --dry-run                # 只看清单，不联网
 *
 * Key 读取顺序：--key= / 环境变量 AGNES_API_KEY / 仓库根目录 .agnes-key / scripts/.agnes-key
 * 输出：public/images/recipes/<id>.jpg（PNG 结果会自动转 JPEG q85）
 */
import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import jpeg from 'jpeg-js';

// 本机 IPv6 不通，Node 默认会先连 IPv6 导致 connect timeout。
dns.setDefaultResultOrder('ipv4first');

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const outDir = path.join(rootDir, 'public', 'images', 'recipes');
const manifestPath = path.join(scriptDir, 'agnes-prompts.json');
const reportPath = path.join(scriptDir, '.agnes-report.json');

const ENDPOINT = 'https://apihub.agnes-ai.com/v1/images/generations';
const TIMEOUT_MS = 300_000; // 官方建议 60s - 360s
const RETRIES = 3;

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const recipeDir = path.join(rootDir, 'src', 'data', 'recipes');
const option = (name) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const only = (option('only') ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const force = flag('force');
const dryRun = flag('dry-run');

function loadKey() {
  const fromArg = option('key');
  if (fromArg) return fromArg.trim();
  if (process.env.AGNES_API_KEY?.trim()) return process.env.AGNES_API_KEY.trim();
  for (const candidate of [path.join(rootDir, '.agnes-key'), path.join(scriptDir, '.agnes-key')]) {
    if (fs.existsSync(candidate)) return fs.readFileSync(candidate, 'utf8').trim();
  }
  console.error('缺少 API Key：设置 AGNES_API_KEY 或在仓库根目录放 .agnes-key 文件。');
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function buildPrompt(dish) {
  return `${dish.prompt}, ${manifest.style}`;
}

async function requestImage(key, dish) {
  const body = {
    model: manifest.model,
    prompt: buildPrompt(dish),
    size: manifest.size,
    ratio: manifest.ratio,
    extra_body: { response_format: 'url' },
  };

  let lastError;
  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    const startedAt = Date.now();
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);

      const json = JSON.parse(text);
      const item = json?.data?.[0];
      if (!item) throw new Error(`响应里没有 data[0]：${text.slice(0, 300)}`);

      if (item.url) {
        const imgRes = await fetch(item.url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
        if (!imgRes.ok) throw new Error(`下载图片失败：HTTP ${imgRes.status}`);
        return { bytes: Buffer.from(await imgRes.arrayBuffer()), elapsed: Date.now() - startedAt };
      }
      if (item.b64_json) {
        return { bytes: Buffer.from(item.b64_json, 'base64'), elapsed: Date.now() - startedAt };
      }
      throw new Error('响应里既没有 url 也没有 b64_json');
    } catch (error) {
      lastError = error;
      if (attempt < RETRIES) {
        const wait = attempt * 4000;
        console.warn(`  ! ${dish.name} 第 ${attempt} 次失败（${error.message}），${wait / 1000}s 后重试`);
        await sleep(wait);
      }
    }
  }
  throw lastError;
}

/** 统一转成 JPEG：PNG 走 pngjs 解码 + jpeg-js 编码，已经是 JPEG 的原样保留。 */
function toJpeg(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return { buffer: bytes, converted: false };
  if (bytes[0] === 0x89 && bytes.toString('latin1', 1, 4) === 'PNG') {
    const png = PNG.sync.read(bytes);
    let data = png.data;
    if (data.length !== png.width * png.height * 4) {
      throw new Error('PNG 解码数据长度异常');
    }
    // 透明像素铺白底，避免 JPEG 变黑
    let hasAlpha = false;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] !== 255) {
        hasAlpha = true;
        break;
      }
    }
    if (hasAlpha) {
      data = Buffer.from(data);
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3] / 255;
        data[i] = Math.round(data[i] * a + 255 * (1 - a));
        data[i + 1] = Math.round(data[i + 1] * a + 255 * (1 - a));
        data[i + 2] = Math.round(data[i + 2] * a + 255 * (1 - a));
        data[i + 3] = 255;
      }
    }
    const encoded = jpeg.encode({ data, width: png.width, height: png.height }, 85);
    return { buffer: encoded.data, converted: true };
  }
  throw new Error(`不认识的图片格式（magic ${bytes.subarray(0, 4).toString('hex')}）`);
}

/** 把已生成的图写进菜谱数据：只改 coverImage 为空的条目。 */
function applyData() {
  const dishIds = new Set(manifest.dishes.map((d) => d.id).filter((id) => fs.existsSync(path.join(outDir, `${id}.jpg`))));
  let changed = 0;
  const files = fs
    .readdirSync(recipeDir)
    .filter((file) => file.endsWith('.ts') && file !== 'index.ts');
  for (const file of files) {
    const target = path.join(recipeDir, file);
    const lines = fs.readFileSync(target, 'utf8').split('\n');
    let currentId = null;
    let dirty = false;
    lines.forEach((line, index) => {
      const idMatch = line.match(/^\s{4}id:\s*['"]([^'"]+)['"]/);
      if (idMatch) currentId = idMatch[1];
      const empty = currentId && dishIds.has(currentId) ? line.match(/^(\s{4}coverImage:\s*)(?:''|"")(,?.*)$/) : null;
      if (empty) {
        lines[index] = `${empty[1]}'./images/recipes/${currentId}.jpg'${empty[2]}`;
        dirty = true;
        changed += 1;
      }
    });
    if (dirty) fs.writeFileSync(target, lines.join('\n'));
  }
  return changed;
}

async function main() {
  const dishes = manifest.dishes.filter((d) => (only.length ? only.includes(d.id) : true));
  if (!dishes.length) {
    console.error(`没有匹配的菜谱 id：${only.join(', ')}`);
    process.exit(1);
  }

  const todo = dishes.filter((d) => {
    const target = path.join(outDir, `${d.id}.jpg`);
    if (fs.existsSync(target) && !force) {
      console.log(`- 跳过 ${d.name}（${d.id}.jpg 已存在，--force 可覆盖）`);
      return false;
    }
    return true;
  });

  console.log(
    `Agnes ${manifest.model} · ${manifest.size} ${manifest.ratio} · 待生成 ${todo.length} 张` +
      (dryRun ? '（dry-run，不联网）' : ''),
  );

  if (dryRun) {
    for (const dish of todo) console.log(`  ${dish.id} ${dish.name} → ${dish.id}.jpg`);
    return;
  }
  if (!todo.length) {
    if (flag('apply')) console.log(`菜谱数据：更新 ${applyData()} 处 coverImage`);
    return;
  }

  const key = loadKey();
  fs.mkdirSync(outDir, { recursive: true });
  const report = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : {};
  const failures = [];

  for (const [index, dish] of todo.entries()) {
    process.stdout.write(`[${index + 1}/${todo.length}] ${dish.id} ${dish.name} … `);
    try {
      const { bytes, elapsed } = await requestImage(key, dish);
      const { buffer, converted } = toJpeg(bytes);
      const target = path.join(outDir, `${dish.id}.jpg`);
      fs.writeFileSync(target, buffer);
      report[dish.id] = {
        name: dish.name,
        file: path.relative(rootDir, target),
        model: manifest.model,
        size: manifest.size,
        ratio: manifest.ratio,
        prompt: buildPrompt(dish),
        bytes: buffer.length,
        elapsedMs: elapsed,
        generatedAt: new Date().toISOString(),
      };
      console.log(
        `ok ${Math.round(buffer.length / 1024)}KB${converted ? ' (PNG→JPEG)' : ''} · ${(elapsed / 1000).toFixed(1)}s`,
      );
      await sleep(800);
    } catch (error) {
      console.log(`失败：${error.message}`);
      failures.push({ id: dish.id, name: dish.name, error: error.message });
    }
  }

  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`\n完成：成功 ${todo.length - failures.length} 张，失败 ${failures.length} 张`);
  if (flag('apply')) {
    console.log(`菜谱数据：更新 ${applyData()} 处 coverImage`);
  }
  if (failures.length) {
    for (const f of failures) console.log(`  ! ${f.id} ${f.name}：${f.error}`);
    process.exitCode = 1;
  }
}

await main();
