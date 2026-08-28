"use client";

import { useState } from "react";
import { analyzeExportZip } from "@/lib/instagram/zip";
import type { AnalysisError, AnalysisResult } from "@/lib/instagram/types";
import { UploadPanel } from "./upload-panel";
import { ErrorPanel } from "./error-panel";
import { ResultsSummary } from "./results-summary";
import { NonReciprocalList } from "./non-reciprocal-list";
import { SampleSection } from "./sample-section";
import { DeliverySection } from "./delivery-section";
import { MessageTemplatesSection } from "./message-templates-section";

type Stage =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "error"; error: AnalysisError }
  | { kind: "result"; result: AnalysisResult };

export function RadarTool() {
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [clientName, setClientName] = useState("");

  async function handleFile(file: File) {
    setStage({ kind: "busy" });
    const outcome = await analyzeExportZip(file);
    setStage(outcome.ok ? { kind: "result", result: outcome } : { kind: "error", error: outcome });
  }

  function reset() {
    setStage({ kind: "idle" });
    setClientName("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Nome do cliente (aparece nos PDFs e mensagens)
        </label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Ex.: Ana Souza"
          className="w-full max-w-sm rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {stage.kind !== "result" && (
        <UploadPanel onFile={handleFile} busy={stage.kind === "busy"} />
      )}

      {stage.kind === "error" && <ErrorPanel error={stage.error} onReset={reset} />}

      {stage.kind === "result" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {stage.result.followersFilesFound} arquivo(s) de seguidores processados.
            </p>
            <button
              type="button"
              onClick={reset}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              🗑 Limpar sessão
            </button>
          </div>

          <ResultsSummary totals={stage.result.totals} />

          <div>
            <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Todas as contas sem reciprocidade
            </h3>
            <NonReciprocalList entries={stage.result.naoReciprocos} />
          </div>

          <SampleSection entries={stage.result.naoReciprocos} clientName={clientName} />

          <DeliverySection entries={stage.result.naoReciprocos} clientName={clientName} />

          <MessageTemplatesSection
            clientName={clientName}
            totalNaoReciprocos={stage.result.totals.totalNaoReciprocos}
          />
        </div>
      )}
    </div>
  );
}
