"use client";

import { IconPickerField, IconProvider, type IconValue } from "@hellomoksedul/icon-store";
import { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as FiIcons from "react-icons/fi";
import * as LuIcons from "react-icons/lu";
import * as MdIcons from "react-icons/md";

const ALL_ICONS: Record<string, Record<string, any>> = {
  fa: FaIcons, fi: FiIcons, md: MdIcons, lu: LuIcons,
};

function resolveIcon(value: IconValue | null | undefined) {
  if (!value || value.type !== "react-icon") return null;
  const set = ALL_ICONS[value.set];
  return set ? set[value.name] ?? null : null;
}

export default function Home() {
  const [icon, setIcon] = useState<IconValue | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const IC = resolveIcon(icon);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-[#0a0a0b] text-white" : "bg-[#fafafa] text-zinc-900"}`}>
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-3 rounded-full bg-white dark:bg-zinc-800 shadow-md hover:scale-105 transition-transform text-sm font-medium"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <IconProvider config={{}}>
        <main className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="max-w-3xl w-full text-center space-y-4 mb-16">
            <h1 className="text-4xl font-bold tracking-tight">Tapsleek Icon Picker</h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">
              A beautiful, clean, and fast icon picker component.
            </p>
          </div>

          {/* ── Variants showcase ─────────────────────── */}
          <div className="max-w-3xl w-full space-y-12">

            {/* Card variants */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Card Variant</h2>
              <div className="flex flex-wrap items-end gap-6">
                {(["sm", "md", "lg", "xl"] as const).map((s) => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <IconPickerField
                      value={icon}
                      onChange={setIcon}
                      variant="card"
                      size={s}
                      IconComponent={IC}
                    />
                    <span className="text-xs text-zinc-400 font-mono">{s}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Button variants */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Button Variant</h2>
              <div className="flex flex-col gap-3 max-w-xs">
                {(["sm", "md", "lg", "xl"] as const).map((s) => (
                  <div key={s} className="flex items-center gap-4">
                    <IconPickerField
                      value={icon}
                      onChange={setIcon}
                      variant="button"
                      size={s}
                      className="w-full"
                      IconComponent={IC}
                    />
                    <span className="text-xs text-zinc-400 font-mono w-6 shrink-0">{s}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Ghost variant */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Ghost Variant</h2>
              <div className="flex flex-wrap items-center gap-4">
                {(["sm", "md", "lg"] as const).map((s) => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <IconPickerField
                      value={icon}
                      onChange={setIcon}
                      variant="ghost"
                      size={s}
                      IconComponent={IC}
                    />
                    <span className="text-xs text-zinc-400 font-mono">{s}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Theme customization */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Custom Theme via Props</h2>
              <div className="flex flex-wrap items-end gap-6">
                <IconPickerField
                  value={icon}
                  onChange={setIcon}
                  variant="card"
                  size="md"
                  IconComponent={IC}
                  theme={{ primary: "#10b981", border: "#d1fae5", surface: "#f0fdf4" }}
                />
                <IconPickerField
                  value={icon}
                  onChange={setIcon}
                  variant="card"
                  size="md"
                  IconComponent={IC}
                  theme={{ primary: "#f59e0b", border: "#fde68a", surface: "#fffbeb" }}
                />
                <IconPickerField
                  value={icon}
                  onChange={setIcon}
                  variant="card"
                  size="md"
                  IconComponent={IC}
                  theme={{ primary: "#ec4899", border: "#fbcfe8", surface: "#fdf2f8" }}
                />
                <IconPickerField
                  value={icon}
                  onChange={setIcon}
                  variant="button"
                  size="lg"
                  className="w-64"
                  IconComponent={IC}
                  theme={{ primary: "#6366f1", border: "#c7d2fe" }}
                />
              </div>
            </section>

          </div>
        </main>
      </IconProvider>
    </div>
  );
}
