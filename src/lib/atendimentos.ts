import { createSupabaseBrowserClient } from "./supabase/client";

export type AtendimentoAcao = "amostra_gratis" | "lista_completa";

export async function logAtendimento(params: {
  clienteNome: string;
  clienteInstagram: string;
  acao: AtendimentoAcao;
  totalNaoReciprocos: number;
}) {
  try {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("atendimentos").insert({
      funcionaria_id: user.id,
      funcionaria_email: user.email ?? "",
      cliente_nome: params.clienteNome,
      cliente_instagram: params.clienteInstagram,
      acao: params.acao,
      total_nao_reciprocos: params.totalNaoReciprocos,
    });
  } catch (err) {
    console.error("Falha ao registrar atendimento:", err);
  }
}
