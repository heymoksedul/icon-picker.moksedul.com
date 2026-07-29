"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { Search, Loader2 } from "lucide-react";
import {
  ICON_SETS,
  loadIconSet,
  iconNames,
  type IconModule,
  type IconSetMeta,
} from "../icon-sets";
import type { IconStoreConfig, IconValue } from "../types";
import { useIconStoreConfig } from "./IconProvider";
import { StyleInjector } from "./IconProvider";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "./ui/dialog";
import CustomSvgInput from "./CustomSvgInput";

/** How many icons to render at once before asking the user to refine search. */
const RENDER_CAP = 300;

type Tab = "library" | "custom";

export interface IconPickerDialogProps {
  open: boolean;
  onClose: () => void;
  /** Fired when the user picks (react-icon) or inserts (custom SVG) an icon. */
  onSelect: (value: IconValue) => void;
  /** Current value — used to preselect the set + highlight the active icon. */
  value?: IconValue | null;
  title?: string;
  /** Per-instance config; falls back to <IconProvider> then package defaults. */
  config?: IconStoreConfig;
}

export function IconPickerDialog({
  open,
  onClose,
  onSelect,
  value,
  title = "Choose an icon",
  config,
}: IconPickerDialogProps) {
  const providerConfig = useIconStoreConfig();
  const merged: IconStoreConfig = { ...providerConfig, ...config };
  const allowCustomSvg = merged.allowCustomSvg !== false;

  const sets: IconSetMeta[] = useMemo(() => {
    if (!merged.enabledSets?.length) return ICON_SETS;
    const allow = new Set(merged.enabledSets);
    return ICON_SETS.filter((s) => allow.has(s.id));
  }, [merged.enabledSets]);

  const initialSet =
    (value?.type === "react-icon" &&
      sets.find((s) => s.id === value.set)?.id) ||
    sets[0]?.id;

  const [tab, setTab] = useState<Tab>("library");
  const [activeSet, setActiveSet] = useState<string>(initialSet);
  const [search, setSearch] = useState("");
  const [mod, setMod] = useState<IconModule | null>(null);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Reset transient state each time the dialog opens.
  useEffect(() => {
    if (open) {
      setTab("library");
      setActiveSet(initialSet);
      setSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Load the active set's module on demand.
  useEffect(() => {
    if (!open || tab !== "library" || !activeSet) return;
    let alive = true;
    setLoading(true);
    setMod(null);
    loadIconSet(activeSet).then((m) => {
      if (!alive) return;
      setMod(m);
      setLoading(false);
      if (gridRef.current) gridRef.current.scrollTop = 0;
    });
    return () => {
      alive = false;
    };
  }, [open, tab, activeSet]);

  const allNames = useMemo(() => (mod ? iconNames(mod) : []), [mod]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const names = q ? allNames.filter((n) => n.toLowerCase().includes(q)) : allNames;
    return names;
  }, [allNames, search]);

  const shown = filtered.slice(0, RENDER_CAP);
  const overflow = filtered.length - shown.length;

  const pick = (name: string) => {
    onSelect({ type: "react-icon", set: activeSet, name });
    onClose();
  };

  const insertSvg = async (svg: string) => {
    if (merged.onUploadSvg) {
      const v = await merged.onUploadSvg(svg);
      onSelect(v);
    } else {
      onSelect({ type: "svg", svg });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <StyleInjector />
      <DialogContent className="h-[80vh] max-w-4xl p-0">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-border p-4 pr-12">
          <DialogTitle>{title}</DialogTitle>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-md border border-border">
              <button
                type="button"
                onClick={() => setTab("library")}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium transition-colors",
                  tab === "library"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                Icon library
              </button>
              {allowCustomSvg && (
                <button
                  type="button"
                  onClick={() => setTab("custom")}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium transition-colors",
                    tab === "custom"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  Custom SVG
                </button>
              )}
            </div>

            {tab === "library" && (
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search icons…"
                  className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        {tab === "custom" ? (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <CustomSvgInput onInsert={insertSvg} />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1">
            {/* Set selector */}
            <div className="custom-scrollbar w-44 shrink-0 overflow-y-auto border-r border-border p-2">
              {sets.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setActiveSet(s.id);
                    setSearch("");
                  }}
                  className={cn(
                    "mb-0.5 w-full truncate rounded-md px-3 py-2 text-left text-sm transition-colors",
                    activeSet === s.id
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/60",
                  )}
                  title={s.label}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Icon grid */}
            <div
              ref={gridRef}
              className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-3"
            >
              {loading ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Loading icons…
                </div>
              ) : shown.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No icons match “{search}”.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-1.5">
                    {shown.map((name) => {
                      const Comp = mod?.[name] as IconType;
                      const active =
                        value?.type === "react-icon" &&
                        value.set === activeSet &&
                        value.name === name;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => pick(name)}
                          title={name}
                          className={cn(
                            "flex aspect-square items-center justify-center rounded-md border text-foreground transition-colors",
                            active
                              ? "border-primary bg-primary/10"
                              : "border-transparent hover:border-border hover:bg-muted",
                          )}
                        >
                          {Comp ? <Comp size={22} /> : null}
                        </button>
                      );
                    })}
                  </div>
                  {overflow > 0 && (
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Showing {shown.length} of {filtered.length}. Refine your
                      search to see more.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default IconPickerDialog;
