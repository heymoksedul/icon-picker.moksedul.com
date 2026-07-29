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
    <div className="flex-1 overflow-y-auto pl-5 md:pl-6 pr-3.5 md:pr-4.5 pb-5 md:pb-6 custom-scrollbar" ref={gridRef} onScroll={handleScroll}>
      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3 md:gap-4 overflow-hidden h-full">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="flex flex-col aspect-square items-center justify-center p-3 rounded-xl border animate-pulse"
              style={{
                borderColor: "var(--ip-border)",
                backgroundColor: "var(--ip-bg)",
              }}
            >
              <div className="w-8 h-8 rounded-md mb-3" style={{ backgroundColor: "var(--ip-surface)" }} />
              <div className="w-14 h-2.5 rounded-full" style={{ backgroundColor: "var(--ip-surface)" }} />
            </div>
          ))}
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
          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3 md:gap-4">
            {shown.map((item) => {
              const { set, name, Comp } = item;
              const active = stagedIcon?.type === "react-icon" && stagedIcon.set === set && stagedIcon.name === name;
              return (
                <button
                  key={`${set}-${name}`}
                  type="button"
                  onClick={() => pick(set, name)}
                  title={name}
                  className="flex flex-col aspect-square items-center justify-center p-3 rounded-xl transition-all duration-200"
                  style={{
                    border: active ? "1px dashed var(--ip-primary)" : "1px solid color-mix(in srgb, var(--ip-border) 40%, transparent)",
                    backgroundColor: active ? "var(--ip-primary-muted)" : "var(--ip-bg)",
                    color: active ? "var(--ip-primary)" : "var(--ip-fg)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.backgroundColor = "var(--ip-primary-muted)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.backgroundColor = "var(--ip-bg)";
                  }}
                >
                  <div className="flex-1 flex items-center justify-center">
                    {Comp ? <Comp size={28} /> : null}
                  </div>
                  <span className="text-[11px] leading-tight w-full truncate text-center mt-2 font-medium" style={{ color: active ? "var(--ip-primary)" : "var(--ip-fg-muted)" }}>
                    {name}
                  </span>
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
