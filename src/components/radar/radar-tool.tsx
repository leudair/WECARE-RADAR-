"use client";

import { useState } from "react";
import { analyzeExportZip } from "@/lib/instagram/zip";
import type { AnalysisError, AnalysisResult } from "@/lib/instagram/types";
import { StepCard } from "./step-card";
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

type DeliveryMode = "teste" | "completo";

export function RadarTool() {
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [clientName, setClientName] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("teste");

  async function handleFile(file: File) {
    setStage({ kind: "busy" });
    const outcome = await analyzeExportZip(file);
    setStage(outcome.ok ? { kind: "result", result: outcome } : { kind: "error", error: outcome });
    setDeliveryMode("teste");
  }

  function reset() {
    setStage({ kind: "idle" });
    setClientName("");
    setInstagramHandle("");
    setDeliveryMode("teste");
  }

  return (
    <div className="flex flex-col gap-5">
      <StepCard step={1} title="Dados do atendimento" description="Aparece nos PDFs e nas mensagens prontas">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Nome do cliente — ex.: Ana Souza"
            className="w-full max-w-sm rounded-md border border-brand-border bg-black/40 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-brand-red focus:outline-none"
          />
          <input
            type="text"
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value.replace(/^@+/, ""))}
            placeholder="@ do Instagram — ex.: ana.souza"
            className="w-full max-w-xs rounded-md border border-brand-border bg-black/40 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-brand-red focus:outline-none"
          />
        </div>
      </StepCard>

      {stage.kind !== "result" && (
        <StepCard
          step={2}
          title="Enviar export do Instagram"
          description='Central de Contas → Baixar suas informações → apenas "Seguidores e seguindo" → formato JSON'
        >
          <UploadPanel onFile={handleFile} busy={stage.kind === "busy"} />
          {stage.kind === "error" && (
            <div className="mt-4">
              <ErrorPanel error={stage.error} onReset={reset} />
            </div>
          )}
        </StepCard>
      )}

      {stage.kind === "result" && (
        <>
          <StepCard step={2} title="Resultado" description={`${stage.result.followersFilesFound} arquivo(s) de seguidores processados`}>
            <div className="flex flex-col gap-4">
              <ResultsSummary totals={stage.result.totals} />
              <details className="group rounded-lg border border-brand-border bg-black/20 open:bg-black/30">
                <summary className="cursor-pointer list-none px-4 py-2.5 text-xs font-medium text-zinc-400 hover:text-white">
                  <span className="mr-1 inline-block transition-transform group-open:rotate-90">▸</span>
                  Ver todas as contas sem reciprocidade
                </summary>
                <div className="border-t border-brand-border p-4">
                  <NonReciprocalList entries={stage.result.naoReciprocos} />
                </div>
              </details>
              <button
                type="button"
                onClick={reset}
                className="self-start text-xs font-medium text-zinc-500 hover:text-brand-red"
              >
                🗑 Limpar sessão e começar de novo
              </button>
            </div>
          </StepCard>

          <StepCard step={3} title="O que você quer gerar?">
            <div className="flex flex-col gap-4">
              <div className="inline-flex w-fit rounded-lg border border-brand-border bg-black/30 p-1">
                <button
                  type="button"
                  onClick={() => setDeliveryMode("teste")}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    deliveryMode === "teste" ? "bg-brand-red text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  🧪 Teste grátis (10 contas)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMode("completo")}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    deliveryMode === "completo" ? "bg-brand-red text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  📦 Lista completa
                </button>
              </div>

              {deliveryMode === "teste" ? (
                <SampleSection
                  entries={stage.result.naoReciprocos}
                  clientName={clientName}
                  instagramHandle={instagramHandle}
                />
              ) : (
                <DeliverySection
                  entries={stage.result.naoReciprocos}
                  clientName={clientName}
                  instagramHandle={instagramHandle}
                />
              )}
            </div>
          </StepCard>

          <StepCard step={4} title="Mensagens prontas" description="Copie e cole direto no WhatsApp">
            <MessageTemplatesSection
              clientName={clientName}
              totalNaoReciprocos={stage.result.totals.totalNaoReciprocos}
            />
          </StepCard>
        </>
      )}
    </div>
  );
}
