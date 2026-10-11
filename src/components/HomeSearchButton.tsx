'use client';

import { Search } from 'lucide-react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { Dialog } from '@base-ui/react/dialog';

export function HomeSearchButton() {
  const { enabled, dialogHandle, setOpenSearch } = useSearchContext();
  if (!enabled) return null;

  return (
    <Dialog.Trigger
      handle={dialogHandle}
      type="button"
      onClick={() => setOpenSearch?.(true)}
      aria-label="Mở ô tìm kiếm tài liệu"
      className="inline-flex min-h-[48px] items-center justify-between gap-4 rounded-xl border border-border/80 bg-card/90 backdrop-blur-md px-5 py-3 text-sm text-muted-foreground shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-card hover:shadow-md active:scale-98 w-full max-w-xl cursor-pointer"
    >
      <div className="flex items-center gap-2.5">
        <Search className="w-4 h-4 text-primary shrink-0" />
        <span className="font-medium text-foreground/80">Tìm kiếm nhanh tài liệu, quy trình, tác vụ...</span>
      </div>
      <div className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/60">
        <kbd>⌘</kbd>
        <kbd>K</kbd>
      </div>
    </Dialog.Trigger>
  );
}
