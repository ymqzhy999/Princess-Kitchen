export type ThemeName = 'strawberry' | 'cream' | 'lilac';

export interface ThemeOption {
  id: ThemeName;
  name: string;
  description: string;
  swatch: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'strawberry',
    name: '草莓粉',
    description: '甜甜的草莓奶油',
    swatch: 'linear-gradient(135deg, #ffd3e1 0%, #f9739b 100%)',
  },
  {
    id: 'cream',
    name: '奶油白',
    description: '温柔的焦糖奶油',
    swatch: 'linear-gradient(135deg, #fff3dd 0%, #dfa26f 100%)',
  },
  {
    id: 'lilac',
    name: '薰衣草',
    description: '安静的淡紫梦境',
    swatch: 'linear-gradient(135deg, #eadfff 0%, #9873d3 100%)',
  },
];

export interface Settings {
  nickname: string;
  /** Either a preset emoji (`👑`) or a compressed `data:image/...` URL. */
  avatar: string;
  theme: ThemeName;
}

export const DEFAULT_SETTINGS: Settings = {
  nickname: '小公主',
  avatar: '👑',
  theme: 'strawberry',
};

export const AVATAR_PRESETS = ['👑', '🎀', '🍓', '🐰', '🌸', '🍰', '🫧', '🧸'];

export interface FavoriteRecord {
  recipeId: string;
  /** 想吃的菜 */
  wantToTry: boolean;
  /** 已经做过的菜 */
  cooked: boolean;
  savedAt: string;
}

export interface OrderItem {
  recipeId: string;
  quantity: number;
  /** Only selected dishes are counted in the total / submitted. */
  selected: boolean;
}

export interface OrderState {
  items: OrderItem[];
  note: string;
  /** ISO timestamp of the last confirmation, null when never confirmed. */
  confirmedAt: string | null;
}

export const EMPTY_ORDER: OrderState = {
  items: [],
  note: '',
  confirmedAt: null,
};

export const MAX_ORDER_QUANTITY = 20;

export interface DiaryEntry {
  id: string;
  /** `YYYY-MM-DD` */
  date: string;
  dishName: string;
  recipeId?: string;
  /** Compressed data URL, optional. */
  photo?: string;
  content: string;
  /** 1 - 5 */
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryDraft {
  date: string;
  dishName: string;
  recipeId?: string;
  photo?: string;
  content: string;
  rating: number;
}

/** Locally stored, user-picked image per recipe (`data:image/...`). */
export type RecipeImageMap = Record<string, string>;
