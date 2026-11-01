# 图片现状与替换清单（54 张）

> 2026-11 更新：**54 张菜品图全部由 Agnes AI 生成**（`agnes-image-2.1-flash`，1K / 4:3），提示词在 [`scripts/agnes-prompts.json`](scripts/agnes-prompts.json)，生成记录 `scripts/.agnes-report.json`。
> 它们是**示意图，不是真实拍摄**，与真实成菜外观可能有差异。

## 想换成实拍照片

1. 准备一张真实成菜图：菜名对应、背景干净、无人物 / 手部 / 杂物 / 文字水印，4:3 或 3:2 横图，短边 ≥ 1000px；
2. 直接覆盖 `public/images/recipes/<id>.jpg`（同名即可，`coverImage` 不用改）；
3. 在 [CREDITS.md](CREDITS.md) 里补一句照片作者。

## 优先想换回实拍的 21 道（原本就没有合格照片）

白切鸡 `dish_004`、蜜汁叉烧 `dish_006`、农家小炒肉 `dish_008`、番茄炒蛋 `dish_009`、番茄牛腩火锅 `dish_012`、皮蛋瘦肉粥 `dish_014`、葱油拌面 `dish_015`、杨枝甘露 `dish_017`、奶油蘑菇意面 `dish_018`、日式照烧鸡腿饭 `dish_019`、日式玉子烧 `dish_020`、地三鲜 `dish_021`、土豆炖排骨 `dish_026`、水煮肉片 `dish_030`、水煮鱼 `dish_031`、豉汁排骨 `dish_035`、农家一碗香 `dish_039`、奥尔良风味烤鸡腿 `dish_041`、蒸水蛋 `dish_049`、炒方便面 `dish_050`、柠檬水 `dish_052`

## 其余 33 道

原本用的是 HowToCook / 用户文档 / Wikimedia 的实拍图，现在被生成图替换；如果更喜欢原来的实拍，可以从 git 历史（提交 `7b2737e` 及更早）取回同名文件覆盖。

## 重新生成某一张

```bash
# 改 scripts/agnes-prompts.json 里对应 prompt，然后
node scripts/agnes-image.mjs --only=dish_004 --force
node scripts/agnes-image.mjs --dry-run          # 只看清单，不联网
```

---

戴诗佳女士所有，由 ymq 独立开发，版权所有 ©
