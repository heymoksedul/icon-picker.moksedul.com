import { Loader2, Search } from "lucide-react";
import type { RefObject, UIEventHandler } from "react";
import type { IconType } from "react-icons";
import type { IconValue } from "../types";

export interface IconPickerGridProps {
  loading: boolean;
  search: string;
  shown: { set: string; name: string; Comp: IconType }[];
  overflow: number;
  stagedIcon: IconValue | null;
  pick: (set: string, name: string) => void;
  gridRef: RefObject<HTMLDivElement | null>;
  handleScroll: UIEventHandler<HTMLDivElement>;
}

export function IconPickerGrid({
  loading,
  search,
  shown,
  overflow,
  stagedIcon,
  pick,
  gridRef,
  handleScroll
}: IconPickerGridProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar" ref={gridRef} onScroll={handleScroll}>
      {loading ? (
        <div className="flex h-40 flex-col items-center justify-center text-zinc-400 gap-4">
          <Loader2 className="size-8 animate-spin text-indigo-500" />
          <span className="text-sm font-medium text-zinc-500">Loading icons...</span>
        </div>
      ) : shown.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center text-zinc-400 gap-4">
          <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            <Search className="size-8 text-zinc-300 dark:text-zinc-600" />
          </div>
          <span className="text-sm font-medium text-zinc-500">No icons match "{search}"</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-3">
            {shown.map((item) => {
              const { set, name, Comp } = item;
              const active = stagedIcon?.type === "react-icon" && stagedIcon.set === set && stagedIcon.name === name;
              return (
                <button
                  key={`${set}-${name}`}
                  type="button"
                  onClick={() => pick(set, name)}
                  title={name}
                  className={`flex aspect-square items-center justify-center rounded-xl transition-all duration-200 group ${
                    active 
                      ? "border border-dashed border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                      : "border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  {Comp ? <Comp size={24} className={active ? "" : "group-hover:scale-110 transition-transform duration-200"} /> : null}
                </button>
              );
            })}
          </div>
          {overflow > 0 && (
            <div className="mt-8 mb-4 flex justify-center items-center gap-3 text-zinc-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Loading more...</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
