# Princess Kitchen · 公主的私房小厨房

> 专属于两个人的美食菜谱与点菜小屋。  
> 移动端优先，粉粉的奶油甜品风，所有功能都可以真实点按使用。  
> 当前版本 **1.4.1** · [项目总结](PROJECT_SUMMARY.md) · [上传 GitHub / 电脑开发](GITHUB_UPLOAD.md) · [Pages 部署](DEPLOY_PAGES.md)

这是当前网页版的完整实现：React + TypeScript + Vite + Tailwind CSS + React Router + Lucide Icons。结构化数据保存在浏览器 `localStorage`，用户上传的菜品图保存在 IndexedDB。没有后端、没有登录、没有真实支付，也不包含 Android 原生工程或 APK 配置。

当前菜谱库共 **54 道菜**：20 道第一阶段原创菜谱 + 34 道从 HowToCook 导入的菜谱，覆盖 **13 个分类**。

---

## 1. 现在能做什么

| 页面 | 已实现 |
| --- | --- |
| 首页 `/` | 品牌欢迎区、按时段问候、今日吃什么入口、今日推荐、今日热门、分类入口、收藏 / 菜单 / 日记快捷入口、今日菜单摘要 |
| 菜谱大全 `/recipes` | 54 道菜谱、13 个分类筛选、关键词搜索（菜名 / 食材 / 口味 / 描述）、收藏、快速加入菜单 |
| 菜谱详情 `/recipe/:id` | 大图、介绍、食材用量、分步骤做法、小贴士、收藏、加入菜单、步骤打勾进度、来源链接 |
| 我的收藏 `/favorites` | 全部收藏 / 想吃的菜 / 已经做过、标记做过、取消收藏、加入菜单 |
| 今日菜单 `/order` | 添加、删除、修改份数、勾选菜品、全选、备注、自动计算参考成本、确认菜单、清空菜单 |
| 美食日记 `/diary` | 日期、菜名、照片、文字、1–5 星评分、新增 / 编辑 / 删除 |
| 今天吃什么 `/wheel` | 真随机转盘、分类筛选、排除做过的菜、结果加入今日菜单 / 查看详情 |
| 我的厨房 `/settings` | 昵称、预设头像 / 上传头像、三套主题、本地数据统计、清除数据、版本与来源信息 |
| 菜品图片 | 每张菜图右下角可从手机相册上传替换；详情页可恢复默认图；图片压缩后只保存在本机 |
| 其他 | 404 页面、空状态、图片加载失败兜底、Toast、二次确认弹窗、底部安全区适配、图片来源页 |

底部固定导航为：**首页 / 菜谱 / 今日菜单 / 收藏 / 我的**。

---

## 2. 技术栈

- React 18.3 + TypeScript 5.6
- Vite 5.4
- Tailwind CSS 3.4（主题色使用 CSS 变量，支持草莓粉 / 奶油白 / 薰衣草）
- React Router 6（`HashRouter`，静态托管和未来 WebView 都不需要服务器重写规则）
- Lucide React 图标
- Vitest 2 + Testing Library（21 个交互 / 数据测试）

没有引入状态管理库、UI 组件库、动画库或数据库 SDK；业务状态集中在 `src/store`，界面与数据分离。

---

## 3. 快速开始

环境要求：**Node.js >= 18**（开发时使用 Node 26 验证），包管理器推荐 pnpm 10。

```bash
cd princess-kitchen
pnpm install
pnpm dev
```

打开：

- 本机：<http://localhost:5173/>
- 手机与电脑在同一 Wi-Fi：使用 `pnpm dev` 启动时 Vite 打印的 **Network** 地址，例如 `http://192.168.1.23:5173/`

`dev` 脚本已经带上 `--host 0.0.0.0`，所以局域网内可以访问。

其他命令：

```bash
pnpm typecheck       # TypeScript 类型检查
pnpm test            # 运行 21 个自动化测试
pnpm build           # 类型检查 + 生产构建，输出到 dist/
pnpm preview         # 预览生产构建，默认 http://localhost:4173/
pnpm images:gen      # 用 Agnes 生成缺图（提示词见 scripts/agnes-prompts.json）
pnpm images:apply    # 把已生成并落盘的图片路径写回菜谱数据
```

如果电脑上使用 npm 也可以：`npm install` / `npm run dev` / `npm test`。

> 注意：`localhost:5173` 和 `localhost:4173` 属于不同的浏览器源，`localStorage` 数据不互通。正式使用时固定一个地址即可。

### 当前运行状态（本次交付时）

- 开发服务器已启动并监听 `0.0.0.0:5173`，首页、模块和图片请求均返回 HTTP 200。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test`：3 个测试文件、21 个测试全部通过。
- 受当前设备环境限制（屏幕助手未开启、内置浏览器禁止访问本机回环地址），**没有生成真机截图**；核心交互通过 Testing Library 的 DOM 级测试验证，构建产物可直接用浏览器打开。

---

## 4. 文件结构

```text
princess-kitchen/
├── .github/workflows/deploy.yml       # GitHub Pages 自动发布
├── public/
│   ├── favicon.svg
│   ├── credits.html               # 图片来源与许可（应用内可打开）
│   ├── images/recipes/            # 54 张 JPG，全部 Agnes AI 生成（无 SVG）
│   ├── icons/                     # 应用图标多尺寸 PNG（Agnes 生成）+ manifest.webmanifest
│   └── favicon.svg                # 粉色渐变心形图标
├── src/
│   ├── App.tsx                    # 路由表
│   ├── main.tsx                   # 入口：HashRouter + Provider
│   ├── index.css                  # Tailwind、主题变量、全局样式
│   ├── config/app.ts              # 版本、品牌、参考项目信息
│   ├── types/
│   │   ├── recipe.ts              # Recipe / Ingredient / CookingStep
│   │   ├── app.ts                 # 收藏 / 菜单 / 日记 / 设置 / 主题
│   │   └── index.ts
│   ├── data/
│   │   ├── categories.ts          # 13 个分类与配色
│   │   └── recipes/
│   │       ├── sichuan.ts         # 原创：川菜 3 道
│   │       ├── cantonese.ts       # 原创：粤菜 3 道
│   │       ├── hunan-home.ts      # 原创：湘菜 2 + 家常菜 3
│   │       ├── comfort.ts         # 原创：火锅 / 烧烤 / 早餐 / 主食 4 道
│   │       ├── sweet.ts           # 原创：甜品 / 饮品 / 西餐 / 日料 5 道
│   │       ├── imported-home.ts   # 导入：家常 / 湘菜 / 其他 10 道
│   │       ├── imported-sichuan.ts # 导入：川菜 7 道
│   │       ├── imported-cantonese-bbq.ts # 导入：粤菜 / 烧烤 7 道
│   │       ├── imported-breakfast.ts     # 导入：早餐 / 主食 / 甜品 / 饮品 / 西餐 10 道
│   │       └── index.ts           # 汇总与查询工具
│   ├── lib/
│   │   ├── storage.ts             # localStorage 封装（唯一存储入口）
│   │   ├── format.ts              # 日期、价格、问候、ID
│   │   ├── image.ts               # 图片压缩（FileReader + canvas）
│   │   ├── random.ts              # crypto.getRandomValues 随机数 / 洗牌
│   │   └── cn.ts                  # className 合并
│   ├── hooks/
│   │   └── usePersistentState.ts  # 可持久化状态
│   ├── store/
│   │   ├── AppStore.tsx           # 全局状态与所有业务动作
│   │   └── validation.ts          # 读取本地数据时的形状校验
│   ├── components/
│   │   ├── layout/                # RootLayout / AppLayout / BottomNav
│   │   ├── recipe/                # RecipeCard / RecipeImage / 相册上传 / 搜索 / 分类 / 收藏
│   │   ├── diary/DiaryForm.tsx
│   │   ├── wheel/WheelCanvas.tsx  # Canvas 转盘绘制 + CSS 旋转动画
│   │   ├── decorations/           # 蝴蝶结、珍珠、氛围背景
│   │   └── ui/                    # Button / Sheet / Toast / Checkbox 等
│   ├── pages/                     # 9 个页面（含 404）
│   └── test/                      # 测试入口与用例
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig*.json
├── package.json
├── pnpm-lock.yaml
├── CREDITS.md                     # 图片与许可的 Markdown 版本
├── IMAGE_TODO.md                  # 21 张生成图的待替换清单与图片要求
├── PROJECT_SUMMARY.md             # 目录、数据流、功能总览
├── GITHUB_UPLOAD.md               # GitHub 上传与电脑开发步骤
├── DEPLOY_PAGES.md                # Pages 自动部署步骤
├── scripts/
│   ├── prepare-pages.mjs          # 生成 .nojekyll 与 404 重定向
│   ├── agnes-image.mjs            # Agnes 生图 → PNG 转 JPEG → 写回 coverImage
│   ├── agnes-icon.mjs             # Agnes 生成应用图标 → 多尺寸 PNG
│   └── agnes-prompts.json         # 21 道菜的生成提示词与参数
└── README.md
```

### 路由

| 路径 | 页面 |
| --- | --- |
| `/` | 首页 |
| `/recipes` | 菜谱大全（支持 `?category=川菜`） |
| `/recipe/:recipeId` | 菜谱详情 |
| `/favorites` | 收藏 |
| `/order` | 今日菜单 |
| `/diary` | 美食日记（从首页 / 设置进入，不在底部导航） |
| `/wheel` | 今天吃什么转盘 |
| `/settings` | 我的厨房 |
| `*` | 404 |

使用 Hash 路由，实际地址形如 `http://localhost:5173/#/recipes`；静态服务器不需要配置 fallback。

---

## 5. 菜谱数据系统

### 5.1 统一数据结构

```ts
interface Recipe {
  id: string;              // dish_001
  name: string;            // 宫保鸡丁
  category: RecipeCategory;// 13 个分类之一
  coverImage: string;      // ./images/recipes/dish_001.jpg（相对路径）
  description: string;
  ingredients: Array<{ name: string; amount: string; optional?: boolean }>;
  steps: Array<{ title: string; description: string; tip?: string }>;
  difficulty: '简单' | '中等' | '较难';
  cookingTime: number;     // 分钟
  servings: string;        // 2 人份
  price: number;           // 参考食材成本（仅用于菜单估算）
  source: string;          // 真实来源说明
  sourceUrl?: string;      // 导入菜谱的原始链接
  tips?: string[];         // 菜谱级小贴士
  tags: string[];
  popularity: number;      // 0-100，驱动今日热门
  featured?: boolean;      // 进入今日推荐池
}
```

在需求给出的基础字段上增加了 `servings`、`price`、`popularity`、`featured`、`optional`、`tip`、`sourceUrl`、`tips`，分别用于份量展示、菜单总价、热门排序、每日推荐、做菜提示、来源追溯和菜谱级小贴士。价格不代表真实付款。

### 5.2 54 道菜的构成

- **第一阶段原创 20 道**：宫保鸡丁、麻婆豆腐、水煮牛肉、白切鸡、清蒸鲈鱼、蜜汁叉烧、剁椒鱼头、农家小炒肉、番茄炒蛋、红烧肉、蒜蓉西兰花、番茄牛腩火锅、蒜香烤鸡翅、皮蛋瘦肉粥、葱油拌面、提拉米苏、杨枝甘露、奶油蘑菇意面、日式照烧鸡腿饭、日式玉子烧。
- **第二阶段导入 34 道**：来自你提供的《精选菜谱合集 v2 · 39 道含图》，根据 HowToCook 原始 Markdown 重新解析、清理后导入：地三鲜、简易红烧肉、可乐鸡翅、手撕包菜、酸辣土豆丝、土豆炖排骨、回锅肉、口水鸡、麻辣香锅、水煮肉片、水煮鱼、鱼香茄子、鱼香肉丝、白灼虾、豉汁排骨、广式萝卜牛腩、梅菜扣肉、辣椒炒肉、农家一碗香、小炒黄牛肉、奥尔良风味烤鸡腿、烤鸡翅、烤茄子、茶叶蛋、煎饺、美式炒蛋、牛奶燕麦、手抓饼、蒸水蛋、炒方便面、烤蛋挞、柠檬水、牛排、家常日本豆腐。
- 合集中另外 5 道（宫保鸡丁、麻婆豆腐、清蒸鲈鱼、蒜蓉西兰花、西红柿炒鸡蛋）与第一阶段已有菜谱重复，**保留现有版本，不重复录入**；其中“西红柿炒鸡蛋”由已有的“番茄炒蛋”覆盖。

分类分布：家常菜 9、川菜 10、粤菜 7、湘菜 5、火锅 1、烧烤 4、早餐 7、主食 2、甜品 2、饮品 2、西餐 2、日料 2、其他 1。

### 5.3 导入数据的处理

DOCX 由自动导出生成，存在 **ID 重复、烹饪时间错误、图片错配** 等问题。本次没有直接照搬，而是：

1. 按菜品名找到 HowToCook 的原始 Markdown，重新解析 `必备原料和工具 / 计算 / 操作 / 附加内容`。
2. 合并 `计算` 与 `必备` 两处食材，去除工具、说明性文字和重复项；对少量配方按原始用量手工校对，个别大份菜按两人份做了取整或缩放。
3. 把长流程整理成适合手机阅读的 3–12 个步骤；保留关键火候、时间与安全提示。
4. 逐张核对图片，替换了“汉堡配茶叶蛋”“拉面配水煮肉片”等明显错配的图片；其余使用 HowToCook 仓库原图、DOCX 图片或 Wikimedia Commons 上许可明确的照片。
5. 所有导入菜谱在详情页显示来源与原始链接，图片许可见 [credits.html](public/credits.html) / [CREDITS.md](CREDITS.md)；生成图与待替换清单见 [IMAGE_TODO.md](IMAGE_TODO.md)。

### 5.4 关于 HowToCook 的调研结论

参考项目：<https://github.com/Anduin2017/HowToCook>

实际检查到的情况：

- 仓库按 `dishes/<分类目录>/<菜名>/<菜名>.md` 组织，分类目录包括 `vegetable_dish`、`meat_dish`、`aquatic`、`soup`、`staple`、`breakfast`、`dessert`、`drink`、`condiment`、`semi-finished`、`template` 等。
- 单篇菜谱使用 Markdown，典型结构为：标题、成品图、简介、预估烹饪难度与卡路里、`## 必备原料和工具`、`## 计算`（按人数给出用量）、`## 操作`（有序步骤，可再分小节）、`## 附加内容`。
- 仓库根目录 `LICENSE` 为 **Unlicense**（public domain）。检查时 README 没有另外声明针对菜谱内容的独立许可。
- 第二阶段导入的 34 道菜谱 **保留了 HowToCook 的来源与 Unlicense 说明**；20 道原创菜谱的 `source` 标注为「原创编写，未复制第三方菜谱」。没有伪造作者或链接。
- 图片许可与作者在 `public/credits.html` 中逐张列出；应用「我的厨房 → 关于」里也可以打开。

### 5.5 新增菜谱

1. 在 `src/data/recipes/` 对应文件中追加一个 `Recipe` 对象，`id` 保持唯一（如 `dish_055`）。
2. 把图片放入 `public/images/recipes/`，`coverImage` 使用相对路径 `./images/recipes/dish_055.jpg`。
3. 保存后 Vite 会热更新；运行 `pnpm test` 会检查字段完整性和数量（当前断言为 54 道，新增后记得同步调整测试数量）。
4. 新增分类时同时修改 `src/types/recipe.ts` 的 `RECIPE_CATEGORIES`、`src/data/categories.ts`，以及 `src/data/recipes/index.ts` 里 `countByCategory` 的初始对象。
5. 若内容来自其他开源项目，请补充 `sourceUrl` 并在 `CREDITS.md` / `credits.html` 中写明许可。

### 5.6 替换 / 生成菜品图片

`public/images/recipes/` 现在有 **54 张 JPG，全部由 Agnes AI 生成**（提示词见 `scripts/agnes-prompts.json`）。它们是示意图、不是实拍，来源说明见 [CREDITS.md](CREDITS.md) / [IMAGE_TODO.md](IMAGE_TODO.md)。**菜品图不使用 SVG**。

- 换某道菜的图：新增 `.jpg` / `.webp` 后修改对应 `coverImage`，路径始终使用相对路径；
- 换成实拍照片：准备一张真实成菜图，**直接覆盖同名 `dish_XXX.jpg`** 即可，`coverImage` 不用改；
- 重新生成某道菜（Agnes）：

```bash
# Key 放环境变量，或写入仓库根目录 .agnes-key（已 gitignore）
export AGNES_API_KEY=sk-xxx
node scripts/agnes-image.mjs --only=dish_004 --force   # 只重生成白切鸡
node scripts/agnes-image.mjs --apply                   # 生成缺图并写回 coverImage
node scripts/agnes-image.mjs --dry-run                 # 只看待生成清单，不联网
```

- 脚本做的事：调 `POST https://apihub.agnes-ai.com/v1/images/generations`（`agnes-image-2.1-flash`，1K / 4:3）→ 下载结果 → PNG 自动转 JPEG（q85）→ 写入 `public/images/recipes/<id>.jpg`；`--apply` 时把 `coverImage` 从空串改成 `./images/recipes/<id>.jpg`，只动空串，不会覆盖已有手填路径。
- 提示词在 `scripts/agnes-prompts.json`，改完重跑即可；生成记录写在 `scripts/.agnes-report.json`（已 gitignore）。
- 组件 `ImageWithFallback` 会在图片为空 / 404 / 解码失败时显示简洁占位，不会出现破图图标，也不使用 SVG 菜品图。

### 5.7 用户相册换图

- 菜谱卡片右下角和详情页都有「从相册上传」按钮，点击后调用系统图片选择器，不需要服务器；
- 选图后用 canvas 压缩到最长边 1000px、JPEG 质量 0.76，再写入本机 **IndexedDB**（`princess-kitchen` / `recipeImages`），每道菜各存一张；旧版的 `pk.v1.recipeImages` 会在启动时自动迁移，不会丢图；
- 上传后所有页面（首页、菜谱、收藏、菜单、转盘）会自动显示自定义图；
- 详情页可点「恢复默认图」删除自定义图；
- 自定义图片**只存在当前设备**，不会上传到任何服务器，也不会同步到另一台手机；清理浏览器数据或“清除本地数据”会一并删除。

---

## 6. 本地数据

结构化小数据走 `src/lib/storage.ts` 的 localStorage；用户上传的菜品图走 `src/lib/recipeImageDb.ts` 的 IndexedDB（容量更大），key 带命名空间和版本：

| key | 内容 |
| --- | --- |
| `pk.v1.settings` | 昵称、头像（emoji 或压缩后的 data URL）、主题 |
| `pk.v1.favorites` | 收藏记录：`recipeId`、想吃的、是否做过、收藏时间 |
| `pk.v1.order` | 菜单项、份数、是否勾选、备注、确认时间 |
| `pk.v1.diary` | 日记：日期、菜名、关联菜谱、照片、文字、评分、时间戳 |
| `princess-kitchen` / `recipeImages` | IndexedDB：用户从相册上传的菜品图（每道菜一张） |

第二阶段新增菜谱使用 `dish_021`–`dish_054`，原有 20 道菜的 ID 完全保留，因此**升级不会丢失已有的收藏、菜单和日记**。原有菜谱换图也不影响收藏关系。

特点：

- 读取时会经过 `src/store/validation.ts` 校验，手工改坏 JSON 也不会让应用白屏。
- 写入失败（隐私模式 / 超出配额）会捕获并打印警告，界面仍可在内存中继续使用。
- 日记照片与头像通过 canvas 压缩后存为 data URL；日记最长边 900px、质量 0.78，头像最长边 480px，尽量控制 localStorage 占用。
- 设置页可以查看各类数据数量和本地占用，并一键清除（只清除本应用的 5 个 localStorage key + IndexedDB 图片库，不影响其他站点）。
- 结构化数据在 localStorage、图片在 IndexedDB；换设备、换域名、换端口都不会自动同步。

---

## 7. 关键交互约定

- **收藏**：点爱心即收藏；收藏记录额外有「想吃的菜 / 已经做过」状态。标记做过不会取消收藏。
- **今日菜单**：只有勾选的菜品计入总价和确认内容；修改任意菜品、份数、勾选或备注都会清除旧的“已确认”时间，避免显示过期状态。
- **确认菜单**：仅生成确认状态与时间，不涉及支付，不会清空菜单。
- **详情步骤**：点步骤可打勾，顶部显示 `已完成/总数`，刷新页面后重置（有意不持久化，避免下次做菜时残留）。
- **主题**：主题存在 `src/index.css` 的 CSS 变量里，写到 `<html data-theme>`；切换即时生效并持久化。
- **图片**：菜品卡片、详情、日记照片都有加载失败兜底；卡片和详情页可从相册换图，图片只存本机；详情页提供来源与许可入口。
- **今天吃什么**：从有实拍图的菜中随机抽 10 道上盘，分类可筛选，可排除日记最近 3/7/14 天内 / 已标记做过的菜；中奖索引使用 `crypto.getRandomValues`，禁止可预测顺序。
- **空状态**：搜索无结果、收藏为空、菜单为空、日记为空、转盘无可用菜都有对应引导。

---

## 8. 测试与验证

```bash
pnpm test
```

覆盖内容：

1. 菜谱数据为 54 道、id 唯一、13 个分类均有菜、食材 / 步骤 / 来源 / 图片字段完整、34 道导入菜谱带来源链接；
2. 分类筛选、搜索、收藏、加入菜单；
3. 详情页步骤打勾、收藏、加入菜单并跳转菜单页；
4. 收藏页的「想吃的菜 / 已经做过」筛选与标记；
5. 菜单总价、全选、备注、确认、清空；
6. 日记新增、评分、自动关联菜谱、编辑、删除；
7. 设置昵称、预设头像、主题切换、清除本地数据；
8. 首页读取本地昵称并渲染；
9. 转盘页真随机抽取、分类/排除筛选、旋转结束后展示结果并加入菜单。

生产构建会先跑 `tsc -b`，因此类型错误会直接阻断构建。

---

## 9. 后续如何在电脑上继续开发

1. 把整个 `princess-kitchen/` 文件夹复制到电脑（建议排除 `node_modules/` 和 `dist/`，或提交到 Git 后 clone）。
2. 安装 Node.js 18+ 和 pnpm：`npm i -g pnpm`。
3. 执行 `pnpm install`、`pnpm dev`，浏览器打开 <http://localhost:5173/>。
4. 推荐安装 VS Code 的 Tailwind CSS IntelliSense 插件；项目本身没有额外 IDE 配置依赖。
5. 修改代码会自动热更新；提交前建议运行 `pnpm typecheck && pnpm test && pnpm build`。

常见改动位置：

| 想改什么 | 去哪里 |
| --- | --- |
| 品牌名、版本、标语 | `src/config/app.ts`、`index.html` |
| 菜品 / 食材 / 步骤 | `src/data/recipes/*.ts` |
| 分类与分类颜色 | `src/data/categories.ts`、`src/types/recipe.ts` |
| 主题色 | `src/index.css` 的 `--pk-*` 变量、`tailwind.config.js` |
| 页面布局 | `src/pages/*.tsx`、`src/components/*` |
| 业务动作（收藏 / 菜单 / 日记） | `src/store/AppStore.tsx` |
| 本地存储实现 | `src/lib/storage.ts`、`src/hooks/usePersistentState.ts` |

### 未来接 Supabase / 云端同步

建议保持现有 UI 与 store API 不变，只替换数据层：

1. 新增 `src/services/`，封装 auth、recipes、favorites、orders、diary 的网络请求；
2. 把 `usePersistentState` 换成“远端读取 + 本地缓存 + 乐观更新”的 hook；
3. 保留 `AppStore` 暴露的动作名（`toggleFavorite`、`addOrderItem`、`confirmOrder` 等），页面无需大改；
4. 设计表时让菜谱内容只读、用户数据按 `coupleId` 隔离，并为日记照片使用对象存储而不是数据库长文本；
5. 两个人同步时注意冲突处理（例如菜单以最新修改为准，或按条目合并）；
6. 云端未接入前，localStorage 仍是唯一数据源，请不要在 UI 上暗示已经同步。

### 未来用 Capacitor 打包（本阶段未做）

当前代码已经为打包留好空间：

- `vite.config.ts` 使用 `base: './'`，所有资源相对路径；
- HashRouter 不需要原生端配置 URL 重写；
- 布局使用 `env(safe-area-inset-*)`，为刘海屏 / 状态栏留白；
- 核心业务逻辑不依赖浏览器专有 API；图片处理集中在 `src/lib/image.ts`，可替换为 Capacitor Camera；
- 存储集中在 `src/lib/storage.ts`，可迁移到 Capacitor Preferences / SQLite。

未来步骤示意（现在**没有**执行，也不包含 Android 工程）：

```bash
pnpm add @capacitor/core @capacitor/cli
pnpm add @capacitor/android
npx cap init "Princess Kitchen" com.princesskitchen.app --web-dir=dist
pnpm build
npx cap add android
npx cap sync android
npx cap open android
```

打包时建议额外验证：Android 状态栏颜色、软键盘顶起输入框、返回键与 Hash 路由、WebView 的 localStorage 持久性、相册权限。若需要可靠保存，优先把数据迁移到 Preferences 或 SQLite，并尽早做云端同步。

---

## 9.5 Android App（Capacitor）

项目里已经带了一个 Capacitor 壳，可以把网页直接打成 APK：

- 配置：`capacitor.config.ts`（appId `com.ymq.princesskitchen`，应用名「公主厨房」，`webDir: dist`）
- 图标：`scripts/agnes-icon.mjs` 用 Agnes 生成 1024 图标并导出多尺寸；`scripts/android-assets.mjs` 把它铺进 `android/.../res`（含自适应图标与启动图）
- 出包：`.github/workflows/android.yml`，push 到 main 或手动触发 → `assembleDebug` → 产物同时作为 Actions artifact 和 Release 附件（tag `android-v<版本>`）

下载安装（手机浏览器）：

```
https://github.com/ymqzhy999/Princess-Kitchen/releases/latest
```

装完就是独立 App，内容是离线内置的（不联网也能用菜谱）；网页版更新后需要重新出包。想在本机出包需要 JDK 21 + Android SDK：

```bash
pnpm build && npx cap sync android && cd android && ./gradlew assembleDebug
```

版本号跟随 `package.json`（`versionName` = version，`versionCode` = major*10000+minor*100+patch）。

## 10. 已知限制（当前版本）

- 没有后端、账号、双人同步，换设备数据不会跟随；
- 没有真实支付，“参考食材成本”只是按两人份估算；
- 没有 Android 原生工程、APK、微信小程序；
- 54 张菜品图都是 Agnes AI 生成的示意图（不是实拍），想换成真实成菜照片直接覆盖同名文件，见 [IMAGE_TODO.md](IMAGE_TODO.md)；
- 部分导入菜谱的原文表述较“程序员风”，已做轻量整理，但仍保留原始用量；如发现不准确，欢迎直接改 `src/data/recipes/imported-*.ts`；
- 没有接入在线字体，标题使用系统衬线字体回退，离线也能正常显示；
- 日记照片/头像仍存 localStorage；菜品图已改存 IndexedDB，容量比 localStorage 大，但仍只在本机；大量高清照片请等云端版本；
- 用户从相册上传的菜品图只保存在当前设备，换设备/清缓存会丢失，也不会同步；
- 没有做 PWA 安装 / Service Worker；
- 未做多标签页之间的实时同步（同一浏览器两个标签页各自读取初始快照）。

---

## 11. 来源与致谢

- 20 道原创菜谱：Princess Kitchen 原创编写。
- 34 道导入菜谱：来自 [HowToCook · 程序员做饭指南](https://github.com/Anduin2017/HowToCook)（Unlicense），按原文重新解析与排版，详情页保留来源链接。
- 图片：54 张全部由 Agnes AI 生成（2026-11，`agnes-image-2.1-flash`，提示词见 `scripts/agnes-prompts.json`），说明见 [CREDITS.md](CREDITS.md) 与 [credits.html](public/credits.html)；v1.2.0 及更早使用的 HowToCook / Wikimedia / 文档图已全部替换，署名记录留在 git 历史；SVG 菜品图已移除。
- 图标：[Lucide](https://lucide.dev/)（ISC License）。
- 字体：系统字体，不额外加载网络字体。

## 12. 版权与署名

戴诗佳女士所有，由 ymq 独立开发，版权所有 ©

All rights reserved by Ms. Dai Shijia. Independently developed by ymq. ©

---

愿你们每一顿饭，都吃得开心。🎀
