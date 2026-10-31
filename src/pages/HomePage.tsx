import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChefHat,
  ChevronRight,
  Clock,
  Dices,
  Heart,
  NotebookPen,
  ShoppingBag,
  Sparkles,
  Star,
  UserRound,
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { getPopularRecipes, getRecipeById, getTodayRecommendation } from '../data/recipes';
import { useAppStore } from '../store/AppStore';
import { useToast } from '../components/ui/Toast';
import { RecipeImage } from '../components/recipe/RecipeImage';
import { Avatar } from '../components/ui/Avatar';
import { FavoriteButton } from '../components/recipe/FavoriteButton';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { Bow, PearlDivider } from '../components/decorations/Ornaments';
import {
  formatDateCN,
  formatPrice,
  formatShortDate,
  formatWeekday,
  greeting,
  todayISO,
} from '../lib/format';
import { APP_NAME, APP_NAME_CN, APP_TAGLINE, APP_VERSION } from '../config/app';

export function HomePage() {
  const { settings, favorites, order, diary, isFavorite, toggleFavorite } = useAppStore();
  const { showToast } = useToast();

  const today = new Date();
  const recommendation = getTodayRecommendation(today);
  const popular = getPopularRecipes(5, recommendation.id);
  const selectedItems = order.items.filter((item) => item.selected);
  const selectedTotal = selectedItems.reduce((total, item) => {
    const recipe = getRecipeById(item.recipeId);
    return total + (recipe ? recipe.price * item.quantity : 0);
  }, 0);
  const selectedNames = selectedItems
    .map((item) => getRecipeById(item.recipeId)?.name)
    .filter(Boolean)
    .join('、');

  const quickEntries = [
    {
      to: '/favorites',
      label: '我的收藏',
      value: `${favorites.length} 道`,
      icon: Heart,
      tint: 'bg-blush-100 text-blush-500',
    },
    {
      to: '/order',
      label: '今日菜单',
      value: `${order.items.length} 道`,
      icon: ShoppingBag,
      tint: 'bg-cream-200 text-amber-700',
    },
    {
      to: '/diary',
      label: '美食日记',
      value: `${diary.length} 篇`,
      icon: NotebookPen,
      tint: 'bg-lilac-100 text-lilac-500',
    },
    {
      to: '/settings',
      label: '我的厨房',
      value: '去设置',
      icon: UserRound,
      tint: 'bg-emerald-50 text-emerald-600',
    },
  ];

  const handleToggleFavorite = () => {
    const nowFavorite = toggleFavorite(recommendation.id);
    showToast(nowFavorite ? '已收进你的收藏夹' : '已取消收藏', {
      icon: <Heart className={nowFavorite ? 'h-3.5 w-3.5 fill-current' : 'h-3.5 w-3.5'} />,
    });
  };

  return (
    <div className="space-y-7">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] tracking-wide text-ink-500">
            {formatDateCN(todayISO())} · {formatWeekday(todayISO())}
          </p>
          <h1 className="mt-1 truncate font-display text-[24px] font-semibold leading-tight tracking-wide text-ink-900">
            {greeting(today)}，{settings.nickname}
          </h1>
          <p className="mt-1 text-xs text-ink-500">今天想做点什么好吃的呀？</p>
        </div>
        <Link
          to="/settings"
          aria-label="打开我的厨房"
          className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-blush-100 to-lilac-100 text-xl shadow-soft transition-transform hover:scale-105"
        >
          <Avatar avatar={settings.avatar} className="h-full w-full text-xl" />
        </Link>
      </header>

      <section className="pk-hero relative overflow-hidden rounded-[32px] px-5 pb-5 pt-6 text-white shadow-card">
        <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full border border-white/20" />
        <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-white/10" />
        <Bow className="pointer-events-none absolute right-4 top-4 h-12 w-14 animate-float text-white/80" />
        <Star
          className="pointer-events-none absolute right-24 top-8 h-3 w-3 text-white/60"
          fill="currentColor"
        />
        <Sparkles className="pointer-events-none absolute right-10 top-24 h-4 w-4 text-white/50" />

        <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-white/75">
          {APP_NAME}
        </p>
        <h2 className="mt-2 font-display text-[27px] font-semibold leading-snug tracking-wide">
          {APP_NAME_CN}
        </h2>
        <p className="mt-1.5 max-w-[240px] text-xs leading-relaxed text-white/85">
          {APP_TAGLINE}。今天也要好好吃饭呀。
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link
            to="/recipes"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-xs font-semibold text-theme-deep shadow-soft transition-transform hover:scale-[1.03] active:scale-95"
          >
            开始点菜
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/diary"
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/50 bg-white/10 px-4 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <NotebookPen className="h-3.5 w-3.5" />
            写美食日记
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-white/15 rounded-2xl bg-white/10 px-2 py-2.5 backdrop-blur-sm">
          {[
            { label: '收藏', value: favorites.length },
            { label: '菜单', value: order.items.length },
            { label: '日记', value: diary.length },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-lg font-semibold leading-none">{stat.value}</p>
              <p className="mt-1 text-[10px] tracking-widest text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {order.items.length > 0 && (
        <Link
          to="/order"
          className="flex items-center gap-3 rounded-3xl border border-white/80 bg-white/85 px-4 py-3 shadow-soft transition-colors hover:bg-white"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-200 text-amber-700">
            <ShoppingBag className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] tracking-wide text-ink-500">
              今晚的菜单 · {selectedItems.length} 道已选
            </p>
            <p className="mt-0.5 truncate text-xs font-medium text-ink-800">
              {selectedNames || '还没有勾选想吃的菜'}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-sm font-semibold text-theme-deep">
              {formatPrice(selectedTotal)}
            </p>
            <p className="text-[9px] text-ink-400">参考成本</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-ink-300" />
        </Link>
      )}

      <section aria-label="快捷入口" className="grid grid-cols-4 gap-2">
        {quickEntries.map(({ to, label, value, icon: Icon, tint }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-1.5 rounded-3xl border border-white/80 bg-white/75 px-1 py-3 shadow-soft backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white"
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-full ${tint}`}>
              <Icon className="h-4 w-4" strokeWidth={1.9} />
            </span>
            <span className="text-[11px] font-medium text-ink-700">{label}</span>
            <span className="text-[9px] leading-none text-ink-400">{value}</span>
          </Link>
        ))}
      </section>

      <Link
        to="/wheel"
        className="group relative flex items-center gap-3 overflow-hidden rounded-[26px] border border-white/80 bg-gradient-to-r from-blush-100 via-cream-100 to-lilac-100 p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-float"
      >
        <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/40" />
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/85 text-theme-deep shadow-soft">
          <Dices className="h-6 w-6" strokeWidth={1.8} />
        </span>
        <div className="relative min-w-0 flex-1">
          <p className="text-[9px] tracking-[0.22em] text-theme-deep/60">TODAY'S LUCK</p>
          <p className="mt-0.5 font-display text-base font-semibold text-ink-800">今天吃什么？</p>
          <p className="mt-0.5 text-[10px] text-ink-500">转一下，把今晚交给运气</p>
        </div>
        <span className="relative inline-flex shrink-0 items-center gap-0.5 text-[10px] font-medium text-theme-deep">
          去转
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </Link>

      <section>
        <SectionHeader
          title="今日推荐"
          subtitle={`${formatShortDate(todayISO())} · 今天想推荐这道`}
          action={
            <Link
              to="/recipes"
              className="flex items-center gap-0.5 text-[11px] text-ink-400 transition-colors hover:text-theme-deep"
            >
              全部菜谱
              <ChevronRight className="h-3 w-3" />
            </Link>
          }
        />
        <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-card">
          <Link to={`/recipe/${recommendation.id}`} className="block">
            <div className="relative aspect-[16/11] w-full overflow-hidden">
              <RecipeImage
                recipe={recommendation}
                loading="eager"
                className="h-full w-full transition-transform duration-700 hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <Badge tone="pink" className="bg-white/90">
                    {recommendation.category}
                  </Badge>
                  <span className="rounded-full border border-white/30 bg-white/10 px-2 py-1 text-[10px] backdrop-blur">
                    <Sparkles className="-mt-0.5 mr-1 inline h-2.5 w-2.5" />
                    主厨推荐
                  </span>
                </div>
                <h3 className="font-display text-[22px] font-semibold tracking-wide">
                  {recommendation.name}
                </h3>
                <p className="mt-1 line-clamp-2 max-w-[92%] text-[11px] leading-relaxed text-white/80">
                  {recommendation.description}
                </p>
                <div className="mt-2.5 flex items-center gap-3 text-[10px] text-white/80">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {recommendation.cookingTime} 分钟
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ChefHat className="h-3 w-3" />
                    {recommendation.difficulty}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-white">
                    查看做法
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
          <FavoriteButton
            active={isFavorite(recommendation.id)}
            onToggle={handleToggleFavorite}
            className="absolute right-3 top-3"
            size="md"
          />
        </div>
      </section>

      <section>
        <SectionHeader
          title="菜谱分类"
          subtitle="按今天的心情挑一个"
          action={
            <Link
              to="/recipes"
              className="flex items-center gap-0.5 text-[11px] text-ink-400 transition-colors hover:text-theme-deep"
            >
              查看全部
              <ChevronRight className="h-3 w-3" />
            </Link>
          }
        />
        <div className="-mx-4 overflow-x-auto px-4 pb-1 no-scrollbar">
          <div className="flex w-max gap-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                to={`/recipes?category=${encodeURIComponent(category.name)}`}
                className="group flex w-[58px] flex-col items-center gap-1.5"
              >
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-white/80 text-[22px] shadow-soft transition-transform duration-200 group-hover:-translate-y-0.5"
                  style={{ backgroundColor: category.tint }}
                  aria-hidden="true"
                >
                  {category.emoji}
                </span>
                <span className="text-[10.5px] text-ink-600 transition-colors group-hover:text-theme-deep">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="今日热门" subtitle="大家最近都在做这些" />
        <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white/85 shadow-card">
          {popular.map((recipe, index) => (
            <Link
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              className="flex items-center gap-3 border-b border-blush-50/80 px-3.5 py-3 transition-colors last:border-b-0 hover:bg-blush-50/50"
            >
              <span
                className={`w-5 shrink-0 text-center font-display text-sm font-semibold ${
                  index === 0 ? 'text-blush-500' : index < 3 ? 'text-blush-400' : 'text-ink-300'
                }`}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <RecipeImage
                recipe={recipe}
                compact
                className="h-12 w-12 shrink-0 rounded-2xl"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-ink-800">{recipe.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-ink-400">
                  <span>{recipe.category}</span>
                  <span className="h-0.5 w-0.5 rounded-full bg-ink-300" />
                  <span>{recipe.cookingTime} 分钟</span>
                  <span className="h-0.5 w-0.5 rounded-full bg-ink-300" />
                  <span>{recipe.difficulty}</span>
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-ink-300" />
            </Link>
          ))}
        </div>
      </section>

      <PearlDivider className="pt-1" />

      <footer className="pb-2 text-center">
        <p className="font-display text-xs tracking-widest text-ink-500">
          愿每一顿饭，都有你陪着一起吃
        </p>
        <p className="mt-2 text-[9px] tracking-[0.2em] text-ink-300">
          {APP_NAME.toUpperCase()} · V{APP_VERSION}
        </p>
        <p className="mt-3 text-[8px] leading-relaxed text-ink-300">
          戴诗佳女士所有，由 ymq 独立开发，版权所有 ©
        </p>
        <p className="mt-0.5 text-[7.5px] leading-relaxed text-ink-300/80">
          All rights reserved by Ms. Dai Shijia. Independently developed by ymq. ©
        </p>
      </footer>
    </div>
  );
}
