import { AlertCircle, Code, PaintBucket, UploadCloud } from "lucide-react";
import { DragEvent, useEffect, useRef, useState } from "react";

export default function CustomSvgInput({ onInsert }: { onInsert: (svg: string | null) => void }) {
  const [svgStr, setSvgStr] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [stripColors, setStripColors] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processSvg = (rawSvg: string, strip: boolean) => {
    if (!strip) return rawSvg;
    let processed = rawSvg.replace(/fill="(?!(none|transparent))[^"]+"/gi, 'fill="currentColor"');
    processed = processed.replace(/stroke="(?!(none|transparent))[^"]+"/gi, 'stroke="currentColor"');
    return processed;
  };

  useEffect(() => {
    if (svgStr.trim()) {
      onInsert(processSvg(svgStr, stripColors));
    } else {
      onInsert(null);
    }
  }, [svgStr, stripColors, onInsert]);

  const handleFile = (file: File) => {
    setError(null);
    if (file.type !== "image/svg+xml" && !file.name.endsWith(".svg")) {
      setError("Please upload a valid SVG file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) setSvgStr(text);
    };
    reader.readAsText(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <div>
        <h3 className="text-xl font-bold mb-1" style={{ color: "var(--ip-fg)" }}>Custom SVG</h3>
        <p className="text-sm" style={{ color: "var(--ip-fg-muted)" }}>
          Upload an SVG file or paste raw code to use your own icon.
        </p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200"
        style={{
          borderColor: isDragging ? "var(--ip-primary)" : svgStr ? "color-mix(in srgb, var(--ip-primary) 50%, transparent)" : "var(--ip-border)",
          backgroundColor: isDragging ? "var(--ip-primary-muted)" : svgStr ? "var(--ip-primary-muted)" : "var(--ip-surface)",
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          accept=".svg,image/svg+xml"
          className="hidden"
        />
        {svgStr ? (
          <>
            <div
              className="mb-4 w-20 h-20 [&>svg]:w-full [&>svg]:h-full flex items-center justify-center drop-shadow-sm"
              style={{ color: "var(--ip-primary)" }}
              dangerouslySetInnerHTML={{ __html: processSvg(svgStr, stripColors) }}
            />
            <p className="text-sm font-medium mb-1" style={{ color: "var(--ip-primary)" }}>
              Click or drag to change SVG
            </p>
          </>
        ) : (
          <>
            <div className="p-4 rounded-full mb-4" style={{ backgroundColor: "var(--ip-bg)" }}>
              <UploadCloud className="w-8 h-8" style={{ color: "var(--ip-primary)" }} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--ip-fg)" }}>
              Click to upload or drag and drop
            </p>
            <p className="text-xs" style={{ color: "var(--ip-fg-muted)" }}>
              SVG files only (max. 2MB)
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm p-3 rounded-lg border" style={{ color: "#dc2626", backgroundColor: "rgba(220,38,38,0.05)", borderColor: "rgba(220,38,38,0.2)" }}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Raw code textarea */}
      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2" style={{ color: "var(--ip-fg)" }}>
          <Code className="w-4 h-4" style={{ color: "var(--ip-fg-muted)" }} />
          Or paste raw SVG code
        </label>
        <textarea
          value={svgStr}
          onChange={(e) => setSvgStr(e.target.value)}
          className="min-h-[35 w-full rounded-xl px-4 py-3 text-sm font-mono resize-y custom-scrollbar focus:outline-none"
          style={{
            border: "1px solid var(--ip-border)",
            backgroundColor: "var(--ip-bg)",
            color: "var(--ip-fg)",
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = "var(--ip-primary)"}
          onBlur={(e) => e.currentTarget.style.borderColor = "var(--ip-border)"}
          placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">...'
        />
      </div>

      {/* Smart color adaptation toggle */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl gap-4"
        style={{ border: "1px solid var(--ip-border)", backgroundColor: "var(--ip-bg)" }}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: stripColors ? "var(--ip-primary-muted)" : "var(--ip-surface)" }}>
            <PaintBucket className="w-4 h-4" style={{ color: stripColors ? "var(--ip-primary)" : "var(--ip-fg-muted)" }} />
          </div>
          <div>
            <h4 className="text-sm font-medium" style={{ color: "var(--ip-fg)" }}>Smart Color Adaptation</h4>
            <p className="text-xs mt-0.5" style={{ color: "var(--ip-fg-muted)" }}>
              Replaces hardcoded fills and strokes with currentColor so the icon adapts to your UI theme.
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer shrink-0 sm:self-center">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={stripColors}
            onChange={(e) => setStripColors(e.target.checked)}
          />
          <div
            className="w-11 h-6 rounded-full relative transition-colors"
            style={{ backgroundColor: stripColors ? "var(--ip-primary)" : "var(--ip-surface)" }}
          >
            <div
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
              style={{ transform: stripColors ? "translateX(20px)" : "translateX(0)" }}
            />
          </div>
        </label>
      </div>
    </div>
  );
}
