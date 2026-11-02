import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from './renderApp';

const DRAFT = {
  name: '糖醋排骨',
  category: '家常菜',
  description: '酸甜挂汁，排骨外脆里嫩，是那种一端上桌就会被夹光的菜。',
  difficulty: '中等',
  cookingTime: 45,
  servings: '2 人份',
  price: 42,
  ingredients: [
    { name: '猪小排', amount: '500g' },
    { name: '冰糖', amount: '30g' },
    { name: '香醋', amount: '3 汤匙' },
    { name: '生抽', amount: '2 汤匙' },
    { name: '姜片', amount: '4 片' },
  ],
  steps: [
    { title: '排骨焯水', description: '冷水下锅，加姜片煮开撇去浮沫，捞出沥干。' },
    { title: '炒糖色', description: '小火化开冰糖至枣红色，倒入排骨翻炒上色。' },
    { title: '调味炖煮', description: '加生抽、醋和热水没过排骨，小火炖 25 分钟。' },
    { title: '收汁', description: '大火收至汤汁浓稠，裹匀排骨即可。' },
    { title: '装盘', description: '撒白芝麻，趁热吃。' },
  ],
  tips: ['醋分两次放，酸味更立体'],
  tags: ['家常', '下饭'],
  imagePrompt: 'sweet and sour pork ribs glazed, on a white plate',
};

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

describe('AI 加菜', () => {
  beforeEach(() => {
    window.localStorage.setItem(
      'pk.v1.aiSettings',
      JSON.stringify({
        textProvider: 'deepseek',
        textApiKey: 'sk-test',
        textModel: 'deepseek-chat',
        imageApiKey: 'sk-test',
        imageModel: 'agnes-image-2.1-flash',
      }),
    );
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes('/chat/completions')) {
          return jsonResponse({ choices: [{ message: { content: JSON.stringify(DRAFT) } }] });
        }
        if (url.includes('/images/generations')) {
          // 真实接口现在直接返回 base64，避免浏览器再去 CDN 下载被跨域拦
          return jsonResponse({ data: [{ b64_json: `iVBORw0KGgo${'A'.repeat(4000)}` }] });
        }
        return new Response(new Blob([new Uint8Array([137, 80, 78, 71])], { type: 'image/png' }));
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('输入菜名后生成草稿，确认保存进菜谱', async () => {
    const user = userEvent.setup();
    renderApp('/add');

    const input = screen.getByLabelText('想吃什么？') as HTMLTextAreaElement;
    await user.type(input, '糖醋排骨');
    await user.click(screen.getByRole('button', { name: /生成菜谱/ }));

    await waitFor(() => expect(screen.getByRole('heading', { name: '糖醋排骨' })).toBeTruthy(), {
      timeout: 4000,
    });
    expect(screen.getByText(/冷水下锅/)).toBeTruthy();

    await user.click(screen.getByRole('button', { name: /用这个，保存/ }));

    await waitFor(() => {
      const saved = JSON.parse(window.localStorage.getItem('pk.v1.customRecipes') ?? '[]');
      expect(Array.isArray(saved)).toBe(true);
      expect(saved).toHaveLength(1);
      expect(saved[0].name).toBe('糖醋排骨');
      expect(saved[0].custom).toBe(true);
      expect(saved[0].steps).toHaveLength(5);
    });
  });
});
