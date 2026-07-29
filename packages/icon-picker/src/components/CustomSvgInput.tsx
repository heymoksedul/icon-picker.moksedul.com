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

  // Auto-stage the SVG whenever it changes
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
      if (text) {
        setSvgStr(text);
      }
    };
    reader.readAsText(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Custom SVG</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Upload an SVG file or paste raw code to use your own icon.
        </p>
      </div>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
            : svgStr
              ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-900/10 hover:border-indigo-400 dark:hover:border-indigo-600"
              : "border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-zinc-50 dark:bg-zinc-900/50"
        }`}
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
              className="mb-4 w-20 h-20 text-indigo-600 dark:text-indigo-400 [&>svg]:w-full [&>svg]:h-full flex items-center justify-center drop-shadow-sm"
              dangerouslySetInnerHTML={{ __html: processSvg(svgStr, stripColors) }} 
            />
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">
              Click or drag to change SVG
            </p>
          </>
        ) : (
          <>
            <div className="p-4 bg-white dark:bg-zinc-800 rounded-full mb-4">
              <UploadCloud className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              SVG files only (max. 2MB)
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-100 dark:border-red-500/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <Code className="w-4 h-4 text-zinc-400" />
            Or paste raw SVG code
          </label>
        </div>
        <textarea
          value={svgStr}
          onChange={(e) => setSvgStr(e.target.value)}
          className="min-h-[140px] w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono resize-y custom-scrollbar"
          placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">...'
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${stripColors ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
            <PaintBucket className={`w-4 h-4 ${stripColors ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500'}`} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Smart Color Adaptation</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
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
          <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500"></div>
        </label>
      </div>

    </div>
  );
}
