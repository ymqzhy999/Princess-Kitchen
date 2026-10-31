import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle2,
  NotebookPen,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { DiaryDraft, DiaryEntry } from '../types';
import { useAppStore } from '../store/AppStore';
import { useToast } from '../components/ui/Toast';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Sheet } from '../components/ui/Sheet';
import { StarRating } from '../components/ui/StarRating';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { DiaryForm } from '../components/diary/DiaryForm';
import { formatDateCN, formatWeekday, parseISODate, todayISO } from '../lib/format';
import { Bow } from '../components/decorations/Ornaments';

export function DiaryPage() {
  const navigate = useNavigate();
  const { diary, addDiaryEntry, updateDiaryEntry, deleteDiaryEntry } = useAppStore();
  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DiaryEntry | null>(null);

  const sortedEntries = useMemo(
    () =>
      [...diary].sort(
        (first, second) =>
          second.date.localeCompare(first.date) || second.createdAt.localeCompare(first.createdAt),
      ),
    [diary],
  );

  const openCreate = () => {
    setEditingEntry(null);
    setFormOpen(true);
  };

  const openEdit = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setFormOpen(true);
  };

  const handleSubmit = (draft: DiaryDraft) => {
    if (editingEntry) {
      updateDiaryEntry(editingEntry.id, draft);
      showToast('日记已更新', { icon: <CheckCircle2 className="h-3.5 w-3.5" /> });
    } else {
      addDiaryEntry(draft);
      showToast('已经收进美食日记本啦', { icon: <Sparkles className="h-3.5 w-3.5" /> });
    }
    setFormOpen(false);
    setEditingEntry(null);
  };

  const handleDelete = () => {
    if (!pendingDelete) return;
    deleteDiaryEntry(pendingDelete.id);
    showToast('这篇日记已删除', { icon: <Trash2 className="h-3.5 w-3.5" /> });
    setPendingDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="美食日记"
        subtitle={`已经记下 ${diary.length} 篇，都是我们好好吃饭的证据`}
        right={
          <Button size="sm" onClick={openCreate} leadingIcon={<Plus className="h-4 w-4" />}>
            写日记
          </Button>
        }
      />

      {sortedEntries.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="日记本还是崭新的"
          description="记下今天做的那道菜、它的味道和当时的心情。日子久了，这些就是你们专属的食谱回忆。"
          action={
            <Button onClick={openCreate} leadingIcon={<Plus className="h-4 w-4" />}>
              写下第一篇
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {sortedEntries.map((entry) => {
            const entryDate = parseISODate(entry.date);
            const isToday = entry.date === todayISO();

            return (
              <article
                key={entry.id}
                className="diary-paper relative overflow-hidden rounded-[28px] border border-white/80 shadow-card"
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blush-100/60" />
                <Bow className="pointer-events-none absolute right-4 top-4 h-8 w-9 text-blush-300/70" />

                {entry.photo && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-blush-50">
                    <ImageWithFallback
                      src={entry.photo}
                      alt={`${entry.dishName} 的美食照片`}
                      fallbackLabel="这张照片弄丢了"
                      className="h-full w-full"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink-900/25 to-transparent" />
                  </div>
                )}

                <div className="relative p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex w-14 shrink-0 flex-col items-center rounded-2xl bg-white/80 px-1 py-2 shadow-innerSoft ring-1 ring-blush-100">
                      <span className="font-display text-2xl font-semibold leading-none text-theme-deep">
                        {entryDate.getDate()}
                      </span>
                      <span className="mt-1 text-[9px] text-ink-500">
                        {entryDate.getMonth() + 1} 月
                      </span>
                      <span className="text-[9px] text-ink-400">{formatWeekday(entry.date)}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 pr-8">
                        <div className="min-w-0">
                          <h3 className="truncate font-display text-lg font-semibold text-ink-900">
                            {entry.dishName}
                          </h3>
                          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-ink-400">
                            <CalendarDays className="h-3 w-3" />
                            {formatDateCN(entry.date)}
                            {isToday && <span className="text-blush-500">· 今天</span>}
                          </p>
                        </div>
                      </div>
                      <div className="mt-1.5">
                        <StarRating value={entry.rating} size="sm" readOnly />
                      </div>
                    </div>
                  </div>

                  {entry.content && (
                    <p className="mt-3 whitespace-pre-wrap text-[12.5px] leading-[1.85] text-ink-600">
                      {entry.content}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-dashed border-blush-100 pt-2.5">
                    <span className="text-[9px] tracking-wide text-ink-300">
                      {entry.photo ? '有照片的这一天' : '纯文字的小记录'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(entry)}
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] text-ink-500 transition-colors hover:bg-white hover:text-theme-deep"
                      >
                        <Pencil className="h-3 w-3" />
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(entry)}
                        aria-label={`删除 ${entry.dishName} 的日记`}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-ink-300 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <button
            type="button"
            onClick={openCreate}
            className="flex w-full items-center justify-center gap-2 rounded-3xl border border-dashed border-blush-200 bg-white/50 py-4 text-xs text-ink-500 transition-colors hover:border-theme/50 hover:bg-white hover:text-theme-deep"
          >
            <Plus className="h-4 w-4" />
            再写一篇
          </button>
        </div>
      )}

      <Sheet
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingEntry(null);
        }}
        title={editingEntry ? '编辑这篇日记' : '写一篇美食日记'}
        description="记下味道、照片和当时的心情，以后再翻看会很甜。"
      >
        <DiaryForm
          initial={editingEntry ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormOpen(false);
            setEditingEntry(null);
          }}
        />
      </Sheet>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="删除这篇日记？"
        description={`「${pendingDelete?.dishName ?? ''}」的记录和照片都会被删除，无法找回。`}
        confirmLabel="删除日记"
        tone="danger"
        onConfirm={handleDelete}
      />

      {diary.length > 0 && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/recipes')}
            className="text-[11px] text-ink-400 underline-offset-4 transition-colors hover:text-theme-deep hover:underline"
          >
            想再做一道菜？去菜谱看看
          </button>
        </div>
      )}
    </div>
  );
}
