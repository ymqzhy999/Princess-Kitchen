import { useCallback, useEffect, useRef, useState } from 'react';
import { readJSON, writeJSON } from '../lib/storage';

/**
 * State that survives reloads and stays in sync with localStorage.
 * `read` lets the store validate older / hand-edited payloads.
 */
export function usePersistentState<T>(
  key: string,
  fallback: T,
  read: (raw: unknown) => T = (raw) => raw as T,
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
  const [value, setValue] = useState<T>(() => read(readJSON<unknown>(key, fallback)));
  const skipNextWrite = useRef(false);

  useEffect(() => {
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    writeJSON(key, value);
  }, [key, value]);

  const reset = useCallback(() => {
    // Use a fresh reference for objects/arrays: React bails out of a state
    // update when the value is identical, and then the "skip next write" flag
    // would survive until the *next* real change — silently losing it.
    if (Array.isArray(fallback)) {
      skipNextWrite.current = true;
      setValue([...fallback] as T);
      return;
    }
    if (fallback !== null && typeof fallback === 'object') {
      skipNextWrite.current = true;
      setValue({ ...(fallback as Record<string, unknown>) } as T);
      return;
    }
    setValue(fallback);
  }, [fallback]);

  return [value, setValue, reset];
}
