import React, { createContext, useContext, useEffect, useState } from "react";
import type { IconStoreConfig, IconTheme } from "../types";
import { cssString } from "../styles";

const IconStoreContext = createContext<IconStoreConfig>({});

export function useIconStoreConfig() {
  return useContext(IconStoreContext);
}

export function IconProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config?: IconStoreConfig;
}) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (config?.theme) {
      const newStyle: any = {};
      Object.entries(config.theme).forEach(([key, val]) => {
        if (val) {
          const cssVar = `--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
          newStyle[cssVar] = val;
        }
      });
      setStyle(newStyle);
    }
  }, [config?.theme]);

  return (
    <IconStoreContext.Provider value={config || {}}>
      {Object.keys(style).length > 0 ? (
        <div style={style} className="contents">
          <style dangerouslySetInnerHTML={{ __html: cssString }} />
          {children}
        </div>
      ) : (
        <>
          <style dangerouslySetInnerHTML={{ __html: cssString }} />
          {children}
        </>
      )}
    </IconStoreContext.Provider>
  );
}
