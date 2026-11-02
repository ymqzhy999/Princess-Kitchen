import { afterEach, describe, expect, it } from 'vitest';
import { TEXT_MODELS, extractJson, isKnownModel, normalizeDraft, normalizeKey, resolveImageKey } from '../lib/ai';
import {
  getAllRecipes,
  getRecipeById,
  searchRecipes,
  setRuntimeCustomRecipes,
} from '../data/recipes';
import { parseAiSettings, parseCustomRecipes } from '../store/validation';
import type { Recipe } from '../types';

const draftFixture = {
  name: '番茄牛腩煲',
  category: '家常菜',
  description: '汤浓肉烂，番茄的酸甜全炖进牛腩里，配一碗白饭刚刚好。',
  difficulty: '中等',
  cookingTime: 90,
  servings: '2 人份',
  price: 48,
  ingredients: [
    { name: '牛腩', amount: '500g' },
    { name: '番茄', amount: '3 个' },
    { name: '洋葱', amount: '半个' },
  ],
  steps: [
    { title: '牛腩焯水', description: '冷水下锅，加姜片煮开撇沫，捞出冲净。' },
    { title: '炒番茄', description: '番茄切块炒出沙，加热水煮开。' },
    { title: '小火慢炖', description: '放入牛腩，小火炖 70 分钟至软烂。' },
  ],
  tags: ['家常', '下饭'],
  tips: ['番茄先去皮口感更好'],
  imagePrompt: 'braised beef brisket with tomatoes in a clay pot',
};

const customRecipe: Recipe = {
  id: 'custom_test1',
  name: '番茄牛腩煲',
  category: '家常菜',
  coverImage: '',
  description: '测试用的自定义菜谱。',
  ingredients: [{ name: '牛腩', amount: '500g' }],
  steps: [{ title: '炖', description: '小火炖到软烂。' }],
  difficulty: '中等',
  cookingTime: 90,
  servings: '2 人份',
  price: 48,
  source: 'AI 生成',
  tags: ['家常'],
  popularity: 50,
  custom: true,
  createdAt: '2026-11-02T00:00:00.000Z',
};

afterEach(() => {
  setRuntimeCustomRecipes([]);
});

describe('AI 菜谱草稿', () => {
  it('能从带代码块的返回里抠出 JSON', () => {
    const text = '好的，给你：\n```json\n{"name":"番茄牛腩煲"}\n```\n祝好';
    expect(extractJson(text)).toEqual({ name: '番茄牛腩煲' });
  });

  it('把模型返回整理成可靠的草稿', () => {
    const draft = normalizeDraft({
      ...draftFixture,
      category: '不存在的分类',
      difficulty: '超难',
      cookingTime: 9999,
      price: -5,
      tags: ['家常', '', '下饭', '快手', 'x', 'y', 'z'],
    });
    expect(draft.category).toBe('其他');
    expect(draft.difficulty).toBe('简单');
    expect(draft.cookingTime).toBe(600);
    expect(draft.price).toBe(1);
    expect(draft.tags.length).toBeLessThanOrEqual(5);
    expect(draft.ingredients).toHaveLength(3);
    expect(draft.steps).toHaveLength(3);
  });

  it('缺菜名时直接报错', () => {
    expect(() => normalizeDraft({ description: '没有名字' })).toThrowError();
  });
});

describe('AI 设置与自定义菜谱存储', () => {
  it('设置解析有兜底', () => {
    expect(parseAiSettings(null).textProvider).toBe('deepseek');
    expect(parseAiSettings({ textProvider: 'agnes', textApiKey: 'sk-1' }).textProvider).toBe('agnes');
    expect(parseAiSettings({ imageModel: '' }).imageModel).toBe('agnes-image-2.1-flash');
    expect(parseAiSettings({ imageBaseUrl: 'https://my-proxy.com//' }).imageBaseUrl).toBe(
      'https://my-proxy.com',
    );
  });

  it('丢弃形状不对的自定义菜谱', () => {
    const parsed = parseCustomRecipes([
      customRecipe,
      { id: 'custom_x', name: '' },
      { id: 'dish_001', name: '白切鸡', category: '粤菜' },
    ]);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe('custom_test1');
    expect(parsed[0].custom).toBe(true);
  });

  it('自定义菜谱会并入全量查询', () => {
    expect(getAllRecipes()).toHaveLength(54);
    setRuntimeCustomRecipes([customRecipe]);
    expect(getAllRecipes()).toHaveLength(55);
    expect(getRecipeById('custom_test1')?.name).toBe('番茄牛腩煲');
    expect(searchRecipes('牛腩').map((recipe) => recipe.name)).toContain('番茄牛腩煲');
  });
});

describe('生图 Key 的取用规则', () => {
  const base = parseAiSettings(null);

  it('去掉粘贴带进来的空格和换行', () => {
    expect(normalizeKey(' sk-abc\n ')).toBe('sk-abc');
  });

  it('生图 Key 优先', () => {
    const settings = { ...base, imageApiKey: 'sk-image', textApiKey: 'sk-text' };
    expect(resolveImageKey(settings)).toEqual({ key: 'sk-image', from: 'image' });
  });

  it('文本用 DeepSeek 时不复用它的 Key（否则 Agnes 会 401）', () => {
    const settings = { ...base, textProvider: 'deepseek' as const, textApiKey: 'sk-deepseek' };
    expect(resolveImageKey(settings)).toEqual({ key: '', from: 'none' });
  });

  it('文本也用 Agnes 时才复用文本 Key', () => {
    const settings = { ...base, textProvider: 'agnes' as const, textApiKey: 'sk-agnes' };
    expect(resolveImageKey(settings)).toEqual({ key: 'sk-agnes', from: 'text' });
  });
});

describe('文本模型名', () => {
  it('只接受服务商真实存在的模型', () => {
    expect(isKnownModel('deepseek', 'deepseek-chat')).toBe(true);
    expect(isKnownModel('deepseek', 'deepseek-flash')).toBe(false);
    expect(isKnownModel('agnes', 'agnes-2.5-flash')).toBe(true);
    expect(isKnownModel('agnes', 'deepseek-chat')).toBe(false);
  });

  it('每个服务商都有默认模型', () => {
    expect(TEXT_MODELS.deepseek).toContain('deepseek-chat');
    expect(TEXT_MODELS.agnes.length).toBeGreaterThan(0);
  });
});
