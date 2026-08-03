"use client";

import {
  IconPickerField,
  IconProvider,
  type IconValue,
} from "@hellokit/icon-picker";
import {
  ChevronRight,
  Github,
  Layers,
  Moon,
  Palette,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as FiIcons from "react-icons/fi";
import * as LuIcons from "react-icons/lu";
import * as MdIcons from "react-icons/md";

const ALL_ICONS: Record<string, Record<string, any>> = {
  fa: FaIcons,
  fi: FiIcons,
  md: MdIcons,
  lu: LuIcons,
};

function resolveIcon(value: IconValue | null | undefined) {
  if (!value || value.type !== "react-icon") return null;
  const set = ALL_ICONS[value.set];
  return set ? (set[value.name] ?? null) : null;
}

export default function Home() {
  const [icon, setIcon] = useState<IconValue | null>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const darkMode = mounted ? resolvedTheme === "dark" : false;

  const IC = resolveIcon(icon);

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen font-primary bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300"
    >
      {/* ── Navigation Bar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white dark:text-zinc-900" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-zinc-900 dark:text-white">
              Tapsleek
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/hellokit/tapsleek-icon-store"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800" />
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <IconProvider>
        <main className="relative z-10 flex flex-col items-center pt-32 pb-24 px-6">
          {/* ── Hero Section ── */}
          <div className="max-w-4xl w-full text-center space-y-8 mb-28">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium mb-4">
              <span className="flex h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
              v0.1.0 is now live
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
              The Ultimate React <br />
              <span className="text-zinc-500 dark:text-zinc-400">
                Icon Picker
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              A beautiful, highly customizable, and blazing fast icon picker
              component. Supports 100k+ icons, Custom SVG uploads, and infinite
              scrolling.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href="#demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium hover:-translate-y-0.5 transition-all duration-300 focus:outline-none"
              >
                Try the Demo
                <ChevronRight className="w-4 h-4" />
              </a>
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-sm">
                <span className="text-zinc-400 dark:text-zinc-500">$</span> pnpm
                add @hellokit/icon-picker
              </div>
            </div>
          </div>

          {/* ── Feature Highlights ── */}
          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 text-zinc-900 dark:text-white">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-white">
                Blazing Fast
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Icons are lazy-loaded in chunks via infinite scrolling, ensuring
                zero UI lag even with 100,000+ icons.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 text-zinc-900 dark:text-white">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-white">
                Multiple Variants
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Choose from highly polished Button, Card, Ghost, or Dashed
                Upload variants to perfectly fit your UI.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 text-zinc-900 dark:text-white">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-white">
                Fully Themed
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Adapts to your brand instantly. Powered by CSS variables with
                full automatic light and dark mode support.
              </p>
            </div>
          </div>

          <div
            id="demo"
            className="w-full max-w-5xl flex flex-col items-center"
          >
            <div className="text-center space-y-3 mb-16">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                Interactive Components
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                Play around with the picker variants below.
              </p>
            </div>

            {/* ── Interactive Demo Area ── */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 mb-28">
              {/* Card & Dashed Variants Container */}
              <div className="space-y-8 flex flex-col items-center justify-center p-12 rounded-[2.5rem] bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-300 relative overflow-hidden group">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 absolute top-8 left-8">
                  Primary Focus
                </h3>

                <IconPickerField
                  value={icon}
                  onChange={setIcon}
                  variant="dashed"
                  size={140}
                  placeholder="Upload Image"
                  IconComponent={IC}
                  className="z-10"
                />

                <div className="flex gap-4 z-10">
                  <IconPickerField
                    value={icon}
                    onChange={setIcon}
                    variant="card"
                    size="md"
                    IconComponent={IC}
                  />
                  <IconPickerField
                    value={icon}
                    onChange={setIcon}
                    variant="card"
                    size="md"
                    IconComponent={IC}
                  />
                </div>
              </div>

              {/* Button & Ghost Variants Container */}
              <div className="space-y-12 flex flex-col items-start justify-center p-12 rounded-[2.5rem] bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-300 relative overflow-hidden group">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 absolute top-8 left-8">
                  UI Elements
                </h3>

                <div className="w-full space-y-4 z-10 mt-8">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Standard Dropdown
                    </span>
                    <IconPickerField
                      value={icon}
                      onChange={setIcon}
                      variant="button"
                      size="md"
                      className="w-48"
                      IconComponent={IC}
                    />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Large Action
                    </span>
                    <IconPickerField
                      value={icon}
                      onChange={setIcon}
                      variant="button"
                      size="lg"
                      className="w-48"
                      IconComponent={IC}
                    />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Minimalist
                    </span>
                    <IconPickerField
                      value={icon}
                      onChange={setIcon}
                      variant="ghost"
                      size="md"
                      IconComponent={IC}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Theming Section ── */}
            <div className="w-full flex flex-col items-center">
              <div className="text-center space-y-3 mb-10">
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                  Infinite Theming
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Match your brand with absolute ease via simple CSS variables.
                </p>
              </div>

              <div className="w-full flex flex-wrap justify-center gap-6 p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                <IconPickerField
                  value={icon}
                  onChange={setIcon}
                  variant="card"
                  size="lg"
                  IconComponent={IC}
                  theme={{
                    primary: "#18181b",
                    border: "#a1a1aa",
                    surface: "#f4f4f5",
                    primaryFg: "#ffffff",
                  }}
                />
                <IconPickerField
                  value={icon}
                  onChange={setIcon}
                  variant="card"
                  size="lg"
                  IconComponent={IC}
                  theme={{
                    primary: "#059669",
                    border: "#6ee7b7",
                    surface: "#ecfdf5",
                    primaryFg: "#ffffff",
                  }}
                />
                <IconPickerField
                  value={icon}
                  onChange={setIcon}
                  variant="card"
                  size="lg"
                  IconComponent={IC}
                  theme={{
                    primary: "#ea580c",
                    border: "#fdba74",
                    surface: "#fff7ed",
                    primaryFg: "#ffffff",
                  }}
                />
                <IconPickerField
                  value={icon}
                  onChange={setIcon}
                  variant="card"
                  size="lg"
                  IconComponent={IC}
                  theme={{
                    primary: "#2563eb",
                    border: "#93c5fd",
                    surface: "#eff6ff",
                    primaryFg: "#ffffff",
                  }}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-10 text-center text-zinc-500 dark:text-zinc-400 text-sm border-t border-zinc-200 dark:border-zinc-800 mt-16 relative z-10">
          <p>Built with ❤️ for modern React applications.</p>
        </footer>
      </IconProvider>
    </div>
  );
}
