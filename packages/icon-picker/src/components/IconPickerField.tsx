"use client";

import { ChevronDown, UploadCloud, X } from "lucide-react";
import { CSSProperties, ReactNode, useState } from "react";
import type { IconType } from "react-icons";
import type { IconValue } from "../types";
import { IconPickerDialog } from "./IconPickerDialog";

export interface IconPickerFieldProps {
  value?: IconValue | null;
  onChange: (val: IconValue | null) => void;
  /** Visual style of the field trigger */
  variant?: "button" | "card" | "ghost" | "dashed";
  /** Size of the trigger element (standard sizes or custom px/string) */
  size?: "sm" | "md" | "lg" | "xl" | number | string;
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
  placeholder?: string;
  IconComponent?: IconType | null;
  placeholderIcon?: ReactNode;
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
  placeholderIcon,
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
    ? (value.name || (value.type === "react-icon" ? value.name : "Custom SVG"))
    : placeholder;

  // ── Card variant ──────────────────────────────────────────────────────────
  if (variant === "card") {
    const isStandard = typeof size === "string" && size in cardSizes;
    const { box, icon: iconSize } = isStandard ? cardSizes[size as string] : cardSizes.md;
    const actualIconSize = isStandard ? iconSize : (typeof size === "number" ? size * 0.4 : 40);
    const customStyle: CSSProperties = isStandard ? {} : {
      width: typeof size === "number" ? `${size}px` : size,
      height: typeof size === "number" ? `${size}px` : size,
    };

    return (
      <div className="icon-picker-scope inline-block" style={themeVars}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`relative ${isStandard ? box : ""} rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-200 focus:outline-none group ${className || ""}`}
          style={{
            ...customStyle,
            border: hovered ? "1px dashed var(--ip-primary)" : "1px solid var(--ip-border)",
            backgroundColor: "var(--ip-surface)",
          }}
        >
          {/* Close button */}
          {value && (
            <div
              className="absolute top-2 right-2 p-1 rounded-full transition-colors z-10 cursor-pointer"
              style={{ color: "var(--ip-fg-muted)", backgroundColor: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ip-fg)"; e.currentTarget.style.backgroundColor = "var(--ip-surface)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ip-fg-muted)"; e.currentTarget.style.backgroundColor = "transparent"; }}
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            >
              <X className="w-4 h-4" />
            </div>
          )}

          {/* Icon or placeholder */}
          <div style={{ opacity: (value && hovered) ? 0 : 1, transition: "opacity 0.2s" }} className="flex items-center justify-center w-full h-full">
            {value ? (
              <div style={{ color: "var(--ip-fg)", width: iconSize, height: iconSize }} className="flex items-center justify-center">
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
              placeholderIcon || (
                <UploadCloud
                  style={{ width: iconSize * 0.6, height: iconSize * 0.6, color: "var(--ip-border)" }}
                />
              )
            )}
          </div>

          {/* Replace Text */}
          {value && (
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none"
              style={{ opacity: hovered ? 1 : 0 }}
            >
              <span className="text-sm font-medium" style={{ color: "var(--ip-primary)" }}>Replace</span>
            </div>
          )}

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

  // ── Dashed variant ────────────────────────────────────────────────────────
  if (variant === "dashed") {
    const isStandard = typeof size === "string" && size in cardSizes;
    const { box, icon: iconSize } = isStandard ? cardSizes[size as string] : cardSizes.md;
    const actualIconSize = isStandard ? iconSize : (typeof size === "number" ? size * 0.4 : 40);
    const customStyle: CSSProperties = isStandard ? {} : {
      width: typeof size === "number" ? `${size}px` : size,
      height: typeof size === "number" ? `${size}px` : size,
    };

    return (
      <div className="icon-picker-scope inline-block" style={themeVars}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`relative ${isStandard ? box : ""} rounded-xl flex flex-col items-center justify-center overflow-hidden transition-all duration-200 focus:outline-none group ${className || ""}`}
          style={{
            ...customStyle,
            border: `1px dashed ${hovered ? "var(--ip-primary)" : "var(--ip-border)"}`,
            backgroundColor: "transparent",
          }}
        >
          {/* Close button */}
          {value && (
            <div
              className="absolute top-2 right-2 p-1 rounded-full transition-colors z-10 cursor-pointer"
              style={{ color: "var(--ip-fg-muted)", backgroundColor: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ip-fg)"; e.currentTarget.style.backgroundColor = "var(--ip-surface)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ip-fg-muted)"; e.currentTarget.style.backgroundColor = "transparent"; }}
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            >
              <X className="w-4 h-4" />
            </div>
          )}

          {/* Inner circle for icon */}
          <div 
            className="rounded-full border flex items-center justify-center mb-3 transition-colors"
            style={{
              width: actualIconSize + 24,
              height: actualIconSize + 24,
              borderColor: hovered ? "var(--ip-primary)" : "var(--ip-border)",
              color: hovered ? "var(--ip-primary)" : "var(--ip-fg-muted)",
              backgroundColor: "transparent",
            }}
          >
            {value ? (
              <div style={{ color: "var(--ip-fg)", width: actualIconSize, height: actualIconSize }} className="flex items-center justify-center">
                {value.type === "svg" ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: value.svg }}
                    className="flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  />
                ) : IconComponent ? (
                  <IconComponent size={actualIconSize} />
                ) : (
                  <div
                    className="flex items-center justify-center text-xs font-bold rounded-full w-full h-full"
                    style={{ backgroundColor: "var(--ip-primary-muted)", color: "var(--ip-primary)" }}
                  >
                    {value.type === "react-icon" ? value.name.substring(0, 2).toUpperCase() : "SV"}
                  </div>
                )}
              </div>
            ) : (
              placeholderIcon || <UploadCloud style={{ width: actualIconSize * 0.6, height: actualIconSize * 0.6 }} />
            )}
          </div>
          
          <span className="font-medium" style={{ color: hovered ? "var(--ip-primary)" : "var(--ip-fg-muted)", fontSize: isStandard ? (size === "sm" ? "0.75rem" : "0.875rem") : "0.875rem" }}>
            {value ? (hovered ? "Replace" : "Selected") : placeholder}
          </span>
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
    const isStandard = typeof size === "string" && size in buttonSizes;
    const btnClass = isStandard ? buttonSizes[size as string] : "h-10 px-4 text-sm gap-2";
    
    return (
      <div className="icon-picker-scope inline-flex" style={themeVars}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`inline-flex items-center rounded-lg text-(--ip-fg) hover:bg-(--ip-surface) transition-all duration-200 focus:outline-none ${btnClass} ${className || ""}`}
          style={{ 
            ...(isStandard ? {} : { width: typeof size === "number" ? `${size}px` : size })
          }}
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
  const isStandardBtn = typeof size === "string" && size in buttonSizes;
  const defBtnClass = isStandardBtn ? buttonSizes[size as string] : "h-10 px-4 text-sm gap-2";

  return (
    <div className={`icon-picker-scope flex ${className?.includes('w-full') ? 'w-full' : 'inline-flex'}`} style={themeVars}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-full flex items-center justify-between border border-(--ip-border) hover:border-(--ip-primary) hover:border-dashed bg-(--ip-bg) text-(--ip-fg) rounded-xl transition-all duration-200 focus:outline-none ${defBtnClass} ${className || ""}`}
        style={{ 
          ...(isStandardBtn ? {} : { width: typeof size === "number" ? `${size}px` : size })
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
        style={{ color: "var(--ip-fg)" }}
      />
    );
  }
  if (IconComponent) {
    return <IconComponent size={18} style={{ color: "var(--ip-fg)", flexShrink: 0 }} />;
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
