import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChefHat, Heart, Search, Sparkles } from 'lucide-react';
import { RECIPE_CATEGORIES, type RecipeCategory } from '../types';
import { RECIPES, countByCategory, searchRecipes } from '../data/recipes';
import { useAppStore } from '../store/AppStore';
import { useToast } from '../components/ui/Toast';
import { SearchBar } from '../components/recipe/SearchBar';
import { CategoryFilter, type CategoryFilterValue } from '../components/recipe/CategoryFilter';
import { RecipeCard } from '../components/recipe/RecipeCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/cn';

function isCategory(value: string | null): value is RecipeCategory {
  return Boolean(value) && RECIPE_CATEGORIES.includes(value as RecipeCategory);
}

export function RecipesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const { isFavorite, toggleFavorite, addOrderItem } = useAppStore();
  const { showToast } = useToast();

  const categoryParam = searchParams.get('category');
  const category: CategoryFilterValue = isCategory(categoryParam) ? categoryParam : '全部';

  const filteredRecipes = useMemo(
    () =>
      searchRecipes(query).filter(
        (recipe) => category === '全部' || recipe.category === category,
      ),
    [category, query],
  );

  const counts = countByCategory();

  const handleCategoryChange = (value: CategoryFilterValue) => {
    const next = new URLSearchParams(searchParams);
    if (value === '全部') {
      next.delete('category');
    } else {
      next.set('category', value);
    }
    setSearchParams(next, { replace: true });
  };

  const handleToggleFavorite = (recipeId: string, name: string) => {
    const nowFavorite = toggleFavorite(recipeId);
    showToast(nowFavorite ? `已把「${name}」收进收藏` : '已取消收藏', {
      icon: <Heart className={cn('h-3.5 w-3.5', nowFavorite && 'fill-current')} />,
    });
  };

  const handleAddToOrder = (recipeId: string, name: string) => {
    addOrderItem(recipeId);
    showToast(`「${name}」已加入今日菜单`, { icon: <Sparkles className="h-3.5 w-3.5" /> });
  };

  const resetFilters = () => {
    setQuery('');
    setSearchParams({}, { replace: true });
  };

  const isFiltering = category !== '全部' || query.trim().length > 0;

  return (
    <div>
      <PageHeader
        title="菜谱大全"
        subtitle={`${RECIPES.length} 道私房菜，慢慢做成我们的味道`}
        right={
          <Badge tone="pink" className="mt-1 px-3 py-1.5">
            <ChefHat className="h-3 w-3" />
            {RECIPES.length} 道
          </Badge>
        }
      />

      <div className="space-y-3.5">
        <SearchBar value={query} onChange={setQuery} />
        <CategoryFilter value={category} onChange={handleCategoryChange} counts={counts} />
      </div>

      <div className="mb-3 mt-5 flex items-center justify-between gap-3">
        <p className="text-[11px] text-ink-500">
          {isFiltering ? (
            <>
              找到 <span className="font-semibold text-theme-deep">{filteredRecipes.length}</span>{' '}
              道菜
            </>
          ) : (
            <>
              共 <span className="font-semibold text-theme-deep">{filteredRecipes.length}</span>{' '}
              道私房菜
            </>
          )}
          {category !== '全部' && <span className="ml-1 text-ink-400">· {category}</span>}
        </p>
        {isFiltering && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-[11px] text-ink-400 underline-offset-4 transition-colors hover:text-theme-deep hover:underline"
          >
            清空筛选
          </button>
        )}
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {filteredRecipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              favorite={isFavorite(recipe.id)}
              onToggleFavorite={() => handleToggleFavorite(recipe.id, recipe.name)}
              onAddToOrder={() => handleAddToOrder(recipe.id, recipe.name)}
              priority={index < 2}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="没有找到这道味道"
          description="换个菜名、食材或者分类再试试吧，也许它正藏在别的分类里。"
          action={
            <Button variant="secondary" onClick={resetFilters}>
              查看全部菜谱
            </Button>
          }
        />
      )}
    </div>
  );
}
