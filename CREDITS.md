# 菜谱与图片来源

本应用共 54 道菜谱：20 道 Princess Kitchen 原创，34 道来自 [HowToCook](https://github.com/Anduin2017/HowToCook)（Unlicense）。

## 菜品图片

**54 张菜品图全部由 Agnes AI 生成**（模型 `agnes-image-2.1-flash`，1K / 4:3，2026-11；提示词见 [`scripts/agnes-prompts.json`](scripts/agnes-prompts.json)）。

- 生成图是**示意图，不是真实拍摄**，与真实成菜外观可能有差异；
- 想换成实拍照片：准备一张真实成菜图，直接覆盖 `public/images/recipes/<id>.jpg` 同名文件即可（`coverImage` 不用改），并把这张的作者写进本文件；
- 重新生成某一张：`node scripts/agnes-image.mjs --only=dish_004 --force`（详见 [README · 替换 / 生成菜品图片](README.md#56-替换--生成菜品图片)）。

### 历史来源（已被替换）

v1.2.0 及更早版本曾使用：HowToCook 仓库原图 14 张（Unlicense）、用户提供的 DOCX 文档图片 9 张、Wikimedia Commons 图片 10 张（CC0 / CC BY / CC BY-SA）。v1.4.0 起这些图片全部替换为生成图；原始文件、逐张作者与许可记录仍保留在 git 历史里（提交 `7b2737e` 及更早版本的 `CREDITS.md` / `public/credits.html`）。替换后不再展示或使用上述照片，因此不再需要逐张署名。

## 其他

- 应用图标：Agnes AI 生成（2026-11，`scripts/agnes-icon.mjs`），多尺寸 PNG 在 `public/icons/`，同时用作 PWA / Android 图标；旧的 `favicon.svg` 为粉色渐变心形，保留作为首选图标。
- 界面图标：[Lucide](https://lucide.dev/)（ISC License）
- 字体：系统字体，不加载网络字体。
- 用户从相册上传的菜品图仅保存在本机 IndexedDB，不上传到服务器，也不参与上面的来源说明。

## 版权

戴诗佳女士所有，由 ymq 独立开发，版权所有 ©

All rights reserved by Ms. Dai Shijia. Independently developed by ymq. ©
