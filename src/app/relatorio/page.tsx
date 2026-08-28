import { createSupabaseServerClient } from "@/lib/supabase/server";

const ACAO_LABEL: Record<string, string> = {
  amostra_gratis: "Teste grátis",
  lista_completa: "Lista completa",
};

export default async function RelatorioPage() {
  const supabase = await createSupabaseServerClient();
  const { data: atendimentos, error } = await supabase
    .from("atendimentos")
    .select("*")
    .order("criado_em", { ascending: false })
    .limit(200);

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

      {error && (
        <div className="rounded-lg border border-brand-red/40 bg-brand-red-soft p-4 text-sm text-red-300">
          Não foi possível carregar o relatório. Confirme se a tabela <code>atendimentos</code> foi
          criada no Supabase (arquivo <code>supabase/schema.sql</code>).
        </div>
      )}

      {!error && atendimentos && atendimentos.length === 0 && (
        <p className="text-sm text-zinc-500">Nenhum atendimento registrado ainda.</p>
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
        </div>
      )}
    </div>
  );
}
