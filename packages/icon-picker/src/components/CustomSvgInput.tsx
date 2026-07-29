"use client";

import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

function looksLikeSvg(s: string): boolean {
  return /<svg[\s\S]*<\/svg>/i.test(s.trim());
}

export interface CustomSvgInputProps {
  /** Called with valid SVG markup when the user confirms. */
  onInsert: (svg: string) => void;
}

/**
 * "Custom SVG" tab body: paste raw SVG code or upload a .svg file, preview it,
 * then insert. Purely presentational — the parent decides what to do with the
 * markup (keep inline or upload to a backend).
 */
export function CustomSvgInput({ onInsert }: CustomSvgInputProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const valid = looksLikeSvg(code);

  const readFile = (file: File) => {
    if (!/svg/i.test(file.type) && !/\.svg$/i.test(file.name)) {
      setError("Please choose an .svg file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      if (looksLikeSvg(text)) {
        setCode(text);
        setError(null);
      } else {
        setError("That file doesn't contain valid SVG markup.");
      }
    };
    reader.readAsText(file);
  };

  const insert = () => {
    if (!valid) {
      setError("Paste valid <svg>…</svg> markup first.");
      return;
    }
    onInsert(code.trim());
  };

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
        }
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) readFile(f);
        }}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center transition-colors hover:bg-muted/50"
      >
        <UploadCloud className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium">Upload an .svg file</p>
        <p className="text-xs text-muted-foreground">or drag &amp; drop it here</p>
        <input
          ref={inputRef}
          type="file"
          accept=".svg,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) readFile(f);
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          …or paste SVG code
        </label>
        <textarea
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          placeholder='<svg viewBox="0 0 24 24">…</svg>'
          spellCheck={false}
          className="custom-scrollbar h-32 w-full resize-none rounded-md border border-input bg-background p-3 font-mono text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Preview:</span>
          <span
            className={cn(
              "flex size-12 items-center justify-center rounded-md border border-border bg-muted/40 text-foreground [&>svg]:size-8",
              !valid && "text-muted-foreground/40",
            )}
            dangerouslySetInnerHTML={
              valid ? { __html: code } : { __html: "" }
            }
          />
        </div>
        <Button onClick={insert} disabled={!valid} size="sm">
          Insert icon
        </Button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default CustomSvgInput;
