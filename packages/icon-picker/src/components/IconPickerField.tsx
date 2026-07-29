"use client";

import { ChevronDown, ImageIcon, Pencil } from "lucide-react";
import { CSSProperties, useState } from "react";
import type { IconType } from "react-icons";
import type { IconValue } from "../types";
import { IconPickerDialog } from "./IconPickerDialog";

export interface IconPickerFieldProps {
  value?: IconValue | null;
  onChange: (val: IconValue) => void;
  /** Visual style of the field trigger */
  variant?: "button" | "card" | "ghost";
  /** Size of the trigger element */
  size?: "sm" | "md" | "lg" | "xl";
  /** Optional extra className for the trigger wrapper */
  className?: string;
  /** Override CSS variables — maps to --ip-* custom properties */
  theme?: {
    primary?: string;
    primaryFg?: string;
    bg?: string;
    fg?: string;
    fgMuted?: string;
    border?: string;
    surface?: string;
  };
  /** Placeholder label when no icon is selected */
  placeholder?: string;
  /** Optional rendered icon component from react-icons (for live preview inside card/button) */
  IconComponent?: IconType | null;
}

const cardSizes: Record<string, { box: string; icon: number }> = {
  sm: { box: "w-20 h-20", icon: 28 },
  md: { box: "w-28 h-28", icon: 40 },
  lg: { box: "w-36 h-36", icon: 52 },
  xl: { box: "w-48 h-48", icon: 64 },
};

const buttonSizes: Record<string, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-sm gap-2.5",
  xl: "h-14 px-6 text-base gap-3",
};

export function IconPickerField({
  value,
  onChange,
  variant = "button",
  size = "md",
  className = "",
  theme,
  placeholder = "Select icon...",
  IconComponent,
}: IconPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Build CSS variable overrides from the theme prop
  const themeVars: CSSProperties = theme
    ? ({
        ...(theme.primary     && { "--ip-primary":      theme.primary }),
        ...(theme.primaryFg   && { "--ip-primary-fg":   theme.primaryFg }),
        ...(theme.bg          && { "--ip-bg":            theme.bg }),
        ...(theme.fg          && { "--ip-fg":            theme.fg }),
        ...(theme.fgMuted     && { "--ip-fg-muted":     theme.fgMuted }),
        ...(theme.border      && { "--ip-border":        theme.border }),
        ...(theme.surface     && { "--ip-surface":       theme.surface }),
      } as CSSProperties)
    : {};

  const label = value
    ? value.type === "react-icon" ? value.name : "Custom SVG"
    : placeholder;

  // ── Card variant ──────────────────────────────────────────────────────────
  if (variant === "card") {
    const { box, icon: iconSize } = cardSizes[size] ?? cardSizes.md;
    return (
      <div className={`icon-picker-scope inline-block ${className}`} style={themeVars}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`relative ${box} rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-200 focus:outline-none group`}
          style={{
            border: `1px solid ${hovered ? "var(--ip-primary)" : "var(--ip-border)"}`,
            backgroundColor: "var(--ip-surface)",
            boxShadow: hovered ? "0 0 0 4px color-mix(in srgb, var(--ip-primary) 12%, transparent)" : "none",
          }}
        >
          {/* Icon or placeholder */}
          {value ? (
            <div style={{ color: "var(--ip-primary)", width: iconSize, height: iconSize }}>
              {value.type === "svg" ? (
                <div
                  dangerouslySetInnerHTML={{ __html: value.svg }}
                  style={{ width: iconSize, height: iconSize }}
                  className="flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                />
              ) : IconComponent ? (
                <IconComponent size={iconSize} />
              ) : (
                <div
                  className="flex items-center justify-center text-xs font-bold rounded-lg"
                  style={{ width: iconSize, height: iconSize, backgroundColor: "var(--ip-primary-muted)", color: "var(--ip-primary)" }}
                >
                  {value.type === "react-icon" ? value.name.substring(0, 2).toUpperCase() : "SV"}
                </div>
              )}
            </div>
          ) : (
            <ImageIcon
              style={{ width: iconSize * 0.6, height: iconSize * 0.6, color: "var(--ip-border)" }}
            />
          )}

          {/* Hover overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 rounded-2xl"
            style={{
              opacity: hovered ? 1 : 0,
              backgroundColor: "color-mix(in srgb, var(--ip-primary) 10%, transparent)",
            }}
          >
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "var(--ip-primary)", color: "var(--ip-primary-fg)" }}
            >
              <Pencil className="w-3 h-3" />
              {value ? "Change" : "Select"}
            </div>
          </div>
        </button>

        <IconPickerDialog
          open={open}
          onClose={() => setOpen(false)}
          onSelect={onChange}
          value={value}
        />
      </div>
    );
  }

  // ── Ghost variant ─────────────────────────────────────────────────────────
  if (variant === "ghost") {
    return (
      <div className={`icon-picker-scope inline-flex ${className}`} style={themeVars}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`inline-flex items-center rounded-lg transition-all duration-200 focus:outline-none ${buttonSizes[size]}`}
          style={{ color: "var(--ip-fg)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ip-surface)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <IconPreview value={value} IconComponent={IconComponent} />
          <span className="font-medium" style={{ color: "var(--ip-fg-muted)" }}>{label}</span>
        </button>
        <IconPickerDialog
          open={open}
          onClose={() => setOpen(false)}
          onSelect={onChange}
          value={value}
        />
      </div>
    );
  }

  // ── Default button variant ─────────────────────────────────────────────────
  return (
    <div className={`icon-picker-scope inline-flex ${className}`} style={themeVars}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-full flex items-center justify-between border rounded-xl transition-all duration-200 focus:outline-none ${buttonSizes[size]}`}
        style={{ backgroundColor: "var(--ip-bg)", borderColor: "var(--ip-border)", color: "var(--ip-fg)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--ip-primary)";
          e.currentTarget.style.boxShadow = "0 0 0 3px color-mix(in srgb, var(--ip-primary) 10%, transparent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--ip-border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div className="flex items-center" style={{ gap: "inherit" }}>
          <IconPreview value={value} IconComponent={IconComponent} />
          <span className="font-medium">{label}</span>
        </div>
        <ChevronDown className="w-4 h-4 shrink-0" style={{ color: "var(--ip-fg-muted)" }} />
      </button>
      <IconPickerDialog
        open={open}
        onClose={() => setOpen(false)}
        onSelect={onChange}
        value={value}
      />
    </div>
  );
}

// ── Helper: small icon preview inside button/ghost ─────────────────────────
function IconPreview({ value, IconComponent }: { value?: IconValue | null; IconComponent?: IconType | null }) {
  if (!value) {
    return (
      <div
        className="w-5 h-5 rounded border border-dashed flex items-center justify-center shrink-0"
        style={{ borderColor: "var(--ip-border)", backgroundColor: "var(--ip-surface)" }}
      />
    );
  }
  if (value.type === "svg") {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: value.svg }}
        className="w-5 h-5 flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full"
        style={{ color: "var(--ip-primary)" }}
      />
    );
  }
  if (IconComponent) {
    return <IconComponent size={18} style={{ color: "var(--ip-primary)", flexShrink: 0 }} />;
  }
  return (
    <div
      className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0"
      style={{ backgroundColor: "var(--ip-primary-muted)", color: "var(--ip-primary)" }}
    >
      {value.type === "react-icon" ? value.name.substring(0, 2).toUpperCase() : "SV"}
    </div>
  );
}
