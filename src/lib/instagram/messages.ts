export function sampleDeliveryMessage(params: { clientName: string; totalNaoReciprocos: number }): string {
  const { clientName, totalNaoReciprocos } = params;
  const saudacao = clientName ? `Oi, ${clientName}!` : "Oi, tudo bem?";
  return `${saudacao} 👋

Aqui está a amostra grátis com 10 contas que você segue e que não te seguem de volta.

Confira os links e veja se bate com o que você esperava. No total, você tem *${totalNaoReciprocos} contas* sem reciprocidade.

Qualquer dúvida, me chama por aqui!`;
}

export function proposalMessage(params: {
  clientName: string;
  totalNaoReciprocos: number;
  price: string;
}): string {
  const { clientName, totalNaoReciprocos, price } = params;
  const abertura = clientName ? `${clientName}, fechando` : "Fechando";
  return `${abertura} o que conversamos:

Você tem *${totalNaoReciprocos} contas* sem reciprocidade no seu Instagram.

O valor para a lista completa (todas as ${totalNaoReciprocos}, organizadas em blocos com links prontos) é de *${price || "R$ —"}*, pagamento único via Pix.

Assim que o pagamento cair eu já te mando tudo. Pode ser?`;
}

export function usageInstructionsMessage(params: { blockSize: number; blockCount: number }): string {
  const { blockSize, blockCount } = params;
  return `Pronto! Segue sua lista completa em ${blockCount} bloco${blockCount === 1 ? "" : "s"} de até ${blockSize} contas cada.

*Como usar sem bloquear sua conta:*
• Deixe de seguir no máximo 20 contas por hora e 100 por dia.
• Faça pausas entre os blocos.
• Confira antes de remover — algumas contas você pode querer continuar seguindo mesmo sem reciprocidade.

Qualquer dúvida durante o processo, me chama!`;
}
