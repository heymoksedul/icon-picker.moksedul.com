import { CheckCircle2, Loader2 } from "lucide-react";
import type { IconValue } from "../types";

export interface IconPickerFooterProps {
  onClose: () => void;
  handleApply: () => void;
  stagedIcon: IconValue | null;
  applying: boolean;
}

export function IconPickerFooter({
  onClose,
  handleApply,
  stagedIcon,
  applying
}: IconPickerFooterProps) {
  return (
    <div className="p-5 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-end gap-3 bg-white dark:bg-zinc-950 shrink-0">
      <button 
        type="button"
        onClick={onClose}
        className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
      >
        Cancel
      </button>
      <button 
        type="button"
        onClick={handleApply}
        disabled={!stagedIcon || applying}
        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:bg-indigo-600"
      >
        {applying ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CheckCircle2 className="w-4 h-4" />
        )}
        Apply icon
      </button>
    </div>
  );
}
