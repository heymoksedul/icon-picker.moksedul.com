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
  Zap
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
  return (
    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800/50 p-5 flex flex-col gap-5 bg-white dark:bg-zinc-950 shrink-0">
      {/* Header in sidebar */}
      <div className="flex items-center gap-2.5 mb-1 pl-1">
        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight">{title}</h2>
      </div>
      
      {/* Sets list */}
      <div className="custom-scrollbar flex-1 overflow-y-auto space-y-0.5 -mx-2 px-2">
        <button
          type="button"
          onClick={() => { setTab("library"); setActiveSet("all"); setSearch(""); }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            tab === "library" && activeSet === "all" 
              ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" 
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <Star className={`w-4 h-4 ${tab === "library" && activeSet === "all" ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400 dark:text-zinc-500"}`} />
            <span>All Icons</span>
          </div>
          <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-semibold transition-colors ${
            tab === "library" && activeSet === "all" 
              ? "bg-indigo-100/50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300" 
              : "text-zinc-400 dark:text-zinc-500"
          }`}>
            25,097
          </span>
        </button>
        
        {sets.map((s) => {
          const isActive = tab === "library" && activeSet === s.id;
          
          // Resolve icon dynamically based on the string name we set in meta
          let SetIcon = Layers;
          if (s.iconName === "star") SetIcon = Star;
          if (s.iconName === "shield") SetIcon = Shield;
          if (s.iconName === "triangle") SetIcon = Triangle;
          if (s.iconName === "bold") SetIcon = Bold;
          if (s.iconName === "aperture") SetIcon = Aperture;
          if (s.iconName === "smile") SetIcon = Smile;
          if (s.iconName === "circle-dot") SetIcon = CircleDot;
          if (s.iconName === "grid") SetIcon = Grid;
          if (s.iconName === "hexagon") SetIcon = Hexagon;
          if (s.iconName === "box") SetIcon = Box;
          if (s.iconName === "zap") SetIcon = Zap;
          if (s.iconName === "feather") SetIcon = Feather;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => { setTab("library"); setActiveSet(s.id); setSearch(""); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" 
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <SetIcon className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400 dark:text-zinc-500"}`} />
                <span className="truncate">{s.label}</span>
              </div>
              {s.count && (
                <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-semibold transition-colors ${
                  isActive 
                    ? "bg-indigo-100/50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300" 
                    : "text-zinc-400 dark:text-zinc-500"
                }`}>
                  {s.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom SVG button */}
      {allowCustomSvg && (
        <button 
          type="button"
          onClick={() => setTab("custom")}
          className={`mt-auto flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            tab === "custom"
              ? "border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400"
              : "border border-zinc-200 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          }`}
        >
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Custom SVG
          </div>
          <ChevronRight className={`w-4 h-4 ${tab === "custom" ? "text-indigo-500" : "text-indigo-400"}`} />
        </button>
      )}
    </div>
  );
}
