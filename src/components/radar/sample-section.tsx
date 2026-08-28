"use client";

import type { ExportEntry } from "@/lib/instagram/types";
import { buildSamplePdf } from "@/lib/instagram/pdf";
import { downloadBlob } from "@/lib/download";
import { CopyButton } from "./copy-button";

const SAMPLE_SIZE = 10;

export function SampleSection({
  entries,
  clientName,
  instagramHandle,
}: {
  entries: ExportEntry[];
  clientName: string;
  instagramHandle: string;
}) {
  const sample = entries.slice(0, SAMPLE_SIZE);
  const sampleText = sample.map((e, i) => `${i + 1}. @${e.username} — ${e.href}`).join("\n");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">
          Amostra grátis ({sample.length} de {entries.length})
        </h3>
        <div className="flex gap-2">
          <CopyButton text={sampleText} label="Copiar lista" />
          <button
            type="button"
            onClick={() =>
              downloadBlob(buildSamplePdf({ clientName, instagramHandle, entries: sample }), "amostra-wecare-radar.pdf")
            }
            className="inline-flex items-center gap-1.5 rounded-md border border-brand-border px-3 py-1.5 text-sm font-medium text-zinc-200 hover:border-brand-red/50 hover:bg-white/5"
          >
            Baixar PDF
          </button>
        </div>
      </div>
      <ol className="grid grid-cols-1 gap-1 rounded-lg border border-brand-border bg-black/30 p-3 text-sm sm:grid-cols-2">
        {sample.map((entry, i) => (
          <li key={entry.username} className="truncate text-zinc-300">
            {i + 1}.{" "}
            <a
              href={entry.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-red hover:underline"
            >
              @{entry.username}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
