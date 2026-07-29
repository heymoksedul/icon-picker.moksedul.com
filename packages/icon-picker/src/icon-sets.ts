import type { IconType } from "react-icons";

/**
 * A loaded icon set is a plain module object mapping component names
 * (e.g. "FaHome") to `IconType` components.
 */
export type IconModule = Record<string, IconType>;

export interface IconSetMeta {
  /** Stable id stored inside the value (e.g. "fa6"). */
  id: string;
  /** Human label shown in the set selector. */
  label: string;
  /** Short prefix every component in the set starts with (for display). */
  prefix: string;
  /** Lazily import the set. Static specifier → consumer can code-split it. */
  load: () => Promise<IconModule>;
}

/**
 * Curated list of react-icons sets. Each `load()` uses a *static* import
 * specifier so bundlers (webpack/vite/turbopack) emit one async chunk per set
 * instead of pulling the whole 40k-icon library into your bundle.
 *
 * Add or remove entries freely, or restrict what a picker shows via the
 * `enabledSets` prop on <IconProvider> / <IconPickerField>.
 */
export const ICON_SETS: IconSetMeta[] = [
  { id: "fa6", label: "Font Awesome 6", prefix: "Fa", load: () => import("react-icons/fa6") },
  { id: "fa", label: "Font Awesome 5", prefix: "Fa", load: () => import("react-icons/fa") },
  { id: "md", label: "Material Design", prefix: "Md", load: () => import("react-icons/md") },
  { id: "fi", label: "Feather", prefix: "Fi", load: () => import("react-icons/fi") },
  { id: "lu", label: "Lucide", prefix: "Lu", load: () => import("react-icons/lu") },
  { id: "hi2", label: "Heroicons 2", prefix: "Hi", load: () => import("react-icons/hi2") },
  { id: "hi", label: "Heroicons", prefix: "Hi", load: () => import("react-icons/hi") },
  { id: "io5", label: "Ionicons 5", prefix: "Io", load: () => import("react-icons/io5") },
  { id: "bs", label: "Bootstrap", prefix: "Bs", load: () => import("react-icons/bs") },
  { id: "bi", label: "BoxIcons", prefix: "Bi", load: () => import("react-icons/bi") },
  { id: "ri", label: "Remix Icon", prefix: "Ri", load: () => import("react-icons/ri") },
  { id: "tb", label: "Tabler", prefix: "Tb", load: () => import("react-icons/tb") },
  { id: "ai", label: "Ant Design", prefix: "Ai", load: () => import("react-icons/ai") },
  { id: "pi", label: "Phosphor", prefix: "Pi", load: () => import("react-icons/pi") },
  { id: "si", label: "Simple Icons (Brands)", prefix: "Si", load: () => import("react-icons/si") },
  { id: "gi", label: "Game Icons", prefix: "Gi", load: () => import("react-icons/gi") },
  { id: "go", label: "Github Octicons", prefix: "Go", load: () => import("react-icons/go") },
  { id: "vsc", label: "VS Code", prefix: "Vsc", load: () => import("react-icons/vsc") },
  { id: "cg", label: "css.gg", prefix: "Cg", load: () => import("react-icons/cg") },
  { id: "tfi", label: "Themify", prefix: "Tfi", load: () => import("react-icons/tfi") },
  { id: "wi", label: "Weather", prefix: "Wi", load: () => import("react-icons/wi") },
  { id: "im", label: "IcoMoon Free", prefix: "Im", load: () => import("react-icons/im") },
  { id: "ti", label: "Typicons", prefix: "Ti", load: () => import("react-icons/ti") },
  { id: "gr", label: "Grommet", prefix: "Gr", load: () => import("react-icons/gr") },
];

const SET_BY_ID: Record<string, IconSetMeta> = Object.fromEntries(
  ICON_SETS.map((s) => [s.id, s]),
);

export function getIconSet(id: string): IconSetMeta | undefined {
  return SET_BY_ID[id];
}

/** In-memory cache of already-imported set modules. */
const moduleCache = new Map<string, IconModule>();

/** Load a set's module (cached). Returns null for unknown ids. */
export async function loadIconSet(id: string): Promise<IconModule | null> {
  const cached = moduleCache.get(id);
  if (cached) return cached;
  const set = SET_BY_ID[id];
  if (!set) return null;
  const mod = (await set.load()) as IconModule;
  moduleCache.set(id, mod);
  return mod;
}

/** All exported icon component names in a set (uppercase-first only). */
export function iconNames(mod: IconModule): string[] {
  return Object.keys(mod).filter((k) => /^[A-Z]/.test(k));
}
