import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from './renderApp';

describe('首页', () => {
  it('展示品牌与问候，并能进入菜谱大全', async () => {
    const user = userEvent.setup();
    renderApp('/');

    expect(screen.getByText('公主的私房小厨房')).toBeTruthy();
    expect(screen.getByText(/今天想做点什么好吃的呀/)).toBeTruthy();

    await user.click(screen.getByRole('link', { name: '菜谱' }));

    expect(screen.getByRole('heading', { name: '菜谱大全' })).toBeTruthy();
  });

  it('读取本地保存的昵称', () => {
    window.localStorage.setItem(
      'pk.v1.settings',
      JSON.stringify({ nickname: '小桃', avatar: '🍓', theme: 'cream' }),
    );
    renderApp('/');

    expect(screen.getByText(/小桃/)).toBeTruthy();
  });
});

describe('菜谱大全', () => {
  it('支持分类筛选和关键词搜索', async () => {
    const user = userEvent.setup();
    renderApp('/recipes');

    expect(screen.getByRole('heading', { name: '菜谱大全' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: '宫保鸡丁' })).toBeTruthy();

    await user.click(screen.getByRole('button', { name: /^甜品/ }));
    expect(screen.getByRole('heading', { name: '提拉米苏' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: '宫保鸡丁' })).toBeNull();

    await user.click(screen.getByRole('button', { name: '全部' }));
    await user.type(screen.getByRole('searchbox', { name: '搜索菜谱' }), '鸡翅');

    expect(screen.getByRole('heading', { name: '蒜香烤鸡翅' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: '提拉米苏' })).toBeNull();
  });

  it('可以收藏菜品并加入今日菜单', async () => {
    const user = userEvent.setup();
    renderApp('/recipes');

    const card = screen.getByRole('heading', { name: '宫保鸡丁' }).closest('article');
    expect(card).toBeTruthy();

    await user.click(within(card as HTMLElement).getByRole('button', { name: '收藏这道菜' }));
    expect(await screen.findByText(/已把「宫保鸡丁」收进收藏/)).toBeTruthy();

    const favorites = JSON.parse(window.localStorage.getItem('pk.v1.favorites') ?? '[]');
    expect(favorites).toHaveLength(1);
    expect(favorites[0].recipeId).toBe('dish_001');

    await user.click(
      within(card as HTMLElement).getByRole('button', {
        name: '把 宫保鸡丁 加入今日菜单',
      }),
    );
    expect(await screen.findByText(/已加入今日菜单/)).toBeTruthy();

    const order = JSON.parse(window.localStorage.getItem('pk.v1.order') ?? '{}');
    expect(order.items).toHaveLength(1);
    expect(order.items[0]).toMatchObject({ recipeId: 'dish_001', quantity: 1, selected: true });
  });
});

describe('菜谱详情', () => {
  it('展示食材和步骤，可标记步骤、收藏并加入菜单', async () => {
    const user = userEvent.setup();
    renderApp('/recipe/dish_009');

    expect(screen.getByRole('heading', { level: 1, name: '番茄炒蛋' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /从相册上传 番茄炒蛋/ })).toBeTruthy();
    expect(screen.getByText('食材清单')).toBeTruthy();
    expect(screen.getByText('制作步骤')).toBeTruthy();
    expect(screen.getByText('番茄')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: /番茄去皮/ }));
    expect(screen.getByText('1/5')).toBeTruthy();

    const favoriteButtons = screen.getAllByRole('button', { name: '收藏这道菜' });
    await user.click(favoriteButtons[0]);
    expect(await screen.findByText(/已收进你的收藏夹/)).toBeTruthy();

    await user.click(screen.getByRole('button', { name: '加入菜单' }));
    expect(await screen.findByText(/已加入今日菜单/)).toBeTruthy();

    const orderLink = screen.getByRole('link', { name: /已在菜单 1 份/ });
    await user.click(orderLink);
    expect(screen.getByRole('heading', { name: '今日菜单' })).toBeTruthy();
  });

  it('导入菜谱展示来源链接与小贴士', () => {
    renderApp('/recipe/dish_021');

    expect(screen.getByRole('heading', { level: 1, name: '地三鲜' })).toBeTruthy();
    expect(screen.getByText('小贴士')).toBeTruthy();
    expect(screen.getByRole('link', { name: /查看原始菜谱/ })).toBeTruthy();
    expect(screen.getByText(/HowToCook 开源项目/)).toBeTruthy();
  });

  it('不存在的菜谱会显示空状态', () => {
    renderApp('/recipe/dish_999');

    expect(screen.getByText('这道菜暂时找不到')).toBeTruthy();
    expect(screen.getByRole('button', { name: '返回菜谱大全' })).toBeTruthy();
  });
});

describe('收藏页', () => {
  it('区分想吃的菜和已经做过的菜', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      'pk.v1.favorites',
      JSON.stringify([
        {
          recipeId: 'dish_001',
          wantToTry: true,
          cooked: false,
          savedAt: '2026-10-01T10:00:00.000Z',
        },
        {
          recipeId: 'dish_016',
          wantToTry: true,
          cooked: true,
          savedAt: '2026-10-02T10:00:00.000Z',
        },
      ]),
    );

    renderApp('/favorites');
    expect(screen.getByRole('heading', { name: '我的收藏' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: '宫保鸡丁' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: '提拉米苏' })).toBeTruthy();

    const kungPaoCard = screen.getByRole('heading', { name: '宫保鸡丁' }).closest('article');
    expect(kungPaoCard).toBeTruthy();
    await user.click(
      within(kungPaoCard as HTMLElement).getByRole('button', { name: '标记做过' }),
    );
    expect(await screen.findByText(/记下啦，这道已经做过/)).toBeTruthy();

    await user.click(screen.getByRole('button', { name: /^已经做过/ }));
    expect(screen.getByRole('heading', { name: '提拉米苏' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: '宫保鸡丁' })).toBeTruthy();

    const favorites = JSON.parse(window.localStorage.getItem('pk.v1.favorites') ?? '[]');
    const updated = favorites.find((item: { recipeId: string }) => item.recipeId === 'dish_001');
    expect(updated.cooked).toBe(true);
  });
});

describe('今日菜单', () => {
  it('计算已选菜品总价、全选、填写备注并确认菜单', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      'pk.v1.order',
      JSON.stringify({
        items: [
          { recipeId: 'dish_001', quantity: 2, selected: true },
          { recipeId: 'dish_009', quantity: 1, selected: false },
        ],
        note: '',
        confirmedAt: null,
      }),
    );

    renderApp('/order');
    expect(screen.getByRole('heading', { name: '今日菜单' })).toBeTruthy();
    const summary = screen.getByText('菜单小结').closest('section');
    expect(summary).toBeTruthy();
    expect(within(summary as HTMLElement).getByText('¥52.00')).toBeTruthy();

    await user.click(screen.getByRole('checkbox', { name: '全选所有菜品' }));
    expect(within(summary as HTMLElement).getByText('¥62.00')).toBeTruthy();

    await user.type(screen.getByLabelText('给大厨的小纸条'), '少放辣，多放香菜');
    await user.click(screen.getByRole('button', { name: '确认菜单' }));
    expect(screen.getByRole('dialog')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: '确认这顿饭' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(screen.getByText(/已确认 ·/)).toBeTruthy();

    const stored = JSON.parse(window.localStorage.getItem('pk.v1.order') ?? '{}');
    expect(stored.note).toBe('少放辣，多放香菜');
    expect(stored.confirmedAt).toBeTruthy();
    expect(stored.items.every((item: { selected: boolean }) => item.selected)).toBe(true);

    await user.click(screen.getByRole('button', { name: '清空' }));
    await user.click(screen.getByRole('button', { name: '清空菜单' }));
    expect(await screen.findByText('今晚的菜单还是空白的')).toBeTruthy();
  });

  it('没有菜品时展示空状态', () => {
    renderApp('/order');
    expect(screen.getByText('今晚的菜单还是空白的')).toBeTruthy();
  });
});

describe('美食日记', () => {
  it('新增、编辑并删除一篇日记', async () => {
    const user = userEvent.setup();
    renderApp('/diary');

    expect(screen.getByText('日记本还是崭新的')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: '写日记' }));
    expect(screen.getByRole('dialog')).toBeTruthy();

    await user.type(screen.getByLabelText('今天做了什么菜'), '番茄炒蛋');
    await user.type(screen.getByLabelText('想记下的话'), '今天的番茄炒蛋特别下饭。');
    await user.click(screen.getByRole('button', { name: '4 星' }));
    await user.click(screen.getByRole('button', { name: '收进日记本' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(screen.getByRole('heading', { name: '番茄炒蛋' })).toBeTruthy();
    expect(screen.getByText('今天的番茄炒蛋特别下饭。')).toBeTruthy();

    const entries = JSON.parse(window.localStorage.getItem('pk.v1.diary') ?? '[]');
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      dishName: '番茄炒蛋',
      rating: 4,
      recipeId: 'dish_009',
    });

    await user.click(screen.getByRole('button', { name: '编辑' }));
    const content = screen.getByLabelText('想记下的话');
    await user.clear(content);
    await user.type(content, '下次想多放一点糖。');
    await user.click(screen.getByRole('button', { name: '保存修改' }));

    expect(await screen.findByText('下次想多放一点糖。')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: '删除 番茄炒蛋 的日记' }));
    await user.click(screen.getByRole('button', { name: '删除日记' }));

    expect(await screen.findByText('日记本还是崭新的')).toBeTruthy();
  });
});

describe('我的厨房', () => {
  it('修改昵称、头像和主题，并清除本地数据', async () => {
    const user = userEvent.setup();
    renderApp('/settings');

    const nickname = screen.getByLabelText('昵称');
    await user.clear(nickname);
    await user.type(nickname, '小兔');
    await user.click(screen.getByRole('button', { name: '保存' }));

    let settings = JSON.parse(window.localStorage.getItem('pk.v1.settings') ?? '{}');
    expect(settings.nickname).toBe('小兔');

    await user.click(screen.getByRole('button', { name: '使用头像 🎀' }));
    settings = JSON.parse(window.localStorage.getItem('pk.v1.settings') ?? '{}');
    expect(settings.avatar).toBe('🎀');

    await user.click(screen.getByRole('button', { name: /薰衣草/ }));
    expect(document.documentElement.dataset.theme).toBe('lilac');
    settings = JSON.parse(window.localStorage.getItem('pk.v1.settings') ?? '{}');
    expect(settings.theme).toBe('lilac');

    await user.click(screen.getByRole('button', { name: '清除本地测试数据' }));
    await user.click(screen.getByRole('button', { name: '确认清除' }));

    expect(window.localStorage.getItem('pk.v1.settings')).toBeNull();
    expect(window.localStorage.getItem('pk.v1.favorites')).toBeNull();
    expect(window.localStorage.getItem('pk.v1.diary')).toBeNull();
    expect(window.localStorage.getItem('pk.v1.recipeImages')).toBeNull();

    // Regression: the first change after a reset must still be persisted.
    await user.click(screen.getByRole('link', { name: '菜谱' }));
    await user.click(screen.getByRole('button', { name: '把 宫保鸡丁 加入今日菜单' }));

    const order = JSON.parse(window.localStorage.getItem('pk.v1.order') ?? '{}');
    expect(order.items).toHaveLength(1);
    expect(order.items[0].recipeId).toBe('dish_001');
  });
});

describe('今天吃什么', () => {
  it('展示转盘、分类筛选与真随机说明', () => {
    renderApp('/wheel');

    expect(screen.getByRole('heading', { name: '今天吃什么' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '开始转' })).toBeTruthy();
    expect(screen.getByRole('switch', { name: /排除做过的菜/ })).toBeTruthy();
    expect(screen.getByText(/结果由系统安全随机数决定/)).toBeTruthy();
    expect(screen.getByText(/从 \d+ 道中随机抽取 \d+ 道/)).toBeTruthy();
  });

  it('转盘结束后展示结果并可加入今日菜单', () => {
    vi.useFakeTimers();
    try {
      renderApp('/wheel');
      const spinButton = screen.getByRole('button', { name: '开始转' }) as HTMLButtonElement;
      expect(spinButton.disabled).toBe(false);

      fireEvent.click(spinButton);
      expect(screen.getByRole('button', { name: /转盘正在转/ })).toBeTruthy();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.getByRole('button', { name: '加入今日菜单' })).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: '加入今日菜单' }));

      const order = JSON.parse(window.localStorage.getItem('pk.v1.order') ?? '{}');
      expect(order.items).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
