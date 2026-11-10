import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ExportCsvButton } from "./export-csv-button";

const ACAO_LABEL: Record<string, string> = {
  amostra_gratis: "Teste grátis",
  lista_completa: "Lista completa",
};

export default async function RelatorioPage({
  searchParams,
}: {
  searchParams: Promise<{ funcionaria?: string; cliente?: string; de?: string; ate?: string }>;
}) {
  const { funcionaria, cliente, de, ate } = await searchParams;

  const supabase = await createSupabaseServerClient();

  // lista de funcionarias pro filtro — tirada dos proprios atendimentos ja
  // registrados (o Radar nao tem tabela de perfis como o Portal).
  const { data: funcionariasRows } = await supabase
    .from("atendimentos")
    .select("funcionaria_email")
    .order("funcionaria_email", { ascending: true });
  const funcionarias = [...new Set((funcionariasRows ?? []).map((r) => r.funcionaria_email))];

  let query = supabase.from("atendimentos").select("*").order("criado_em", { ascending: false }).limit(500);

  if (funcionaria) query = query.eq("funcionaria_email", funcionaria);
  if (cliente) query = query.or(`cliente_nome.ilike.%${cliente}%,cliente_instagram.ilike.%${cliente}%`);
  if (de) query = query.gte("criado_em", `${de}T00:00:00`);
  if (ate) query = query.lte("criado_em", `${ate}T23:59:59`);

  const { data: atendimentos, error } = await query;

  const hasFilters = Boolean(funcionaria || cliente || de || ate);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">WeCare Radar</p>
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">Relatório de atendimentos</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
          Quem atendeu qual cliente e quando — registrado automaticamente sempre que uma amostra
          grátis ou uma lista completa é gerada.
        </p>
      </header>

      <form className="flex flex-wrap items-end gap-3 rounded-lg border border-brand-border bg-black/30 p-4" method="GET">
        <div className="flex flex-col gap-1">
          <label htmlFor="funcionaria" className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            Funcionária
          </label>
          <select
            id="funcionaria"
            name="funcionaria"
            defaultValue={funcionaria ?? ""}
            className="rounded-md border border-brand-border bg-black/40 px-3 py-2 text-sm text-white focus:border-brand-red focus:outline-none"
          >
            <option value="">Todas</option>
            {funcionarias.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="cliente" className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            Cliente ou @
          </label>
          <input
            id="cliente"
            name="cliente"
            type="text"
            defaultValue={cliente ?? ""}
            placeholder="Buscar nome ou @"
            className="rounded-md border border-brand-border bg-black/40 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-brand-red focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="de" className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            De
          </label>
          <input
            id="de"
            name="de"
            type="date"
            defaultValue={de ?? ""}
            className="rounded-md border border-brand-border bg-black/40 px-3 py-2 text-sm text-white focus:border-brand-red focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="ate" className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            Até
          </label>
          <input
            id="ate"
            name="ate"
            type="date"
            defaultValue={ate ?? ""}
            className="rounded-md border border-brand-border bg-black/40 px-3 py-2 text-sm text-white focus:border-brand-red focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-brand-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-red-dark"
        >
          Filtrar
        </button>
        {hasFilters && (
          <a href="/relatorio" className="text-sm text-zinc-500 hover:text-white">
            Limpar filtros
          </a>
        )}
        <div className="ml-auto">
          <ExportCsvButton rows={atendimentos ?? []} />
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-brand-red/40 bg-brand-red-soft p-4 text-sm text-red-300">
          Não foi possível carregar o relatório. Confirme se a tabela <code>atendimentos</code> foi
          criada no Supabase (arquivo <code>supabase/schema.sql</code>).
        </div>
      )}

      {!error && atendimentos && atendimentos.length === 0 && (
        <p className="text-sm text-zinc-500">
          {hasFilters ? "Nenhum atendimento encontrado com esses filtros." : "Nenhum atendimento registrado ainda."}
        </p>
      )}

      {!error && atendimentos && atendimentos.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-brand-border bg-black/30">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-brand-border text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Funcionária</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Instagram</th>
                <th className="px-4 py-3 font-medium">Ação</th>
                <th className="px-4 py-3 font-medium">Não-recíprocos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {atendimentos.map((a) => (
                <tr key={a.id}>
                  <td className="whitespace-nowrap px-4 py-2.5 text-zinc-400">
                    {new Date(a.criado_em).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-300">{a.funcionaria_email}</td>
                  <td className="px-4 py-2.5 text-zinc-300">{a.cliente_nome || "—"}</td>
                  <td className="px-4 py-2.5 text-zinc-300">
                    {a.cliente_instagram ? `@${a.cliente_instagram}` : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-300">{ACAO_LABEL[a.acao] ?? a.acao}</td>
                  <td className="px-4 py-2.5 text-zinc-300">{a.total_nao_reciprocos}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {atendimentos.length === 500 && (
            <p className="border-t border-brand-border px-4 py-2 text-xs text-zinc-500">
              Mostrando as 500 mais recentes — use os filtros pra ver um período mais específico.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
