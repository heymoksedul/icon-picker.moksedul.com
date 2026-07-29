"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { IconValue } from "../types";
import { IconPickerDialog } from "./IconPickerDialog";

export function IconPickerField({
  value,
  onChange,
  className,
}: {
  value?: IconValue | null;
  onChange: (val: IconValue) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center justify-between px-4 py-3 border rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-200 ${className}`}
      >
        <div className="flex items-center gap-3">
          {value ? (
            <div className="text-zinc-700 dark:text-zinc-200 flex items-center justify-center">
              {value.type === "svg" ? (
                <div dangerouslySetInnerHTML={{ __html: value.svg }} className="w-5 h-5 flex items-center justify-center" />
              ) : (
                <div className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">
                  {value.type === "react-icon" ? value.name.substring(0, 2).toUpperCase() : "IC"}
                </div>
              )}
            </div>
          ) : (
            <div className="w-5 h-5 rounded border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/50" />
          )}
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {value ? (value.type === "react-icon" ? value.name : "Custom SVG") : "Select icon..."}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
      </button>
      <IconPickerDialog
        open={open}
        onClose={() => setOpen(false)}
        onSelect={onChange}
        value={value}
      />
    </>
  );
}
