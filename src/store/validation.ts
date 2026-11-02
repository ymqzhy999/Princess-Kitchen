import {
  DEFAULT_AI_SETTINGS,
  DEFAULT_SETTINGS,
  DIFFICULTIES,
  RECIPE_CATEGORIES,
  EMPTY_ORDER,
  MAX_ORDER_QUANTITY,
  THEME_OPTIONS,
  type DiaryDraft,
  type DiaryEntry,
  type FavoriteRecord,
  type OrderState,
  type AiSettings,
  type Recipe,
  type RecipeImageMap,
  type Settings,
} from '../types';
import { createId } from '../lib/format';

/* ------------------------------------------------------------------ */
/* Validators: localStorage is user-editable, never trust its shape.   */
/* ------------------------------------------------------------------ */

export function parseSettings(raw: unknown): Settings {
  if (!raw || typeof raw !== 'object') return DEFAULT_SETTINGS;
  const value = raw as Partial<Settings>;
  const nickname =
    typeof value.nickname === 'string' && value.nickname.trim()
      ? value.nickname.trim().slice(0, 16)
      : DEFAULT_SETTINGS.nickname;
  const avatar =
    typeof value.avatar === 'string' && value.avatar ? value.avatar : DEFAULT_SETTINGS.avatar;
  const theme = THEME_OPTIONS.some((option) => option.id === value.theme)
    ? (value.theme as Settings['theme'])
    : DEFAULT_SETTINGS.theme;

  return { nickname, avatar, theme };
}

export function parseFavorites(raw: unknown): FavoriteRecord[] {
  if (!Array.isArray(raw)) return [];

  const seen = new Set<string>();
  const records: FavoriteRecord[] = [];

  raw.forEach((item) => {
    if (!item || typeof item !== 'object') return;
    const value = item as Partial<FavoriteRecord>;
    if (typeof value.recipeId !== 'string' || seen.has(value.recipeId)) return;
    seen.add(value.recipeId);
    records.push({
      recipeId: value.recipeId,
      wantToTry: value.wantToTry !== false,
      cooked: value.cooked === true,
      savedAt: typeof value.savedAt === 'string' ? value.savedAt : new Date().toISOString(),
    });
  });

  return records;
}

export function parseOrder(raw: unknown): OrderState {
  if (!raw || typeof raw !== 'object') return EMPTY_ORDER;
  const value = raw as Partial<OrderState>;
  const seen = new Set<string>();
  const items = Array.isArray(value.items)
    ? value.items.flatMap((item) => {
        if (!item || typeof item !== 'object') return [];
        const entry = item as { recipeId?: unknown; quantity?: unknown; selected?: unknown };
        if (typeof entry.recipeId !== 'string' || seen.has(entry.recipeId)) return [];
        seen.add(entry.recipeId);
        const quantity = Math.min(
          MAX_ORDER_QUANTITY,
          Math.max(1, Math.round(Number(entry.quantity) || 1)),
        );
        return [{ recipeId: entry.recipeId, quantity, selected: entry.selected !== false }];
      })
    : [];

  return {
    items,
    note: typeof value.note === 'string' ? value.note.slice(0, 300) : '',
    confirmedAt: typeof value.confirmedAt === 'string' ? value.confirmedAt : null,
  };
}

export function parseDiary(raw: unknown): DiaryEntry[] {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const value = item as Partial<DiaryEntry>;
    if (typeof value.id !== 'string' || typeof value.dishName !== 'string') return [];

    return [
      {
        id: value.id,
        date: typeof value.date === 'string' ? value.date : new Date().toISOString().slice(0, 10),
        dishName: value.dishName,
        recipeId: typeof value.recipeId === 'string' ? value.recipeId : undefined,
        photo: typeof value.photo === 'string' && value.photo ? value.photo : undefined,
        content: typeof value.content === 'string' ? value.content : '',
        rating: Math.min(5, Math.max(1, Math.round(Number(value.rating) || 5))),
        createdAt:
          typeof value.createdAt === 'string' ? value.createdAt : new Date().toISOString(),
        updatedAt:
          typeof value.updatedAt === 'string' ? value.updatedAt : new Date().toISOString(),
      },
    ];
  });
}

/* ------------------------------------------------------------------ */
/* Factories                                                           */
/* ------------------------------------------------------------------ */

export function createFavorite(recipeId: string): FavoriteRecord {
  return {
    recipeId,
    wantToTry: true,
    cooked: false,
    savedAt: new Date().toISOString(),
  };
}

export function createDiaryEntry(draft: DiaryDraft): DiaryEntry {
  const now = new Date().toISOString();
  return {
    ...draft,
    id: createId('diary'),
    date: draft.date,
    dishName: draft.dishName.trim(),
    content: draft.content.trim(),
    rating: Math.min(5, Math.max(1, Math.round(draft.rating))),
    createdAt: now,
    updatedAt: now,
  };
}

export function applyDiaryDraft(entry: DiaryEntry, draft: DiaryDraft): DiaryEntry {
  return {
    ...entry,
    ...draft,
    dishName: draft.dishName.trim(),
    content: draft.content.trim(),
    rating: Math.min(5, Math.max(1, Math.round(draft.rating))),
    updatedAt: new Date().toISOString(),
  };
}


export function parseRecipeImages(raw: unknown): RecipeImageMap {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};

  const images: RecipeImageMap = {};
  Object.entries(raw as Record<string, unknown>).forEach(([recipeId, value]) => {
    if (!/^dish_\d{3}$/.test(recipeId)) return;
    if (typeof value !== 'string' || !value.startsWith('data:image/')) return;
    if (value.startsWith('data:image/svg')) return;
    // A safety cap; uploaded images are compressed to around 100-300 KB.
    if (value.length > 2_000_000) return;
    images[recipeId] = value;
  });
  return images;
}

/* ------------------------------------------------------------------ */
/* AI：自定义菜谱与 AI 设置                                            */
/* ------------------------------------------------------------------ */

const asText = (value: unknown, max: number): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const asInt = (value: unknown, min: number, max: number, fallback: number): number => {
  const num = typeof value === 'number' ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, Math.round(num)));
};

function parseRecipe(raw: unknown): Recipe | null {
  if (!raw || typeof raw !== 'object') return null;
  const value = raw as Record<string, unknown>;
  const id = asText(value.id, 64);
  const name = asText(value.name, 40);
  if (!id.startsWith('custom_') || !name) return null;
  if (!(RECIPE_CATEGORIES as readonly string[]).includes(String(value.category))) return null;

  const ingredients = (Array.isArray(value.ingredients) ? value.ingredients : [])
    .map((item) => {
      const record = (item ?? {}) as Record<string, unknown>;
      const name = asText(record.name, 40);
      const amount = asText(record.amount, 40);
      return name && amount ? { name, amount } : null;
    })
    .filter((item): item is { name: string; amount: string } => Boolean(item));

  const steps = (Array.isArray(value.steps) ? value.steps : [])
    .map((item) => {
      const record = (item ?? {}) as Record<string, unknown>;
      const title = asText(record.title, 60);
      const description = asText(record.description, 800);
      if (!title || !description) return null;
      const tip = asText(record.tip, 300);
      return tip ? { title, description, tip } : { title, description };
    })
    .filter((item): item is { title: string; description: string; tip?: string } => Boolean(item));

  if (!ingredients.length || !steps.length) return null;

  const difficulty = (DIFFICULTIES as readonly string[]).includes(String(value.difficulty))
    ? (value.difficulty as Recipe['difficulty'])
    : '简单';

  return {
    id,
    name,
    category: value.category as Recipe['category'],
    coverImage: '',
    description: asText(value.description, 300),
    ingredients,
    steps,
    difficulty,
    cookingTime: asInt(value.cookingTime, 5, 600, 30),
    servings: asText(value.servings, 20) || '2 人份',
    price: asInt(value.price, 1, 999, 40),
    source: asText(value.source, 120) || 'AI 生成（未核对）',
    tags: (Array.isArray(value.tags) ? value.tags : [])
      .map((tag) => asText(tag, 20))
      .filter(Boolean)
      .slice(0, 6),
    popularity: asInt(value.popularity, 0, 100, 50),
    custom: true,
    createdAt: asText(value.createdAt, 40) || new Date().toISOString(),
  };
}

export function parseCustomRecipes(raw: unknown): Recipe[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseRecipe).filter((recipe): recipe is Recipe => Boolean(recipe));
}

export function parseAiSettings(raw: unknown): AiSettings {
  if (!raw || typeof raw !== 'object') return DEFAULT_AI_SETTINGS;
  const value = raw as Partial<AiSettings>;
  const provider = value.textProvider === 'agnes' ? 'agnes' : 'deepseek';
  return {
    textProvider: provider,
    textApiKey: asText(value.textApiKey, 200),
    textModel: asText(value.textModel, 60),
    imageApiKey: asText(value.imageApiKey, 200),
    imageModel: asText(value.imageModel, 60) || DEFAULT_AI_SETTINGS.imageModel,
  };
}
