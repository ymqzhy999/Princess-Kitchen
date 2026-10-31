export const RECIPE_CATEGORIES = [
  '家常菜',
  '川菜',
  '粤菜',
  '湘菜',
  '火锅',
  '烧烤',
  '早餐',
  '主食',
  '甜品',
  '饮品',
  '西餐',
  '日料',
  '其他',
] as const;

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];

export const DIFFICULTIES = ['简单', '中等', '较难'] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

/** A single ingredient line, e.g. { name: '鸡腿肉', amount: '300g' }. */
export interface Ingredient {
  name: string;
  amount: string;
  /** Optional ingredients can be skipped without ruining the dish. */
  optional?: boolean;
}

/** One cooking step. Kept short so it stays readable on a phone screen. */
export interface CookingStep {
  title: string;
  description: string;
  tip?: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: RecipeCategory;
  /** Relative path such as `./images/recipes/dish_001.jpg`; safe to swap later. */
  coverImage: string;
  description: string;
  ingredients: Ingredient[];
  steps: CookingStep[];
  difficulty: Difficulty;
  /** Total cooking time in minutes. */
  cookingTime: number;
  /** Reference serving size, e.g. `2 人份`. */
  servings: string;
  /** Reference ingredient cost in CNY, used by the order total (no real payment). */
  price: number;
  /** Honest provenance note. Never invent a URL or author. */
  source: string;
  /** Link to the original recipe when the content was imported. */
  sourceUrl?: string;
  /** Optional recipe-level tips shown after the steps. */
  tips?: string[];
  tags: string[];
  /** 0 - 100, drives the "今日热门" list. */
  popularity: number;
  /** Shown in the home page hero rotation. */
  featured?: boolean;
}
