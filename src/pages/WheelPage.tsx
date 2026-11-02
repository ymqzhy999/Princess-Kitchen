import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  ChefHat,
  ChevronRight,
  Clock,
  Dices,
  RefreshCw,
  Sparkles,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { findRecipeByName, getAllRecipes } from '../data/recipes';
import type { Recipe, RecipeCategory } from '../types';
import { useAppStore } from '../store/AppStore';
import { useToast } from '../components/ui/Toast';
import { PageHeader } from '../components/ui/PageHeader';
import { WheelCanvas } from '../components/wheel/WheelCanvas';
import { RecipeImage } from '../components/recipe/RecipeImage';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { secureRandomInt, secureShuffle } from '../lib/random';
import { formatPrice, parseISODate } from '../lib/format';
import { cn } from '../lib/cn';

type WheelCategory = RecipeCategory | '全部';

const MAX_SECTORS = 10;
const SPIN_MS = 4200;

export function WheelPage() {
  const { favorites, diary, addOrderItem, recipeImages } = useAppStore();
  const { showToast } = useToast();

  const [category, setCategory] = useState<WheelCategory>('全部');
  const [excludeCooked, setExcludeCooked] = useState(true);
  const [recentDays, setRecentDays] = useState(7);
  const [wheelSeed, setWheelSeed] = useState(0);
  const [wheelRecipes, setWheelRecipes] = useState<Recipe[]>([]);
  const [rotation, setRotation] = useState(0);
  const [spinDuration, setSpinDuration] = useState(SPIN_MS);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Recipe | null>(null);

  const spinTimer = useRef<number | null>(null);
  const finishedRef = useRef(true);
  const pendingResult = useRef<Recipe | null>(null);

  const excludedIds = useMemo(() => {
    const excluded = new Set<string>();

    favorites.filter((favorite) => favorite.cooked).forEach((favorite) => {
      excluded.add(favorite.recipeId);
    });

    // Diary is the only dated "cooked" record; last 7 calendar days.
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - (recentDays - 1));
    const cutoffTime = cutoff.getTime();

    diary.forEach((entry) => {
      if (parseISODate(entry.date).getTime() < cutoffTime) return;
      if (entry.recipeId) {
        excluded.add(entry.recipeId);
        return;
      }
      const matched = findRecipeByName(entry.dishName);
      if (matched) excluded.add(matched.id);
    });

    return excluded;
  }, [favorites, diary, recentDays]);

  // Only recipes with a real photo can enter the wheel; we no longer use SVG
  // dish artwork or show the wheel with blank image cards.
  const photoRecipes = useMemo(
    () =>
      getAllRecipes().filter(
        (recipe) =>
          Boolean(recipeImages[recipe.id] ?? recipe.coverImage) &&
          !(excludeCooked && excludedIds.has(recipe.id)),
      ),
    [excludeCooked, excludedIds, recipeImages],
  );

  const categoryOptions = useMemo(
    () =>
      CATEGORIES.map((item) => ({
        ...item,
        count: photoRecipes.filter((recipe) => recipe.category === item.name).length,
      })).filter((item) => item.count > 0),
    [photoRecipes],
  );

  const activeCategory: WheelCategory =
    category !== '全部' && categoryOptions.some((item) => item.name === category)
      ? category
      : '全部';

  const candidates = useMemo(
    () =>
      photoRecipes.filter(
        (recipe) => activeCategory === '全部' || recipe.category === activeCategory,
      ),
    [activeCategory, photoRecipes],
  );

  const sampledRecipes = useMemo(
    () => secureShuffle(candidates).slice(0, Math.min(MAX_SECTORS, candidates.length)),
    [candidates, wheelSeed],
  );

  const finishSpin = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (spinTimer.current !== null) {
      window.clearTimeout(spinTimer.current);
      spinTimer.current = null;
    }
    setSpinning(false);
    setResult(pendingResult.current);
  }, []);

  const resetWheel = useCallback(() => {
    finishedRef.current = true;
    pendingResult.current = null;
    if (spinTimer.current !== null) {
      window.clearTimeout(spinTimer.current);
      spinTimer.current = null;
    }
    setSpinning(false);
    setResult(null);
    setRotation(0);
    setSpinDuration(SPIN_MS);
  }, []);

  // New filter / new batch: clear the previous result and put the wheel at 0.
  useEffect(() => {
    setWheelRecipes(sampledRecipes);
    resetWheel();
  }, [sampledRecipes, resetWheel]);

  useEffect(() => {
    return () => {
      if (spinTimer.current !== null) window.clearTimeout(spinTimer.current);
    };
  }, []);

  const handleSpin = () => {
    if (spinning || wheelRecipes.length === 0) return;

    const targetIndex = secureRandomInt(wheelRecipes.length);
    const sector = 360 / wheelRecipes.length;
    const jitter = (secureRandomInt(1001) / 1000 - 0.5) * sector * 0.55;
    const wanted = ((-(targetIndex + 0.5) * sector + jitter) % 360 + 360) % 360;
    const current = ((rotation % 360) + 360) % 360;
    const delta = (wanted - current + 360) % 360;
    const turns = 5 + secureRandomInt(3);
    const nextRotation = rotation + turns * 360 + delta;
    const reduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduceMotion ? 260 : SPIN_MS;

    pendingResult.current = wheelRecipes[targetIndex];
    finishedRef.current = false;
    setSpinDuration(duration);
    setSpinning(true);
    setResult(null);
    setRotation(nextRotation);
    spinTimer.current = window.setTimeout(finishSpin, duration + 350);
  };

  const handleReshuffle = () => {
    if (spinning) return;
    setResult(null);
    setWheelSeed((seed) => seed + 1);
  };

  const handleResetFilters = () => {
    setCategory('全部');
    setExcludeCooked(false);
    setResult(null);
  };

  const handleAddToOrder = () => {
    if (!result) return;
    addOrderItem(result.id);
    showToast(`「${result.name}」已加入今日菜单`, {
      icon: <Sparkles className="h-3.5 w-3.5" />,
    });
  };

  const isCategoryEmpty = candidates.length === 0;

  return (
    <div>
      <PageHeader
        title="今天吃什么"
        subtitle="让转盘替你们决定，今晚不纠结"
        right={
          <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blush-100 to-lilac-100 text-blush-500 shadow-soft">
            <Dices className="h-5 w-5" strokeWidth={1.8} />
          </div>
        }
      />

      <section className="pk-card mb-4 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-semibold text-ink-900">参与转盘的菜</h2>
            <p className="mt-0.5 text-[10px] text-ink-400">仅使用有实拍图的菜，分类可自选</p>
          </div>
          <span className="rounded-full bg-blush-50 px-2.5 py-1 text-[10px] text-blush-500">
            {candidates.length} 道可用
          </span>
        </div>

        <div className="-mx-1 overflow-x-auto px-1 pb-1 no-scrollbar">
          <div className="flex w-max gap-2">
            <button
              type="button"
              disabled={spinning}
              onClick={() => setCategory('全部')}
              className={cn(
                'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] transition-colors disabled:opacity-50',
                activeCategory === '全部'
                  ? 'border-transparent bg-gradient-to-br from-theme to-theme-deep font-medium text-white shadow-float'
                  : 'border-white/80 bg-white/70 text-ink-500 hover:border-blush-200 hover:text-ink-800',
              )}
            >
              全部
              <span className={cn('text-[9px]', activeCategory === '全部' ? 'text-white/75' : 'text-ink-400')}>
                {photoRecipes.length}
              </span>
            </button>
            {categoryOptions.map((item) => (
              <button
                key={item.name}
                type="button"
                disabled={spinning}
                onClick={() => setCategory(item.name)}
                className={cn(
                  'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[11px] transition-colors disabled:opacity-50',
                  activeCategory === item.name
                    ? 'border-transparent bg-gradient-to-br from-theme to-theme-deep font-medium text-white shadow-float'
                    : 'border-white/80 bg-white/70 text-ink-500 hover:border-blush-200 hover:text-ink-800',
                )}
              >
                {item.emoji} {item.name}
                <span className={cn('text-[9px]', activeCategory === item.name ? 'text-white/75' : 'text-ink-400')}>
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={excludeCooked}
          disabled={spinning}
          onClick={() => setExcludeCooked((value) => !value)}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-cream-100/80 px-3 py-2.5 text-left transition-colors hover:bg-cream-100 disabled:opacity-60"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-blush-400">
            <BadgeCheck className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-medium text-ink-700">排除做过的菜</span>
            <span className="mt-0.5 block text-[9px] text-ink-400">
              日记 {recentDays} 天内 / 已标记做过 ·{' '}
              {excludeCooked ? `已排除 ${excludedIds.size} 道` : '当前不排除'}
            </span>
          </span>
          <span
            className={cn(
              'relative h-5 w-9 shrink-0 rounded-full transition-colors',
              excludeCooked ? 'bg-theme' : 'bg-blush-200',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                excludeCooked ? 'translate-x-[18px]' : 'translate-x-0.5',
              )}
            />
          </span>
        </button>

        {excludeCooked && (
          <div className="mt-2 flex items-center justify-end gap-1.5 text-[9px] text-ink-400">
            最近
            <select
              value={recentDays}
              disabled={spinning}
              onChange={(event) => setRecentDays(Number(event.target.value))}
              aria-label="排除最近几天做过的菜"
              className="rounded-full border border-blush-200 bg-white px-2 py-1 text-[9px] text-ink-600 outline-none focus:border-theme/60 focus:ring-1 focus:ring-theme/20"
            >
              <option value={3}>3 天</option>
              <option value={7}>7 天</option>
              <option value={14}>14 天</option>
            </select>
            做过的菜
          </div>
        )}
      </section>

      {isCategoryEmpty ? (
        <EmptyState
          icon={Dices}
          title="这一轮没有可转的菜"
          description="当前分类暂时没有合格实拍图，或做过的菜都被排除了。换一个分类、关闭排除，或者先去菜谱看看。"
          action={
            <Button variant="secondary" onClick={handleResetFilters}>
              重置筛选
            </Button>
          }
        />
      ) : (
        <>
          <section className="pk-card overflow-hidden px-4 pb-4 pt-3">
            <div className="relative mx-auto aspect-square w-full max-w-[430px] px-3 py-4">
              <WheelCanvas
                recipes={wheelRecipes}
                rotation={rotation}
                spinning={spinning}
                durationMs={spinDuration}
                onSpinEnd={finishSpin}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1 z-10 h-0 w-0 -translate-x-1/2 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-theme drop-shadow-[0_3px_4px_rgba(163,45,83,0.25)]"
              />
            </div>

            <div className="flex items-center justify-between gap-2 px-1">
              <p className="text-[10px] leading-relaxed text-ink-400">
                从 {candidates.length} 道中随机抽取 {wheelRecipes.length} 道
              </p>
              <button
                type="button"
                onClick={handleReshuffle}
                disabled={spinning}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] text-ink-500 transition-colors hover:bg-blush-50 hover:text-theme-deep disabled:opacity-40"
              >
                <RefreshCw className={cn('h-3 w-3', spinning && 'animate-spin')} />
                换一批
              </button>
            </div>

            <Button
              size="lg"
              fullWidth
              className="mt-3"
              disabled={spinning || wheelRecipes.length === 0}
              onClick={handleSpin}
              leadingIcon={<Dices className={cn('h-5 w-5', spinning && 'animate-pulse')} />}
            >
              {spinning ? '转盘正在转…' : '开始转'}
            </Button>

            <p className="mt-2 text-center text-[9px] text-ink-400">
              结果由系统安全随机数决定 · 不是预设顺序
            </p>
          </section>

          {result ? (
            <section
              aria-live="polite"
              className="pk-card mt-4 overflow-hidden animate-pop-in"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-blush-50">
                <RecipeImage
                  recipe={result}
                  loading="eager"
                  className="h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 rounded-full border border-white/40 bg-white/20 px-2.5 py-1 text-[10px] text-white backdrop-blur">
                  转盘选中
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Badge tone="pink">{result.category}</Badge>
                    <h2 className="mt-1.5 font-display text-xl font-semibold text-ink-900">
                      {result.name}
                    </h2>
                  </div>
                  <span className="font-display text-lg font-semibold text-theme-deep">
                    {formatPrice(result.price)}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-500">
                  {result.description}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-ink-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3 text-blush-400" />
                    {result.cookingTime} 分钟
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ChefHat className="h-3 w-3 text-blush-400" />
                    {result.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Wallet className="h-3 w-3 text-blush-400" />
                    参考 {formatPrice(result.price)}
                  </span>
                </div>

                <div className="mt-3.5 flex gap-2">
                  <Button
                    fullWidth
                    onClick={handleAddToOrder}
                    leadingIcon={<UtensilsCrossed className="h-4 w-4" />}
                  >
                    加入今日菜单
                  </Button>
                  <Link
                    to={`/recipe/${result.id}`}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-1 rounded-full border border-blush-200 bg-white px-4 text-xs font-medium text-ink-700 transition-colors hover:bg-blush-50"
                  >
                    查看详情
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={handleSpin}
                  disabled={spinning}
                  className="mt-3 w-full text-center text-[10px] text-ink-400 underline-offset-4 transition-colors hover:text-theme-deep hover:underline disabled:opacity-40"
                >
                  不满意？再转一次
                </button>
              </div>
            </section>
          ) : (
            <section className="mt-4 rounded-3xl border border-dashed border-blush-100 bg-white/50 px-4 py-3.5 text-center">
              <p className="text-[11px] leading-relaxed text-ink-500">
                {spinning
                  ? '转盘正在替你们做决定…'
                  : '转盘停下的那一刻，就是今晚的答案。'}
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}
