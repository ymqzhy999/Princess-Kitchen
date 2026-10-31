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

const RECIPE_MAP = new Map(RECIPES.map((recipe) => [recipe.id, recipe]));

export function getRecipeById(id: string | undefined): Recipe | undefined {
  if (!id) return undefined;
  return RECIPE_MAP.get(id);
}

export function getRecipesByCategory(category: RecipeCategory): Recipe[] {
  return RECIPES.filter((recipe) => recipe.category === category);
}

export function getFeaturedRecipes(): Recipe[] {
  const featured = RECIPES.filter((recipe) => recipe.featured);
  return featured.length > 0 ? featured : RECIPES;
}

/** Deterministic pick so the same day always shows the same recommendation. */
export function getTodayRecommendation(date = new Date()): Recipe {
  const pool = getFeaturedRecipes();
  return pool[dayOfYear(date) % pool.length];
}

export function getPopularRecipes(limit = 5, excludeId?: string): Recipe[] {
  return [...RECIPES]
    .filter((recipe) => recipe.id !== excludeId && Boolean(recipe.coverImage))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export function searchRecipes(query: string): Recipe[] {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return RECIPES;

  return RECIPES.filter((recipe) => {
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
  return RECIPES.reduce(
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
  return RECIPES.find((recipe) => recipe.name === trimmed);
}
