"use client";

import { IconPickerField, IconProvider, type IconValue } from "@hellomoksedul/icon-store";
import { useState } from "react";
// We can just render the icon component from react-icons if we need to display it.
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

function RenderIcon({ value, size = 64 }: { value: IconValue; size?: number }) {
  if (value.type === "react-icon") {
    const iconSet = ALL_ICONS[value.set];
    const Comp = iconSet ? iconSet[value.name] : null;
    return Comp ? <Comp size={size} color={value.color || "currentColor"} /> : null;
  }
  if (value.type === "svg") {
    return <div dangerouslySetInnerHTML={{ __html: value.svg }} style={{ width: size, height: size, color: value.color || "currentColor" }} />;
  }
  return null;
}

export default function Home() {
  const [icon, setIcon] = useState<IconValue | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode on document body
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-[#0a0a0b] text-white' : 'bg-[#fafafa] text-zinc-900'}`}>
      <button 
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-3 rounded-full bg-white dark:bg-zinc-800 shadow-md hover:scale-105 transition-transform"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
      
      <IconProvider config={{}}>
        <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="max-w-2xl w-full text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Tapsleek Icon Picker
          </h1>
          <p className="text-lg text-gray-600">
            A beautiful, clean, and fast icon picker component.
          </p>
          
          <div className="flex flex-col items-center gap-8 pt-8 w-full">
            <div className="flex items-center justify-center w-40 h-40 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 transition-all duration-300 hover:shadow-2xl">
              {icon ? (
                <RenderIcon value={icon} size={72} />
              ) : (
                <div className="text-zinc-300 dark:text-zinc-700">
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="4" ry="4"/>
                    <circle cx="9" cy="9" r="2.5"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
              )}
            </div>

            <IconPickerField
              value={icon}
              onChange={setIcon}
              className="w-full max-w-sm h-14 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 rounded-xl transition-all"
            />
          </div>
        </div>
      </main>
    </IconProvider>
    </div>
  );
}
