/**
 * The value produced/consumed by the icon picker. Store this straight in your
 * DB (it's small + JSON-serialisable) and render it later with <Icon value={} />.
 */
export type IconValue = ReactIconValue | SvgIconValue;

/** A pick from one of the react-icons sets. */
export interface ReactIconValue {
  type: "react-icon";
  /** Icon set id, e.g. "fa6", "md", "lu". */
  set: string;
  /** Component name within the set, e.g. "FaHome". */
  name: string;
}

/** A custom icon supplied as raw SVG markup (upload or pasted code). */
export interface SvgIconValue {
  type: "svg";
  /** Full `<svg>…</svg>` markup. */
  svg: string;
}

export function isReactIconValue(v: IconValue | null | undefined): v is ReactIconValue {
  return !!v && v.type === "react-icon";
}

export function isSvgIconValue(v: IconValue | null | undefined): v is SvgIconValue {
  return !!v && v.type === "svg";
}

/** Design tokens applied at runtime via CSS variables. */
export interface IconPickerTheme {
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
  /**
   * Restrict which icon sets are offered (by id, e.g. ["fa6","lu","md"]).
   * Omit to offer every set in ICON_SETS.
   */
  enabledSets?: string[];
  /** Show the "Custom SVG" tab (upload / paste code). Default true. */
  allowCustomSvg?: boolean;
  /**
   * Optional hook to persist an uploaded/pasted SVG to your backend and return
   * a value. If omitted, custom SVGs are kept inline as `{ type:"svg", svg }`.
   */
  onUploadSvg?: (svg: string, file?: File) => Promise<IconValue> | IconValue;
  /** Runtime theming. */
  theme?: IconPickerTheme;
}
