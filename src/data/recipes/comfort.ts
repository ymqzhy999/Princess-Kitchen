import type { Recipe } from '../../types';

const SOURCE = '原创编写，未复制第三方菜谱';

export const comfortRecipes: Recipe[] = [
  {
    id: 'dish_012',
    name: '番茄牛腩火锅',
    category: '火锅',
    coverImage: './images/recipes/dish_012.jpg',
    description:
      '番茄熬出浓浓的红汤，牛腩炖到软烂，再涮上金针菇、娃娃菜和宽粉。两个人围着一个小锅，就是最热闹的晚餐。',
    ingredients: [
      { name: '牛腩', amount: '500g' },
      { name: '番茄', amount: '4 个' },
      { name: '番茄膏', amount: '2 汤匙' },
      { name: '洋葱', amount: '半个' },
      { name: '姜', amount: '4 片' },
      { name: '蒜', amount: '3 瓣' },
      { name: '冰糖', amount: '1 小勺' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '盐', amount: '适量' },
      { name: '清水', amount: '1.5L' },
      { name: '金针菇', amount: '150g' },
      { name: '娃娃菜', amount: '1 颗' },
      { name: '宽粉', amount: '100g' },
      { name: '嫩豆腐', amount: '200g' },
    ],
    steps: [
      {
        title: '牛腩焯水',
        description:
          '牛腩切 3cm 见方的块，冷水下锅，加姜片和 1 汤匙料酒，煮开后撇去浮沫，捞出用温水洗净。',
      },
      {
        title: '炒番茄底',
        description:
          '番茄两个切块、两个切碎。锅中放油，先炒香洋葱碎和蒜末，再加入切碎的番茄和番茄膏，炒到出沙、颜色红亮。',
        tip: '番茄膏能让汤底颜色更浓，味道也更集中。',
      },
      {
        title: '炖牛腩',
        description:
          '放入牛腩块翻炒均匀，加入生抽、冰糖和清水，大火烧开后转小火炖 50 分钟，直到牛腩软烂。',
        tip: '炖煮时间根据牛腩部位调整，筷子能轻松扎透即可。',
      },
      {
        title: '加入番茄块',
        description:
          '放入剩下的番茄块，再煮 10 分钟，让汤里保留一些完整的番茄果肉。',
      },
      {
        title: '调味上桌',
        description:
          '加盐调味，把锅移到电磁炉或卡式炉上，汤底煮开后就可以开始涮菜了。',
        tip: '先喝一小碗汤，再涮菜，味道会更有层次。',
      },
      {
        title: '准备涮菜',
        description:
          '金针菇去根洗净，娃娃菜掰开，宽粉提前泡软，豆腐切块。按喜欢的顺序下锅，宽粉最后煮，汤会更浓。',
      },
    ],
    difficulty: '中等',
    cookingTime: 80,
    servings: '2-3 人份',
    price: 58,
    source: SOURCE,
    tags: ['火锅', '番茄', '牛肉', '冬日'],
    popularity: 89,
  },
  {
    id: 'dish_013',
    name: '蒜香烤鸡翅',
    category: '烧烤',
    coverImage: './images/recipes/dish_013.jpg',
    description:
      '鸡翅腌足蒜香，烤到外皮焦脆、里面还流着肉汁。不用炭火也能在家拥有夜宵摊的快乐，配一杯气泡水刚刚好。',
    ingredients: [
      { name: '鸡中翅', amount: '10 个' },
      { name: '蒜', amount: '5 瓣' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '蚝油', amount: '1 汤匙' },
      { name: '蜂蜜', amount: '1 汤匙' },
      { name: '料酒', amount: '1 汤匙' },
      { name: '黑胡椒', amount: '适量' },
      { name: '孜然粉', amount: '1 小勺' },
      { name: '辣椒粉', amount: '1 小勺' },
      { name: '白芝麻', amount: '1 小勺' },
    ],
    steps: [
      {
        title: '鸡翅改刀',
        description:
          '鸡翅洗净擦干，两面各划两刀，方便入味。',
      },
      {
        title: '调腌料',
        description:
          '蒜切末，与生抽、蚝油、料酒、黑胡椒和一半蜂蜜混合，倒入鸡翅抓匀。',
      },
      {
        title: '冷藏腌制',
        description:
          '盖上保鲜膜冷藏腌制 2 小时以上，时间充裕的话腌一夜更入味。',
        tip: '腌料里的蜂蜜先放一半，剩下的一半留着最后刷面。',
      },
      {
        title: '烤箱烤制',
        description:
          '烤箱预热 200℃。鸡翅摆在烤架上，下面垫接油盘，烤 20 分钟后翻面。',
      },
      {
        title: '刷蜜撒料',
        description:
          '剩余蜂蜜加少许温水调开，刷在鸡翅两面，撒上孜然粉、辣椒粉和白芝麻，再烤 8-10 分钟至表面焦亮。',
        tip: '最后几分钟注意观察，蜂蜜容易烤焦。',
      },
      {
        title: '静置装盘',
        description:
          '出炉后静置 3 分钟再吃，肉汁会更饱满。可以搭配生菜和柠檬角解腻。',
      },
    ],
    difficulty: '简单',
    cookingTime: 45,
    servings: '2 人份',
    price: 24,
    source: SOURCE,
    tags: ['烤箱菜', '夜宵', '鸡肉', '蒜香'],
    popularity: 85,
  },
  {
    id: 'dish_014',
    name: '皮蛋瘦肉粥',
    category: '早餐',
    coverImage: './images/recipes/dish_014.jpg',
    description:
      '米粒熬到开花，皮蛋的醇香和瘦肉的鲜味融进粥里，撒一点白胡椒和葱花。胃不舒服的早晨，最需要这一碗。',
    ingredients: [
      { name: '大米', amount: '100g' },
      { name: '猪里脊', amount: '100g' },
      { name: '皮蛋', amount: '2 个' },
      { name: '姜丝', amount: '1 小勺' },
      { name: '小葱', amount: '1 根' },
      { name: '盐', amount: '适量' },
      { name: '白胡椒粉', amount: '少许' },
      { name: '香油', amount: '几滴' },
      { name: '清水', amount: '1.2L' },
    ],
    steps: [
      {
        title: '大米冷冻',
        description:
          '大米淘洗干净，沥干后装入保鲜袋冷冻 1 小时。冷冻过的米更容易煮开花。',
        tip: '如果赶时间，直接煮也可以，只是要多熬 15 分钟。',
      },
      {
        title: '腌瘦肉',
        description:
          '里脊切细丝，加少许盐、白胡椒粉和 1 小勺淀粉抓匀，腌 10 分钟。',
      },
      {
        title: '煮粥底',
        description:
          '锅中加入清水烧开，放入冷冻的大米和姜丝，大火煮开后转小火，保持微沸熬 30 分钟，中途偶尔搅拌防止粘底。',
        tip: '水一次加够，中途加水会影响粥的浓稠度。',
      },
      {
        title: '加皮蛋',
        description:
          '皮蛋切小块，放入粥中煮 5 分钟，让皮蛋的香味融进粥里。',
      },
      {
        title: '下瘦肉',
        description:
          '把肉丝抖散下锅，用勺子轻轻推散，煮 2-3 分钟到肉丝变白。',
      },
      {
        title: '调味出锅',
        description:
          '加盐和白胡椒粉调味，关火后滴几滴香油，撒上葱花即可。',
        tip: '皮蛋本身有味道，盐要少量多次地加。',
      },
    ],
    difficulty: '简单',
    cookingTime: 50,
    servings: '2 人份',
    price: 14,
    source: SOURCE,
    tags: ['早餐', '粥', '暖胃', '清淡'],
    popularity: 80,
  },
  {
    id: 'dish_015',
    name: '葱油拌面',
    category: '主食',
    coverImage: './images/recipes/dish_015.jpg',
    description:
      '小葱在油里慢慢熬到焦香，酱汁甜咸浓郁，拌上热面条，简单却让人一口接一口。深夜饿了，二十分钟就能吃到。',
    ingredients: [
      { name: '细面条', amount: '200g' },
      { name: '小葱', amount: '8 根' },
      { name: '蒜', amount: '2 瓣' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '老抽', amount: '半汤匙' },
      { name: '白糖', amount: '1 小勺' },
      { name: '食用油', amount: '4 汤匙' },
      { name: '白芝麻', amount: '1 小勺' },
    ],
    steps: [
      {
        title: '处理小葱',
        description:
          '小葱洗净擦干，葱白和葱绿分开切成长段。葱一定要擦干，避免下油锅时溅油。',
      },
      {
        title: '熬葱油',
        description:
          '冷锅倒入食用油，放入葱白和蒜片，小火慢慢熬。葱白变软后加入葱绿，继续熬到葱段变深褐色、香味浓郁。',
        tip: '全程小火，葱熬焦了会发苦，颜色金黄偏褐就可以捞出。',
      },
      {
        title: '调酱汁',
        description:
          '关火，趁油温还热，加入生抽、老抽和白糖，利用余温搅拌均匀。',
        tip: '酱汁遇热会沸腾，动作轻一点，小心溅出。',
      },
      {
        title: '煮面',
        description:
          '另起锅烧水，水开后下面条，按包装时间煮熟，捞出沥干。',
      },
      {
        title: '拌面',
        description:
          '面条放入碗中，淋上两到三汤匙葱油酱汁，撒上熬香的葱段和白芝麻，趁热拌匀。',
        tip: '酱汁咸度较高，先少放，尝过味道再添。',
      },
    ],
    difficulty: '简单',
    cookingTime: 20,
    servings: '2 人份',
    price: 10,
    source: SOURCE,
    tags: ['主食', '面食', '夜宵', '快手菜'],
    popularity: 83,
  },
];
