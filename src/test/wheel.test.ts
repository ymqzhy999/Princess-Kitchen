import { describe, expect, it } from 'vitest';
import { secureRandomInt, secureShuffle } from '../lib/random';

describe('转盘随机数', () => {
  it('使用安全随机源并保持在合法范围内', () => {
    for (let index = 0; index < 200; index += 1) {
      const value = secureRandomInt(7);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(7);
    }
    expect(secureRandomInt(1)).toBe(0);
    expect(secureRandomInt(0)).toBe(0);
  });

  it('洗牌不会丢失或重复菜品', () => {
    const source = ['a', 'b', 'c', 'd', 'e'];
    const shuffled = secureShuffle(source);
    expect([...shuffled].sort()).toEqual([...source].sort());
    expect(source).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});

describe('用户菜品图片', () => {
  it('只接受本机 data 图片地址，拒绝外部 URL 和非法键', async () => {
    const { parseRecipeImages } = await import('../store/validation');
    const parsed = parseRecipeImages({
      dish_001: 'data:image/jpeg;base64,abc',
      'bad-key': 'data:image/jpeg;base64,abc',
      dish_002: 'https://example.com/a.jpg',
      dish_003: 'data:image/svg+xml;base64,abc',
    });
    expect(parsed).toEqual({ dish_001: 'data:image/jpeg;base64,abc' });
  });
});
