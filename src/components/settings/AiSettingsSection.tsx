import { useState } from 'react';
import { Eye, EyeOff, ImageIcon, KeyRound, Loader2, PlugZap, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { SectionHeader } from '../ui/SectionHeader';
import { useAppStore } from '../../store/AppStore';
import { useToast } from '../ui/Toast';
import { AiError, TEXT_MODELS, TEXT_PROVIDERS, testImageConnection, testTextConnection } from '../../lib/ai';
import type { AiTextProvider } from '../../types/ai';
import { cn } from '../../lib/cn';

const PROVIDER_HINTS: Record<AiTextProvider, { keyUrl: string; keyHint: string }> = {
  deepseek: {
    keyUrl: 'https://platform.deepseek.com/api_keys',
    keyHint: 'DeepSeek Key 形如 sk-…，控制台可以创建',
  },
  agnes: {
    keyUrl: 'https://platform.agnes-ai.com',
    keyHint: 'Agnes Key 形如 sk-…，一个 Key 文本和生图都能用',
  },
};

export function AiSettingsSection() {
  const { aiSettings, updateAiSettings } = useAppStore();
  const { showToast } = useToast();
  const [showKey, setShowKey] = useState(false);
  const [customModel, setCustomModel] = useState(false);
  const modelList = TEXT_MODELS[aiSettings.textProvider];
  const storedModel = aiSettings.textModel.trim();
  // 旧版本可能存了一个不属于当前服务商的模型名（比如 deepseek-flash），这里显示为「自定义」方便改
  const isCustomModel = customModel || (storedModel !== '' && !modelList.includes(storedModel));
  const [testing, setTesting] = useState(false);
  const [testingImage, setTestingImage] = useState(false);

  const handleTestImage = async () => {
    setTestingImage(true);
    try {
      showToast(await testImageConnection(aiSettings));
    } catch (error) {
      const err = error instanceof AiError ? error : new AiError('生图连接失败');
      showToast(err.hint ? `${err.message}：${err.hint}` : err.message);
    } finally {
      setTestingImage(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const message = await testTextConnection(aiSettings);
      showToast(message);
    } catch (error) {
      const err = error instanceof AiError ? error : new AiError('连接失败');
      showToast(err.hint ? `${err.message}：${err.hint}` : err.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <section className="pk-card p-4">
      <SectionHeader
        title="AI 助手"
        subtitle="写菜谱的文字模型、画配图的模型是两块，分开填"
        action={<Sparkles className="mb-1 h-4 w-4 text-blush-300" />}
      />

      <p className="mb-1 text-[10.5px] font-medium text-ink-600">① 写菜谱用哪个</p>
      <div className="mb-1 flex gap-1.5 rounded-full bg-cream-100/80 p-1">
        {(Object.keys(TEXT_PROVIDERS) as AiTextProvider[]).map((provider) => (
          <button
            key={provider}
            type="button"
            onClick={() =>
              updateAiSettings({
                textProvider: provider,
                textModel: TEXT_MODELS[provider].includes(aiSettings.textModel.trim())
                  ? aiSettings.textModel
                  : '',
              })
            }
            aria-pressed={aiSettings.textProvider === provider}
            className={cn(
              'flex-1 rounded-full px-3 py-1.5 text-[11.5px] transition-colors',
              aiSettings.textProvider === provider
                ? 'bg-white font-semibold text-theme-deep shadow-soft'
                : 'text-ink-500',
            )}
          >
            {TEXT_PROVIDERS[provider].label}
          </button>
        ))}
      </div>
      <p className="mb-3 mt-1.5 text-[10px] leading-relaxed text-ink-400">
        写菜谱用 {TEXT_PROVIDERS[aiSettings.textProvider].label}，
        <a
          href={PROVIDER_HINTS[aiSettings.textProvider].keyUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-theme-deep underline-offset-2 hover:underline"
        >
          打开控制台
        </a>
        ·{PROVIDER_HINTS[aiSettings.textProvider].keyHint}
      </p>

      <label htmlFor="ai-text-key" className="pk-label flex items-center gap-1.5">
        <KeyRound className="h-3.5 w-3.5 text-blush-300" />
        文本模型 Key
      </label>
      <div className="relative mt-1.5">
        <input
          id="ai-text-key"
          type={showKey ? 'text' : 'password'}
          value={aiSettings.textApiKey}
          onChange={(event) => updateAiSettings({ textApiKey: event.target.value.trim() })}
          placeholder="sk-..."
          autoComplete="off"
          spellCheck={false}
          className="pk-input h-11 pr-10 font-mono text-[12px]"
        />
        <button
          type="button"
          onClick={() => setShowKey((value) => !value)}
          aria-label={showKey ? '隐藏 Key' : '显示 Key'}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-400 hover:bg-blush-50"
        >
          {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>

      <label htmlFor="ai-text-model" className="pk-label mt-3 block">
        文本模型
      </label>
      <select
        id="ai-text-model"
        value={isCustomModel ? '__custom' : storedModel || TEXT_PROVIDERS[aiSettings.textProvider].defaultModel}
        onChange={(event) => {
          if (event.target.value === '__custom') {
            setCustomModel(true);
            return;
          }
          setCustomModel(false);
          updateAiSettings({ textModel: event.target.value });
        }}
        className="pk-input mt-1.5 h-11 text-[12.5px]"
      >
        {modelList.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
        <option value="__custom">自定义…</option>
      </select>
      {isCustomModel && (
        <input
          aria-label="自定义模型名"
          value={aiSettings.textModel}
          onChange={(event) => updateAiSettings({ textModel: event.target.value })}
          placeholder={TEXT_PROVIDERS[aiSettings.textProvider].defaultModel}
          autoComplete="off"
          spellCheck={false}
          className="pk-input mt-2 h-10 font-mono text-[12px]"
        />
      )}
      <p className="mt-1 text-[10px] leading-relaxed text-ink-400">
        {TEXT_PROVIDERS[aiSettings.textProvider].label} 可用：{modelList.join(' / ')}
      </p>

      <div className="mb-1 mt-4 border-t border-dashed border-blush-100 pt-3">
        <p className="text-[10.5px] font-medium text-ink-600">
          ② 生成配图（固定用 Agnes，和上面选谁无关）
        </p>
      </div>

      <label htmlFor="ai-image-key" className="pk-label block">
        生图 Key（Agnes，与 DeepSeek 不通用）
      </label>
      <input
        id="ai-image-key"
        type={showKey ? 'text' : 'password'}
        value={aiSettings.imageApiKey}
        onChange={(event) => updateAiSettings({ imageApiKey: event.target.value.trim() })}
        placeholder="sk-..."
        autoComplete="off"
        spellCheck={false}
        className="pk-input mt-1.5 h-11 font-mono text-[12px]"
      />
      <input
        aria-label="生图模型"
        value={aiSettings.imageModel}
        onChange={(event) => updateAiSettings({ imageModel: event.target.value })}
        placeholder="agnes-image-2.1-flash"
        autoComplete="off"
        spellCheck={false}
        className="pk-input mt-2 h-10 font-mono text-[12px]"
      />

      <input
        aria-label="生图接口地址"
        value={aiSettings.imageBaseUrl}
        onChange={(event) => updateAiSettings({ imageBaseUrl: event.target.value.trim() })}
        placeholder="https://apihub.agnes-ai.com"
        autoComplete="off"
        spellCheck={false}
        className="pk-input mt-2 h-10 font-mono text-[12px]"
      />
      <p className="mt-1 text-[10px] leading-relaxed text-ink-400">
        上面是接口地址（默认 Agnes 官方网关），只有在用中转/自建代理时才需要改。
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleTestImage}
          disabled={testingImage}
          leadingIcon={
            testingImage ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImageIcon className="h-3.5 w-3.5" />
            )
          }
        >
          {testingImage ? '生图中…' : '测试生图'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleTest}
          disabled={testing || !aiSettings.textApiKey}
          leadingIcon={
            testing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <PlugZap className="h-3.5 w-3.5" />
            )
          }
        >
          {testing ? '测试中…' : '测试连接'}
        </Button>
        <p className="text-[10px] leading-relaxed text-ink-400">
          Key 只存在这台设备，不会上传到任何服务器。
        </p>
      </div>
    </section>
  );
}
