import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Sparkles } from 'lucide-react';
import { createId } from '../../lib/format';

interface ToastItem {
  id: string;
  message: string;
  icon?: ReactNode;
}

interface ToastContextValue {
  showToast: (message: string, options?: { icon?: ReactNode; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, number>());

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message: string, options?: { icon?: ReactNode; duration?: number }) => {
      const id = createId('toast');
      setToasts((current) => [...current.slice(-2), { id, message, icon: options?.icon }]);
      const timer = window.setTimeout(() => dismiss(id), options?.duration ?? 2400);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer));
      pending.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-toast z-[70] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex max-w-[90vw] animate-pop-in items-center gap-2 rounded-full border border-white/20 bg-ink-800/95 px-4 py-2.5 text-[13px] font-medium text-white shadow-float backdrop-blur"
          >
            <span className="text-blush-300">{toast.icon ?? <Sparkles className="h-3.5 w-3.5" />}</span>
            <span className="truncate">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast 必须在 ToastProvider 内使用');
  return context;
}
