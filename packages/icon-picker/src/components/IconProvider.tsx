"use client";

import React, { createContext, useContext } from "react";
import { PACKAGE_STYLES } from "../generated-styles";
import type { IconStoreConfig } from "../types";

export function StyleInjector() {
  return (
    <style
      id="icon-picker-styles"
      dangerouslySetInnerHTML={{ __html: PACKAGE_STYLES }}
    />
  );
}

const IconStoreContext = createContext<IconStoreConfig | null>(null);

export interface IconProviderProps {
  children: React.ReactNode;
  config?: IconStoreConfig;
}

/**
 * Optional. Wrap your app (or a subtree) to share config — enabled sets,
 * custom-SVG handling, theme — across every <IconPickerField>. The field also
 * works standalone without a provider; provider values are just defaults that
 * per-field props can override.
 */
export function IconProvider({ children, config }: IconProviderProps) {
  const theme = config?.theme;

  // Tailwind v4 (CSS-first): the package's `@theme` maps `bg-primary` etc.
  // to these CSS variables, so overriding them here re-themes everything.
  const style = {
    ...(theme?.primary && { "--primary": theme.primary }),
    ...(theme?.radius && { "--radius": theme.radius }),
    ...(theme?.background && { "--background": theme.background }),
    ...(theme?.foreground && { "--foreground": theme.foreground }),
    ...(theme?.border && { "--border": theme.border }),
    ...(theme?.muted && { "--muted": theme.muted }),
    ...(theme?.mutedForeground && { "--muted-foreground": theme.mutedForeground }),
    ...(theme?.popover && { "--popover": theme.popover }),
    ...(theme?.popoverForeground && {
      "--popover-foreground": theme.popoverForeground,
    }),
  } as React.CSSProperties;

  return (
    <IconStoreContext.Provider value={config ?? null}>
      <StyleInjector />
      {Object.keys(style).length > 0 ? (
        <div style={style} className="contents">
          {children}
        </div>
      ) : (
        children
      )}
    </IconStoreContext.Provider>
  );
}

/** Read provider config. Safe to call without a provider (returns {}). */
export function useIconStoreConfig(): IconStoreConfig {
  return useContext(IconStoreContext) ?? {};
}
