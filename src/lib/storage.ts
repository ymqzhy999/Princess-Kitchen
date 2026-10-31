/**
 * Thin, defensive localStorage layer.
 *
 * Structured app data goes through this module. User-uploaded recipe images use
 * IndexedDB separately (see recipeImageDb.ts) because they are much larger.
 * All keys are namespaced and versioned.
 */

export const STORAGE_PREFIX = 'pk.v1.';

export const STORAGE_KEYS = {
  settings: `${STORAGE_PREFIX}settings`,
  favorites: `${STORAGE_PREFIX}favorites`,
  order: `${STORAGE_PREFIX}order`,
  diary: `${STORAGE_PREFIX}diary`,
  recipeImages: `${STORAGE_PREFIX}recipeImages`,
} as const;

function canUseStorage(): boolean {
  try {
    return typeof window !== 'undefined' && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[PrincessKitchen] 无法读取本地数据：${key}`, error);
    return fallback;
  }
}

/** Returns false when the browser refuses to write (quota / private mode). */
export function writeJSON<T>(key: string, value: T): boolean {
  if (!canUseStorage()) return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[PrincessKitchen] 无法保存本地数据：${key}`, error);
    return false;
  }
}

export function removeKey(key: string): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[PrincessKitchen] 无法删除本地数据：${key}`, error);
  }
}

/** Clears only this app's keys, never other sites' data. */
export function clearAllAppData(): void {
  Object.values(STORAGE_KEYS).forEach(removeKey);
}

/** Rough usage of this app's own keys, shown in Settings. */
export function getAppStorageSize(): number {
  if (!canUseStorage()) return 0;

  return Object.values(STORAGE_KEYS).reduce((total, key) => {
    try {
      const value = window.localStorage.getItem(key);
      return total + (value ? value.length : 0);
    } catch {
      return total;
    }
  }, 0);
}
