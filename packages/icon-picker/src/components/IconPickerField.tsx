"use client";

import React, { ReactNode, useState } from "react";
import { Smile, Plus, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IconStoreConfig, IconValue } from "../types";
import { Icon } from "./Icon";
import { IconPickerDialog } from "./IconPickerDialog";

export type IconFieldVariant = "box" | "button";
export type IconFieldBorderVariant = "dashed" | "solid" | "none";

export interface IconPickerFieldProps {
  // ── Core ──────────────────────────────────────────────────────────────────
  /** Current icon value. null/undefined = nothing chosen yet. */
  value?: IconValue | null;
  /** Called with the new value, or null when the user clears it. */
  onChange: (value: IconValue | null) => void;

  /** Visual style. Default "box". */
  variant?: IconFieldVariant;

  /** Per-instance config (enabledSets, allowCustomSvg, onUploadSvg, theme). */
  config?: IconStoreConfig;

  // ── Labels ────────────────────────────────────────────────────────────────
  /** Empty-state label. Default "Add icon". */
  label?: string;
  /** Dialog title. Default "Choose an icon". */
  title?: string;
  /** Overlay label on hover when filled (button variant). Default "Change". */
  changeLabel?: string;

  // ── Sizing ────────────────────────────────────────────────────────────────
  /** Box side length in px (box variant). Default 72. */
  size?: number;
  /** Rendered icon size in px. Defaults to ~55% of `size` (box) / 18 (button). */
  iconSize?: number;

  // ── Icon overrides ────────────────────────────────────────────────────────
  /** Placeholder icon shown in the empty state. */
  placeholderIcon?: ReactNode;
  /** Icon in the hover-change overlay (default: RefreshCw). */
  changeIcon?: ReactNode;
  /** Icon on the remove button (default: X). */
  removeIcon?: ReactNode;

  // ── Border / style ────────────────────────────────────────────────────────
  borderVariant?: IconFieldBorderVariant;
  borderClass?: string;
  emptyClassName?: string;
  filledClassName?: string;
  rounded?: string;

  // ── Behaviour ─────────────────────────────────────────────────────────────
  showChangeOverlay?: boolean;
  showRemoveButton?: boolean;
  removeButtonClassName?: string;
  disabled?: boolean;
  className?: string;
}

function resolveBorderClass(
  variant?: IconFieldBorderVariant,
  borderClass?: string,
): string {
  if (borderClass) return borderClass;
  if (variant === "solid") return "border border-border";
  if (variant === "none") return "border-0";
  return "border border-dashed border-border";
}

/**
 * A fully-configurable icon picker field. Click to open the icon library
 * dialog (react-icons across every set + custom SVG), then returns the chosen
 * IconValue via `onChange`.
 */
export function IconPickerField({
  value,
  onChange,
  variant = "box",
  config,
  label = "Add icon",
  title,
  changeLabel = "Change",
  size = 72,
  iconSize,
  placeholderIcon,
  changeIcon,
  removeIcon,
  borderVariant,
  borderClass,
  emptyClassName,
  filledClassName,
  rounded,
  showChangeOverlay = true,
  showRemoveButton = true,
  removeButtonClassName,
  disabled,
  className,
}: IconPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const filled = !!value;

  const openDialog = () => {
    if (!disabled) setOpen(true);
  };
  const remove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const resolvedPlaceholder = placeholderIcon ?? <Smile className="size-6" />;
  const resolvedChangeIcon = changeIcon ?? <RefreshCw className="size-4" />;
  const resolvedRemoveIcon = removeIcon ?? <X className="size-3.5" />;

  const dialog = (
    <IconPickerDialog
      open={open}
      onClose={() => setOpen(false)}
      onSelect={(v) => onChange(v)}
      value={value}
      title={title}
      config={config}
    />
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // Variant: button
  // ═══════════════════════════════════════════════════════════════════════════
  if (variant === "button") {
    return (
      <div className={cn("icon-picker-scope inline-flex items-center gap-3", className)}>
        <button
          type="button"
          disabled={disabled}
          onClick={openDialog}
          className={cn(
            "inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50",
            filledClassName,
          )}
          title={title ?? label}
        >
          {filled ? (
            <>
              <Icon value={value} size={iconSize ?? 18} />
              <span>{changeLabel}</span>
            </>
          ) : (
            <>
              <Plus className="size-4" />
              <span>{label}</span>
            </>
          )}
        </button>
        {filled && !disabled && showRemoveButton && (
          <button
            type="button"
            onClick={remove}
            className={cn(
              "text-sm text-muted-foreground hover:text-destructive",
              removeButtonClassName,
            )}
          >
            Remove
          </button>
        )}
        {dialog}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Variant: box (default)
  // ═══════════════════════════════════════════════════════════════════════════
  const emptyBorder = resolveBorderClass(borderVariant, borderClass);
  const resolvedIconSize = iconSize ?? Math.round(size * 0.55);

  return (
    <div
      className={cn("icon-picker-scope relative inline-block", className)}
      style={{ width: size, height: size }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={openDialog}
        style={{ width: "100%", height: "100%" }}
        className={cn(
          "group relative flex flex-col items-center justify-center gap-1 overflow-hidden transition-colors",
          rounded ?? "rounded-xl",
          filled
            ? cn("border border-solid border-border bg-background text-foreground", filledClassName)
            : cn(
                emptyBorder,
                "bg-muted/30 text-muted-foreground hover:bg-muted/50",
                emptyClassName,
              ),
          disabled && "cursor-not-allowed opacity-50",
        )}
        title={title ?? label}
      >
        {filled ? (
          <>
            <Icon value={value} size={resolvedIconSize} />
            {showChangeOverlay && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all group-hover:bg-black/45 group-hover:opacity-100">
                {resolvedChangeIcon}
              </span>
            )}
          </>
        ) : (
          <>
            {resolvedPlaceholder}
            <span className="px-1 text-center text-[11px] leading-tight">{label}</span>
          </>
        )}
      </button>

      {filled && !disabled && showRemoveButton && (
        <button
          type="button"
          onClick={remove}
          title="Remove"
          className={cn(
            "absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white shadow-sm transition-colors hover:opacity-90",
            removeButtonClassName,
          )}
        >
          {resolvedRemoveIcon}
        </button>
      )}

      {dialog}
    </div>
  );
}

export default IconPickerField;
