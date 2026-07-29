import "./index.css";

// ── Icon store public API ───────────────────────────────────────────────────
// Ships an Elementor-style icon library: a configurable picker *field*
// (box | button), the *dialog* that browses every react-icons set + custom SVG,
// and an <Icon> renderer for displaying a stored value later.

// Optional provider — shares config (enabled sets, custom-SVG handling, theme)
// and injects the scoped styles. The field also works without it.
export {
  IconProvider,
  useIconStoreConfig,
  StyleInjector,
} from "./components/IconProvider";
export type { IconProviderProps } from "./components/IconProvider";

// The inline field — click to open the picker. Variants: box | button.
export {
  IconPickerField,
  default as IconPicker,
} from "./components/IconPickerField";
export type {
  IconPickerFieldProps,
  IconFieldVariant,
  IconFieldBorderVariant,
} from "./components/IconPickerField";

// Standalone dialog — control `open` yourself if you don't want the field.
export { IconPickerDialog } from "./components/IconPickerDialog";
export type { IconPickerDialogProps } from "./components/IconPickerDialog";

// Renderer for a stored value.
export { Icon } from "./components/Icon";
export type { IconProps } from "./components/Icon";

// Custom-SVG tab body (exported for advanced/custom layouts).
export { CustomSvgInput } from "./components/CustomSvgInput";
export type { CustomSvgInputProps } from "./components/CustomSvgInput";

// Icon-set metadata + lazy loaders (for building your own UIs).
export {
  ICON_SETS,
  getIconSet,
  loadIconSet,
  iconNames,
} from "./icon-sets";
export type { IconSetMeta, IconModule } from "./icon-sets";

// Types.
export type {
  IconValue,
  ReactIconValue,
  SvgIconValue,
  IconStoreConfig,
  IconPickerTheme,
} from "./types";
export { isReactIconValue, isSvgIconValue } from "./types";
