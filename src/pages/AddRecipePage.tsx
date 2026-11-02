import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChefHat,
  ImagePlus,
  Loader2,
  RefreshCw,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { useAppStore } from '../store/AppStore';
import { AiError, generateDishImage, generateRecipeDraft, hasImageKey, hasTextKey } from '../lib/ai';
import type { AiTaskStatus, RecipeDraft } from '../types/ai';
import type { Recipe } from '../types';
import { cn } from '../lib/cn';

const EXAMPLES = ['糖醋排骨', '想吃得清淡一点，来条鱼', '番茄牛腩煲', '十分钟搞定的早餐'];

export function AddRecipePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { aiSettings, addCustomRecipe, setRecipeImage, customRecipes, deleteCustomRecipe } =
    useAppStore();

  const [input, setInput] = useState('');
  const [status, setStatus] = useState<AiTaskStatus>('idle');
  const [stage, setStage] = useState('');
  const [draft, setDraft] = useState<RecipeDraft | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; hint?: string } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const busy = status === 'text' || status === 'image';
  const keyReady = hasTextKey(aiSettings);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setDraft(null);
    setImageDataUrl(null);
    setError(null);
    setStatus('idle');
    setStage('');
  }, []);

  const handleGenerate = useCallback(async () => {
    if (busy || !input.trim()) return;
    reset();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus('text');
    setStage('正在写菜谱…');
    try {
      const next = await generateRecipeDraft(input.trim(), aiSettings, controller.signal);
      setDraft(next);
      setStatus('image');
      setStage('菜谱写好了，正在画配图…');
      try {
        const url = await generateDishImage(next, aiSettings, controller.signal);
        setImageDataUrl(url);
      } catch (imageError) {
        // 配图失败不影响保存菜谱
        const message = imageError instanceof AiError ? imageError.message : '配图生成失败';
        showToast(`${message}，可以先保存文字版`);
      }
      setStatus('done');
      setStage('');
    } catch (error) {
      const message = error instanceof AiError ? error : new AiError('生成失败，请重试');
      setError({ message: message.message, hint: (message as AiError).hint });
      setStatus('error');
      setStage('');
    } finally {
      abortRef.current = null;
    }
  }, [aiSettings, busy, input, reset, showToast]);

  const handleSave = useCallback(async () => {
    if (!draft) return;
    const id = `custom_${Date.now().toString(36)}`;
    const recipe: Recipe = {
      id,
      name: draft.name,
      category: draft.category,
      coverImage: '',
      description: draft.description,
      ingredients: draft.ingredients,
      steps: draft.steps,
      difficulty: draft.difficulty,
      cookingTime: draft.cookingTime,
      servings: draft.servings,
      price: draft.price,
      source: 'AI 生成 · 请按自己口味核对',
      tags: draft.tags.length ? draft.tags : ['AI 新菜'],
      tips: draft.tips.length ? draft.tips : undefined,
      popularity: 52,
      custom: true,
      createdAt: new Date().toISOString(),
    };
    addCustomRecipe(recipe);
    if (imageDataUrl) {
      try {
        await setRecipeImage(id, imageDataUrl);
      } catch (error) {
        console.warn('[PrincessKitchen] 保存配图失败', error);
        showToast('菜谱已保存，配图没存上');
      }
    }
    showToast(`「${recipe.name}」已收进菜谱`, { icon: <Sparkles className="h-3.5 w-3.5" /> });
    navigate(`/recipe/${id}`);
  }, [addCustomRecipe, draft, imageDataUrl, navigate, setRecipeImage, showToast]);

  return (
    <div>
      <PageHeader
        title="AI 加菜"
        subtitle="说出想吃的，菜谱和配图一起给你"
        right={
          <button
            type="button"
            onClick={() => navigate('/recipes')}
            aria-label="返回菜谱"
            className="mt-1 flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/80 text-ink-500 shadow-soft"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        }
      />

      {!keyReady && (
        <div className="pk-card mb-4 border border-amber-200/70 bg-amber-50/80 p-4">
          <p className="text-[12.5px] leading-relaxed text-amber-800">
            还差一步：去「我的厨房 → AI 助手」填一个 DeepSeek 或 Agnes 的 API Key，就能开始生成菜谱了。
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-2"
            onClick={() => navigate('/settings')}
          >
            去填 Key
          </Button>
        </div>
      )}

      <section className="pk-card p-4">
        <label htmlFor="dish-input" className="pk-label">
          想吃什么？
        </label>
        <textarea
          id="dish-input"
          value={input}
          onChange={(event) => setInput(event.target.value.slice(0, 120))}
          rows={3}
          placeholder="输入菜名，或者描述一下想吃的：「想吃点酸辣的、下饭的，最好 30 分钟能做好」"
          className="pk-input mt-1.5 min-h-[88px] resize-none leading-relaxed"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setInput(example)}
              className="rounded-full border border-blush-100 bg-white/70 px-2.5 py-1 text-[10.5px] text-ink-500 transition-colors hover:border-blush-200 hover:text-theme-deep"
            >
              {example}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button
            fullWidth
            disabled={busy || !input.trim()}
            onClick={handleGenerate}
            leadingIcon={
              busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )
            }
          >
            {busy ? stage || '生成中…' : draft ? '再生成一版' : '生成菜谱'}
          </Button>
          {busy && (
            <Button variant="secondary" size="md" className="shrink-0" onClick={reset}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-ink-400">
          文本用 {aiSettings.textProvider === 'agnes' ? 'Agnes' : 'DeepSeek'}
          {aiSettings.textModel ? `（${aiSettings.textModel}）` : ''} 生成，配图用 Agnes
          {hasImageKey(aiSettings) ? '' : '（还没填 Key，会跳过）'}；Key 只存在这台设备。
        </p>
      </section>

      {error && (
        <div className="pk-card mb-4 border border-red-100 bg-red-50/80 p-4">
          <p className="text-[12.5px] font-medium text-red-700">{error.message}</p>
          {error.hint && <p className="mt-1 text-[11px] leading-relaxed text-red-500">{error.hint}</p>}
        </div>
      )}

      {status === 'text' && (
        <div className="pk-card flex items-center gap-2 p-4 text-[12px] text-ink-500">
          <Loader2 className="h-4 w-4 animate-spin text-theme" />
          正在写菜谱…
        </div>
      )}

      {draft && (
        <section className="mt-4 space-y-3">
          <div className="pk-card overflow-hidden">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-blush-50">
              {imageDataUrl ? (
                <img src={imageDataUrl} alt={draft.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-blush-400">
                  {status === 'image' ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-[11px]">正在画配图…</span>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="h-6 w-6" />
                      <span className="text-[11px]">没有配图，也能保存菜谱</span>
                    </>
                  )}
                </div>
              )}
              <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium text-theme-deep shadow-soft">
                AI 草稿 · 还没保存
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-xl font-semibold text-ink-900">{draft.name}</h2>
                <Badge tone="pink">{draft.category}</Badge>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-600">{draft.description}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-ink-500">
                <span className="inline-flex items-center gap-1">
                  <ChefHat className="h-3 w-3 text-blush-400" />
                  {draft.difficulty}
                </span>
                <span>{draft.cookingTime} 分钟</span>
                <span>{draft.servings}</span>
                <span>参考 ¥{draft.price}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {draft.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blush-50 px-2 py-0.5 text-[10px] text-blush-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pk-card p-4">
            <h3 className="font-display text-base font-semibold text-ink-900">食材</h3>
            <ul className="mt-2 divide-y divide-blush-50">
              {draft.ingredients.map((item) => (
                <li
                  key={`${item.name}-${item.amount}`}
                  className="flex items-baseline justify-between gap-3 py-1.5 text-[12.5px]"
                >
                  <span className="text-ink-700">{item.name}</span>
                  <span className="shrink-0 text-ink-500">{item.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pk-card p-4">
            <h3 className="font-display text-base font-semibold text-ink-900">步骤</h3>
            <ol className="mt-2 space-y-2.5">
              {draft.steps.map((step, index) => (
                <li key={`${step.title}-${index}`} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-theme-soft text-[10px] font-semibold text-theme-deep">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-medium text-ink-800">{step.title}</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-ink-600">
                      {step.description}
                    </p>
                    {step.tip && (
                      <p className="mt-1 rounded-xl bg-cream-100 px-2 py-1 text-[10.5px] leading-relaxed text-ink-500">
                        💡 {step.tip}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            {draft.tips.length > 0 && (
              <ul className="mt-3 space-y-1.5 rounded-2xl bg-cream-100/70 p-3">
                {draft.tips.map((tip) => (
                  <li key={tip} className="text-[11px] leading-relaxed text-ink-500">
                    · {tip}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="sticky bottom-20 z-20 flex gap-2 rounded-3xl border border-white/80 bg-white/95 p-2 shadow-float">
            <Button
              variant="secondary"
              className="shrink-0"
              onClick={handleGenerate}
              disabled={busy}
              leadingIcon={<RefreshCw className={cn('h-4 w-4', busy && 'animate-spin')} />}
            >
              重来
            </Button>
            <Button fullWidth onClick={handleSave} disabled={busy}>
              用这个，保存
            </Button>
          </div>
        </section>
      )}

      {customRecipes.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 font-display text-base font-semibold text-ink-900">
            已经加的 {customRecipes.length} 道 AI 菜
          </h2>
          <ul className="space-y-2">
            {customRecipes.map((recipe) => (
              <li
                key={recipe.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/80 bg-white/70 px-3 py-2"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-[12.5px] font-medium text-ink-800">{recipe.name}</p>
                  <p className="mt-0.5 text-[10px] text-ink-400">
                    {recipe.category} · {recipe.cookingTime} 分钟
                  </p>
                </button>
                <button
                  type="button"
                  aria-label={`删除 ${recipe.name}`}
                  onClick={() => {
                    deleteCustomRecipe(recipe.id);
                    showToast(`已删除「${recipe.name}」`);
                  }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-300 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
