import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_AI_SETTINGS,
  DEFAULT_SETTINGS,
  EMPTY_ORDER,
  MAX_ORDER_QUANTITY,
  type DiaryDraft,
  type DiaryEntry,
  type FavoriteRecord,
  type OrderState,
  type AiSettings,
  type Recipe,
  type RecipeImageMap,
  type Settings,
} from '../types';
import { setRuntimeCustomRecipes } from '../data/recipes';
import { clearAllAppData, getAppStorageSize, STORAGE_KEYS } from '../lib/storage';
import {
  clearRecipeImages,
  deleteRecipeImage,
  loadRecipeImages,
  saveRecipeImage,
} from '../lib/recipeImageDb';
import { usePersistentState } from '../hooks/usePersistentState';
import {
  applyDiaryDraft,
  createDiaryEntry,
  createFavorite,
  parseAiSettings,
  parseCustomRecipes,
  parseDiary,
  parseFavorites,
  parseOrder,
  parseSettings,
} from './validation';

interface AppStoreValue {
  settings: Settings;
  favorites: FavoriteRecord[];
  order: OrderState;
  diary: DiaryEntry[];
  recipeImages: RecipeImageMap;
  /** AI 生成并保存的自定义菜谱（只在本机） */
  customRecipes: Recipe[];
  aiSettings: AiSettings;
  storageSize: number;
  addCustomRecipe: (recipe: Recipe) => void;
  deleteCustomRecipe: (recipeId: string) => void;
  updateAiSettings: (patch: Partial<AiSettings>) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  isFavorite: (recipeId: string) => boolean;
  getFavorite: (recipeId: string) => FavoriteRecord | undefined;
  toggleFavorite: (recipeId: string) => boolean;
  setCooked: (recipeId: string, cooked: boolean) => void;
  addOrderItem: (recipeId: string) => void;
  removeOrderItem: (recipeId: string) => void;
  setOrderQuantity: (recipeId: string, quantity: number) => void;
  toggleOrderItem: (recipeId: string) => void;
  setAllOrderSelected: (selected: boolean) => void;
  setOrderNote: (note: string) => void;
  clearOrder: () => void;
  confirmOrder: () => void;
  addDiaryEntry: (draft: DiaryDraft) => DiaryEntry;
  updateDiaryEntry: (id: string, draft: DiaryDraft) => void;
  deleteDiaryEntry: (id: string) => void;
  setRecipeImage: (recipeId: string, dataUrl: string) => Promise<void>;
  removeRecipeImage: (recipeId: string) => Promise<void>;
  resetAllData: () => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

const EMPTY_FAVORITES: FavoriteRecord[] = [];
const EMPTY_DIARY: DiaryEntry[] = [];

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings, resetSettings] = usePersistentState<Settings>(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS,
    parseSettings,
  );
  const [favorites, setFavorites, resetFavorites] = usePersistentState<FavoriteRecord[]>(
    STORAGE_KEYS.favorites,
    EMPTY_FAVORITES,
    parseFavorites,
  );
  const [order, setOrder, resetOrder] = usePersistentState<OrderState>(
    STORAGE_KEYS.order,
    EMPTY_ORDER,
    parseOrder,
  );
  const [diary, setDiary, resetDiary] = usePersistentState<DiaryEntry[]>(
    STORAGE_KEYS.diary,
    EMPTY_DIARY,
    parseDiary,
  );
  const [customRecipes, setCustomRecipes, resetCustomRecipes] = usePersistentState<Recipe[]>(
    STORAGE_KEYS.customRecipes,
    [],
    parseCustomRecipes,
  );
  const [aiSettings, setAiSettings, resetAiSettings] = usePersistentState<AiSettings>(
    STORAGE_KEYS.aiSettings,
    DEFAULT_AI_SETTINGS,
    parseAiSettings,
  );
  const [recipeImages, setRecipeImages] = useState<RecipeImageMap>({});
  const [storageSize, setStorageSize] = useState(0);

  // 让数据层的查询函数（搜索 / 详情 / 转盘 / 热门）自动带上自定义菜谱
  setRuntimeCustomRecipes(customRecipes);

  // Custom recipe images live in IndexedDB; localStorage now only holds the
  // small structured state below.
  useEffect(() => {
    let active = true;
    loadRecipeImages()
      .then((images) => {
        if (active) setRecipeImages(images);
      })
      .catch((error) => {
        console.warn('[PrincessKitchen] 读取自定义菜品图片失败', error);
      });
    return () => {
      active = false;
    };
  }, []);

  // Theme lives on <html> so it also tints the page background outside the app.
  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute(
        'content',
        settings.theme === 'cream'
          ? '#fffcf5'
          : settings.theme === 'lilac'
            ? '#faf8ff'
            : '#fffafb',
      );
    }
  }, [settings.theme]);

  // Recalculate the storage badge whenever persisted content changes.
  useEffect(() => {
    setStorageSize(getAppStorageSize());
  }, [settings, favorites, order, diary]);

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      setSettings((current) => ({ ...current, ...patch }));
    },
    [setSettings],
  );

  const isFavorite = useCallback(
    (recipeId: string) => favorites.some((favorite) => favorite.recipeId === recipeId),
    [favorites],
  );

  const getFavorite = useCallback(
    (recipeId: string) => favorites.find((favorite) => favorite.recipeId === recipeId),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (recipeId: string) => {
      const exists = favorites.some((favorite) => favorite.recipeId === recipeId);
      if (exists) {
        setFavorites((current) => current.filter((favorite) => favorite.recipeId !== recipeId));
        return false;
      }
      setFavorites((current) => [...current, createFavorite(recipeId)]);
      return true;
    },
    [favorites, setFavorites],
  );

  const setCooked = useCallback(
    (recipeId: string, cooked: boolean) => {
      setFavorites((current) => {
        const exists = current.some((favorite) => favorite.recipeId === recipeId);
        if (!exists) return [...current, { ...createFavorite(recipeId), cooked }];
        return current.map((favorite) =>
          favorite.recipeId === recipeId ? { ...favorite, cooked } : favorite,
        );
      });
    },
    [setFavorites],
  );

  const addOrderItem = useCallback(
    (recipeId: string) => {
      setOrder((current) => {
        const exists = current.items.some((item) => item.recipeId === recipeId);
        const items = exists
          ? current.items.map((item) =>
              item.recipeId === recipeId
                ? {
                    ...item,
                    quantity: Math.min(MAX_ORDER_QUANTITY, item.quantity + 1),
                    selected: true,
                  }
                : item,
            )
          : [...current.items, { recipeId, quantity: 1, selected: true }];
        return { ...current, items, confirmedAt: null };
      });
    },
    [setOrder],
  );

  const removeOrderItem = useCallback(
    (recipeId: string) => {
      setOrder((current) => ({
        ...current,
        items: current.items.filter((item) => item.recipeId !== recipeId),
        confirmedAt: null,
      }));
    },
    [setOrder],
  );

  const setOrderQuantity = useCallback(
    (recipeId: string, quantity: number) => {
      setOrder((current) => ({
        ...current,
        items: current.items.map((item) =>
          item.recipeId === recipeId
            ? {
                ...item,
                quantity: Math.min(MAX_ORDER_QUANTITY, Math.max(1, Math.round(quantity))),
              }
            : item,
        ),
        confirmedAt: null,
      }));
    },
    [setOrder],
  );

  const toggleOrderItem = useCallback(
    (recipeId: string) => {
      setOrder((current) => ({
        ...current,
        items: current.items.map((item) =>
          item.recipeId === recipeId ? { ...item, selected: !item.selected } : item,
        ),
        confirmedAt: null,
      }));
    },
    [setOrder],
  );

  const setAllOrderSelected = useCallback(
    (selected: boolean) => {
      setOrder((current) => ({
        ...current,
        items: current.items.map((item) => ({ ...item, selected })),
        confirmedAt: null,
      }));
    },
    [setOrder],
  );

  const setOrderNote = useCallback(
    (note: string) => {
      setOrder((current) => ({ ...current, note: note.slice(0, 300), confirmedAt: null }));
    },
    [setOrder],
  );

  const clearOrder = useCallback(() => {
    setOrder(EMPTY_ORDER);
  }, [setOrder]);

  const confirmOrder = useCallback(() => {
    setOrder((current) => {
      if (!current.items.some((item) => item.selected)) return current;
      return { ...current, confirmedAt: new Date().toISOString() };
    });
  }, [setOrder]);

  const addDiaryEntry = useCallback(
    (draft: DiaryDraft) => {
      const entry = createDiaryEntry(draft);
      setDiary((current) => [entry, ...current]);
      return entry;
    },
    [setDiary],
  );

  const updateDiaryEntry = useCallback(
    (id: string, draft: DiaryDraft) => {
      setDiary((current) =>
        current.map((entry) => (entry.id === id ? applyDiaryDraft(entry, draft) : entry)),
      );
    },
    [setDiary],
  );

  const deleteDiaryEntry = useCallback(
    (id: string) => {
      setDiary((current) => current.filter((entry) => entry.id !== id));
    },
    [setDiary],
  );

  const setRecipeImage = useCallback(
    async (recipeId: string, dataUrl: string) => {
      if (!dataUrl.startsWith('data:image/') || dataUrl.startsWith('data:image/svg')) {
        throw new Error('不支持这种图片格式');
      }
      await saveRecipeImage(recipeId, dataUrl);
      setRecipeImages((current) => ({ ...current, [recipeId]: dataUrl }));
    },
    [],
  );

  const removeRecipeImage = useCallback(async (recipeId: string) => {
    await deleteRecipeImage(recipeId);
    setRecipeImages((current) => {
      if (!(recipeId in current)) return current;
      const next = { ...current };
      delete next[recipeId];
      return next;
    });
  }, []);

  const addCustomRecipe = useCallback(
    (recipe: Recipe) => {
      setCustomRecipes((current) => [recipe, ...current.filter((item) => item.id !== recipe.id)]);
    },
    [setCustomRecipes],
  );

  const deleteCustomRecipe = useCallback(
    (recipeId: string) => {
      setCustomRecipes((current) => current.filter((item) => item.id !== recipeId));
      void deleteRecipeImage(recipeId).catch((error) => {
        console.warn('[PrincessKitchen] 删除自定义菜谱图片失败', error);
      });
    },
    [setCustomRecipes],
  );

  const updateAiSettings = useCallback(
    (patch: Partial<AiSettings>) => {
      setAiSettings((current) => ({ ...current, ...patch }));
    },
    [setAiSettings],
  );

  const resetAllData = useCallback(() => {
    clearAllAppData();
    resetSettings();
    resetFavorites();
    resetOrder();
    resetDiary();
    resetCustomRecipes();
    resetAiSettings();
    setRecipeImages({});
    void clearRecipeImages().catch((error) => {
      console.warn('[PrincessKitchen] 清空自定义图片失败', error);
    });
    setStorageSize(0);
  }, [resetSettings, resetFavorites, resetOrder, resetDiary, resetCustomRecipes, resetAiSettings]);

  const recipeImageChars = useMemo(
    () => Object.values(recipeImages).reduce((total, value) => total + value.length, 0),
    [recipeImages],
  );

  const value = useMemo<AppStoreValue>(
    () => ({
      settings,
      favorites,
      order,
      diary,
      recipeImages,
      customRecipes,
      aiSettings,
      storageSize,
      recipeImageChars,
      addCustomRecipe,
      deleteCustomRecipe,
      updateAiSettings,
      updateSettings,
      isFavorite,
      getFavorite,
      toggleFavorite,
      setCooked,
      addOrderItem,
      removeOrderItem,
      setOrderQuantity,
      toggleOrderItem,
      setAllOrderSelected,
      setOrderNote,
      clearOrder,
      confirmOrder,
      addDiaryEntry,
      updateDiaryEntry,
      deleteDiaryEntry,
      setRecipeImage,
      removeRecipeImage,
      resetAllData,
    }),
    [
      settings,
      favorites,
      order,
      diary,
      recipeImages,
      customRecipes,
      aiSettings,
      storageSize,
      recipeImageChars,
      addCustomRecipe,
      deleteCustomRecipe,
      updateAiSettings,
      updateSettings,
      isFavorite,
      getFavorite,
      toggleFavorite,
      setCooked,
      addOrderItem,
      removeOrderItem,
      setOrderQuantity,
      toggleOrderItem,
      setAllOrderSelected,
      setOrderNote,
      clearOrder,
      confirmOrder,
      addDiaryEntry,
      updateDiaryEntry,
      deleteDiaryEntry,
      setRecipeImage,
      removeRecipeImage,
      resetAllData,
    ],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStoreValue {
  const context = useContext(AppStoreContext);
  if (!context) throw new Error('useAppStore 必须在 AppStoreProvider 内使用');
  return context;
}
