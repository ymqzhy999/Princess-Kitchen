import type { Recipe } from '../../types';

const SOURCE = '原创编写，未复制第三方菜谱';

export const hunanHomeRecipes: Recipe[] = [
  {
    id: 'dish_007',
    name: '剁椒鱼头',
    category: '湘菜',
    coverImage: './images/recipes/dish_007.jpg',
    description:
      '鱼头铺满红艳艳的剁椒，蒸好后泼一勺热油，鲜辣里带着发酵的香气。剩下的汤汁拌面，两个人能吃得干干净净。',
    ingredients: [
      { name: '胖头鱼鱼头', amount: '1 个（约 700g）' },
      { name: '红剁椒', amount: '4 汤匙' },
      { name: '姜', amount: '1 块' },
      { name: '蒜', amount: '4 瓣' },
      { name: '小葱', amount: '2 根' },
      { name: '料酒', amount: '2 汤匙' },
      { name: '蒸鱼豉油', amount: '1 汤匙' },
      { name: '白胡椒粉', amount: '1 小撮' },
      { name: '食用油', amount: '2 汤匙' },
      { name: '盐', amount: '少许' },
    ],
    steps: [
      {
        title: '处理鱼头',
        description:
          '鱼头从中间劈开但不要切断，去掉鱼鳃和黑膜，冲洗干净后用厨房纸吸干水分。',
      },
      {
        title: '腌制去腥',
        description:
          '鱼头两面抹少许盐、白胡椒粉和料酒，铺上姜片腌 15 分钟。',
      },
      {
        title: '炒香剁椒',
        description:
          '锅中放 1 汤匙油，小火炒香一半蒜末，倒入剁椒翻炒 30 秒，盛出备用。',
        tip: '剁椒本身有咸味，盐要少放，炒过之后香气更足。',
      },
      {
        title: '铺料上锅',
        description:
          '鱼头平铺在盘中，鱼皮朝上，把炒好的剁椒均匀铺满，再撒上剩余蒜末。',
      },
      {
        title: '大火蒸制',
        description:
          '蒸锅水开后放入鱼头，大火蒸 12-15 分钟，关火焖 2 分钟。',
        tip: '用筷子能轻松扎透鱼头最厚处就熟了，不要蒸过头。',
      },
      {
        title: '泼油出锅',
        description:
          '取出后淋上蒸鱼豉油，撒葱花。另起锅把 1 汤匙油烧热，泼在葱花上即可。',
      },
    ],
    difficulty: '中等',
    cookingTime: 35,
    servings: '2-3 人份',
    price: 45,
    source: SOURCE,
    tags: ['鲜辣', '蒸菜', '鱼类', '湘味'],
    popularity: 87,
  },
  {
    id: 'dish_008',
    name: '农家小炒肉',
    category: '湘菜',
    coverImage: '',
    description:
      '五花肉煸到微微卷边，青椒炒出虎皮，豆豉和酱油的香气混在一起。锅气十足，一碗米饭根本不够。',
    ingredients: [
      { name: '五花肉', amount: '200g' },
      { name: '青尖椒', amount: '4 个' },
      { name: '红椒', amount: '1 个' },
      { name: '蒜', amount: '3 瓣' },
      { name: '姜', amount: '2 片' },
      { name: '豆豉', amount: '1 小勺' },
      { name: '生抽', amount: '1 汤匙' },
      { name: '老抽', amount: '半汤匙' },
      { name: '料酒', amount: '1 汤匙' },
      { name: '盐', amount: '少许' },
      { name: '食用油', amount: '1 汤匙' },
    ],
    steps: [
      {
        title: '切肉片',
        description:
          '五花肉稍微冷冻 10 分钟再切，能切得更薄。把肥瘦相间的肉切成 2mm 左右的薄片。',
      },
      {
        title: '煸出猪油',
        description:
          '锅烧热，放少许油，下五花肉片中小火煸炒，炒到肉片出油、边缘微微卷起，盛出多余的油。',
        tip: '把肉煸到微焦，香味才够足，也不会觉得腻。',
      },
      {
        title: '炒香配料',
        description:
          '放入姜片、蒜片和豆豉炒香，再沿锅边淋入料酒，加生抽和老抽翻炒上色。',
      },
      {
        title: '青椒炒出虎皮',
        description:
          '倒入切好的青红椒，转大火快速翻炒，炒到青椒表面出现焦斑，撒少许盐调味。',
        tip: '青椒不要炒太久，保持脆感才好吃。',
      },
      {
        title: '合炒出锅',
        description:
          '把肉片倒回锅中，与青椒一起大火翻炒 30 秒，尝一下咸淡即可出锅。',
      },
    ],
    difficulty: '简单',
    cookingTime: 25,
    servings: '2 人份',
    price: 28,
    source: SOURCE,
    tags: ['下饭', '香辣', '猪肉', '快手菜'],
    popularity: 93,
  },
  {
    id: 'dish_009',
    name: '番茄炒蛋',
    category: '家常菜',
    coverImage: '',
    description:
      '鸡蛋蓬松柔软，番茄炒出酸甜的汁水，浇在米饭上能拌出满满一碗。最简单的家常味道，也最让人安心。',
    ingredients: [
      { name: '番茄', amount: '3 个（约 400g）' },
      { name: '鸡蛋', amount: '3 个' },
      { name: '小葱', amount: '1 根' },
      { name: '白糖', amount: '1 小勺' },
      { name: '盐', amount: '适量' },
      { name: '食用油', amount: '2 汤匙' },
      { name: '白胡椒粉', amount: '少许' },
    ],
    steps: [
      {
        title: '番茄去皮',
        description:
          '番茄顶部划十字，放入开水中烫 30 秒，撕掉外皮后切成滚刀块。',
        tip: '去皮后口感更顺滑，汤汁也更浓。',
      },
      {
        title: '打散鸡蛋',
        description:
          '鸡蛋打入碗中，加一小撮盐和少许白胡椒粉，充分搅打到蛋液均匀起小泡。',
      },
      {
        title: '热锅炒蛋',
        description:
          '锅烧热后放 1.5 汤匙油，油热倒入蛋液，等底部凝固后用锅铲从边缘往中间推，蛋液八成熟就盛出。',
        tip: '鸡蛋不要炒太老，盛出后余温会继续加热。',
      },
      {
        title: '炒出番茄汁',
        description:
          '锅中补少许油，倒入番茄块，中火翻炒到番茄变软、边缘出汁，加入白糖和少许盐。',
        tip: '加一点糖不是为了甜，而是为了平衡番茄的酸味。',
      },
      {
        title: '合炒收汁',
        description:
          '把鸡蛋倒回锅中，轻轻翻炒让蛋块裹上番茄汁，煮 1 分钟，撒葱花即可出锅。',
      },
    ],
    difficulty: '简单',
    cookingTime: 15,
    servings: '2 人份',
    price: 10,
    source: SOURCE,
    tags: ['快手菜', '酸甜', '下饭', '新手友好', '西红柿'],
    popularity: 95,
  },
  {
    id: 'dish_010',
    name: '红烧肉',
    category: '家常菜',
    coverImage: './images/recipes/dish_010.jpg',
    description:
      '小火慢炖到筷子一夹就颤，肥而不腻、甜咸浓郁。需要一点耐心，但等待的过程本身就很幸福。',
    ingredients: [
      { name: '带皮五花肉', amount: '500g' },
      { name: '冰糖', amount: '25g' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '老抽', amount: '1 汤匙' },
      { name: '料酒', amount: '2 汤匙' },
      { name: '姜', amount: '4 片' },
      { name: '小葱', amount: '1 根' },
      { name: '八角', amount: '1 个' },
      { name: '桂皮', amount: '1 小块' },
      { name: '香叶', amount: '1 片' },
      { name: '热水', amount: '600ml' },
    ],
    steps: [
      {
        title: '切块焯水',
        description:
          '五花肉切成 3cm 见方的块，冷水下锅，加 2 片姜和 1 汤匙料酒，煮开后撇去浮沫，捞出用温水洗净。',
        tip: '焯水后用温水冲洗，冷水会让肉质突然收紧。',
      },
      {
        title: '煸出多余油脂',
        description:
          '锅中不放油，下五花肉块中小火煸炒，炒到表面微黄、出油，盛出备用。',
      },
      {
        title: '炒糖色',
        description:
          '锅留少许底油，放入冰糖小火慢慢融化，炒到糖液呈琥珀色、冒小泡时，立刻倒入肉块翻炒上色。',
        tip: '糖色炒过头会发苦，颜色由浅黄变成枣红就要马上放肉。',
      },
      {
        title: '加调料炖煮',
        description:
          '加入姜片、八角、桂皮和香叶炒香，淋入料酒、生抽和老抽，倒入没过肉的热水，大火烧开。',
      },
      {
        title: '转小火慢炖',
        description:
          '转小火盖盖炖 50 分钟，中途翻动一两次，让肉块均匀入味。',
      },
      {
        title: '大火收汁',
        description:
          '开盖转大火收汁，不断翻动让汤汁均匀裹在肉上，收到浓稠发亮即可，撒葱花装盘。',
        tip: '收汁时守在锅边，糖分高，容易糊底。',
      },
    ],
    difficulty: '中等',
    cookingTime: 70,
    servings: '2-3 人份',
    price: 32,
    source: SOURCE,
    tags: ['炖菜', '下饭', '猪肉', '甜咸'],
    popularity: 94,
  },
  {
    id: 'dish_011',
    name: '蒜蓉西兰花',
    category: '家常菜',
    coverImage: './images/recipes/dish_011.jpg',
    description:
      '翠绿的西兰花裹着蒜香，清脆爽口，十分钟就能做好。大鱼大肉之后，最想念的往往是这样一盘清爽的蔬菜。',
    ingredients: [
      { name: '西兰花', amount: '1 颗（约 350g）' },
      { name: '蒜', amount: '5 瓣' },
      { name: '蚝油', amount: '1 汤匙' },
      { name: '盐', amount: '适量' },
      { name: '淀粉', amount: '半小勺' },
      { name: '清水', amount: '2 汤匙' },
      { name: '食用油', amount: '1 汤匙' },
    ],
    steps: [
      {
        title: '拆成小朵',
        description:
          '西兰花切掉老根，拆成大小均匀的小朵，放入淡盐水中浸泡 10 分钟，再冲洗干净。',
        tip: '盐水浸泡能帮助洗掉藏在花球里的小虫和灰尘。',
      },
      {
        title: '焯水',
        description:
          '锅中水烧开，加少许盐和几滴油，放入西兰花焯 1 分钟，捞出立刻过凉水。',
        tip: '加盐和油能让西兰花保持翠绿，过凉水能锁住脆感。',
      },
      {
        title: '调蒜蓉汁',
        description:
          '蒜切末，蚝油、淀粉和清水调成碗汁，避免下锅后手忙脚乱。',
      },
      {
        title: '炒香蒜末',
        description: '锅中放油，小火炒香一半蒜末，炒到微微金黄。',
      },
      {
        title: '快速合炒',
        description:
          '转大火，放入西兰花和剩余蒜末快速翻炒，倒入碗汁勾薄芡，翻匀后即可出锅。',
        tip: '西兰花已经焯熟，大火快炒半分钟就够，炒久了会发黄。',
      },
    ],
    difficulty: '简单',
    cookingTime: 15,
    servings: '2 人份',
    price: 12,
    source: SOURCE,
    tags: ['清淡', '蔬菜', '快手菜', '低脂'],
    popularity: 78,
  },
];
