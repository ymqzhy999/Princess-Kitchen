import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-theme to-theme-deep text-white shadow-float hover:brightness-105 active:brightness-95 disabled:from-blush-200 disabled:to-blush-200 disabled:text-white/80 disabled:shadow-none',
  secondary:
    'border border-blush-200 bg-white/90 text-ink-700 shadow-innerSoft hover:border-blush-300 hover:bg-blush-50 active:bg-blush-100',
  soft: 'bg-theme-soft text-theme-deep hover:bg-theme-soft/80 active:bg-theme-soft/70',
  ghost: 'text-ink-600 hover:bg-blush-50 active:bg-blush-100',
  danger:
    'border border-red-100 bg-red-50 text-red-600 hover:border-red-200 hover:bg-red-100 active:bg-red-100',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 gap-1.5 rounded-full px-3.5 text-[13px]',
  md: 'h-11 gap-2 rounded-full px-5 text-sm',
  lg: 'h-[52px] gap-2 rounded-full px-6 text-[15px]',
  icon: 'h-10 w-10 rounded-full',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex select-none items-center justify-center font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50',
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}
