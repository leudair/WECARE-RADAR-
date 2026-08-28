"use client";

import { useState } from "react";
import {
  proposalMessage,
  sampleDeliveryMessage,
  usageInstructionsMessage,
} from "@/lib/instagram/messages";
import { CopyButton } from "./copy-button";

function TemplateCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-brand-border bg-black/30 p-4">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{title}</h4>
        <CopyButton text={text} />
      </div>
      <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300">{text}</pre>
    </div>
  );
}

export function MessageTemplatesSection({
  clientName,
  totalNaoReciprocos,
  blockSizeDefault = 100,
}: {
  clientName: string;
  totalNaoReciprocos: number;
  blockSizeDefault?: number;
}) {
  const [price, setPrice] = useState("");
  const blockCount = Math.max(1, Math.ceil(totalNaoReciprocos / blockSizeDefault));

  return (
    <div className="flex flex-col gap-4">
      <TemplateCard title="Entrega da amostra" text={sampleDeliveryMessage({ clientName, totalNaoReciprocos })} />

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-xs text-zinc-400">
          Preço da lista completa
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="R$ 00,00"
            className="w-32 rounded-md border border-brand-border bg-black/40 px-2 py-1 text-sm text-white focus:border-brand-red focus:outline-none"
          />
        </label>
        <TemplateCard
          title="Proposta comercial"
          text={proposalMessage({ clientName, totalNaoReciprocos, price })}
        />
      </div>

      <TemplateCard
        title="Instruções de uso"
        text={usageInstructionsMessage({ blockSize: blockSizeDefault, blockCount })}
      />
    </div>
  );
}
