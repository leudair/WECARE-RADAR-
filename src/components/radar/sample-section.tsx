"use client";

import type { ExportEntry } from "@/lib/instagram/types";
import { buildSamplePdf } from "@/lib/instagram/pdf";
import { downloadBlob } from "@/lib/download";
import { CopyButton } from "./copy-button";

const SAMPLE_SIZE = 10;

export function SampleSection({ entries, clientName }: { entries: ExportEntry[]; clientName: string }) {
  const sample = entries.slice(0, SAMPLE_SIZE);
  const sampleText = sample.map((e, i) => `${i + 1}. @${e.username} — ${e.href}`).join("\n");

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Amostra grátis ({sample.length} de {entries.length})
        </h3>
        <div className="flex gap-2">
          <CopyButton text={sampleText} label="Copiar lista" />
          <button
            type="button"
            onClick={() => downloadBlob(buildSamplePdf({ clientName, entries: sample }), "amostra-wecare-radar.pdf")}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Baixar PDF
          </button>
        </div>
      </div>
      <ol className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
        {sample.map((entry, i) => (
          <li key={entry.username} className="truncate text-zinc-700 dark:text-zinc-300">
            {i + 1}.{" "}
            <a href={entry.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
              @{entry.username}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
