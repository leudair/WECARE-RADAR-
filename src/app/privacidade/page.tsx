export default function PrivacidadePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-10 sm:px-6">
      <h1 className="text-xl font-semibold text-white">Política de privacidade — WeCare Radar</h1>

      <div className="flex flex-col gap-3 text-sm leading-relaxed text-zinc-300">
        <p>
          O WeCare Radar identifica, a partir do export oficial que você mesmo solicita ao
          Instagram, quais contas que você segue não retribuem o follow. Não pedimos sua senha,
          não acessamos sua conta e não usamos nenhuma API ou ferramenta de terceiros para obter
          listas de seguidores.
        </p>
        <p>
          <strong>O que pedimos:</strong> apenas o export parcial &quot;Seguidores e seguindo&quot;
          (Central de Contas → Baixar suas informações), em formato JSON. Se o arquivo enviado
          contiver outras categorias (mensagens, buscas, histórico de login, etc.), ele é recusado
          e apagado imediatamente, sem processamento.
        </p>
        <p>
          <strong>O que fazemos com o arquivo:</strong> o processamento roda inteiramente no
          navegador de quem está operando a ferramenta — o .zip nunca é enviado a nenhum servidor
          nosso. Depois da entrega ao cliente, o arquivo é apagado.
        </p>
        <p>
          <strong>O que guardamos:</strong> na fase atual, nada é armazenado automaticamente após
          o fechamento da sessão. Se no futuro passarmos a oferecer análise comparativa recorrente,
          guardaremos apenas nomes de usuário (nunca o arquivo original), com prazo de expiração
          definido e informado previamente.
        </p>
        <p>
          <strong>O que não fazemos:</strong> não desfazemos follows automaticamente, não
          garantimos aumento de alcance, visualizações ou engajamento, e não compartilhamos dados
          com terceiros.
        </p>
        <p>
          Esta política segue a Lei Geral de Proteção de Dados (LGPD) e, para clientes residentes
          nos EUA, a legislação estadual de privacidade aplicável.
        </p>
      </div>
    </div>
  );
}
