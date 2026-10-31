import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  MessageSquareHeart,
  ShoppingBag,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { getRecipeById } from '../data/recipes';
import { useAppStore } from '../store/AppStore';
import { useToast } from '../components/ui/Toast';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Checkbox } from '../components/ui/Checkbox';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { RecipeImage } from '../components/recipe/RecipeImage';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Sheet } from '../components/ui/Sheet';
import { cn } from '../lib/cn';
import { formatPrice, formatTime } from '../lib/format';

export function OrderPage() {
  const navigate = useNavigate();
  const {
    order,
    removeOrderItem,
    setOrderQuantity,
    toggleOrderItem,
    setAllOrderSelected,
    setOrderNote,
    clearOrder,
    confirmOrder,
  } = useAppStore();
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);

  const rows = useMemo(
    () =>
      order.items.flatMap((item) => {
        const recipe = getRecipeById(item.recipeId);
        return recipe ? [{ item, recipe }] : [];
      }),
    [order.items],
  );

  const selectedRows = rows.filter((row) => row.item.selected);
  const selectedQuantity = selectedRows.reduce((total, row) => total + row.item.quantity, 0);
  const totalQuantity = rows.reduce((total, row) => total + row.item.quantity, 0);
  const totalPrice = selectedRows.reduce(
    (total, row) => total + row.recipe.price * row.item.quantity,
    0,
  );
  const allSelected = rows.length > 0 && rows.every((row) => row.item.selected);
  const someSelected = rows.some((row) => row.item.selected);

  const handleConfirm = () => {
    confirmOrder();
    setConfirmOpen(false);
    showToast('菜单已确认，今晚好好吃饭呀', { icon: <CheckCircle2 className="h-3.5 w-3.5" /> });
  };

  const handleClear = () => {
    clearOrder();
    showToast('今日菜单已清空', { icon: <Trash2 className="h-3.5 w-3.5" /> });
  };

  return (
    <div>
      <PageHeader
        title="今日菜单"
        subtitle="把想吃的告诉我，今晚我来做"
        right={
          <div className="mt-1 flex items-center gap-1 rounded-full border border-white/80 bg-white/80 px-3 py-2 shadow-soft">
            <ShoppingBag className="h-3.5 w-3.5 text-blush-500" />
            <span className="text-[11px] font-medium text-ink-600">{totalQuantity} 份</span>
          </div>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="今晚的菜单还是空白的"
          description="去菜谱里点几道想吃的菜吧，选好份数、写张小纸条，就能把菜单交给大厨啦。"
          action={
            <Button onClick={() => navigate('/recipes')} leadingIcon={<Sparkles className="h-4 w-4" />}>
              去挑几道菜
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <section className="pk-card overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-blush-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allSelected}
                  indeterminate={!allSelected && someSelected}
                  onChange={() => setAllOrderSelected(!allSelected)}
                  label={allSelected ? '取消全选' : '全选所有菜品'}
                />
                <span className="text-xs text-ink-600">全选</span>
              </div>
              <span className="text-[10px] text-ink-400">
                已选 {selectedRows.length} / {rows.length} 道
              </span>
            </div>

            <ul className="divide-y divide-blush-50">
              {rows.map(({ item, recipe }) => (
                <li
                  key={recipe.id}
                  className={cn(
                    'flex gap-3 px-4 py-3.5 transition-opacity duration-200',
                    !item.selected && 'opacity-55',
                  )}
                >
                  <div className="pt-4">
                    <Checkbox
                      checked={item.selected}
                      onChange={() => toggleOrderItem(recipe.id)}
                      label={item.selected ? `取消选择${recipe.name}` : `选择${recipe.name}`}
                    />
                  </div>

                  <Link
                    to={`/recipe/${recipe.id}`}
                    className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-blush-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme/40"
                    aria-label={`查看 ${recipe.name} 的做法`}
                  >
                    <RecipeImage
                      recipe={recipe}
                      compact
                      className="h-full w-full"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          to={`/recipe/${recipe.id}`}
                          className="block truncate text-[13px] font-medium text-ink-800 hover:text-theme-deep"
                        >
                          {recipe.name}
                        </Link>
                        <p className="mt-0.5 text-[10px] text-ink-400">
                          {recipe.category} · {formatPrice(recipe.price)}/份
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          removeOrderItem(recipe.id);
                          showToast(`已把「${recipe.name}」移出菜单`, {
                            icon: <Trash2 className="h-3.5 w-3.5" />,
                          });
                        }}
                        aria-label={`从菜单中删除 ${recipe.name}`}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-300 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QuantityStepper
                        value={item.quantity}
                        onChange={(quantity) => setOrderQuantity(recipe.id, quantity)}
                      />
                      <span className="text-[13px] font-semibold tabular-nums text-theme-deep">
                        {formatPrice(recipe.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="pk-card p-4">
            <label htmlFor="order-note" className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink-700">
              <MessageSquareHeart className="h-4 w-4 text-blush-400" strokeWidth={1.8} />
              给大厨的小纸条
            </label>
            <textarea
              id="order-note"
              value={order.note}
              onChange={(event) => setOrderNote(event.target.value)}
              maxLength={300}
              rows={3}
              placeholder="少放辣、多加香菜、想配一碗米饭…"
              className="pk-input min-h-[92px] resize-none leading-relaxed"
            />
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-ink-400">
              <span>口味和忌口都可以写在这里</span>
              <span className="tabular-nums">{order.note.length}/300</span>
            </div>
          </section>

          <section className="pk-card overflow-hidden p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-ink-900">菜单小结</h2>
              {order.confirmedAt ? (
                <Badge tone="sage">
                  <CheckCircle2 className="h-3 w-3" />
                  已确认 · {formatTime(order.confirmedAt)}
                </Badge>
              ) : (
                <Badge tone="cream">待确认</Badge>
              )}
            </div>

            <dl className="mt-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <dt className="text-ink-500">已选菜品</dt>
                <dd className="text-ink-800">
                  {selectedRows.length} 道 · 共 {selectedQuantity} 份
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-500">参考食材成本</dt>
                <dd className="font-display text-lg font-semibold text-theme-deep">
                  {formatPrice(totalPrice)}
                </dd>
              </div>
            </dl>

            <p className="mt-2 rounded-2xl bg-cream-100 px-3 py-2 text-[10px] leading-relaxed text-ink-500">
              价格按两人份食材估算，仅作菜单参考，不涉及真实支付。未勾选的菜品不会计入总价和确认内容。
            </p>

            {order.confirmedAt && (
              <p className="mt-2 text-[10px] text-emerald-600">
                菜单已确认，如需调整可以直接修改后重新确认。
              </p>
            )}

            <div className="mt-4 flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => setClearOpen(true)}
                leadingIcon={<Trash2 className="h-4 w-4" />}
                className="shrink-0"
              >
                清空
              </Button>
              <Button
                fullWidth
                disabled={selectedRows.length === 0}
                onClick={() => setConfirmOpen(true)}
                leadingIcon={<CheckCircle2 className="h-4 w-4" />}
              >
                {order.confirmedAt ? '重新确认菜单' : '确认菜单'}
              </Button>
            </div>
            {selectedRows.length === 0 && (
              <p className="mt-2 text-center text-[10px] text-ink-400">
                先勾选至少一道菜，才能确认菜单哦
              </p>
            )}
          </section>
        </div>
      )}

      <ConfirmDialog
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        title="清空今日菜单？"
        description="菜单里的菜品、份数和备注都会一起清空，这个操作无法撤销。"
        confirmLabel="清空菜单"
        tone="danger"
        onConfirm={handleClear}
      />

      <Sheet
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="确认今日菜单"
        description="确认之后，就可以照着菜单准备食材啦。"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setConfirmOpen(false)}>
              再看看
            </Button>
            <Button
              fullWidth
              onClick={handleConfirm}
              leadingIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              确认这顿饭
            </Button>
          </div>
        }
      >
        <ul className="divide-y divide-blush-50 rounded-2xl bg-white/60 px-3">
          {selectedRows.map(({ item, recipe }) => (
            <li key={recipe.id} className="flex items-center justify-between gap-3 py-2.5 text-xs">
              <span className="min-w-0 truncate text-ink-700">{recipe.name}</span>
              <span className="shrink-0 text-ink-400">
                ×{item.quantity} · {formatPrice(recipe.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        {order.note.trim() && (
          <div className="mt-3 rounded-2xl border border-dashed border-blush-200 bg-blush-50/60 px-3 py-2.5">
            <p className="text-[10px] font-medium text-ink-500">给大厨的小纸条</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-700">{order.note}</p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-theme-soft px-4 py-3">
          <span className="text-xs text-ink-600">参考食材成本</span>
          <span className="font-display text-xl font-semibold text-theme-deep">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </Sheet>
    </div>
  );
}
