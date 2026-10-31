/**
 * Cryptographic randomness for the "今天吃什么" wheel.
 *
 * The wheel must not use Math.random as its only source: the winning index is
 * chosen with `crypto.getRandomValues`, using rejection sampling so the result
 * has no modulo bias. A tiny fallback exists only for environments without a
 * Web Crypto API (older WebViews); modern browsers and Capacitor use crypto.
 */

export function secureRandomInt(maxExclusive: number): number {
  if (!Number.isFinite(maxExclusive) || maxExclusive <= 0) return 0;

  const max = Math.floor(maxExclusive);
  const cryptoObj = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    return Math.floor(Math.random() * max);
  }

  // Reject the top partial bucket so every index is equally likely.
  const limit = Math.floor(0x1_0000_0000 / max) * max;
  const buffer = new Uint32Array(1);
  do {
    cryptoObj.getRandomValues(buffer);
  } while (buffer[0] >= limit);

  return buffer[0] % max;
}

/** Fisher–Yates shuffle using the secure random source. */
export function secureShuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = secureRandomInt(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
