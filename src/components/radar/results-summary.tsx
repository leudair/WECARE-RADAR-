import type { AnalysisTotals } from "@/lib/instagram/types";

function StatCard({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-xl border p-4 ${
        emphasis ? "border-brand-red bg-brand-red-soft" : "border-brand-border bg-black/30"
      }`}
    >
      <span className="text-xs font-medium text-zinc-500">{label}</span>
      <span
        className={`text-2xl font-semibold tabular-nums ${emphasis ? "text-red-300" : "text-white"}`}
      >
        {value}
      </span>
    </div>
  );
}

export function ResultsSummary({ totals }: { totals: AnalysisTotals }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <StatCard label="Seguindo" value={totals.totalSeguindo.toLocaleString("pt-BR")} />
      <StatCard label="Seguidores" value={totals.totalSeguidores.toLocaleString("pt-BR")} />
      <StatCard label="Recíprocos" value={totals.totalReciprocos.toLocaleString("pt-BR")} />
      <StatCard
        label="Não-recíprocos"
        value={totals.totalNaoReciprocos.toLocaleString("pt-BR")}
        emphasis
      />
      <StatCard label="% Reciprocidade" value={`${totals.percentualReciprocidade.toFixed(1)}%`} />
    </div>
  );
}
