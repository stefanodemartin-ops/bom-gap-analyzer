"use client";

import { useCallback, DragEvent, ChangeEvent, useState } from "react";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type Props = {
  label: string;
  description: string;
  accept: string;
  acceptLabel: string;
  files: File[];
  /** Called with the newly selected files (not the full accumulated list). */
  onFiles: (newFiles: File[]) => void;
  /** Multiple mode: called when the user removes a file by index. */
  onRemoveFile?: (index: number) => void;
  multiple?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export default function UploadZone({
  label,
  description,
  accept,
  acceptLabel,
  files,
  onFiles,
  onRemoveFile,
  multiple = false,
  disabled = false,
  icon,
}: Props) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const dropped = Array.from(e.dataTransfer.files);
      if (dropped.length) onFiles(multiple ? dropped : [dropped[0]]);
    },
    [onFiles, multiple, disabled]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files ?? []);
      if (selected.length) onFiles(multiple ? selected : [selected[0]]);
      e.target.value = "";
    },
    [onFiles, multiple]
  );

  const hasFiles = files.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-slate-400">{icon}</span>}
        <span className="font-semibold text-slate-700 text-sm">{label}</span>
        <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">
          {acceptLabel}
        </span>
      </div>

      {/* Multi-file list */}
      {multiple && hasFiles && (
        <ul className="flex flex-col gap-1 mb-1">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-sm"
            >
              <span className="text-slate-700 truncate mr-2">{f.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400">{formatBytes(f.size)}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => onRemoveFile?.(i)}
                    className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    aria-label="Remove file"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <label
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={[
          "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-8 py-8 transition-all duration-150 select-none",
          disabled
            ? "cursor-not-allowed opacity-50 border-slate-200 bg-slate-50"
            : dragging
            ? "cursor-pointer border-sky-400 bg-sky-50"
            : !multiple && hasFiles
            ? "cursor-pointer border-emerald-400 bg-emerald-50"
            : "cursor-pointer border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white",
        ].join(" ")}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer disabled:cursor-not-allowed"
          onChange={handleChange}
        />

        {!multiple && hasFiles ? (
          <>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-medium text-slate-700 text-sm truncate max-w-xs">{files[0].name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{formatBytes(files[0].size)}</p>
            </div>
            {!disabled && <p className="text-xs text-emerald-600 font-medium">Click or drop to replace</p>}
          </>
        ) : (
          <>
            <div className={["flex items-center justify-center w-10 h-10 rounded-full transition-colors", dragging ? "bg-sky-100" : "bg-slate-100"].join(" ")}>
              <svg className={["w-5 h-5 transition-colors", dragging ? "text-sky-500" : "text-slate-400"].join(" ")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">
                {multiple && hasFiles ? "Add more files" : "Drop your file here"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">or click to browse</p>
            </div>
            <p className="text-xs text-slate-400">{description}</p>
          </>
        )}
      </label>
    </div>
  );
}
