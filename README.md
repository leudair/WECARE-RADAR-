# WeCare Radar

Ferramenta interna para identificar, a partir do export oficial do Instagram, quais contas o
cliente segue e não são seguidas de volta ("não-recíprocos"). Uso da equipe (atendimento via
WhatsApp + Pix), não é um produto para o cliente final acessar diretamente.

Implementa a **Fase 1** do PRD: 100% client-side, sem backend e sem persistência — o .zip do
cliente nunca sai do navegador de quem está operando a ferramenta.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4, rodando inteiramente no navegador.
`JSZip` lê o .zip do export; `jsPDF` gera os PDFs de entrega.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Como usar

1. Peça ao cliente o export oficial do Instagram: **Perfil → Menu → Central de Contas → Suas
   informações e permissões → Baixar suas informações** → escolher **"Algumas das suas
   informações"** → marcar apenas **"Seguidores e seguindo"** → formato **JSON** → baixar no
   dispositivo.
2. O cliente envia o `.zip` pelo WhatsApp (sem descompactar).
3. Suba o `.zip` na ferramenta (arraste ou clique na área de upload).
4. A ferramenta calcula automaticamente seguindo, seguidores, recíprocos e não-recíprocos.
5. Gere a **amostra grátis** (10 contas) e envie usando a mensagem pronta.
6. Depois de o cliente confirmar e pagar, gere os **PDFs completos em blocos** (padrão: 100 por
   bloco) e envie junto com as instruções de ritmo seguro.
7. Clique em **Limpar sessão** ao terminar o atendimento.

### Se o cliente escolher o export errado

- **Export completo** ("Todas as suas informações"): a ferramenta detecta e bloqueia
  automaticamente o processamento — peça um novo export só com "Seguidores e seguindo".
- **Formato HTML**: a ferramenta avisa e pede para gerar de novo em JSON.

## Restrições do produto (não mudar sem revisar o PRD)

- Sem login do cliente, sem senha, sem token.
- Sem scraping e sem API de terceiros para listas de seguidores.
- Sem unfollow automatizado — a ferramenta só entrega os links, a ação é manual do cliente.
- Nunca prometer aumento de alcance/engajamento/visualizações (ver seção 11 do PRD).

## Página de privacidade

`/privacidade` — política de uma página para enviar junto com a proposta comercial.
