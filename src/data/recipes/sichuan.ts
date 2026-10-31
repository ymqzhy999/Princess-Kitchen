import type { Recipe } from '../../types';

const SOURCE = '原创编写，未复制第三方菜谱';

export const sichuanRecipes: Recipe[] = [
  {
    id: 'dish_001',
    name: '宫保鸡丁',
    category: '川菜',
    coverImage: './images/recipes/dish_001.jpg',
    description:
      '鸡丁滑嫩、花生酥脆，酸甜里带着一点花椒的麻。大火快炒几分钟就能上桌，是两个人晚餐里最可靠的下饭选手。',
    ingredients: [
      { name: '鸡腿肉', amount: '300g' },
      { name: '熟花生米', amount: '50g' },
      { name: '干辣椒', amount: '8 个' },
      { name: '花椒', amount: '1 小撮' },
      { name: '大葱', amount: '1 段' },
      { name: '姜', amount: '3 片' },
      { name: '蒜', amount: '2 瓣' },
      { name: '生抽', amount: '1.5 汤匙' },
      { name: '香醋', amount: '1 汤匙' },
      { name: '白糖', amount: '1 汤匙' },
      { name: '料酒', amount: '1 汤匙' },
      { name: '淀粉', amount: '1 汤匙' },
      { name: '食用油', amount: '2 汤匙' },
    ],
    steps: [
      {
        title: '腌制鸡丁',
        description:
          '鸡腿肉去骨切成 1.5cm 见方的小丁，加入半汤匙生抽、料酒和淀粉抓匀，最后淋半汤匙油封住水分，静置 10 分钟。',
        tip: '用鸡腿肉比鸡胸肉更嫩，切的时候尽量大小一致，受热才均匀。',
      },
      {
        title: '调一碗灵魂碗汁',
        description:
          '小碗里放入剩余的生抽、香醋、白糖、半茶匙淀粉和 3 汤匙清水，搅拌到糖完全化开。',
        tip: '提前调好碗汁，下锅后就不会手忙脚乱。',
      },
      {
        title: '小火煸香香料',
        description:
          '锅烧热后倒油，转小火放入干辣椒段和花椒，慢慢煸出香味，辣椒颜色变深但不要发黑。',
        tip: '花椒很容易糊，油温不要太高，闻到麻香就进行下一步。',
      },
      {
        title: '滑炒鸡丁',
        description:
          '转中大火，下鸡丁快速摊开，炒到表面变白、边缘微微金黄，再放入葱段、姜片和蒜片炒香。',
      },
      {
        title: '倒入碗汁收浓',
        description:
          '把碗汁再次搅匀后沿锅边倒入，转大火快速翻炒，让酱汁均匀裹住鸡丁，收到微微挂勺即可关火。',
        tip: '收汁时动作要快，淀粉容易沉底，倒之前记得再搅一下。',
      },
      {
        title: '最后放花生',
        description: '关火后倒入熟花生米，翻拌两下立刻装盘，这样花生才能保持酥脆。',
      },
    ],
    difficulty: '中等',
    cookingTime: 25,
    servings: '2 人份',
    price: 26,
    source: SOURCE,
    tags: ['下饭', '酸甜微辣', '快手菜', '鸡肉'],
    popularity: 96,
    featured: true,
  },
  {
    id: 'dish_002',
    name: '麻婆豆腐',
    category: '川菜',
    coverImage: './images/recipes/dish_002.jpg',
    description:
      '嫩豆腐在红亮的汤汁里轻轻晃动，麻辣鲜香全都渗进去。一勺浇在热米饭上，就是最踏实的满足。',
    ingredients: [
      { name: '嫩豆腐', amount: '400g' },
      { name: '牛肉末', amount: '80g' },
      { name: '郫县豆瓣酱', amount: '1.5 汤匙' },
      { name: '豆豉', amount: '1 小勺' },
      { name: '蒜苗', amount: '2 根' },
      { name: '姜末', amount: '1 小勺' },
      { name: '蒜末', amount: '1 小勺' },
      { name: '花椒粉', amount: '1 小勺' },
      { name: '生抽', amount: '1 汤匙' },
      { name: '淀粉', amount: '1 汤匙' },
      { name: '清水', amount: '200ml' },
      { name: '食用油', amount: '2 汤匙' },
    ],
    steps: [
      {
        title: '处理豆腐',
        description:
          '豆腐切成 2cm 见方的小块，放入加了少许盐的温水中浸泡 5 分钟，捞出沥干。',
        tip: '温水加盐能让豆腐更紧实，煮的时候不容易碎。',
      },
      {
        title: '炒香肉末',
        description: '锅中放油，中火把牛肉末炒散，炒到水分收干、肉末微微酥香。',
      },
      {
        title: '炒出红油',
        description:
          '转小火，加入豆瓣酱、豆豉、姜末和蒜末，慢慢炒出红油和香味，约 1 分钟。',
        tip: '豆瓣酱一定要小火炒，火大了容易发苦。',
      },
      {
        title: '煮豆腐',
        description:
          '倒入清水和生抽煮开，轻轻放入豆腐，转中小火煮 5 分钟，期间用锅铲背轻推，不要大力翻炒。',
      },
      {
        title: '淀粉水分两次勾芡',
        description:
          '淀粉加两汤匙清水调匀，分两次淋入锅中，每次都等汤汁重新沸腾再加下一次，汤汁会均匀地挂在豆腐上。',
        tip: '分次勾芡是麻婆豆腐汤汁浓而不糊的关键。',
      },
      {
        title: '出锅撒花椒',
        description:
          '放入蒜苗段煮 30 秒，盛入碗中，最后撒上花椒粉。趁热吃，麻香最足。',
      },
    ],
    difficulty: '简单',
    cookingTime: 20,
    servings: '2 人份',
    price: 15,
    source: SOURCE,
    tags: ['麻辣', '下饭', '豆腐', '一锅出'],
    popularity: 92,
    featured: true,
  },
  {
    id: 'dish_003',
    name: '水煮牛肉',
    category: '川菜',
    coverImage: './images/recipes/dish_003.jpg',
    description:
      '牛肉片嫩得能在筷子上打滑，底下垫着吸满汤汁的豆芽和莴笋。最后那勺热油泼下去，香味会先一步跑进房间。',
    ingredients: [
      { name: '牛里脊', amount: '300g' },
      { name: '黄豆芽', amount: '200g' },
      { name: '莴笋', amount: '半根' },
      { name: '干辣椒', amount: '10 个' },
      { name: '花椒', amount: '1 汤匙' },
      { name: '郫县豆瓣酱', amount: '2 汤匙' },
      { name: '姜末', amount: '1 汤匙' },
      { name: '蒜末', amount: '1 汤匙' },
      { name: '蛋清', amount: '1 个' },
      { name: '淀粉', amount: '1 汤匙' },
      { name: '料酒', amount: '1 汤匙' },
      { name: '生抽', amount: '1 汤匙' },
      { name: '小葱', amount: '2 根' },
      { name: '白芝麻', amount: '1 小勺' },
      { name: '食用油', amount: '4 汤匙' },
      { name: '清水', amount: '600ml' },
    ],
    steps: [
      {
        title: '逆纹切牛肉',
        description:
          '牛里脊提前冷冻 20 分钟更好切。逆着纹理切成薄片，加入蛋清、料酒、生抽和淀粉抓匀，再加半汤匙油拌匀，腌 15 分钟。',
        tip: '逆纹切断肌肉纤维，是牛肉嫩滑的第一步。',
      },
      {
        title: '炒底料',
        description:
          '锅中放 1 汤匙油，小火炒香豆瓣酱、姜末和一半蒜末，炒出红油后倒入清水煮开。',
      },
      {
        title: '烫蔬菜',
        description:
          '豆芽洗净，莴笋切薄片。把蔬菜放入汤中烫熟，捞出铺在大碗底部。',
        tip: '蔬菜不要煮太久，保持一点脆感更好吃。',
      },
      {
        title: '滑熟牛肉',
        description:
          '汤保持微沸，把牛肉片一片片分散下锅，不要立刻搅动。等肉片定型变白后轻轻推散，煮约 40 秒连汤倒入碗中。',
        tip: '牛肉切得薄，煮到刚变色就够，久煮会老。',
      },
      {
        title: '铺香料',
        description:
          '在牛肉表面铺上剩余蒜末、干辣椒段、花椒、白芝麻和葱花。',
      },
      {
        title: '泼热油',
        description:
          '另起锅把 3 汤匙油烧到微微冒烟，均匀泼在香料上，听到“滋啦”一声就完成了。',
        tip: '泼油时人稍微退后一点，避免热油溅到手上。',
      },
    ],
    difficulty: '较难',
    cookingTime: 40,
    servings: '2 人份',
    price: 42,
    source: SOURCE,
    tags: ['麻辣', '牛肉', '宴客菜', '重口味'],
    popularity: 88,
  },
];
