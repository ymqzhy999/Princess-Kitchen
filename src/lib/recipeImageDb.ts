import type { RecipeImageMap } from '../types';
import { STORAGE_KEYS, readJSON, writeJSON, removeKey } from './storage';

/**
 * Recipe images can be much larger than the small structured data kept in
 * localStorage. Store them in IndexedDB (larger quota) and keep only the
 * legacy localStorage map as a fallback/migration path.
 */

const DB_NAME = 'princess-kitchen';
const DB_VERSION = 1;
const STORE_NAME = 'recipeImages';

interface StoredRecipeImage {
  recipeId: string;
  dataUrl: string;
  updatedAt: string;
}

let databasePromise: Promise<IDBDatabase | null> | null = null;

function openDatabase(): Promise<IDBDatabase | null> {
  if (databasePromise) return databasePromise;

  if (typeof indexedDB === 'undefined') {
    databasePromise = Promise.resolve(null);
    return databasePromise;
  }

  databasePromise = new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'recipeId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.warn('[PrincessKitchen] IndexedDB 打开失败，图片改用 localStorage');
      resolve(null);
    };
    request.onblocked = () => resolve(null);
  });

  return databasePromise;
}

function readLegacyImages(): RecipeImageMap {
  const raw = readJSON<unknown>(STORAGE_KEYS.recipeImages, {});
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};

  const images: RecipeImageMap = {};
  Object.entries(raw as Record<string, unknown>).forEach(([recipeId, value]) => {
    if (!/^dish_\d{3}$/.test(recipeId)) return;
    if (typeof value !== 'string' || !value.startsWith('data:image/')) return;
    if (value.startsWith('data:image/svg')) return;
    if (value.length > 2_000_000) return;
    images[recipeId] = value;
  });
  return images;
}

async function readDatabase(db: IDBDatabase): Promise<RecipeImageMap> {
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => {
      const images: RecipeImageMap = {};
      (request.result as StoredRecipeImage[]).forEach((row) => {
        if (row && typeof row.recipeId === 'string' && typeof row.dataUrl === 'string') {
          images[row.recipeId] = row.dataUrl;
        }
      });
      resolve(images);
    };
    request.onerror = () => resolve({});
  });
}

async function writeDatabase(db: IDBDatabase, recipeId: string, dataUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put({
      recipeId,
      dataUrl,
      updatedAt: new Date().toISOString(),
    } satisfies StoredRecipeImage);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('图片保存失败'));
    transaction.onabort = () => reject(transaction.error ?? new Error('图片保存被中断'));
  });
}

async function writeLegacyImages(images: RecipeImageMap): Promise<void> {
  if (Object.keys(images).length === 0) {
    removeKey(STORAGE_KEYS.recipeImages);
    return;
  }
  if (!writeJSON(STORAGE_KEYS.recipeImages, images)) {
    throw new Error('本机存储空间不足，请先清理一些数据');
  }
}

export async function loadRecipeImages(): Promise<RecipeImageMap> {
  const legacy = readLegacyImages();
  const db = await openDatabase();
  if (!db) return legacy;

  const stored = await readDatabase(db);

  // Merge and migrate any images saved by an older build in localStorage.
  const merged = { ...legacy, ...stored };
  const needsMigration = Object.keys(legacy).some((recipeId) => !(recipeId in stored));
  if (needsMigration) {
    try {
      await Promise.all(
        Object.entries(legacy)
          .filter(([recipeId]) => !(recipeId in stored))
          .map(([recipeId, dataUrl]) => writeDatabase(db, recipeId, dataUrl)),
      );
      removeKey(STORAGE_KEYS.recipeImages);
    } catch (error) {
      console.warn('[PrincessKitchen] 旧图片迁移失败，暂时继续使用 localStorage', error);
    }
  }

  return merged;
}

export async function saveRecipeImage(recipeId: string, dataUrl: string): Promise<void> {
  const db = await openDatabase();
  if (!db) {
    const images = { ...readLegacyImages(), [recipeId]: dataUrl };
    await writeLegacyImages(images);
    return;
  }
  await writeDatabase(db, recipeId, dataUrl);
}

export async function deleteRecipeImage(recipeId: string): Promise<void> {
  const db = await openDatabase();
  if (!db) {
    const images = readLegacyImages();
    delete images[recipeId];
    await writeLegacyImages(images);
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(recipeId);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('图片删除失败'));
    transaction.onabort = () => resolve();
  });
}

export async function clearRecipeImages(): Promise<void> {
  removeKey(STORAGE_KEYS.recipeImages);
  const db = await openDatabase();
  if (!db) return;

  await new Promise<void>((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => resolve();
    transaction.onabort = () => resolve();
  });
}
