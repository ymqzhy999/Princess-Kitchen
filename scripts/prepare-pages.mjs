/**
 * GitHub Pages is a plain static host. Vite already emits relative asset paths
 * (`base: './'`) and the app uses HashRouter. The 404 file is a tiny redirect
 * rather than a copy of index.html, because a copied page would resolve
 * relative assets against the unknown path.
 */
import { writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');

await access(join(dist, 'index.html'));

const notFound = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Princess Kitchen</title>
  <script>location.replace('./');</script>
</head>
<body style="font-family:-apple-system,'PingFang SC',sans-serif;padding:32px;color:#5a3b45;background:#fff7fa">
  <p>正在回到 Princess Kitchen…</p>
</body>
</html>
`;
await writeFile(join(dist, '404.html'), notFound);
await writeFile(join(dist, '.nojekyll'), '');

console.log('[pages] prepared dist/404.html redirect and dist/.nojekyll');
