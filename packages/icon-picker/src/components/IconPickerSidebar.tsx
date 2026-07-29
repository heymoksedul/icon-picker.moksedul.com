import {
  Aperture,
  Bold,
  Box,
  ChevronRight,
  CircleDot,
  Code,
  Feather,
  Grid,
  Hexagon,
  Layers,
  Shield,
  Smile,
  Sparkles,
  Star,
  Triangle,
  Zap,
  Upload
} from "lucide-react";
import type { IconSetMeta } from "../icon-sets";

export interface IconPickerSidebarProps {
  title: string;
  tab: "library" | "custom";
  setTab: (tab: "library" | "custom") => void;
  activeSet: string;
  setActiveSet: (set: string) => void;
  setSearch: (search: string) => void;
  sets: IconSetMeta[];
  allowCustomSvg: boolean;
}

export function IconPickerSidebar({
  title,
  tab,
  setTab,
  activeSet,
  setActiveSet,
  setSearch,
  sets,
  allowCustomSvg
}: IconPickerSidebarProps) {
  const iconMap: Record<string, React.ElementType> = {
    star: Star, shield: Shield, triangle: Triangle, bold: Bold,
    aperture: Aperture, smile: Smile, "circle-dot": CircleDot,
    grid: Grid, hexagon: Hexagon, box: Box, zap: Zap, feather: Feather,
  };

  const activeStyle = {
    backgroundColor: "var(--ip-primary-muted)",
    color: "var(--ip-primary)",
  };
  const inactiveStyle = {
    backgroundColor: "transparent",
    color: "var(--ip-fg-muted)",
  };

  return (
    <div
      className="w-full md:w-64 border-b md:border-b-0 md:border-r p-5 md:p-6 flex flex-col gap-3 md:gap-5 shrink-0"
      style={{ borderColor: "var(--ip-border)", backgroundColor: "var(--ip-bg)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-0 md:mb-1 pl-1">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5" style={{ color: "var(--ip-primary)" }} />
          <h2 className="font-bold text-base md:text-lg tracking-tight" style={{ color: "var(--ip-fg)" }}>{title}</h2>
        </div>
        
        {/* Custom SVG toggle button for mobile only */}
        {allowCustomSvg && (
          <button
            type="button"
            onClick={() => {
              if (tab === "custom") {
                setTab("library");
                setActiveSet("all");
                setSearch("");
              } else {
                setTab("custom");
              }
            }}
            className="md:hidden flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: "var(--ip-surface)",
              color: "var(--ip-fg)",
              border: "1px solid var(--ip-border)"
            }}
          >
            {tab === "custom" ? (
              <>
                <Star className="w-3.5 h-3.5" />
                <span>All icons</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload SVG</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Sets list - Hidden on mobile, visible on desktop */}
      <div className="hidden md:flex custom-scrollbar flex-col overflow-y-auto flex-1 space-y-0.5 -mx-2 px-2">
        {/* All Icons */}
        {(() => {
          const isAll = tab === "library" && activeSet === "all";
          return (
            <button
              type="button"
              onClick={() => { setTab("library"); setActiveSet("all"); setSearch(""); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={isAll ? activeStyle : inactiveStyle}
              onMouseEnter={(e) => { if (!isAll) { e.currentTarget.style.backgroundColor = "var(--ip-accent)"; e.currentTarget.style.color = "var(--ip-fg)"; }}}
              onMouseLeave={(e) => { if (!isAll) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--ip-fg-muted)"; }}}
            >
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4" style={{ color: isAll ? "var(--ip-primary)" : "var(--ip-fg-muted)" }} />
                <span>All Icons</span>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold border"
                style={{ 
                  backgroundColor: isAll ? "var(--ip-primary-muted)" : "var(--ip-surface)", 
                  color: isAll ? "var(--ip-primary)" : "var(--ip-fg-muted)",
                  borderColor: isAll ? "transparent" : "var(--ip-border)"
                }}
              >
                25,097
              </span>
            </button>
          );
        })()}

        {sets.map((s) => {
          const isActive = tab === "library" && activeSet === s.id;
          const SetIcon = iconMap[s.iconName ?? ""] ?? Layers;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => { setTab("library"); setActiveSet(s.id); setSearch(""); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={isActive ? activeStyle : inactiveStyle}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = "var(--ip-accent)"; e.currentTarget.style.color = "var(--ip-fg)"; }}}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--ip-fg-muted)"; }}}
            >
              <div className="flex items-center gap-3 truncate">
                <SetIcon className="w-4 h-4 shrink-0" style={{ color: isActive ? "var(--ip-primary)" : "var(--ip-fg-muted)" }} />
                <span className="truncate">{s.label}</span>
              </div>
              {s.count && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold border"
                  style={{ 
                    backgroundColor: isActive ? "var(--ip-primary-muted)" : "var(--ip-surface)", 
                    color: isActive ? "var(--ip-primary)" : "var(--ip-fg-muted)",
                    borderColor: isActive ? "transparent" : "var(--ip-border)"
                  }}
                >
                  {s.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom SVG button - Hidden on mobile, visible on desktop */}
      {allowCustomSvg && (
        <button
          type="button"
          onClick={() => setTab("custom")}
          className="hidden md:flex mt-auto items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors"
          style={{
            border: "1px solid",
            borderColor: tab === "custom" ? "color-mix(in srgb, var(--ip-primary) 30%, transparent)" : "var(--ip-border)",
            backgroundColor: tab === "custom" ? "var(--ip-primary-muted)" : "transparent",
            color: "var(--ip-primary)",
          }}
        >
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>Custom SVG</span>
          </div>
          <ChevronRight className="w-4 h-4 hidden md:block" />
        </button>
      )}
    </div>
  );
}
