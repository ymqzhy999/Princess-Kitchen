# 菜谱与图片来源

本应用共 54 道菜谱：20 道 Princess Kitchen 原创，34 道来自 [HowToCook](https://github.com/Anduin2017/HowToCook)（Unlicense）。

当前 **54 道菜谱全部有图**：**33 张实拍照片** + **21 张 Agnes AI 生成图**（2026-11 补，非真实拍摄）。生成图只用于先把卡片补齐，收到合格实拍照片后按 [IMAGE_TODO.md](IMAGE_TODO.md) 覆盖同名文件即可；不再使用 SVG 占位图。

## 图片构成

- HowToCook 仓库原图（14 张，Unlicense）
- 用户提供的 DOCX 文档图片（9 张）：蒜蓉西兰花、白灼虾、广式萝卜牛腩、烤鸡翅、家常日本豆腐、剁椒鱼头、蒜香烤鸡翅、水煮牛肉、提拉米苏
- Wikimedia Commons 图片（10 张，CC0 / CC BY / CC BY-SA，见下表）
- Agnes AI 生成图（21 张，模型 `agnes-image-2.1-flash`，2026-11 生成；提示词与生成参数见 `scripts/agnes-prompts.json`）

## Wikimedia Commons 署名

| 菜谱 | 作者 | 许可 | 来源 |
| --- | --- | --- | --- |
| 辣椒炒肉 | N509FZ | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lajiao_Chaorou_at_Xiangzhongyuan_Hunan_Cuisine,_Beijing_(20240131171227).jpg) |
| 可乐鸡翅 | Suginami | [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%E5%8F%AF%E4%B9%90%E9%B8%A1%E7%BF%85_Cola_Jichi.jpg) |
| 酸辣土豆丝 | bryan... from Taipei, Taiwan | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Food_%E8%92%9C%E9%A6%99%E7%B4%99%E5%8C%85%E9%AD%9A,_%E9%87%91%E7%89%8C%E6%B0%B4%E7%85%AE%E7%89%9B,_%E8%93%89%E5%9F%8E%E5%8F%A3%E6%B0%B4%E9%9B%9E,_%E9%85%B8%E8%BE%A3%E5%9C%9F%E8%B1%86%E7%B5%B2,_%E8%99%8E%E7%9A%AE%E9%9D%92%E6%A4%92%E7%9A%AE%E8%9B%8B,_%E8%80%81%E7%BD%88%E9%A6%99%E5%B7%9D%E5%91%B3%E5%85%92%E5%B7%9D%E8%8F%9C%E9%A4%A8,_%E5%8F%B0%E5%8C%97,_%E5%8F%B0%E7%81%A3,_Taipei,_Taiwan_(47417883161).jpg) |
| 麻辣香锅 | 我乃野云鹤 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ma_La_Xiang_Guo.jpg) |
| 鱼香肉丝 | Liuxingy | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%E5%B7%9D%E8%8F%9C%E9%B1%BC%E9%A6%99%E8%82%89%E4%B8%9D.jpg) |
| 茶叶蛋 | Daniela Eftimova | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tea_eggs_1.jpg) |
| 煎饺 | Naha Mama Pavilionz | [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:JP_%E6%97%A5%E6%9C%AC_Japan_%E6%B2%96%E7%B9%A9_OKINAWA_%E9%82%A3%E9%9C%B8_Naha_%E7%90%89%E7%90%83%E6%96%B0%E9%BA%BA_Ryukyu_Shinmen_%E9%80%9A%E5%A0%82_Tondo_Orokuhonten_%E7%85%8E%E9%A4%83%E5%AD%90_pan_fried_Gyoza_dumpling_January_2025_R12S_03.jpg) |
| 美式炒蛋 | Andy Li | [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Scrambled_eggs_on_toast_-_Joe%27s_Cafe_2024-04-14.jpg) |
| 牛奶燕麦 | Ann Larie Valentine | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Oatmeal,_blueberries_and_almond_milk.jpg) |
| 手抓饼 | Sdkb | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Green_onion_cakes_in_Edmonton.jpg) |

图片经过裁切、缩放与 JPEG 压缩，未改变画面内容。

## AI 生成图片（21 张）

下面 21 道菜原本没有合格实拍图，2026-11 用 **Agnes AI**（`agnes-image-2.1-flash`，1K / 4:3）按菜名生成，先把卡片补齐。它们是**生成图，不是真实拍摄**，与真实成菜外观可能有差别；拿到实拍照片后直接覆盖同名文件即可，并在这里改成照片作者。

生成参数与每道菜的提示词见 [`scripts/agnes-prompts.json`](scripts/agnes-prompts.json)，重新生成命令见 [README · 补图](README.md#56-替换菜品图片)。

| 菜谱 | 文件 | 菜谱 | 文件 |
| --- | --- | --- | --- |
| 白切鸡 | dish_004.jpg | 豉汁排骨 | dish_035.jpg |
| 蜜汁叉烧 | dish_006.jpg | 奥尔良风味烤鸡腿 | dish_041.jpg |
| 农家小炒肉 | dish_008.jpg | 地三鲜 | dish_021.jpg |
| 番茄炒蛋 | dish_009.jpg | 土豆炖排骨 | dish_026.jpg |
| 番茄牛腩火锅 | dish_012.jpg | 农家一碗香 | dish_039.jpg |
| 皮蛋瘦肉粥 | dish_014.jpg | 水煮肉片 | dish_030.jpg |
| 葱油拌面 | dish_015.jpg | 水煮鱼 | dish_031.jpg |
| 杨枝甘露 | dish_017.jpg | 蒸水蛋 | dish_049.jpg |
| 奶油蘑菇意面 | dish_018.jpg | 炒方便面 | dish_050.jpg |
| 日式照烧鸡腿饭 | dish_019.jpg | 柠檬水 | dish_052.jpg |
| 日式玉子烧 | dish_020.jpg |  |  |

## 其他
- 图标：[Lucide](https://lucide.dev/)（ISC License）
- 缺图菜谱使用纯 CSS 占位提示，不使用 SVG 菜品图。
- 用户从相册上传的菜品图仅保存在本机，不上传到服务器，也不参与上面的来源署名。

## 版权

戴诗佳女士所有，由 ymq 独立开发，版权所有 ©

All rights reserved by Ms. Dai Shijia. Independently developed by ymq. ©
