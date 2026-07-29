export type IconValue =
  | { type: "react-icon"; set: string; name: string; size?: number; color?: string }
  | { type: "svg"; svg: string; name?: string; size?: number; color?: string }
  | { type: "url"; url: string; size?: number; color?: string };

export interface IconTheme {
  primary?: string;
  radius?: string;
  background?: string;
  foreground?: string;
  border?: string;
  muted?: string;
  mutedForeground?: string;
  popover?: string;
  popoverForeground?: string;
}

export interface IconStoreConfig {
  enabledSets?: string[];
  allowCustomSvg?: boolean;
  onUploadSvg?: (svgString: string) => Promise<{ type: "url"; url: string }>;
  theme?: IconTheme;
  outputFormat?: "react-icon" | "svg";
}
