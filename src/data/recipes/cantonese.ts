import type { Recipe } from '../../types';

const SOURCE = '原创编写，未复制第三方菜谱';

export const cantoneseRecipes: Recipe[] = [
  {
    id: 'dish_004',
    name: '白切鸡',
    category: '粤菜',
    coverImage: './images/recipes/dish_004.jpg',
    description:
      '皮爽肉滑、原汁原味，蘸一碟姜葱油就足够惊艳。做法不复杂，却特别适合周末慢慢做给重要的人吃。',
    ingredients: [
      { name: '三黄鸡（半只）', amount: '约 600g' },
      { name: '姜', amount: '1 大块' },
      { name: '小葱', amount: '4 根' },
      { name: '盐', amount: '1 小勺' },
      { name: '冰水', amount: '1 大盆' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '花生油', amount: '2 汤匙' },
      { name: '姜蓉', amount: '2 汤匙' },
      { name: '葱末', amount: '2 汤匙' },
    ],
    steps: [
      {
        title: '准备浸鸡的水',
        description:
          '大锅中加足量清水，放入 4 片姜和 2 根打结的小葱，大火烧开后转小火，保持水面微微冒泡。',
      },
      {
        title: '三提三放',
        description:
          '提着鸡腿把整鸡浸入热水中 10 秒，再提起沥干，重复三次。这样鸡皮会更紧致，也不容易破。',
        tip: '半只鸡同样操作，动作轻一点，别让鸡皮粘在锅边。',
      },
      {
        title: '小火浸熟',
        description:
          '把鸡完全浸入水中，保持小火似开非开的状态，浸 18-20 分钟。用筷子扎最厚的大腿处，没有血水流出即可。',
        tip: '全程不要大火滚煮，否则鸡皮容易破、肉质变柴。',
      },
      {
        title: '立刻过冰水',
        description:
          '捞出后马上放入冰水中浸 10 分钟，让鸡皮迅速收缩，口感变得爽脆。',
        tip: '这一步是白切鸡皮爽肉滑的关键，冰水要够冰。',
      },
      {
        title: '调姜葱油',
        description:
          '姜蓉和葱末放入小碗，加 1 小勺盐。花生油烧到微微冒烟，泼在姜葱上激出香味，再加入生抽拌匀。',
      },
      {
        title: '斩件装盘',
        description:
          '鸡沥干水分，表面薄薄抹一层花生油，斩成方便入口的块状，摆盘后配上姜葱油蘸碟。',
      },
    ],
    difficulty: '中等',
    cookingTime: 50,
    servings: '2-3 人份',
    price: 38,
    source: SOURCE,
    tags: ['清淡', '原味', '宴客菜', '鸡肉'],
    popularity: 86,
  },
  {
    id: 'dish_005',
    name: '清蒸鲈鱼',
    category: '粤菜',
    coverImage: './images/recipes/dish_005.jpg',
    description:
      '十分钟蒸出鲜嫩鱼肉，淋上热油和蒸鱼豉油，葱姜的香气清清淡淡。想吃清淡又不将就的晚上，就做它。',
    ingredients: [
      { name: '鲈鱼', amount: '1 条（约 500g）' },
      { name: '姜', amount: '1 块' },
      { name: '小葱', amount: '3 根' },
      { name: '红椒', amount: '少许' },
      { name: '蒸鱼豉油', amount: '2 汤匙' },
      { name: '料酒', amount: '1 汤匙' },
      { name: '盐', amount: '少许' },
      { name: '食用油', amount: '1.5 汤匙' },
    ],
    steps: [
      {
        title: '处理鱼',
        description:
          '鲈鱼清洗干净，去鳞去内脏，刮掉鱼腹内的黑膜。用厨房纸把表面和腹腔的水分擦干。',
        tip: '黑膜是腥味来源，一定要刮干净。',
      },
      {
        title: '改刀去腥',
        description:
          '在鱼身两侧各划两刀，抹少许盐和料酒，鱼腹和刀口里塞入姜片和葱段，静置 10 分钟。',
      },
      {
        title: '水开再上锅',
        description:
          '蒸锅水烧开后放入鱼，大火蒸 8 分钟。关火后焖 2 分钟再取出。',
        tip: '500g 左右的鱼蒸 8 分钟刚好，鱼更大就适当加 2 分钟。',
      },
      {
        title: '倒掉腥水',
        description:
          '取出后倒掉盘中的汤汁，夹掉蒸过的姜葱，重新铺上新鲜的葱丝、姜丝和红椒丝。',
      },
      {
        title: '淋豉油泼热油',
        description:
          '沿盘边淋入蒸鱼豉油，食用油烧到冒烟后均匀泼在葱姜丝上，激出香味即可上桌。',
        tip: '豉油沿盘边淋，鱼肉颜色会更清爽。',
      },
    ],
    difficulty: '简单',
    cookingTime: 25,
    servings: '2 人份',
    price: 32,
    source: SOURCE,
    tags: ['清蒸', '低脂', '鲜甜', '鱼类'],
    popularity: 90,
  },
  {
    id: 'dish_006',
    name: '蜜汁叉烧',
    category: '粤菜',
    coverImage: './images/recipes/dish_006.jpg',
    description:
      '梅花肉腌足一夜，烤到边缘微焦，刷上蜂蜜后再回炉两分钟。切开时肉汁亮晶晶，甜咸交织，配饭配面都合适。',
    ingredients: [
      { name: '梅花肉', amount: '500g' },
      { name: '叉烧酱', amount: '3 汤匙' },
      { name: '蜂蜜', amount: '1.5 汤匙' },
      { name: '生抽', amount: '1 汤匙' },
      { name: '蚝油', amount: '1 汤匙' },
      { name: '料酒', amount: '1 汤匙' },
      { name: '蒜', amount: '2 瓣' },
      { name: '五香粉', amount: '1 小撮' },
      { name: '食用油', amount: '1 小勺' },
    ],
    steps: [
      {
        title: '切肉',
        description:
          '梅花肉顺纹切成约 3cm 厚的长条，用叉子在表面扎些小孔，方便入味。',
        tip: '梅花肉带一点脂肪，烤出来最润；全瘦的肉容易柴。',
      },
      {
        title: '调腌料',
        description:
          '叉烧酱、生抽、蚝油、料酒、蒜末和五香粉混合均匀，倒入肉中抓匀，让每一面都裹上酱料。',
      },
      {
        title: '冷藏腌制',
        description:
          '装入密封袋冷藏至少 4 小时，如果时间允许，腌一夜风味更好。中途翻面一两次。',
      },
      {
        title: '烤箱烤制',
        description:
          '烤箱预热 200℃。肉条放在铺了锡纸的烤架上，刷一层腌料，烤 20 分钟后翻面，再刷腌料烤 15 分钟。',
        tip: '烤架下面垫烤盘接油，清理起来会轻松很多。',
      },
      {
        title: '刷蜂蜜上色',
        description:
          '蜂蜜加 1 小勺温水调开，刷在肉的两面，再烤 5 分钟，直到表面油亮、边缘微焦。',
        tip: '蜂蜜容易焦，最后几分钟要守在烤箱旁边。',
      },
      {
        title: '静置切片',
        description: '取出后静置 5 分钟再切片，肉汁会更稳定地留在肉里。',
      },
    ],
    difficulty: '中等',
    cookingTime: 70,
    servings: '2-3 人份',
    price: 36,
    source: SOURCE,
    tags: ['烤箱菜', '甜咸', '猪肉', '提前腌制'],
    popularity: 84,
  },
];
