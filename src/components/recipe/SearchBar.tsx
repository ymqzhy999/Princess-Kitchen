import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = '搜菜名、食材或口味…',
  ariaLabel = '搜索菜谱',
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blush-400"
        strokeWidth={2.2}
        aria-hidden="true"
      />
      <input
        type="search"
        inputMode="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        enterKeyHint="search"
        className="h-12 w-full appearance-none rounded-full border border-white/90 bg-white/95 pl-11 pr-11 text-base text-ink-800 shadow-soft outline-none transition-colors placeholder:text-ink-400 focus:border-theme/50 focus:ring-2 focus:ring-theme/20 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="清空搜索"
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-blush-50 text-ink-400 transition-colors hover:bg-blush-100 hover:text-ink-700"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
