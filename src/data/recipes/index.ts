import type { Recipe, RecipeCategory } from '../../types';
import { dayOfYear } from '../../lib/format';
import { cantoneseRecipes } from './cantonese';
import { comfortRecipes } from './comfort';
import { hunanHomeRecipes } from './hunan-home';
import { sichuanRecipes } from './sichuan';
import { sweetRecipes } from './sweet';
import { importedHomeRecipes } from './imported-home';
import { importedSichuanRecipes } from './imported-sichuan';
import { importedCantoneseBbqRecipes } from './imported-cantonese-bbq';
import { importedBreakfastRecipes } from './imported-breakfast';

/**
 * The single source of truth for recipe content.
 *
 * Two sources coexist here:
 * - the original 20 recipes written for this project;
 * - 34 recipes imported from HowToCook (Unlicense) in phase two, each keeping
 *   its own `sourceUrl`. The DOCX collection contained 39 dishes; five of them
 *   already existed in the catalog and are not duplicated.
 *
 * The data shape stays close to HowToCook's Markdown sections (ingredients /
 * amounts / ordered steps) so future imports only touch this folder.
 */
export const RECIPES: Recipe[] = [
  ...sichuanRecipes,
  ...cantoneseRecipes,
  ...hunanHomeRecipes,
  ...comfortRecipes,
  ...sweetRecipes,
  ...importedHomeRecipes,
  ...importedSichuanRecipes,
  ...importedCantoneseBbqRecipes,
  ...importedBreakfastRecipes,
];

const BASE_MAP = new Map(RECIPES.map((recipe) => [recipe.id, recipe]));

/* ------------------------------------------------------------------ */
/* 用户用 AI 生成并保存的自定义菜谱（只在本机）                         */
/* ------------------------------------------------------------------ */

let runtimeCustom: Recipe[] = [];

/** 由 AppStore 在启动/变更时调用，页面里的查询函数会自动带上自定义菜谱 */
export function setRuntimeCustomRecipes(list: Recipe[]): void {
  runtimeCustom = list;
}

export function getCustomRecipes(): Recipe[] {
  return runtimeCustom;
}

/** 全量菜谱：自定义在前，静态在后 */
export function getAllRecipes(): Recipe[] {
  return runtimeCustom.length ? [...runtimeCustom, ...RECIPES] : RECIPES;
}

export function getRecipeById(id: string | undefined): Recipe | undefined {
  if (!id) return undefined;
  return runtimeCustom.find((recipe) => recipe.id === id) ?? BASE_MAP.get(id);
}

export function getRecipesByCategory(category: RecipeCategory): Recipe[] {
  return getAllRecipes().filter((recipe) => recipe.category === category);
}

export function getFeaturedRecipes(): Recipe[] {
  const pool = getAllRecipes();
  const featured = pool.filter((recipe) => recipe.featured);
  return featured.length > 0 ? featured : pool;
}

/** Deterministic pick so the same day always shows the same recommendation. */
export function getTodayRecommendation(date = new Date()): Recipe {
  const pool = getFeaturedRecipes();
  return pool[dayOfYear(date) % pool.length];
}

export function getPopularRecipes(limit = 5, excludeId?: string): Recipe[] {
  return [...getAllRecipes()]
    .filter((recipe) => recipe.id !== excludeId && Boolean(recipe.coverImage))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export function searchRecipes(query: string): Recipe[] {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return getAllRecipes();

  return getAllRecipes().filter((recipe) => {
    const haystack = [
      recipe.name,
      recipe.category,
      recipe.description,
      ...recipe.tags,
      ...recipe.ingredients.map((ingredient) => ingredient.name),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(keyword);
  });
}

export function countByCategory(): Record<RecipeCategory, number> {
  return getAllRecipes().reduce(
    (counts, recipe) => {
      counts[recipe.category] += 1;
      return counts;
    },
    {
      家常菜: 0,
      川菜: 0,
      粤菜: 0,
      湘菜: 0,
      火锅: 0,
      烧烤: 0,
      早餐: 0,
      主食: 0,
      甜品: 0,
      饮品: 0,
      西餐: 0,
      日料: 0,
      其他: 0,
    } satisfies Record<RecipeCategory, number>,
  );
}

export function findRecipeByName(name: string): Recipe | undefined {
  const trimmed = name.trim();
  if (!trimmed) return undefined;
  return getAllRecipes().find((recipe) => recipe.name === trimmed);
}
