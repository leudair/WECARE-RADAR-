"use client";

import { useRef, useState } from "react";

export function UploadPanel({
  onFile,
  busy,
}: {
  onFile: (file: File) => void;
  busy: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onFile(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
        dragOver
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
          : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".zip"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={busy}
      />
      <span className="text-3xl">📦</span>
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {busy ? "Processando arquivo…" : "Arraste o .zip do export aqui, ou clique para escolher"}
      </p>
      <p className="max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
        O arquivo não sai do seu navegador — nada é enviado a nenhum servidor. Envie exatamente o
        .zip recebido por e-mail do Instagram, sem descompactar.
      </p>
    </div>
  );
}
