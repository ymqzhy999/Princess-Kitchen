import type { CookingStep, Difficulty, Ingredient, RecipeCategory } from './recipe';

/** 文本模型供应商：DeepSeek 官方 / Agnes（OpenAI 兼容） */
export type AiTextProvider = 'deepseek' | 'agnes';

export interface AiSettings {
  textProvider: AiTextProvider;
  textApiKey: string;
  textModel: string;
  imageApiKey: string;
  imageModel: string;
  /** 生图接口地址，默认 Agnes 官方网关；可改成自己的中转 */
  imageBaseUrl: string;
}

export const DEFAULT_AI_SETTINGS: AiSettings = {
  textProvider: 'deepseek',
  textApiKey: '',
  textModel: '',
  imageApiKey: '',
  imageModel: 'agnes-image-2.1-flash',
  imageBaseUrl: 'https://apihub.agnes-ai.com',
};

/** AI 生成的菜谱草稿：保存前给用户确认，字段与 Recipe 对齐 */
export interface RecipeDraft {
  name: string;
  category: RecipeCategory;
  description: string;
  ingredients: Ingredient[];
  steps: CookingStep[];
  difficulty: Difficulty;
  cookingTime: number;
  servings: string;
  price: number;
  tags: string[];
  tips: string[];
  /** 喂给生图模型的英文画面描述，保证配图和菜名对得上 */
  imagePrompt: string;
}

export type AiTaskStatus = 'idle' | 'text' | 'image' | 'done' | 'error';
