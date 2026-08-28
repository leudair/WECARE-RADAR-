import type { AnalysisError } from "@/lib/instagram/types";

const MESSAGES: Record<AnalysisError["code"], { title: string; body: string }> = {
  "html-export": {
    title: "Export no formato errado (HTML)",
    body: "Esse export foi gerado em HTML. Peça um novo export ao cliente escolhendo o formato JSON (Central de Contas → Baixar suas informações → Formato: JSON).",
  },
  "full-export": {
    title: "Isso parece um export completo",
    body: 'Encontramos arquivos fora de "Seguidores e seguindo" nesse .zip. Por segurança, recusamos e apagamos este arquivo automaticamente — não processamos exports completos. Peça ao cliente um novo export escolhendo apenas "Seguidores e seguindo".',
  },
  "missing-followers": {
    title: "Não encontramos os arquivos de seguidores",
    body: 'Não achamos nenhum followers_*.json dentro do .zip. Confirme que o export incluiu a categoria "Seguidores e seguindo".',
  },
  "missing-following": {
    title: "Não encontramos o arquivo de seguindo",
    body: 'Não achamos o following.json dentro do .zip. Confirme que o export incluiu a categoria "Seguidores e seguindo".',
  },
  "not-a-zip": {
    title: "Arquivo inválido",
    body: "Esse arquivo não é um .zip válido. Peça ao cliente para reenviar o arquivo original recebido do Instagram, sem abrir ou renomear.",
  },
  "empty-zip": {
    title: "O .zip está vazio",
    body: "O arquivo não contém nada. Peça ao cliente para reenviar o .zip original.",
  },
  "parse-error": {
    title: "Não conseguimos ler os dados",
    body: "O conteúdo dos arquivos JSON veio num formato inesperado. Confira se o export não foi editado e, se persistir, peça um novo export.",
  },
};

export function ErrorPanel({ error, onReset }: { error: AnalysisError; onReset: () => void }) {
  const info = MESSAGES[error.code];
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-brand-red/40 bg-brand-red-soft p-6">
      <p className="text-sm font-semibold text-red-300">⚠️ {info.title}</p>
      <p className="text-sm text-red-200/90">{info.body}</p>
      {error.detail && <p className="text-xs text-red-400/70">Detalhe técnico: {error.detail}</p>}
      <button
        type="button"
        onClick={onReset}
        className="self-start rounded-md border border-brand-red/50 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-brand-red/10"
      >
        Tentar outro arquivo
      </button>
    </div>
  );
}
