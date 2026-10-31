import { AlertTriangle } from 'lucide-react';
import { Sheet } from './Sheet';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'primary';
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = '确认',
  cancelLabel = '再想想',
  tone = 'primary',
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            fullWidth
            onClick={() => {
              onConfirm();
              onClose();
            }}
            leadingIcon={
              tone === 'danger' ? <AlertTriangle className="h-4 w-4" /> : undefined
            }
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex items-center justify-center py-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blush-100">
          <AlertTriangle className="h-6 w-6 text-blush-500" strokeWidth={1.6} />
        </div>
      </div>
    </Sheet>
  );
}
