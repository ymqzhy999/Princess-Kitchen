import type { RecipeCategory } from '../types';

export interface CategoryMeta {
  name: RecipeCategory;
  emoji: string;
  hint: string;
  /** Pastel tint used for the category tile. */
  tint: string;
}

/**
 * Order matters: this is also the order of the filter chips on the recipes
 * page and the category shortcuts on the home page.
 */
export const CATEGORIES: CategoryMeta[] = [
  { name: '家常菜', emoji: '🏡', hint: '每天都想吃的味道', tint: '#ffe4ec' },
  { name: '川菜', emoji: '🌶️', hint: '麻辣鲜香超过瘾', tint: '#ffe0d6' },
  { name: '粤菜', emoji: '🦐', hint: '清淡鲜甜有讲究', tint: '#e2f3ff' },
  { name: '湘菜', emoji: '🫑', hint: '香辣下饭第一名', tint: '#e6f5dc' },
  { name: '火锅', emoji: '🍲', hint: '两个人也要热热闹闹', tint: '#ffe3d3' },
  { name: '烧烤', emoji: '🍢', hint: '夜宵摊的快乐', tint: '#ffe8cf' },
  { name: '早餐', emoji: '🍳', hint: '慢慢醒来的早晨', tint: '#fff2cf' },
  { name: '主食', emoji: '🍜', hint: '一碗就满足', tint: '#f3e8d5' },
  { name: '甜品', emoji: '🍰', hint: '给生活加一点糖', tint: '#ffe1ee' },
  { name: '饮品', emoji: '🧋', hint: '在杯子里装下夏天', tint: '#e8f0ff' },
  { name: '西餐', emoji: '🍝', hint: '在家也要有仪式感', tint: '#f0e6dc' },
  { name: '日料', emoji: '🍣', hint: '清爽又治愈', tint: '#e6f4ef' },
  { name: '其他', emoji: '🍽️', hint: '不期而遇的小惊喜', tint: '#f3ede7' },
];

export const CATEGORY_NAMES = CATEGORIES.map((category) => category.name);

export function getCategoryMeta(name: RecipeCategory): CategoryMeta {
  return CATEGORIES.find((category) => category.name === name) ?? CATEGORIES[0];
}
