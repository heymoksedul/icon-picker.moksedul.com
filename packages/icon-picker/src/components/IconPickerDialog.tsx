"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { IconType } from "react-icons";
import { ICON_SETS, iconNames, loadIconSet, type IconSetMeta } from "../icon-sets";
import type { IconStoreConfig, IconValue } from "../types";
import CustomSvgInput from "./CustomSvgInput";
import { IconPickerFooter } from "./IconPickerFooter";
import { IconPickerGrid } from "./IconPickerGrid";
import { IconPickerHeader } from "./IconPickerHeader";
import { IconPickerSidebar } from "./IconPickerSidebar";
import { useIconStoreConfig } from "./IconProvider";

const RENDER_CAP = 300;
type Tab = "library" | "custom";

export interface IconPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (value: IconValue) => void;
  value?: IconValue | null;
  title?: string;
  config?: IconStoreConfig;
}

export function IconPickerDialog({
  open,
  onClose,
  onSelect,
  value,
  title = "Choose Icon",
  config,
}: IconPickerDialogProps) {
  const providerConfig = useIconStoreConfig();
  const merged: IconStoreConfig = { outputFormat: "svg", ...providerConfig, ...config };
  const allowCustomSvg = merged.allowCustomSvg !== false;

  const sets: IconSetMeta[] = useMemo(() => {
    if (!merged.enabledSets?.length) return ICON_SETS;
    const allow = new Set(merged.enabledSets);
    return ICON_SETS.filter((s) => allow.has(s.id));
  }, [merged.enabledSets]);

  const initialSet = (value?.type === "react-icon" && sets.find((s) => s.id === value.set)?.id) || "all";

  const [tab, setTab] = useState<Tab>("library");
  const [activeSet, setActiveSet] = useState<string>(initialSet);
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState("all");
  const [loadedIcons, setLoadedIcons] = useState<{ set: string; name: string; Comp: IconType }[]>([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(RENDER_CAP);

  const [stagedIcon, setStagedIcon] = useState<IconValue | null>(value || null);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      // Wait for next frame to trigger enter animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      // Wait for exit animation to finish before unmounting
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 200); // 200ms matches our duration-200
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setTab("library");
      setActiveSet(initialSet);
      setSearch("");
      setStagedIcon(value || null);
      setApplying(false);
    }
  }, [open, initialSet, value]);

  useEffect(() => {
    setVisibleCount(RENDER_CAP);
  }, [search, activeSet, tab]);

  useEffect(() => {
    if (!open || tab !== "library" || !activeSet) return;
    let alive = true;
    setLoading(true);
    setLoadedIcons([]);

    const loadData = async () => {
      if (activeSet === "all") {
        const mods = await Promise.all(sets.map((s) => loadIconSet(s.id)));
        if (!alive) return;
        const combined: { set: string; name: string; Comp: IconType }[] = [];
        mods.forEach((m, i) => {
          if (m) {
            const setId = sets[i].id;
            iconNames(m).forEach((name) => combined.push({ set: setId, name, Comp: m[name] }));
          }
        });
        setLoadedIcons(combined);
      } else {
        const m = await loadIconSet(activeSet);
        if (!alive) return;
        const combined: { set: string; name: string; Comp: IconType }[] = [];
        if (m) {
          iconNames(m).forEach((name) => combined.push({ set: activeSet, name, Comp: m[name] }));
        }
        setLoadedIcons(combined);
      }
      setLoading(false);
      if (gridRef.current) gridRef.current.scrollTop = 0;
    };

    loadData();
    return () => {
      alive = false;
    };
  }, [open, tab, activeSet, sets]);

  const filtered = useMemo(() => {
    let result = loadedIcons;
    if (styleFilter === "outline") {
      result = result.filter((item) => {
        const lower = item.name.toLowerCase();
        return lower.includes("outline") || lower.includes("reg") || lower.includes("line");
      });
    } else if (styleFilter === "solid") {
      result = result.filter((item) => {
        const lower = item.name.toLowerCase();
        return lower.includes("solid") || lower.includes("fill");
      });
    }
    const q = search.trim().toLowerCase();
    return q ? result.filter((item) => item.name.toLowerCase().includes(q)) : result;
  }, [loadedIcons, search, styleFilter]);

  const shown = filtered.slice(0, visibleCount);
  const overflow = filtered.length - shown.length;

  const handleScroll = () => {
    if (!gridRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = gridRef.current;
    if (scrollHeight - scrollTop - clientHeight < 250) {
      setVisibleCount((prev) => prev + RENDER_CAP);
    }
  };

  const pick = (set: string, name: string) => {
    setStagedIcon({ type: "react-icon", set, name });
  };

  const handleCustomSvgInsert = (svg: string | null) => {
    if (svg) {
      setStagedIcon({ type: "svg", svg });
    } else {
      setStagedIcon(null);
    }
  };

  const handleApply = async () => {
    if (!stagedIcon) return;
    setApplying(true);
    try {
      let finalIcon = stagedIcon;

      // Convert react-icon to svg string if outputFormat is "svg"
      if (stagedIcon.type === "react-icon" && merged.outputFormat === "svg") {
        const item = loadedIcons.find((i) => i.set === stagedIcon.set && i.name === stagedIcon.name);
        if (item) {
          const Comp = item.Comp;
          // Dynamically import react-dom/server to avoid bloating the client bundle
          const { renderToStaticMarkup } = await import("react-dom/server");
          const svgString = renderToStaticMarkup(<Comp />);
          finalIcon = { type: "svg", svg: svgString, name: stagedIcon.name };
        }
      }

      if (finalIcon.type === "svg" && merged.onUploadSvg) {
        const uploaded = await merged.onUploadSvg(finalIcon.svg);
        onSelect(uploaded);
      } else {
        onSelect(finalIcon);
      }
      onClose();
    } catch (err) {
      console.error("Failed to apply icon", err);
      setApplying(false);
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <div className="icon-picker-scope antialiased">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-9998 transition-opacity duration-200 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
        style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div
        className={`fixed left-1/2 top-1/2 w-[95%] md:w-full z-9999 flex max-w-300 h-[85vh] -translate-x-1/2 flex-col md:flex-row overflow-hidden rounded-2xl transition-all duration-200 ease-out ${isVisible ? "-translate-y-1/2 opacity-100 scale-100" : "translate-y-[-48%] opacity-0 scale-95"}`}
        style={{ border: "1px solid var(--ip-border)", backgroundColor: "var(--ip-bg)" }}
      >
        <IconPickerSidebar 
          title={title}
          tab={tab}
          setTab={setTab}
          activeSet={activeSet}
          setActiveSet={setActiveSet}
          setSearch={setSearch}
          sets={sets}
          allowCustomSvg={allowCustomSvg}
        />

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0" style={{ backgroundColor: "var(--ip-bg)" }}>
          {tab === "custom" ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar px-5 md:px-6 py-5 md:py-6">
              <CustomSvgInput onInsert={handleCustomSvgInsert} />
            </div>
          ) : (
            <>
              <IconPickerHeader 
                search={search}
                setSearch={setSearch}
                styleFilter={styleFilter}
                setStyleFilter={setStyleFilter}
              />
              <IconPickerGrid 
                loading={loading}
                search={search}
                shown={shown}
                overflow={overflow}
                stagedIcon={stagedIcon}
                pick={pick}
                gridRef={gridRef}
                handleScroll={handleScroll}
              />
            </>
          )}

          <IconPickerFooter 
            onClose={onClose}
            handleApply={handleApply}
            stagedIcon={stagedIcon}
            applying={applying}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

export default IconPickerDialog;
