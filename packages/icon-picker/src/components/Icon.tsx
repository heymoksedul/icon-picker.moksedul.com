"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { IconType } from "react-icons";
import { loadIconSet } from "../icon-sets";
import type { IconValue } from "../types";
import { cn } from "@/lib/utils";

/** Very small allow-list sanitiser for inline SVG strings. */
function sanitizeSvg(svg: string): string {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/ on[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/ on[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export interface IconProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /** The stored icon value. Renders nothing when null/undefined. */
  value?: IconValue | null;
  /** Pixel size (width & height). Default 24. */
  size?: number;
  /** CSS color (uses currentColor by default). */
  color?: string;
  /** Node rendered while a react-icon set is still importing. */
  fallback?: React.ReactNode;
}

/**
 * Renders any IconValue. For react-icons it lazily imports the set and renders
 * the component; for custom SVG it inlines the (sanitised) markup sized to
 * `size` and coloured with `currentColor`.
 */
export function Icon({
  value,
  size = 24,
  color,
  fallback = null,
  className,
  style,
  ...rest
}: IconProps) {
  const [Comp, setComp] = useState<IconType | null>(null);

  useEffect(() => {
    let alive = true;
    setComp(null);
    if (value?.type === "react-icon") {
      loadIconSet(value.set).then((mod) => {
        if (alive && mod && mod[value.name]) setComp(() => mod[value.name]);
      });
    }
    return () => {
      alive = false;
    };
  }, [value?.type, (value as any)?.set, (value as any)?.name]);

  const cleanSvg = useMemo(
    () => (value?.type === "svg" ? sanitizeSvg(value.svg) : ""),
    [value],
  );

  if (!value) return <>{fallback}</>;

  if (value.type === "svg") {
    return (
      <span
        {...rest}
        className={cn("icon-picker-svg inline-flex", className)}
        style={{
          width: size,
          height: size,
          color,
          ...style,
        }}
        // Consumer-owned markup; sanitised above.
        dangerouslySetInnerHTML={{ __html: cleanSvg }}
      />
    );
  }

  // react-icon
  if (!Comp) {
    return (
      <span
        {...rest}
        className={cn("inline-flex", className)}
        style={{ width: size, height: size, ...style }}
      >
        {fallback}
      </span>
    );
  }

  return (
    <span
      {...rest}
      className={cn("inline-flex", className)}
      style={{ color, ...style }}
    >
      <Comp size={size} />
    </span>
  );
}

export default Icon;
