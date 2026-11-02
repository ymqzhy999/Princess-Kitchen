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

function friendlyHttpError(status: number, body: string): AiError {
  const detail = body.slice(0, 200);
  if (status === 401 || status === 403) {
    return new AiError('API Key 无效或没有权限', '去「我的厨房 → AI 助手」检查 Key 和模型名');
  }
  if (status === 402 || status === 429) {
    return new AiError(status === 429 ? '请求太频繁，稍等一会儿再试' : '账户余额不足', detail);
  }
  if (status >= 500) return new AiError(`服务商暂时出错（${status}）`, '过一会儿再试一次');
  return new AiError(`请求失败（${status}）`, detail);
}

function networkError(error: unknown): AiError {
  const message = error instanceof Error ? error.message : String(error);
  if (/abort/i.test(message)) return new AiError('已取消');
  return new AiError(
    '网络请求失败',
    '检查手机网络；如果开了代理，确认能访问对应服务商域名',
  );
}

function textConfig(settings: AiSettings): { url: string; model: string; key: string } {
  const provider = TEXT_PROVIDERS[settings.textProvider] ?? TEXT_PROVIDERS.deepseek;
  return {
    url: `${provider.baseUrl}${provider.chatPath}`,
    model: settings.textModel.trim() || provider.defaultModel,
    key: settings.textApiKey.trim(),
  };
}

export function hasTextKey(settings: AiSettings): boolean {
  return settings.textApiKey.trim().length > 0;
}

export function hasImageKey(settings: AiSettings): boolean {
  return (settings.imageApiKey || settings.textApiKey).trim().length > 0;
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
      signal,
    });
  } catch (error) {
    throw networkError(error);
  }

  const text = await response.text();
  if (!response.ok) throw friendlyHttpError(response.status, text);

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
  const key = (settings.imageApiKey || settings.textApiKey).trim();
  if (!key) {
    throw new AiError('还没有填生图模型的 API Key', '去「我的厨房 → AI 助手」填 Agnes 的 Key');
  }
  const model = settings.imageModel.trim() || IMAGE_API.defaultModel;

  let response: Response;
  try {
    response = await fetch(`${IMAGE_API.baseUrl}${IMAGE_API.path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        prompt: buildImagePrompt(draft),
        size: '1K',
        ratio: '4:3',
        extra_body: { response_format: 'url' },
      }),
      signal,
    });
  } catch (error) {
    throw networkError(error);
  }

  const text = await response.text();
  if (!response.ok) throw friendlyHttpError(response.status, text);

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
  } catch (error) {
    throw networkError(error);
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
      signal: AbortSignal.timeout(30_000),
    });
  } catch (error) {
    throw networkError(error);
  }
  const text = await response.text();
  if (!response.ok) throw friendlyHttpError(response.status, text);
  return `${TEXT_PROVIDERS[settings.textProvider].label} · ${model} 连接正常`;
}
