import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  BookOpen,
  Check,
  Database,
  ExternalLink,
  Heart,
  Info,
  Palette,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
} from 'lucide-react';
import { AVATAR_PRESETS, DEFAULT_SETTINGS, THEME_OPTIONS, type ThemeName } from '../types';
import { getAllRecipes } from '../data/recipes';
import { useAppStore } from '../store/AppStore';
import { useToast } from '../components/ui/Toast';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { SectionHeader } from '../components/ui/SectionHeader';
import { AiSettingsSection } from '../components/settings/AiSettingsSection';
import { Avatar } from '../components/ui/Avatar';
import { IMAGE_ACCEPT, compressImageFile } from '../lib/image';
import { formatFileSize } from '../lib/format';
import { cn } from '../lib/cn';
import {
  APP_NAME_CN,
  APP_VERSION,
  REFERENCE_PROJECT,
} from '../config/app';

export function SettingsPage() {
  const {
    settings,
    favorites,
    order,
    diary,
    storageSize,
    updateSettings,
    resetAllData,
  } = useAppStore();
  const { showToast } = useToast();

  const [nicknameDraft, setNicknameDraft] = useState(settings.nickname);
  const [clearOpen, setClearOpen] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNicknameDraft(settings.nickname);
  }, [settings.nickname]);

  const trimmedNickname = nicknameDraft.trim();
  const nicknameChanged = trimmedNickname.length > 0 && trimmedNickname !== settings.nickname;

  const handleSaveNickname = (event: FormEvent) => {
    event.preventDefault();
    if (!trimmedNickname) {
      showToast('昵称不能为空哦');
      return;
    }
    updateSettings({ nickname: trimmedNickname });
    showToast('昵称已经换好啦');
  };

  const handlePresetAvatar = (avatar: string) => {
    updateSettings({ avatar });
    showToast('新头像真好看');
  };

  const handleAvatarFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setAvatarBusy(true);
    try {
      const dataUrl = await compressImageFile(file, { maxSize: 480, quality: 0.85 });
      updateSettings({ avatar: dataUrl });
      showToast('头像已经换好啦');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '头像上传失败，请重试');
    } finally {
      setAvatarBusy(false);
    }
  };

  const handleTheme = (theme: ThemeName, name: string) => {
    if (settings.theme === theme) return;
    updateSettings({ theme });
    showToast(`已切换到「${name}」主题`);
  };

  const handleClearData = () => {
    resetAllData();
    setNicknameDraft(DEFAULT_SETTINGS.nickname);
    showToast('本地数据已清空，一切重新开始');
  };

  const stats = [
    { label: '收藏的菜', value: `${favorites.length} 道`, icon: Heart },
    { label: '菜单里的菜', value: `${order.items.length} 道`, icon: Sparkles },
    { label: '美食日记', value: `${diary.length} 篇`, icon: BookOpen },
    { label: '本地占用', value: formatFileSize(storageSize), icon: Database },
  ];

  return (
    <div>
      <PageHeader title="我的厨房" subtitle="把这里，变成只属于我们的样子" />

      <section className="pk-hero relative mb-5 overflow-hidden rounded-[30px] p-5 text-white shadow-card">
        <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full border border-white/20" />
        <div className="pointer-events-none absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-white/10" />
        <Sparkles className="pointer-events-none absolute right-14 top-6 h-4 w-4 text-white/50" />

        <div className="flex items-center gap-4">
          <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/80 bg-white/20 text-3xl shadow-float backdrop-blur">
            <Avatar avatar={settings.avatar} className="h-full w-full text-3xl" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/70">My Kitchen</p>
            <h2 className="mt-1 truncate font-display text-2xl font-semibold tracking-wide">
              {settings.nickname}
            </h2>
            <p className="mt-0.5 text-[11px] text-white/75">公主厨房的主人 · 今天也要好好吃饭</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {stats.slice(0, 2).map(({ label, value }) => (
            <div key={label} className="rounded-2xl bg-white/10 px-3 py-2 backdrop-blur-sm">
              <p className="text-[9px] tracking-wide text-white/65">{label}</p>
              <p className="mt-0.5 font-display text-sm font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pk-card mb-5 p-4">
        <SectionHeader
          title="个人资料"
          subtitle="换一个喜欢的昵称和头像"
          action={<UserRound className="mb-1 h-4 w-4 text-blush-300" />}
        />

        <form onSubmit={handleSaveNickname} className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <label htmlFor="nickname" className="pk-label">
              昵称
            </label>
            <input
              id="nickname"
              type="text"
              value={nicknameDraft}
              onChange={(event) => setNicknameDraft(event.target.value)}
              maxLength={16}
              placeholder="想被怎么称呼呀"
              className="pk-input h-11 py-0"
            />
          </div>
          <Button
            type="submit"
            disabled={!nicknameChanged}
            className="mb-0.5 h-11 shrink-0 px-4"
          >
            保存
          </Button>
        </form>
        <p className="mt-1.5 text-[10px] text-ink-400">最多 16 个字，会被用在首页的问候里。</p>

        <div className="mt-4 border-t border-dashed border-blush-100 pt-4">
          <span className="pk-label">头像</span>
          <div className="flex flex-wrap gap-2">
            {AVATAR_PRESETS.map((preset) => {
              const active = settings.avatar === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetAvatar(preset)}
                  aria-pressed={active}
                  aria-label={`使用头像 ${preset}`}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border text-lg transition-all',
                    active
                      ? 'border-theme bg-theme-soft shadow-soft ring-2 ring-theme/20'
                      : 'border-blush-100 bg-white hover:border-blush-300 hover:bg-blush-50',
                  )}
                >
                  <span aria-hidden="true">{preset}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarBusy}
              aria-label="上传自定义头像"
              className="flex h-10 items-center gap-1.5 rounded-full border border-dashed border-blush-200 bg-white/70 px-3 text-[11px] text-ink-500 transition-colors hover:border-theme/50 hover:text-theme-deep disabled:opacity-60"
            >
              <Upload className="h-3.5 w-3.5" />
              {avatarBusy ? '处理中…' : '上传'}
            </button>
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept={IMAGE_ACCEPT}
            onChange={handleAvatarFile}
            className="hidden"
          />
          <p className="mt-2 text-[10px] text-ink-400">
            上传的照片会压缩后保存在本机，不会发送到任何服务器。
          </p>
        </div>
      </section>

      <section className="pk-card mb-5 p-4">
        <SectionHeader
          title="主题"
          subtitle="换一种心情，页面会马上变化"
          action={<Palette className="mb-1 h-4 w-4 text-lilac-300" />}
        />
        <div className="grid grid-cols-3 gap-2">
          {THEME_OPTIONS.map((option) => {
            const active = settings.theme === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleTheme(option.id, option.name)}
                aria-pressed={active}
                className={cn(
                  'relative overflow-hidden rounded-2xl border p-2.5 text-left transition-all duration-200',
                  active
                    ? 'border-theme/60 bg-white shadow-soft ring-2 ring-theme/15'
                    : 'border-blush-100 bg-white/60 hover:border-blush-200 hover:bg-white',
                )}
              >
                <span
                  className="mb-2 block h-10 w-full rounded-xl shadow-innerSoft"
                  style={{ background: option.swatch }}
                />
                <span className="block text-[11px] font-medium text-ink-800">{option.name}</span>
                <span className="mt-0.5 block text-[9px] leading-tight text-ink-400">
                  {option.description}
                </span>
                {active && (
                  <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-theme text-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[10px] text-ink-400">
          主题只影响按钮、背景和高光颜色，菜谱卡片会一直保持奶油粉的温柔感。
        </p>
      </section>

      <section className="pk-card mb-5 p-4">
        <SectionHeader
          title="数据小管家"
          subtitle="所有内容目前都只保存在这台设备上"
          action={<Database className="mb-1 h-4 w-4 text-blush-300" />}
        />
        <ul className="divide-y divide-blush-50 rounded-2xl bg-white/60 px-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <li key={label} className="flex items-center justify-between gap-3 py-2.5 text-xs">
              <span className="flex items-center gap-2 text-ink-500">
                <Icon className="h-3.5 w-3.5 text-blush-300" strokeWidth={1.8} />
                {label}
              </span>
              <span className="font-medium text-ink-800">{value}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-cream-100 px-3 py-2.5 text-[10px] leading-relaxed text-ink-500">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
          <p>
            清除后收藏、菜单、日记和昵称都会恢复初始状态。菜谱本身是内置数据，不会丢失。
          </p>
        </div>

        <Button
          variant="danger"
          fullWidth
          onClick={() => setClearOpen(true)}
          leadingIcon={<Trash2 className="h-4 w-4" />}
          className="mt-3"
        >
          清除本地测试数据
        </Button>
      </section>

      <AiSettingsSection />

      <section className="pk-card p-4">
        <SectionHeader
          title="关于"
          subtitle="我们的小厨房"
          action={<Info className="mb-1 h-4 w-4 text-blush-300" />}
        />
        <div className="space-y-2 text-[11px]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-ink-500">版本</span>
            <span className="text-ink-800">v{APP_VERSION} · 网页版</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-ink-500">菜谱</span>
            <span className="text-ink-800">{getAllRecipes().length} 道 · 含 AI 生成</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-ink-500">数据同步</span>
            <span className="text-right text-ink-800">暂未接入云端，换设备不会同步</span>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-dashed border-blush-100 bg-white/60 px-3 py-3">
          <p className="text-[10px] font-medium text-ink-600">参考的开源项目</p>
          <a
            href={REFERENCE_PROJECT.url}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-1 inline-flex items-center gap-1 text-[11px] text-theme-deep underline-offset-4 hover:underline"
          >
            {REFERENCE_PROJECT.name}
            <ExternalLink className="h-3 w-3" />
          </a>
          <p className="mt-1.5 text-[10px] leading-relaxed text-ink-400">
            {REFERENCE_PROJECT.note}
          </p>
          <a
            href={REFERENCE_PROJECT.licenseUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-1 inline-flex items-center gap-1 text-[10px] text-ink-400 underline-offset-4 hover:text-theme-deep hover:underline"
          >
            查看其 Unlicense 许可
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
          <a
            href="./credits.html"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 flex items-center justify-center gap-1 rounded-full border border-blush-100 bg-white/80 px-3 py-2 text-[10px] text-ink-500 transition-colors hover:border-theme/40 hover:text-theme-deep"
          >
            查看全部菜谱与图片来源
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>

        <p className="mt-4 text-center font-display text-[11px] tracking-widest text-ink-400">
          {APP_NAME_CN} · Made with 爱
        </p>
        <p className="mt-2 text-center text-[8.5px] leading-relaxed text-ink-400">
          戴诗佳女士所有，由 ymq 独立开发，版权所有 ©
        </p>
        <p className="mt-0.5 text-center text-[7.5px] leading-relaxed text-ink-300">
          All rights reserved by Ms. Dai Shijia. Independently developed by ymq. ©
        </p>
      </section>

      <ConfirmDialog
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        title="清除所有本地数据？"
        description="收藏、今日菜单、美食日记、头像和昵称都会恢复初始状态，且无法找回。内置菜谱不受影响。"
        confirmLabel="确认清除"
        tone="danger"
        onConfirm={handleClearData}
      />
    </div>
  );
}
