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
      <div
        className="relative flex-1 flex items-center rounded-lg transition-all"
        style={{ border: "1px solid var(--ip-border)", backgroundColor: "var(--ip-bg)" }}
        onFocusCapture={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--ip-primary)"}
        onBlurCapture={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--ip-border)"}
      >
        <Search className="w-4 h-4 ml-3.5 shrink-0" style={{ color: "var(--ip-fg-muted)" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2.5 bg-transparent text-sm focus:outline-none"
          style={{ color: "var(--ip-fg)" }}
          placeholder="Search icons..."
        />
        <div className="flex items-center gap-2 pr-1.5 shrink-0">
          <kbd
            className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-medium"
            style={{ border: "1px solid var(--ip-border)", backgroundColor: "var(--ip-surface)", color: "var(--ip-fg-muted)" }}
          >
            ⌘K
          </kbd>
          <div className="w-px h-4 mx-1" style={{ backgroundColor: "var(--ip-border)" }} />
          <div className="relative">
            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
              className="appearance-none pl-7 pr-6 py-1.5 rounded-lg text-sm font-medium bg-transparent focus:outline-none cursor-pointer transition-colors"
              style={{ color: "var(--ip-fg)" }}
            >
              <option value="all">All styles</option>
              <option value="outline">Outline</option>
              <option value="solid">Solid</option>
            </select>
            <Sparkles className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--ip-fg-muted)" }} />
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--ip-fg-muted)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
