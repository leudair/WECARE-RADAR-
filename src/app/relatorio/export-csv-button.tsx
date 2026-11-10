"use client";

import { downloadBlob } from "@/lib/download";

interface AtendimentoRow {
  criado_em: string;
  funcionaria_email: string;
  cliente_nome: string;
  cliente_instagram: string;
  acao: string;
  total_nao_reciprocos: number;
}

const ACAO_LABEL: Record<string, string> = {
  amostra_gratis: "Teste grátis",
  lista_completa: "Lista completa",
};

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function ExportCsvButton({ rows }: { rows: AtendimentoRow[] }) {
  function handleExport() {
    const header = ["Data", "Funcionária", "Cliente", "Instagram", "Ação", "Não-recíprocos"];
    const lines = rows.map((a) =>
      [
        new Date(a.criado_em).toLocaleString("pt-BR"),
        a.funcionaria_email,
        a.cliente_nome || "",
        a.cliente_instagram ? `@${a.cliente_instagram}` : "",
        ACAO_LABEL[a.acao] ?? a.acao,
        String(a.total_nao_reciprocos),
      ]
        .map(csvEscape)
        .join(",")
    );
    const csv = [header.join(","), ...lines].join("\n");
    // BOM no inicio pra o Excel abrir acentos corretamente.
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    downloadBlob(blob, `atendimentos-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={rows.length === 0}
      className="rounded-md border border-brand-border px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-brand-red hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      Exportar CSV
    </button>
  );
}
