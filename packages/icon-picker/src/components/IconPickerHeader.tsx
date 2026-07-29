import { ChevronDown, Search, Sparkles } from "lucide-react";

export interface IconPickerHeaderProps {
  search: string;
  setSearch: (search: string) => void;
  styleFilter: string;
  setStyleFilter: (filter: string) => void;
}

export function IconPickerHeader({
  search,
  setSearch,
  styleFilter,
  setStyleFilter
}: IconPickerHeaderProps) {
  return (
    <div className="p-6 pb-4 flex items-center gap-3">
      <div className="relative flex-1 flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus-within:border-indigo-500 transition-all">
        <Search className="w-4 h-4 text-zinc-400 ml-3.5 shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2.5 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none placeholder:text-zinc-400" 
          placeholder="Search icons..." 
        />
        <div className="flex items-center gap-2 pr-1.5 shrink-0">
          <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">⌘K</kbd>
          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
          <div className="relative">
            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
              className="appearance-none flex items-center gap-2 pl-7 pr-6 py-1.5 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-transparent focus:outline-none hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
            >
              <option value="all">All styles</option>
              <option value="outline">Outline</option>
              <option value="solid">Solid</option>
            </select>
            <Sparkles className="w-3.5 h-3.5 text-zinc-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
