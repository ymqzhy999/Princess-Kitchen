import { describe, expect, it } from 'vitest';
import { RECIPE_CATEGORIES } from '../types';
import {
  RECIPES,
  countByCategory,
  getPopularRecipes,
  getRecipeById,
  getTodayRecommendation,
  searchRecipes,
} from '../data/recipes';

describe('菜谱数据', () => {
  it('包含 54 道完整菜谱且 id 唯一', () => {
    expect(RECIPES).toHaveLength(54);
    expect(new Set(RECIPES.map((recipe) => recipe.id)).size).toBe(54);
  });

  it('每道菜都有完整的食材和步骤', () => {
    RECIPES.forEach((recipe) => {
      expect(recipe.name.length).toBeGreaterThan(0);
      expect(RECIPE_CATEGORIES).toContain(recipe.category);
      if (recipe.coverImage) {
        expect(recipe.coverImage.startsWith('./images/recipes/')).toBe(true);
        expect(recipe.coverImage.endsWith('.svg')).toBe(false);
      }
      expect(recipe.description.length).toBeGreaterThan(10);
      expect(recipe.ingredients.length).toBeGreaterThanOrEqual(3);
      expect(recipe.steps.length).toBeGreaterThanOrEqual(3);
      expect(recipe.cookingTime).toBeGreaterThan(0);
      expect(recipe.price).toBeGreaterThan(0);
      expect(recipe.source.length).toBeGreaterThan(0);
      expect(recipe.tags.length).toBeGreaterThan(0);
      if (recipe.tips) expect(Array.isArray(recipe.tips)).toBe(true);
      if (recipe.sourceUrl) expect(recipe.sourceUrl.startsWith('https://github.com/')).toBe(true);

      recipe.ingredients.forEach((ingredient) => {
        expect(ingredient.name.length).toBeGreaterThan(0);
        expect(ingredient.amount.length).toBeGreaterThan(0);
      });

      recipe.steps.forEach((step) => {
        expect(step.title.length).toBeGreaterThan(0);
        expect(step.description.length).toBeGreaterThan(5);
      });
    });
  });

  it('支持按 id、分类、搜索和热度查询', () => {
    expect(getRecipeById('dish_001')?.name).toBe('宫保鸡丁');
    expect(getRecipeById('not-exist')).toBeUndefined();
    const counts = countByCategory();
    expect(counts.川菜).toBe(10);
    expect(counts.其他).toBe(1);
    Object.values(counts).forEach((count) => expect(count).toBeGreaterThan(0));
    expect(RECIPES.filter((recipe) => recipe.sourceUrl)).toHaveLength(34);
    expect(searchRecipes('芒果').map((recipe) => recipe.name)).toContain('杨枝甘露');
    expect(searchRecipes('鸡翅').map((recipe) => recipe.name)).toContain('蒜香烤鸡翅');
    expect(searchRecipes('不存在的菜')).toHaveLength(0);

    const popular = getPopularRecipes(3);
    expect(popular).toHaveLength(3);
    expect(popular[0].popularity).toBeGreaterThanOrEqual(popular[1].popularity);
    popular.forEach((recipe) => expect(recipe.coverImage.length).toBeGreaterThan(0));
  });

  it('每日推荐是稳定且存在的菜谱', () => {
    const first = getTodayRecommendation(new Date('2026-01-01T12:00:00'));
    const second = getTodayRecommendation(new Date('2026-01-01T20:00:00'));
    expect(first.id).toBe(second.id);
    expect(RECIPES.some((recipe) => recipe.id === first.id)).toBe(true);
    expect(first.coverImage.length).toBeGreaterThan(0);
  });
});
