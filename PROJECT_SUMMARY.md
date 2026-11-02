# 项目总结 · Princess Kitchen

> 公主的私房小厨房，送给戴诗佳女士。  
> 当前版本：**1.5.2**（React + TypeScript + Vite + Tailwind + React Router + Lucide）

## 1. 项目定位

移动端优先的两人食谱 + 点菜 + 美食日记网页应用。视觉是粉色公主风、奶油甜品风，所有按钮和流程都可以真实点按使用。

当前状态：

- **54 道菜谱**：20 道原创 + 34 道 HowToCook 导入
- **13 个分类**：家常菜、川菜、粤菜、湘菜、火锅、烧烤、早餐、主食、甜品、饮品、西餐、日料、其他
- **54 张菜品图**：全部由 Agnes AI 生成（非实拍，见 `CREDITS.md`）；卡片用 480px 缩略图（`images/recipes/thumbs/`），详情页用原图
- **0 道缺图**：54 道全部有图，卡片不再出现「实拍图待补充」
- **0 张 SVG 菜品图**
- **21 个自动化测试全部通过**
- **补图工装**：`scripts/agnes-image.mjs` + `scripts/agnes-prompts.json`（Agnes 生图、PNG→JPEG、写回 coverImage）
- **Android App**：Capacitor 壳 + `android/` 工程 + CI 自动出 debug APK（Release `android-v1.4.0`）
- **应用图标**：Agnes 生成（`public/icons/`，含 48–1024 多尺寸），同时用于 PWA 与 Android
- **GitHub Pages Actions 自动部署已配置**（见 `DEPLOY_PAGES.md`）
- 没有后端、登录、真实支付；数据只在本机

## 2. 页面与功能

| 路由 | 页面 | 核心功能 |
| --- | --- | --- |
| `/` | 首页 | 问候、今日吃什么入口、今日推荐、今日热门、分类、快捷入口、菜单摘要 |
| `/recipes` | 菜谱大全 | 54 道、分类筛选、搜索、收藏、加入菜单、相册换图 |
| `/recipe/:id` | 菜谱详情 | 大图、食材、步骤、小贴士、来源、收藏、加入菜单、步骤打勾、相册换图/恢复默认 |
| `/favorites` | 我的收藏 | 全部 / 想吃的 / 已经做过 |
| `/order` | 今日菜单 | 份数、勾选、全选、备注、参考成本、确认、清空 |
| `/diary` | 美食日记 | 日期、菜名、照片、文字、评分、增删改 |
| `/wheel` | 今天吃什么 | 真随机转盘、分类、排除做过的菜、结果加入菜单/查看详情 |
| `/settings` | 我的厨房 | 昵称、头像、主题、本地统计、清除数据、版权与来源 |
| `/credits.html` | 图片来源 | 逐张署名与许可 |

底部导航固定为：**首页 / 菜谱 / 今日菜单 / 收藏 / 我的**。

## 3. 目录结构

```text
princess-kitchen/
├── public/
│   ├── favicon.svg
│   ├── credits.html                 # 应用内图片来源页
│   └── images/recipes/              # 54 张 JPG，全部 AI 生成
├── src/
│   ├── config/app.ts                # 名称、版本、参考项目
│   ├── types/                       # Recipe / App 数据类型
│   ├── data/
│   │   ├── categories.ts            # 13 个分类
│   │   └── recipes/                 # 原创 + 导入菜谱数据
│   ├── lib/
│   │   ├── storage.ts               # localStorage 封装
│   │   ├── recipeImageDb.ts         # IndexedDB 菜品图（含旧数据迁移）
│   │   ├── image.ts                 # 相册图片压缩
│   │   ├── random.ts                # crypto.getRandomValues
│   │   └── format.ts / cn.ts
│   ├── hooks/usePersistentState.ts
│   ├── store/
│   │   ├── AppStore.tsx             # 全局状态与业务动作
│   │   └── validation.ts            # 本地数据形状校验
│   ├── components/
│   │   ├── recipe/                  # 卡片、收藏、图片、相册上传
│   │   ├── wheel/WheelCanvas.tsx    # Canvas 转盘
│   │   ├── layout/                  # 页面壳、底部导航
│   │   ├── diary/DiaryForm.tsx
│   │   └── ui/                      # Button / Toast / Sheet / Badge 等
│   ├── pages/                       # 9 个页面（含 404）
│   └── test/                        # Vitest + Testing Library
├── README.md                        # 运行与完整说明
├── CREDITS.md                       # 图片许可
├── IMAGE_TODO.md                    # 21 张生成图的待替换清单
├── scripts/
│   ├── agnes-image.mjs              # Agnes 生图 → JPEG → 写回 coverImage
│   ├── agnes-prompts.json           # 21 道菜的生成提示词与参数
│   └── prepare-pages.mjs            # Pages 发布整理
├── PROJECT_SUMMARY.md               # 本文件
├── GITHUB_UPLOAD.md                 # 上传 GitHub / 电脑开发步骤
├── DEPLOY_PAGES.md                  # GitHub Pages 部署步骤
├── .github/workflows/deploy.yml      # Pages 自动发布
├── package.json
├── pnpm-lock.yaml
└── vite.config.ts
```

## 4. 数据流

1. **静态菜谱**：`src/data/recipes/*.ts` 导出 `Recipe[]`，`index.ts` 统一汇总、搜索、分类、热门、每日推荐。
2. **类型**：`src/types/recipe.ts` 定义 `Recipe / Ingredient / CookingStep`。
3. **全局状态**：`AppStore.tsx` 用 React Context 暴露收藏、菜单、日记、设置、自定义图、转盘等动作。
4. **本地持久化**：
   - 小型结构化数据 → localStorage（`pk.v1.settings / favorites / order / diary / recipeImages`）。
   - 菜品自定义图 → IndexedDB（数据库 `princess-kitchen`，store `recipeImages`）。
   - 启动时会把旧版 `pk.v1.recipeImages` 自动迁移到 IndexedDB，避免 localStorage 2MB 限制导致不能上传。
5. **图片显示**：`RecipeImage` 优先读取 `recipeImages[recipe.id]`，否则使用 `recipe.coverImage`。
6. **上传流程**：`RecipeImageUpload` → 系统相册 → `compressImageFile`（最长边 1000px / JPEG 0.76）→ 写入 IndexedDB → 更新 Context → 所有页面即时更新。

## 5. 大转盘

- Canvas 绘制最多 10 个扇形菜名，CSS `transform` 缓动旋转约 4.2 秒。
- 中奖索引用 `crypto.getRandomValues` + 拒绝采样，不使用 `Math.random` 作为唯一随机源。
- 候选只包含有图菜品（含用户上传图）。
- 分类筛选；可排除已标记做过 / 日记最近 3、7、14 天做过的菜。
- 结果可加入今日菜单、查看详情、再转一次。

## 6. 命令

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm typecheck
pnpm test         # 21 个测试
pnpm build        # dist/
pnpm preview
```

## 7. 已知限制

- 无后端 / 账号 / 双人同步；换设备数据不跟随。
- 自定义菜品图只在本机 IndexedDB，不上传服务器。
- 没有 APK / Capacitor 原生工程 / 微信小程序。
- 54 张菜品图都是 Agnes AI 生成的示意图（不是实拍），想换成真实成菜照片见 `IMAGE_TODO.md`。
- 部分图片来自 HowToCook / Wikimedia / 用户提供文档，许可见 `CREDITS.md`。

## 8. 版权

戴诗佳女士所有，由 ymq 独立开发，版权所有 ©

All rights reserved by Ms. Dai Shijia. Independently developed by ymq. ©
