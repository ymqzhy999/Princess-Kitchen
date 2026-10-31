import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ChefHat,
  Clock,
  Heart,
  Lightbulb,
  Plus,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import { getRecipeById } from '../data/recipes';
import { useAppStore } from '../store/AppStore';
import { useToast } from '../components/ui/Toast';
import { RecipeImage } from '../components/recipe/RecipeImage';
import { RecipeImageUpload } from '../components/recipe/RecipeImageUpload';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { cn } from '../lib/cn';
import { formatPrice } from '../lib/format';

export function RecipeDetailPage() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const recipe = getRecipeById(recipeId);
  const { isFavorite, toggleFavorite, addOrderItem, order } = useAppStore();
  const { showToast } = useToast();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setCompletedSteps([]);
  }, [recipeId]);

  if (!recipe) {
    return (
      <div className="min-h-dvh px-4 pb-16 pt-page">
        <button
          type="button"
          onClick={() => navigate('/recipes')}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/80 text-ink-600 shadow-soft"
          aria-label="返回菜谱列表"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <EmptyState
          icon={ChefHat}
          title="这道菜暂时找不到"
          description="也许菜谱编号写错了，或者它还没有被收进小厨房。去菜谱大全看看别的味道吧。"
          action={<Button onClick={() => navigate('/recipes')}>返回菜谱大全</Button>}
        />
      </div>
    );
  }

  const favorite = isFavorite(recipe.id);
  const orderLine = order.items.find((item) => item.recipeId === recipe.id);
  const doneCount = completedSteps.length;

  const handleToggleFavorite = () => {
    const nowFavorite = toggleFavorite(recipe.id);
    showToast(nowFavorite ? '已收进你的收藏夹' : '已取消收藏', {
      icon: <Heart className={cn('h-3.5 w-3.5', nowFavorite && 'fill-current')} />,
    });
  };

  const handleAddToOrder = () => {
    addOrderItem(recipe.id);
    showToast(
      orderLine
        ? `「${recipe.name}」又加了一份`
        : `「${recipe.name}」已加入今日菜单`,
      { icon: <Sparkles className="h-3.5 w-3.5" /> },
    );
  };

  const toggleStep = (index: number) => {
    setCompletedSteps((current) =>
      current.includes(index) ? current.filter((value) => value !== index) : [...current, index],
    );
  };

  const metaItems = [
    { icon: Clock, label: '烹饪时间', value: `${recipe.cookingTime} 分钟` },
    { icon: ChefHat, label: '难度', value: recipe.difficulty },
    { icon: Users, label: '份量', value: recipe.servings },
    { icon: Wallet, label: '参考成本', value: formatPrice(recipe.price) },
  ];

  return (
    <article className="relative min-h-dvh">
      <div className="relative h-[320px] w-full overflow-hidden bg-blush-100 sm:h-[380px]">
        <RecipeImage
          recipe={recipe}
          loading="eager"
          fallbackLabel="菜品图片准备中"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/25 to-ink-900/25" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-hero-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="返回上一页"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white shadow-soft backdrop-blur-md transition-colors hover:bg-white/30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            {orderLine && (
              <Link
                to="/order"
                aria-label="查看今日菜单"
                className="flex h-10 items-center gap-1 rounded-full border border-white/40 bg-white/20 px-3 text-[11px] text-white shadow-soft backdrop-blur-md transition-colors hover:bg-white/30"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                菜单 {orderLine.quantity}
              </Link>
            )}
            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-pressed={favorite}
              aria-label={favorite ? '取消收藏' : '收藏这道菜'}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border shadow-soft backdrop-blur-md transition-all active:scale-95',
                favorite
                  ? 'border-white/40 bg-theme text-white'
                  : 'border-white/40 bg-white/20 text-white hover:bg-white/30',
              )}
            >
              <Heart className={cn('h-4 w-4', favorite && 'fill-current')} />
            </button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-4 pb-10 text-white">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[10px] backdrop-blur">
              {recipe.category}
            </span>
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur"
              >
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="mt-2 font-display text-[30px] font-semibold leading-tight tracking-wide">
            {recipe.name}
          </h1>
          <p className="mt-1 text-[11px] text-white/75">
            {recipe.difficulty} · {recipe.cookingTime} 分钟 · {recipe.servings}
          </p>
        </div>
      </div>

      <div className="relative -mt-6 rounded-t-[32px] bg-canvas px-4 pb-detail pt-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-[9px] leading-relaxed text-ink-400">
            图片不合适？可以换成你相册里的实拍
          </p>
          <RecipeImageUpload recipe={recipe} variant="pill" showReset />
        </div>

        <section className="pk-card mb-4 p-4">
          <p className="text-[14px] leading-[1.9] text-ink-600">{recipe.description}</p>
          <div className="mt-4 grid grid-cols-4 gap-1 border-t border-dashed border-blush-100 pt-3">
            {metaItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1 px-0.5 text-center">
                <Icon className="h-4 w-4 text-blush-400" strokeWidth={1.7} />
                <span className="text-[9px] text-ink-400">{label}</span>
                <span className="text-[11px] font-medium leading-tight text-ink-800">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="pk-card mb-4 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink-900">食材清单</h2>
              <p className="mt-0.5 text-[10px] text-ink-400">按 {recipe.servings} 整理</p>
            </div>
            <span className="rounded-full bg-blush-50 px-2.5 py-1 text-[10px] text-blush-500">
              {recipe.ingredients.length} 样食材
            </span>
          </div>

          <ul className="divide-y divide-blush-50">
            {recipe.ingredients.map((ingredient) => (
              <li
                key={`${ingredient.name}-${ingredient.amount}`}
                className="flex items-baseline gap-2 py-2.5"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blush-300" />
                <span className="text-[14px] text-ink-700">{ingredient.name}</span>
                {ingredient.optional && (
                  <span className="rounded-full bg-cream-200 px-1.5 py-0.5 text-[8px] text-ink-500">
                    可选
                  </span>
                )}
                <span className="mx-1 min-w-4 flex-1 border-b border-dotted border-blush-200" />
                <span className="shrink-0 text-[13px] tabular-nums text-ink-500">
                  {ingredient.amount}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="pk-card mb-4 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink-900">制作步骤</h2>
              <p className="mt-0.5 text-[10px] text-ink-400">点一下步骤可以标记完成</p>
            </div>
            {doneCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-theme-soft px-2.5 py-1 text-[10px] font-medium text-theme-deep">
                  {doneCount}/{recipe.steps.length}
                </span>
                <button
                  type="button"
                  onClick={() => setCompletedSteps([])}
                  aria-label="重置步骤进度"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-ink-300 transition-colors hover:bg-blush-50 hover:text-ink-600"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          <ol className="relative">
            {recipe.steps.map((step, index) => {
              const done = completedSteps.includes(index);
              const isLast = index === recipe.steps.length - 1;

              return (
                <li key={`${step.title}-${index}`} className="relative pb-1 pl-11 last:pb-0">
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute left-[15px] top-9 h-[calc(100%_-_20px)] w-px',
                        done ? 'bg-theme/40' : 'bg-blush-100',
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      'absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors',
                      done
                        ? 'border-theme bg-theme text-white'
                        : 'border-blush-200 bg-white text-blush-500',
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleStep(index)}
                    aria-pressed={done}
                    className="mb-4 w-full rounded-2xl text-left transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme/40 focus-visible:ring-offset-2"
                  >
                    <h3
                      className={cn(
                        'pt-0.5 text-[15px] font-semibold transition-colors',
                        done ? 'text-ink-400 line-through' : 'text-ink-900',
                      )}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={cn(
                        'mt-1.5 whitespace-pre-line text-[14px] leading-[1.85] transition-colors',
                        done ? 'text-ink-400' : 'text-ink-600',
                      )}
                    >
                      {step.description}
                    </p>
                    {step.tip && (
                      <div className="mt-2 flex items-start gap-1.5 rounded-2xl bg-cream-100 px-3 py-2">
                        <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" strokeWidth={2} />
                        <p className="text-[12px] leading-relaxed text-ink-500">{step.tip}</p>
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        {recipe.tips && recipe.tips.length > 0 && (
          <section className="pk-card mb-4 p-4">
            <div className="mb-2.5 flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4 text-amber-500" strokeWidth={1.9} />
              <h2 className="font-display text-lg font-semibold text-ink-900">小贴士</h2>
            </div>
            <ul className="space-y-2">
              {recipe.tips.map((tip) => (
                <li key={tip} className="flex gap-2 text-[12.5px] leading-relaxed text-ink-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blush-300" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-3xl border border-dashed border-blush-100 bg-white/50 p-3.5">
          <p className="text-[10px] leading-relaxed text-ink-400">
            <span className="font-medium text-ink-500">菜谱来源：</span>
            {recipe.source}
          </p>
          {recipe.sourceUrl ? (
            <p className="mt-1 text-[10px] leading-relaxed text-ink-400">
              菜谱文字来自 HowToCook 开源项目（Unlicense），已按手机阅读重新排版；图片作者与许可见下方。
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="ml-0.5 inline-flex items-center gap-0.5 text-theme-deep underline-offset-4 hover:underline"
              >
                查看原始菜谱
                <Sparkles className="h-2.5 w-2.5" />
              </a>
            </p>
          ) : (
            <p className="mt-1 text-[10px] leading-relaxed text-ink-400">
              菜谱为本站原创整理，参考了 HowToCook 的结构，未复制其内容。
            </p>
          )}
          <p className="mt-1.5 text-[10px] leading-relaxed text-ink-400">
            菜品图片版权与来源详见
            <a
              href="./credits.html"
              target="_blank"
              rel="noreferrer noopener"
              className="ml-0.5 text-theme-deep underline-offset-4 hover:underline"
            >
              图片来源与许可
            </a>
            。
          </p>
          <Link
            to="/recipes"
            className="mt-2 inline-flex items-center gap-1 text-[10px] text-theme-deep underline-offset-4 hover:underline"
          >
            继续逛逛别的菜
            <Sparkles className="h-3 w-3" />
          </Link>
        </section>

        <footer className="mt-5 text-center text-[8px] leading-relaxed text-ink-300">
          <p>戴诗佳女士所有，由 ymq 独立开发，版权所有 ©</p>
          <p className="mt-0.5 text-[7.5px] text-ink-300/80">
            All rights reserved by Ms. Dai Shijia. Independently developed by ymq. ©
          </p>
        </footer>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[760px] items-center gap-2.5 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold leading-none text-theme-deep">
              {formatPrice(recipe.price)}
            </p>
            <p className="mt-1 text-[9px] text-ink-400">
              参考食材成本 · {recipe.servings}
            </p>
            {orderLine && (
              <Link
                to="/order"
                className="mt-0.5 inline-block text-[9px] text-theme-deep underline underline-offset-2"
              >
                已在菜单 {orderLine.quantity} 份 · 去菜单
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-pressed={favorite}
            aria-label={favorite ? '取消收藏' : '收藏这道菜'}
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all active:scale-95',
              favorite
                ? 'border-theme bg-theme text-white shadow-float'
                : 'border-blush-200 bg-white text-ink-500 hover:text-theme',
            )}
          >
            <Heart className={cn('h-5 w-5', favorite && 'fill-current')} />
          </button>

          <Button
            onClick={handleAddToOrder}
            className="h-12 shrink-0 px-4"
            leadingIcon={<Plus className="h-4 w-4" />}
          >
            {orderLine ? '再加一份' : '加入菜单'}
          </Button>
        </div>
      </div>
    </article>
  );
}
