import type { IconType } from "react-icons";

export interface IconSetMeta {
  id: string;
  label: string;
  count: string;
  iconName: string;
  load: () => Promise<any>;
}

export const ICON_SETS: IconSetMeta[] = [
  { id: "lu", label: "Lucide", count: "1,215", iconName: "triangle", load: () => import("react-icons/lu") },
  { id: "fi", label: "Feather", count: "287", iconName: "feather", load: () => import("react-icons/fi") },
  { id: "hi2", label: "Heroicons", count: "423", iconName: "shield", load: () => import("react-icons/hi2") },
  { id: "tb", label: "Tabler", count: "5,487", iconName: "grid", load: () => import("react-icons/tb") },
  { id: "pi", label: "Phosphor", count: "1,028", iconName: "circle-dot", load: () => import("react-icons/pi") },
  { id: "io5", label: "Ionicons 5", count: "1,305", iconName: "aperture", load: () => import("react-icons/io5") },
  { id: "fa6", label: "Font Awesome 6", count: "1,739", iconName: "star", load: () => import("react-icons/fa6") },
  { id: "md", label: "Material Design", count: "3,927", iconName: "layers", load: () => import("react-icons/md") },
  { id: "bs", label: "Bootstrap", count: "1,088", iconName: "bold", load: () => import("react-icons/bs") },
  { id: "si", label: "Simple Icons", count: "3,154", iconName: "smile", load: () => import("react-icons/si") },
  { id: "ai", label: "Ant Design", count: "1,745", iconName: "hexagon", load: () => import("react-icons/ai") },
  { id: "bi", label: "Boxicons", count: "1,389", iconName: "box", load: () => import("react-icons/bi") },
  { id: "ri", label: "Remix Icon", count: "2,310", iconName: "zap", load: () => import("react-icons/ri") },
];

export async function loadIconSet(id: string): Promise<Record<string, IconType> | null> {
  const meta = ICON_SETS.find((s) => s.id === id);
  if (!meta) return null;
  return await meta.load();
}

export function iconNames(mod: Record<string, IconType>): string[] {
  return Object.keys(mod).filter((k) => k !== "default" && typeof mod[k] === "function");
}
