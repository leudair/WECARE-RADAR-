"use client";

import { useMemo, useState } from "react";
import type { ExportEntry } from "@/lib/instagram/types";
import { buildAllBlocksZip, buildBlockPdf, chunk } from "@/lib/instagram/pdf";
import { downloadBlob } from "@/lib/download";

export function DeliverySection({ entries, clientName }: { entries: ExportEntry[]; clientName: string }) {
  const [blockSize, setBlockSize] = useState(100);
  const [zipping, setZipping] = useState(false);

  const blocks = useMemo(() => chunk(entries, blockSize), [entries, blockSize]);

  function fileName(index: number) {
    const safeName = (clientName || "cliente").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return `wecare-radar-${safeName}-bloco-${index + 1}-de-${blocks.length}.pdf`;
  }

  function downloadOne(index: number) {
    const offset = index * blockSize;
    const blob = buildBlockPdf({
      clientName,
      blockIndex: index + 1,
      blockCount: blocks.length,
      offset,
      entries: blocks[index],
    });
    downloadBlob(blob, fileName(index));
  }

  async function downloadAll() {
    setZipping(true);
    try {
      const files = blocks.map((entriesInBlock, index) => {
        const offset = index * blockSize;
        const blob = buildBlockPdf({
          clientName,
          blockIndex: index + 1,
          blockCount: blocks.length,
          offset,
          entries: entriesInBlock,
        });
        return { name: fileName(index), blob };
      });
      const zipBlob = await buildAllBlocksZip(files);
      downloadBlob(zipBlob, `wecare-radar-${(clientName || "cliente").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}-completo.zip`);
    } finally {
      setZipping(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Entrega completa ({entries.length} contas em {blocks.length} bloco{blocks.length === 1 ? "" : "s"})
        </h3>
        <label className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          Contas por bloco
          <input
            type="number"
            min={1}
            value={blockSize}
            onChange={(e) => setBlockSize(Math.max(1, Number(e.target.value) || 1))}
            className="w-20 rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={downloadAll}
        disabled={zipping || entries.length === 0}
        className="self-start rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-60"
      >
        {zipping ? "Gerando .zip…" : "Baixar todos os PDFs (.zip)"}
      </button>

      <ul className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
        {blocks.map((blockEntries, index) => (
          <li key={index} className="flex items-center justify-between py-2 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">
              Bloco {index + 1} de {blocks.length} — {blockEntries.length} conta
              {blockEntries.length === 1 ? "" : "s"}
            </span>
            <button
              type="button"
              onClick={() => downloadOne(index)}
              className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Baixar PDF
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
