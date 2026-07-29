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
    <div className="icon-picker-scope">
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          backgroundColor: "var(--ip-bg)",
          borderColor: "var(--ip-border)",
          color: "var(--ip-fg)",
        }}
        className={`flex items-center justify-between px-4 py-3 border rounded-xl transition-all duration-200 ${className}`}
      >
        <div className="flex items-center gap-3">
          {value ? (
            <div className="flex items-center justify-center" style={{ color: "var(--ip-fg)" }}>
              {value.type === "svg" ? (
                <div dangerouslySetInnerHTML={{ __html: value.svg }} className="w-5 h-5 flex items-center justify-center" />
              ) : (
                <div
                  className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
                  style={{ backgroundColor: "var(--ip-primary-muted)", color: "var(--ip-primary)" }}
                >
                  {value.type === "react-icon" ? value.name.substring(0, 2).toUpperCase() : "IC"}
                </div>
              )}
            </div>
          ) : (
            <div
              className="w-5 h-5 rounded border border-dashed flex items-center justify-center"
              style={{ borderColor: "var(--ip-border)", backgroundColor: "var(--ip-surface)" }}
            />
          )}
          <span className="text-sm font-medium" style={{ color: "var(--ip-fg)" }}>
            {value ? (value.type === "react-icon" ? value.name : "Custom SVG") : "Select icon..."}
          </span>
        </div>
        <ChevronDown className="w-4 h-4" style={{ color: "var(--ip-fg-muted)" }} />
      </button>
      <IconPickerDialog
        open={open}
        onClose={() => setOpen(false)}
        onSelect={onChange}
        value={value}
      />
    </div>
  );
}
