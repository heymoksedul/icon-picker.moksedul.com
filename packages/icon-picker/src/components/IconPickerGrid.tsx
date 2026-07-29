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
        <div className="flex h-40 flex-col items-center justify-center gap-4">
          <Loader2 className="size-8 animate-spin" style={{ color: "var(--ip-primary)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--ip-fg-muted)" }}>Loading icons...</span>
        </div>
      ) : shown.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-4">
          <div
            className="p-4 rounded-full"
            style={{ backgroundColor: "var(--ip-surface)", border: "1px solid var(--ip-border)" }}
          >
            <Search className="size-8 opacity-30" style={{ color: "var(--ip-fg-muted)" }} />
          </div>
          <span className="text-sm font-medium" style={{ color: "var(--ip-fg-muted)" }}>No icons match "{search}"</span>
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
                  className="flex aspect-square items-center justify-center rounded-xl transition-all duration-200 group"
                  style={{
                    border: active ? "1px dashed var(--ip-primary)" : "1px solid var(--ip-border)",
                    backgroundColor: active ? "var(--ip-primary-muted)" : "var(--ip-bg)",
                    color: active ? "var(--ip-primary)" : "var(--ip-fg)",
                  }}
                >
                  {Comp ? <Comp size={24} className={active ? "" : "group-hover:scale-110 transition-transform duration-200"} /> : null}
                </button>
              );
            })}
          </div>
          {overflow > 0 && (
            <div className="mt-8 mb-4 flex justify-center items-center gap-3" style={{ color: "var(--ip-fg-muted)" }}>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Loading more...</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
