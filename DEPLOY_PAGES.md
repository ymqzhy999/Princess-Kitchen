# GitHub Pages 部署

当前仓库已经准备好 GitHub Pages 的自动发布流程：

- `.github/workflows/deploy.yml`
- `pnpm build:pages`
- `scripts/prepare-pages.mjs`
- Vite `base: './'` + `HashRouter`，支持 `https://<用户>.github.io/<仓库名>/` 子路径
- `dist/.nojekyll`
- `dist/404.html` 回到应用首页

## 当前为什么还没公开地址

这个环境里**没有你的 GitHub 账号授权，也没有远程仓库**，所以我不能替你 push 或打开 Pages。

你需要在电脑上完成最后两步：推送代码、在 GitHub 开启 Pages。之后每次 push 到 `main` 都会自动发布。

## 1. 推送代码

在电脑上：

```bash
cd princess-kitchen
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git branch -M main
git push -u origin main
```

如果仓库里已经有 `.git`（本机当前已经初始化并提交），只需补 remote 后 push。

## 2. 开启 Pages

打开 GitHub 仓库：

```text
Settings → Pages → Build and deployment
```

把 **Source** 设为：

```text
GitHub Actions
```

不需要选 “Deploy from a branch”。

然后：

```text
Actions → Deploy to GitHub Pages → Run workflow
```

也可以再 push 一次触发。

## 3. 访问地址

项目仓库的 Pages 地址通常是：

```text
https://<你的用户名>.github.io/<仓库名>/
```

如果仓库名是 `<用户名>.github.io`，则是：

```text
https://<你的用户名>.github.io/
```

因为使用了 `HashRouter`，页面路由会是：

```text
https://<你的用户名>.github.io/<仓库名>/#/recipes
https://<你的用户名>.github.io/<仓库名>/#/wheel
```

## 4. 本地验证 Pages 产物

```bash
pnpm install --frozen-lockfile
pnpm build:pages
```

产物在 `dist/`：

```text
dist/
├── index.html
├── 404.html
├── .nojekyll
├── assets/
├── images/recipes/
└── credits.html
```

本地可以：

```bash
pnpm preview
```

## 5. 常见问题

### 页面空白 / JS 404

- 确认 Pages 的 Source 是 **GitHub Actions**，不是 branch；
- 确认 workflow 成功；
- 本项目 `base: './'` 已适配仓库子路径，不需要改 `base`；
- 不要直接双击 `dist/index.html` 用 `file://` 打开。

### Actions 没有权限发布

确认仓库：

```text
Settings → Actions → General → Workflow permissions
```

选择 **Read and write permissions**，并允许 GitHub Pages。

### 图片/自定义图

- 33 张内置图随 `dist` 一起发布；
- 用户从相册上传的图保存在各自手机的 IndexedDB，不会上传服务器，也不会跨设备同步；
- 换浏览器/清缓存会丢失自定义图。

### 自定义域名

在：

```text
Settings → Pages → Custom domain
```

填写域名，并在 DNS 添加 CNAME。Vite 的相对路径和 HashRouter 不需要改代码。

## 6. 每次更新

```bash
git add .
git commit -m "feat: ..."
git push
```

GitHub Actions 会自动：

1. 安装依赖
2. `pnpm typecheck`
3. `pnpm test`
4. `pnpm build:pages`
5. 发布到 Pages

---

戴诗佳女士所有，由 ymq 独立开发，版权所有 ©
