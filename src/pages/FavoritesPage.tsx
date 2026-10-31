import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Heart, HeartOff, Sparkles, Trash2 } from 'lucide-react';
import type { FavoriteRecord, Recipe } from '../types';
import { getRecipeById } from '../data/recipes';
import { useAppStore } from '../store/AppStore';
import { useToast } from '../components/ui/Toast';
import { PageHeader } from '../components/ui/PageHeader';
import { RecipeCard } from '../components/recipe/RecipeCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/cn';

type FavoriteTab = 'all' | 'want' | 'cooked';

interface SavedItem {
  record: FavoriteRecord;
  recipe: Recipe;
}

export function FavoritesPage() {
  const navigate = useNavigate();
  const {
    favorites,
    isFavorite,
    toggleFavorite,
    setCooked,
    addOrderItem,
  } = useAppStore();
  const { showToast } = useToast();
  const [tab, setTab] = useState<FavoriteTab>('all');

  const savedItems = useMemo(
    () =>
      favorites
        .flatMap((record) => {
          const recipe = getRecipeById(record.recipeId);
          return recipe ? [{ record, recipe }] : [];
        })
        .sort((first, second) => second.record.savedAt.localeCompare(first.record.savedAt)),
    [favorites],
  );

  const cookedCount = savedItems.filter((item) => item.record.cooked).length;
  const wantCount = savedItems.length - cookedCount;

  const visibleItems = savedItems.filter((item) => {
    if (tab === 'want') return !item.record.cooked;
    if (tab === 'cooked') return item.record.cooked;
    return true;
  });

  const tabs: Array<{ id: FavoriteTab; label: string; count: number }> = [
    { id: 'all', label: '全部收藏', count: savedItems.length },
    { id: 'want', label: '想吃的菜', count: wantCount },
    { id: 'cooked', label: '已经做过', count: cookedCount },
  ];

  const handleToggleFavorite = (item: SavedItem) => {
    const nowFavorite = toggleFavorite(item.recipe.id);
    showToast(nowFavorite ? '已重新收藏' : `已把「${item.recipe.name}」移出收藏`, {
      icon: <Heart className="h-3.5 w-3.5" />,
    });
  };

  const handleToggleCooked = (item: SavedItem) => {
    const nextCooked = !item.record.cooked;
    setCooked(item.recipe.id, nextCooked);
    showToast(nextCooked ? '记下啦，这道已经做过' : '已移回想吃的清单', {
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    });
  };

  const handleAddToOrder = (item: SavedItem) => {
    addOrderItem(item.recipe.id);
    showToast(`「${item.recipe.name}」已加入今日菜单`, {
      icon: <Sparkles className="h-3.5 w-3.5" />,
    });
  };

  const emptyState = {
    all: {
      icon: HeartOff,
      title: '收藏夹还空空的',
      description: '看到喜欢的菜，点一下小爱心就能把它留在身边，慢慢做给对方吃。',
    },
    want: {
      icon: Heart,
      title: '还没有想吃的菜',
      description: '去菜谱里逛一逛，把心动的味道先收藏起来，再标记成想吃的菜。',
    },
    cooked: {
      icon: CheckCircle2,
      title: '还没有做过的记录',
      description: '做完一道菜后，在收藏卡片上点「标记已做过」，它就会出现在这里。',
    },
  }[tab];

  return (
    <div>
      <PageHeader
        title="我的收藏"
        subtitle="把心动的味道，一道一道收藏起来"
        right={
          <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blush-100 to-lilac-100 text-blush-500 shadow-soft">
            <Heart className="h-5 w-5 fill-current" strokeWidth={1.8} />
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-3 gap-1 rounded-full border border-white/80 bg-white/70 p-1 shadow-soft backdrop-blur">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            aria-pressed={tab === item.id}
            className={cn(
              'flex h-9 items-center justify-center gap-1.5 rounded-full text-[11px] transition-all duration-200',
              tab === item.id
                ? 'bg-gradient-to-br from-theme to-theme-deep font-semibold text-white shadow-soft'
                : 'text-ink-500 hover:text-ink-800',
            )}
          >
            {item.label}
            <span
              className={cn(
                'rounded-full px-1 text-[9px] leading-4',
                tab === item.id ? 'bg-white/20' : 'bg-blush-50 text-blush-500',
              )}
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {visibleItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {visibleItems.map((item) => (
            <RecipeCard
              key={item.recipe.id}
              recipe={item.recipe}
              favorite={isFavorite(item.recipe.id)}
              onToggleFavorite={() => handleToggleFavorite(item)}
              onAddToOrder={() => handleAddToOrder(item)}
            >
              <div className="mt-2.5 flex items-center gap-1.5 border-t border-dashed border-blush-100 pt-2">
                <button
                  type="button"
                  onClick={() => handleToggleCooked(item)}
                  aria-pressed={item.record.cooked}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1 rounded-full px-1.5 py-1.5 text-[10px] transition-colors',
                    item.record.cooked
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-blush-50 text-ink-500 hover:bg-blush-100 hover:text-theme-deep',
                  )}
                >
                  <CheckCircle2
                    className={cn('h-3 w-3', item.record.cooked && 'fill-emerald-100')}
                    strokeWidth={2}
                  />
                  {item.record.cooked ? '已做过' : '标记做过'}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleFavorite(item)}
                  aria-label={`移除收藏 ${item.recipe.name}`}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink-300 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </RecipeCard>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
          action={
            <Button onClick={() => navigate('/recipes')} leadingIcon={<Heart className="h-4 w-4" />}>
              去菜谱里逛逛
            </Button>
          }
        />
      )}
    </div>
  );
}
