import type { Recipe } from '../../types';

const SOURCE = '原创编写，未复制第三方菜谱';

export const sweetRecipes: Recipe[] = [
  {
    id: 'dish_016',
    name: '提拉米苏',
    category: '甜品',
    coverImage: './images/recipes/dish_016.jpg',
    description:
      '马斯卡彭奶酪轻盈绵密，手指饼干吸饱咖啡酒香，表面筛一层可可粉。冷藏一夜后切开，是适合两个人分享的小小庆祝。',
    ingredients: [
      { name: '马斯卡彭奶酪', amount: '250g' },
      { name: '手指饼干', amount: '100g' },
      { name: '浓缩咖啡', amount: '150ml' },
      { name: '朗姆酒', amount: '1 汤匙（可省）', optional: true },
      { name: '蛋黄', amount: '2 个' },
      { name: '细砂糖', amount: '50g' },
      { name: '淡奶油', amount: '200ml' },
      { name: '可可粉', amount: '适量' },
    ],
    steps: [
      {
        title: '准备咖啡液',
        description:
          '浓缩咖啡放凉至室温，加入朗姆酒搅匀。咖啡一定要放凉，否则会把奶油糊烫化。',
      },
      {
        title: '打发蛋黄',
        description:
          '蛋黄加细砂糖放入耐热碗中，隔 70℃ 左右的温水打发，打到颜色变浅、体积膨胀、提起打蛋器有纹路。',
        tip: '隔水加热能杀菌，也能让蛋黄更容易打发，水温不要太高。',
      },
      {
        title: '拌入马斯卡彭',
        description:
          '马斯卡彭提前从冰箱取出回温，用刮刀压顺滑，再分两次加入蛋黄糊，翻拌均匀。',
        tip: '不要过度搅拌，马斯卡彭容易油水分离。',
      },
      {
        title: '打发淡奶油',
        description:
          '淡奶油打发到六分发（提起打蛋器有缓慢流动的尖角），分两次翻拌进奶酪糊中，成为轻盈的慕斯糊。',
      },
      {
        title: '组装',
        description:
          '手指饼干在咖啡液里快速蘸一下，铺满容器底部，抹一层奶酪糊，再铺一层蘸过咖啡的饼干，最后抹平表面。',
        tip: '饼干蘸咖啡的时间控制在 1 秒内，泡久了会散。',
      },
      {
        title: '冷藏定型',
        description:
          '盖好保鲜膜冷藏至少 4 小时，最好过夜。吃之前筛上可可粉，切块时用热刀会更整齐。',
      },
    ],
    difficulty: '中等',
    cookingTime: 45,
    servings: '2-3 人份',
    price: 38,
    source: SOURCE,
    tags: ['甜品', '免烤', '咖啡', '需要冷藏'],
    popularity: 91,
  },
  {
    id: 'dish_017',
    name: '杨枝甘露',
    category: '饮品',
    coverImage: './images/recipes/dish_017.jpg',
    description:
      '芒果的甜、西柚的微苦和椰浆的香混在一起，配上 Q 弹的西米，冰冰凉凉。夏天的午后，一杯就足够治愈。',
    ingredients: [
      { name: '芒果', amount: '2 个（约 400g）' },
      { name: '西柚', amount: '半个' },
      { name: '西米', amount: '50g' },
      { name: '椰浆', amount: '200ml' },
      { name: '淡奶油', amount: '100ml' },
      { name: '牛奶', amount: '100ml' },
      { name: '细砂糖', amount: '1 汤匙' },
      { name: '冰块', amount: '适量' },
    ],
    steps: [
      {
        title: '煮西米',
        description:
          '水烧开后倒入西米，中火煮 12 分钟，中途搅拌防止粘底。关火盖盖焖 8 分钟，直到西米中间的小白点消失。',
        tip: '西米一定要水开后再下锅，冷水下锅会煮成糊。',
      },
      {
        title: '西米过凉',
        description: '煮好的西米捞出，用流动的清水冲洗掉表面黏液，再泡在冰水里备用。',
      },
      {
        title: '处理水果',
        description:
          '芒果去皮，一半切小丁，一半打成芒果泥。西柚剥出果粒，尽量去掉白色筋膜。',
      },
      {
        title: '调椰奶底',
        description:
          '椰浆、牛奶、淡奶油和细砂糖混合搅拌到糖融化。喜欢更浓的口感，可以多加一点椰浆。',
      },
      {
        title: '混合',
        description:
          '把芒果泥和椰奶底混合，加入西米、芒果丁和西柚粒，轻轻拌匀。',
      },
      {
        title: '冰镇享用',
        description:
          '装入杯中冷藏 30 分钟，喝之前加几块冰。西柚粒留一点最后撒在表面，颜色更好看。',
      },
    ],
    difficulty: '简单',
    cookingTime: 25,
    servings: '2 杯',
    price: 22,
    source: SOURCE,
    tags: ['饮品', '芒果', '夏日', '冰镇'],
    popularity: 88,
  },
  {
    id: 'dish_018',
    name: '奶油蘑菇意面',
    category: '西餐',
    coverImage: './images/recipes/dish_018.jpg',
    description:
      '口蘑和培根的香气融进奶白的酱汁，每条意面都裹得浓浓的。点上蜡烛，在家也能拥有一顿像样的小晚餐。',
    ingredients: [
      { name: '意大利面', amount: '200g' },
      { name: '口蘑', amount: '150g' },
      { name: '培根', amount: '80g' },
      { name: '淡奶油', amount: '200ml' },
      { name: '蒜', amount: '2 瓣' },
      { name: '黄油', amount: '15g' },
      { name: '帕玛森芝士', amount: '20g' },
      { name: '黑胡椒', amount: '适量' },
      { name: '盐', amount: '适量' },
      { name: '欧芹碎', amount: '少许（可省）', optional: true },
    ],
    steps: [
      {
        title: '煮意面',
        description:
          '大锅水烧开，加一勺盐，放入意面按包装时间煮至八分熟。捞出时留一杯煮面水。',
        tip: '煮面水含淀粉，是让酱汁浓稠的秘密武器。',
      },
      {
        title: '煎培根和蘑菇',
        description:
          '平底锅中小火融化黄油，放入培根煎到出油微焦，再放入切片的口蘑，煎到金黄。',
        tip: '蘑菇不要一次放太多，分两次煎更容易上色。',
      },
      {
        title: '炒香蒜末',
        description:
          '加入蒜末炒香，倒入淡奶油，小火煮到微微冒泡。',
      },
      {
        title: '调入芝士',
        description:
          '加入帕玛森芝士碎，搅拌到融化，用盐和黑胡椒调味。',
      },
      {
        title: '拌入意面',
        description:
          '把意面放入酱汁中，加入两到三汤匙煮面水，快速翻拌，让酱汁均匀包裹住面条。',
        tip: '如果酱汁太稠，少量多次加煮面水调节。',
      },
      {
        title: '装盘',
        description:
          '盛入温热的盘中，再撒一点黑胡椒、帕玛森芝士和欧芹碎即可。',
      },
    ],
    difficulty: '简单',
    cookingTime: 30,
    servings: '2 人份',
    price: 28,
    source: SOURCE,
    tags: ['西餐', '意面', '奶油', '约会晚餐'],
    popularity: 82,
  },
  {
    id: 'dish_019',
    name: '日式照烧鸡腿饭',
    category: '日料',
    coverImage: './images/recipes/dish_019.jpg',
    description:
      '鸡腿煎到皮脆肉嫩，裹上亮晶晶的照烧汁，铺在热米饭上，再配几朵西兰花。甜咸适口，便当和晚餐都合适。',
    ingredients: [
      { name: '去骨鸡腿', amount: '2 块' },
      { name: '米饭', amount: '2 碗' },
      { name: '西兰花', amount: '100g' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '味淋', amount: '2 汤匙' },
      { name: '蜂蜜', amount: '1 汤匙' },
      { name: '清酒或料酒', amount: '1 汤匙' },
      { name: '姜', amount: '2 片' },
      { name: '白芝麻', amount: '1 小勺' },
      { name: '海苔丝', amount: '少许（可省）', optional: true },
    ],
    steps: [
      {
        title: '鸡腿处理',
        description:
          '去骨鸡腿肉用厨房纸吸干水分，在肉厚的地方划几刀，让厚度更均匀。',
        tip: '鸡皮一定要擦干，煎的时候才能变脆。',
      },
      {
        title: '调照烧汁',
        description:
          '生抽、味淋、清酒和蜂蜜混合搅匀，备用。',
      },
      {
        title: '煎鸡腿',
        description:
          '平底锅不放油，鸡皮朝下放入鸡腿，中小火煎 5-6 分钟，煎出鸡油、鸡皮金黄酥脆后翻面，再煎 3 分钟。',
        tip: '用锅铲轻轻压住鸡腿，让鸡皮受热更均匀。',
      },
      {
        title: '倒入照烧汁',
        description:
          '倒掉锅中多余的油，放入姜片，倒入照烧汁，中小火煮到汤汁浓稠、均匀裹在鸡腿上。',
        tip: '照烧汁含蜂蜜和糖，收汁时注意别糊锅。',
      },
      {
        title: '焯西兰花',
        description:
          '另起锅烧水，加少许盐，西兰花焯 1 分钟后捞出。',
      },
      {
        title: '装碗',
        description:
          '鸡腿切条，铺在热米饭上，摆上西兰花，淋上锅中剩余的照烧汁，撒白芝麻和海苔丝。',
      },
    ],
    difficulty: '简单',
    cookingTime: 35,
    servings: '2 人份',
    price: 26,
    source: SOURCE,
    tags: ['日料', '盖饭', '鸡肉', '便当'],
    popularity: 90,
  },
  {
    id: 'dish_020',
    name: '日式玉子烧',
    category: '日料',
    coverImage: './images/recipes/dish_020.jpg',
    description:
      '一层层卷起的柔软蛋卷，带着淡淡的高汤和甜味。切开后切面层层叠叠，做成早餐或者便当配菜都很可爱。',
    ingredients: [
      { name: '鸡蛋', amount: '3 个' },
      { name: '牛奶或出汁', amount: '3 汤匙' },
      { name: '细砂糖', amount: '1 小勺' },
      { name: '味淋', amount: '1 小勺' },
      { name: '盐', amount: '1 小撮' },
      { name: '食用油', amount: '1 小勺' },
    ],
    steps: [
      {
        title: '调蛋液',
        description:
          '鸡蛋打散，加入牛奶、细砂糖、味淋和盐，用筷子画圈搅匀，尽量不要打出太多泡沫。',
        tip: '蛋液过筛一遍，煎出来的蛋卷会更细腻。',
      },
      {
        title: '热锅',
        description:
          '玉子烧锅或小平底锅烧热，用厨房纸蘸油薄薄擦一层，转小火。',
      },
      {
        title: '第一层',
        description:
          '倒入约三分之一的蛋液，摊满锅底。等表面半凝固、底部定型时，从一端卷向另一端。',
        tip: '蛋液不需要完全凝固，半熟时卷起才能粘合。',
      },
      {
        title: '重复卷制',
        description:
          '把蛋卷推回锅的一端，再擦一层油，倒入剩余蛋液的一半，掀起之前的蛋卷让蛋液流到下面，半凝固后继续卷起。',
      },
      {
        title: '最后一层',
        description:
          '重复倒入最后的蛋液，同样卷好，用锅铲轻轻压紧形状，再煎 30 秒定型。',
      },
      {
        title: '定型切块',
        description:
          '趁热用竹帘或保鲜膜卷住定型 2 分钟，切成 2cm 厚的块，摆盘即可。',
      },
    ],
    difficulty: '中等',
    cookingTime: 15,
    servings: '2 人份',
    price: 12,
    source: SOURCE,
    tags: ['日料', '鸡蛋', '早餐', '便当'],
    popularity: 76,
  },
];
