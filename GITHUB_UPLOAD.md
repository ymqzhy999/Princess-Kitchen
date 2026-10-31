# 上传 GitHub · 到电脑继续开发

> 项目已经整理成可直接提交的源码结构。`node_modules/`、`dist/`、`.env` 等不会进入 Git。

## 1. 电脑环境

建议：

- Node.js **20 LTS**（18+ 也可运行）
- pnpm 10（项目使用 `pnpm-lock.yaml`）

```bash
node -v
corepack enable
corepack prepare pnpm@10.18.3 --activate
pnpm -v
```

## 2. 拿到源码

把整个 `princess-kitchen/` 文件夹拷到电脑，或从 GitHub clone：

```bash
git clone <你的仓库地址>
cd princess-kitchen
pnpm install --frozen-lockfile
pnpm dev
```

打开终端显示的地址（通常是 `http://localhost:5173/`）。

## 3. 本机验证

```bash
pnpm typecheck
pnpm test        # 21 个测试
pnpm build       # 产物在 dist/
pnpm preview
```

## 4. 传到 GitHub

在 GitHub 新建一个**空仓库**（不要勾选自动生成 README / .gitignore）。

如果项目目录里已经有 `.git`（本次已经初始化并做了首个提交）：

```bash
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git branch -M main
git push -u origin main
```

如果拷贝到电脑后没有 `.git`：

```bash
git init -b main
git add .
git commit -m "feat: Princess Kitchen v1.2.0"
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

### 不要提交的内容

`.gitignore` 已处理：

- `node_modules/`
- `dist/`
- `.env` / `.env.*`
- `*.tsbuildinfo`
- `.DS_Store`、编辑器配置
- 测试覆盖率

保留：

- `src/`
- `public/`（33 张菜品图，约 5.4MB）
- `pnpm-lock.yaml`
- `README.md` / `CREDITS.md` / `IMAGE_TODO.md` / `PROJECT_SUMMARY.md`

## 5. 部署到网页

### Vercel / Netlify

- 安装命令：`pnpm install --frozen-lockfile`
- 构建命令：`pnpm build`
- 输出目录：`dist`
- Node 版本：20

### GitHub Pages

项目使用 `HashRouter` + Vite `base: './'`，部署到子路径也能正常打开。把 `dist/` 发布到 `gh-pages` 分支即可，或使用 GitHub Actions。

## 6. 上传图片为什么之前会“本机满了”

旧版把用户上传的菜品图放在 `localStorage`，并有一个 2MB 的保守上限，所以传几张就会提示满。

现在已改为：

- 菜品图存 **IndexedDB**（容量大得多）；
- 旧的 `pk.v1.recipeImages` 会在启动时自动迁移到 IndexedDB；
- 不再有“本机图片空间快满了”的 2MB 限制；
- 图片仍然只在本机，不上传服务器。

升级后第一次打开请**刷新一次**，让旧图迁移完成。如果仍不能上传：

1. 确认不是无痕/隐私模式；
2. 确认浏览器允许 IndexedDB；
3. 在「我的厨房」清除本地数据后重试（会删除自定义图）；
4. 仍然异常时看浏览器控制台是否有 `IndexedDB` 报错。

## 7. 版本与数据

- 当前版本：`1.2.0`
- 54 道菜、13 个分类、33 张实拍图、21 道待补图
- 自定义图片：IndexedDB
- 收藏 / 菜单 / 日记 / 设置：localStorage
- 换电脑不会自动同步任何数据

## 8. 版权

戴诗佳女士所有，由 ymq 独立开发，版权所有 ©

All rights reserved by Ms. Dai Shijia. Independently developed by ymq. ©
