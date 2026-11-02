/**
 * AI 助手：用 DeepSeek / Agnes 的文本模型生成菜谱草稿，用 Agnes 生图模型出配图。
 *
 * 这是纯前端直连（BYOK）：Key 只存在本机 localStorage，请求只发往你填的服务商。
 * 两个接口都支持 CORS，网页版和 App 内都能直接调用。
 */
import {
  DIFFICULTIES,
  RECIPE_CATEGORIES,
  type CookingStep,
  type Difficulty,
  type Ingredient,
  type RecipeCategory,
} from '../types';
import type { AiSettings, AiTextProvider, RecipeDraft } from '../types/ai';

interface ProviderConfig {
  label: string;
  baseUrl: string;
  chatPath: string;
  defaultModel: string;
}

export const TEXT_PROVIDERS: Record<AiTextProvider, ProviderConfig> = {
  deepseek: {
    label: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    chatPath: '/chat/completions',
    defaultModel: 'deepseek-chat',
  },
  agnes: {
    label: 'Agnes',
    baseUrl: 'https://apihub.agnes-ai.com',
    chatPath: '/v1/chat/completions',
    defaultModel: 'agnes-2.5-flash',
  },
};

/** 各服务商真实存在的文本模型（下拉选，避免手打死名） */
export const TEXT_MODELS: Record<AiTextProvider, string[]> = {
  deepseek: ['deepseek-chat', 'deepseek-reasoner'],
  agnes: ['agnes-2.5-flash', 'agnes-2.5-pro-alpha', 'agnes-2.5-pro-beta', 'agnes-3.0-flash'],
};

/** 当前模型是否属于该服务商（用来在切换服务商时自动纠正） */
export function isKnownModel(provider: AiTextProvider, model: string): boolean {
  return TEXT_MODELS[provider].includes(model.trim());
}

export const IMAGE_API = {
  baseUrl: 'https://apihub.agnes-ai.com',
  path: '/v1/images/generations',
  defaultModel: 'agnes-image-2.1-flash',
};

const IMAGE_STYLE =
  'Chinese home-style plating on a clean plain light background, soft natural window light, 45-degree angle, ' +
  'realistic professional food photography, appetizing, no people, no hands, no chopsticks, no text, no watermark';

export class AiError extends Error {
  constructor(
    message: string,
    readonly hint?: string,
  ) {
    super(message);
    this.name = 'AiError';
  }
}

function friendlyHttpError(status: number, body: string, context = ''): AiError {
  const detail = body.slice(0, 200);
  if (status === 401 || status === 403) {
    return new AiError(
      'API Key 无效或没有权限',
      context ? `${context}；Key 不通用：生图必须填 Agnes 的 Key` : '去「我的厨房 → AI 助手」检查 Key 和模型名',
    );
  }
  if (status === 402 || status === 429) {
    return new AiError(status === 429 ? '请求太频繁，稍等一会儿再试' : '账户余额不足', detail);
  }
  if (status === 400 || status === 404 || status === 422) {
    return new AiError(
      `请求被拒绝（${status}）：模型名或参数不对`,
      context || '检查模型名：DeepSeek 用 deepseek-chat，Agnes 用 agnes-2.5-flash',
    );
  }
  if (status >= 500) return new AiError(`服务商暂时出错（${status}）`, '过一会儿再试一次');
  return new AiError(`请求失败（${status}）`, detail);
}

function networkError(error: unknown, timeoutMs?: number): AiError {
  const name = (error as { name?: string } | null)?.name ?? '';
  const message = error instanceof Error ? error.message : String(error);
  // 超时和「用户取消」是两种完全不同的情况，不能都显示成"已取消"
  if (name === 'TimeoutError' || /timeout|timed out/i.test(message)) {
    return new AiError(
      timeoutMs ? `请求超时（等了 ${Math.round(timeoutMs / 1000)} 秒没响应）` : '请求超时',
      '多半是网络：该服务域名在你那边访问不通，开代理或换个网络再试',
    );
  }
  if (name === 'AbortError' || /aborted/i.test(message)) {
    return new AiError('请求被中断', '是不是切到后台了？回到页面再试一次');
  }
  return new AiError(
    '网络请求失败',
    '检查手机网络；如果开了代理，确认能访问对应服务商域名（apihub.agnes-ai.com / api.deepseek.com）',
  );
}

/** 把调用方的取消 signal 和超时合并（老 WebView 没有 AbortSignal.any 时退回超时） */
function withTimeout(signal: AbortSignal | undefined, ms: number): AbortSignal {
  const timeout = AbortSignal.timeout(ms);
  if (!signal) return timeout;
  const anyFn = (AbortSignal as unknown as { any?: (signals: AbortSignal[]) => AbortSignal }).any;
  return anyFn ? anyFn([signal, timeout]) : timeout;
}

function textConfig(settings: AiSettings): { url: string; model: string; key: string } {
  const provider = TEXT_PROVIDERS[settings.textProvider] ?? TEXT_PROVIDERS.deepseek;
  return {
    url: `${provider.baseUrl}${provider.chatPath}`,
    model: settings.textModel.trim() || provider.defaultModel,
    key: normalizeKey(settings.textApiKey ?? ''),
  };
}

export function hasTextKey(settings: AiSettings): boolean {
  return settings.textApiKey.trim().length > 0;
}

/** 去掉粘贴时混进来的空格、换行、零宽字符 */
export function normalizeKey(raw: string): string {
  return raw.replace(/[\s\u200b-\u200d\ufeff]/g, '');
}

/**
 * 生图用哪个 Key：
 * - 优先「生图 Key」；
 * - 没填时只在文本模型也是 Agnes 的情况下复用文本 Key，
 *   DeepSeek 的 Key 与 Agnes 不通用，绝不能混着用（这是 401 最常见的原因）。
 */
export function resolveImageKey(settings: AiSettings): {
  key: string;
  from: 'image' | 'text' | 'none';
} {
  const imageKey = normalizeKey(settings.imageApiKey ?? '');
  if (imageKey) return { key: imageKey, from: 'image' };
  if (settings.textProvider === 'agnes') {
    const textKey = normalizeKey(settings.textApiKey ?? '');
    if (textKey) return { key: textKey, from: 'text' };
  }
  return { key: '', from: 'none' };
}

export function hasImageKey(settings: AiSettings): boolean {
  return resolveImageKey(settings).from !== 'none';
}

export function imageEndpoint(settings: AiSettings): string {
  const base = (settings.imageBaseUrl || IMAGE_API.baseUrl).trim().replace(/\/+$/, '');
  return `${base}${IMAGE_API.path}`;
}

const SYSTEM_PROMPT = `你是「公主厨房」的菜谱编辑，只输出 JSON，不要解释、不要 markdown 代码块。
严格按照下面的字段生成一道 2 人份的中国家常菜：

{
  "name": "菜名（去掉引号，4-8 个字）",
  "category": "必须从这些里选一个：${RECIPE_CATEGORIES.join('、')}",
  "description": "35-70 字，温柔口语化的介绍，别用感叹号堆砌",
  "difficulty": "${DIFFICULTIES.join(' 或 ')}",
  "cookingTime": 整数分钟（10-180）,
  "servings": "2 人份",
  "price": 整数（两人份食材参考成本，人民币，10-200）,
  "ingredients": [{ "name": "食材", "amount": "用量，如 300g / 2 汤匙" }],
  "steps": [{ "title": "6-12 字的步骤名", "description": "40-90 字的可执行步骤", "tip": "可选，一句小提示" }],
  "tips": ["可选，0-3 条整道菜的小贴士"],
  "tags": ["2-4 个短标签，如 家常、快手、下饭"],
  "imagePrompt": "English, under 40 words: a plain description of the finished dish, main ingredients, plating and cooking method, for food photography"
}

硬性要求：
- ingredients 至少 5 条、steps 至少 5 条，用量必须具体（不要写"适量"以外的模糊词）；
- 火候、时间、油温写具体，别写外行话；涉及肉类要说中心熟透；
- 全部中文（imagePrompt 除外），不要出现"AI 生成"字样；
- 只输出 JSON 对象本身。`;

/** 从模型返回里抠出 JSON（容忍 ```json 代码块和前后废话） */
export function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new AiError('模型没有返回 JSON', '换个说法再生成一次试试');
  }
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    throw new AiError('模型返回的 JSON 解析失败', '再生成一次，或者换个模型试试');
  }
}

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value.trim() : fallback;

const asNumber = (value: unknown, min: number, max: number, fallback: number): number => {
  const num = typeof value === 'number' ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, Math.round(num)));
};

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalizeIngredients(value: unknown): Ingredient[] {
  return asArray(value)
    .map((item) => {
      const record = (item ?? {}) as Record<string, unknown>;
      const name = asString(record.name);
      const amount = asString(record.amount);
      if (!name || !amount) return null;
      const optional = record.optional === true;
      const ingredient: Ingredient = optional ? { name, amount, optional } : { name, amount };
      return ingredient;
    })
    .filter((item): item is Ingredient => item !== null)
    .slice(0, 16);
}

function normalizeSteps(value: unknown): CookingStep[] {
  return asArray(value)
    .map((item) => {
      const record = (item ?? {}) as Record<string, unknown>;
      const title = asString(record.title);
      const description = asString(record.description);
      if (!title || !description) return null;
      const tip = asString(record.tip);
      return tip ? { title, description, tip } : { title, description };
    })
    .filter((item): item is CookingStep => Boolean(item))
    .slice(0, 12);
}

/** 把模型返回的 JSON 变成可靠的草稿：字段兜底、范围收敛、数量下限 */
export function normalizeDraft(raw: unknown): RecipeDraft {
  const record = (raw ?? {}) as Record<string, unknown>;
  const name = asString(record.name).slice(0, 24);
  if (!name) throw new AiError('模型没给出菜名', '再生成一次，或者把想吃的写得更具体');

  const categoryRaw = asString(record.category);
  const category: RecipeCategory = (RECIPE_CATEGORIES as readonly string[]).includes(categoryRaw)
    ? (categoryRaw as RecipeCategory)
    : '其他';

  const difficultyRaw = asString(record.difficulty);
  const difficulty: Difficulty = (DIFFICULTIES as readonly string[]).includes(difficultyRaw)
    ? (difficultyRaw as Difficulty)
    : '简单';

  const ingredients = normalizeIngredients(record.ingredients);
  const steps = normalizeSteps(record.steps);

  return {
    name,
    category,
    description: asString(record.description).slice(0, 200) || `${name}，家常做法，简单好上手。`,
    ingredients: ingredients.length ? ingredients : [],
    steps: steps.length ? steps : [],
    difficulty,
    cookingTime: asNumber(record.cookingTime, 5, 600, 30),
    servings: asString(record.servings) || '2 人份',
    price: asNumber(record.price, 1, 999, 40),
    tags: asArray(record.tags)
      .map((tag) => asString(tag))
      .filter(Boolean)
      .slice(0, 5),
    tips: asArray(record.tips)
      .map((tip) => asString(tip))
      .filter(Boolean)
      .slice(0, 3),
    imagePrompt: asString(record.imagePrompt).slice(0, 400),
  };
}

/** 生成菜谱草稿（只调文本模型，不生成图） */
export async function generateRecipeDraft(
  input: string,
  settings: AiSettings,
  signal?: AbortSignal,
): Promise<RecipeDraft> {
  if (!hasTextKey(settings)) {
    throw new AiError('还没有填文本模型的 API Key', '去「我的厨房 → AI 助手」填一个，DeepSeek 或 Agnes 都行');
  }
  const { url, model, key } = textConfig(settings);
  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `我想吃：${input.trim()}\n请生成一道菜的菜谱。` },
    ],
    temperature: 0.8,
  };
  if (settings.textProvider === 'deepseek') {
    body.response_format = { type: 'json_object' };
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify(body),
      signal: withTimeout(signal, 120_000),
    });
  } catch (error) {
    throw networkError(error, 120_000);
  }

  const text = await response.text();
  if (!response.ok) {
    throw friendlyHttpError(
      response.status,
      text,
      `模型 ${model} @ ${url} 返回 ${response.status}；可用模型：${TEXT_MODELS[settings.textProvider].join(' / ')}`,
    );
  }

  let content = '';
  try {
    const json = JSON.parse(text) as { choices?: { message?: { content?: string } }[] };
    content = json.choices?.[0]?.message?.content ?? '';
  } catch {
    throw new AiError('服务商返回格式看不懂', text.slice(0, 160));
  }
  if (!content.trim()) throw new AiError('模型返回了空内容', '再生成一次试试');
  return normalizeDraft(extractJson(content));
}

/** 发给生图模型的英文提示词 */
export function buildImagePrompt(draft: Pick<RecipeDraft, 'name' | 'imagePrompt'>) {
  const subject = draft.imagePrompt.trim() || draft.name;
  return `${subject}, ${IMAGE_STYLE}`;
}

/** 生成配图并返回 dataURL（直接可存 IndexedDB / 展示） */
export async function generateDishImage(
  draft: Pick<RecipeDraft, 'name' | 'imagePrompt'>,
  settings: AiSettings,
  signal?: AbortSignal,
): Promise<string> {
  const { key } = resolveImageKey(settings);
  if (!key) {
    throw new AiError(
      '还没有填生图 Key',
      '生图要用 Agnes 的 Key，和 DeepSeek 的不通用；去「我的厨房 → AI 助手」单独填一个',
    );
  }
  const model = settings.imageModel.trim() || IMAGE_API.defaultModel;
  const endpoint = imageEndpoint(settings);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        prompt: buildImagePrompt(draft),
        size: '1K',
        ratio: '4:3',
        // 直接要 base64：返回的图片放在 CDN 上，浏览器再 fetch 会被跨域拦掉
        return_base64: true,
        extra_body: { response_format: 'b64_json' },
      }),
      signal: withTimeout(signal, 300_000),
    });
  } catch (error) {
    throw networkError(error, 300_000);
  }

  const text = await response.text();
  if (!response.ok) {
    throw friendlyHttpError(
      response.status,
      text,
      `生图接口 ${endpoint}（模型 ${model}）返回 ${response.status}`,
    );
  }

  let item: { url?: string; b64_json?: string } | undefined;
  try {
    item = (JSON.parse(text) as { data?: { url?: string; b64_json?: string }[] }).data?.[0];
  } catch {
    throw new AiError('生图接口返回格式看不懂', text.slice(0, 160));
  }
  if (!item) throw new AiError('生图接口没有返回图片', '再试一次');

  if (item.b64_json) return `data:image/png;base64,${item.b64_json}`;
  if (!item.url) throw new AiError('生图接口没有返回图片地址', '再试一次');

  let imageResponse: Response;
  try {
    imageResponse = await fetch(item.url, { signal });
  } catch {
    throw new AiError(
      '图片生成成功，但浏览器下载不下来',
      `返回的是外链（${new URL(item.url).host}），跨域被拦；已改用 base64 模式，请重试`,
    );
  }
  if (!imageResponse.ok) throw new AiError(`下载生成的图片失败（${imageResponse.status}）`);
  const blob = await imageResponse.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new AiError('图片读取失败'));
    reader.readAsDataURL(blob);
  });
}

/** 设置页用：发一句 ping 验证 Key / 模型名是否可用 */
export async function testTextConnection(settings: AiSettings): Promise<string> {
  if (!hasTextKey(settings)) throw new AiError('还没有填 API Key');
  const { url, model, key } = textConfig(settings);
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: '只回复 ok' }],
        max_tokens: 4,
      }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch (error) {
    throw networkError(error, 60_000);
  }
  const text = await response.text();
  if (!response.ok) {
    throw friendlyHttpError(
      response.status,
      text,
      `模型 ${model} @ ${url} 返回 ${response.status}；可用模型：${TEXT_MODELS[settings.textProvider].join(' / ')}`,
    );
  }
  return `${TEXT_PROVIDERS[settings.textProvider].label} · ${model} 连接正常`;
}

/** 设置页用：用最小请求验证「生图 Key + 接口地址 + 模型名」是否可用 */
export async function testImageConnection(settings: AiSettings): Promise<string> {
  const { key, from } = resolveImageKey(settings);
  if (!key) {
    throw new AiError('还没有填生图 Key', 'Agnes 的 Key 与 DeepSeek 不通用，请单独填一个');
  }
  const model = settings.imageModel.trim() || IMAGE_API.defaultModel;
  const endpoint = imageEndpoint(settings);
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        prompt: 'a red apple on a white table, simple product photo',
        size: '1K',
        ratio: '1:1',
        return_base64: true,
        extra_body: { response_format: 'b64_json' },
      }),
      signal: AbortSignal.timeout(240_000),
    });
  } catch (error) {
    throw networkError(error, 240_000);
  }
  const text = await response.text();
  if (!response.ok) {
    throw friendlyHttpError(response.status, text, `生图接口 ${endpoint}（模型 ${model}）返回 ${response.status}`);
  }
  let item: { url?: string; b64_json?: string } | undefined;
  try {
    item = (JSON.parse(text) as { data?: { url?: string; b64_json?: string }[] }).data?.[0];
  } catch {
    throw new AiError('接口返回的不是 JSON', `${endpoint}：${text.slice(0, 120)}`);
  }
  const bytes = item?.b64_json ? item.b64_json.length : 0;
  if (!item || (!bytes && !item.url)) {
    throw new AiError('接口通了，但没返回图片', `${endpoint} 返回：${text.slice(0, 120)}`);
  }
  if (item.b64_json && bytes < 2000) {
    throw new AiError('返回的图片数据太小，可能是空图', `base64 长度 ${bytes}`);
  }
  return `生图可用 · ${model}${from === 'text' ? '（复用文本 Key）' : ''}`;
}
