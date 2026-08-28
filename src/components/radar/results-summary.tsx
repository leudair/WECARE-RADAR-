import type { AnalysisTotals } from "@/lib/instagram/types";

function StatCard({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-xl border p-4 ${
        emphasis
          ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
          : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      }`}
    >
      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
      <span
        className={`text-2xl font-semibold tabular-nums ${
          emphasis ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-900 dark:text-zinc-50"
        }`}
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
