// Compartilha o cookie de sessão com o Portal (mesmo domínio-pai), pra quem
// já está logado no Portal não precisar logar de novo ao abrir o Radar.
// Em desenvolvimento local (localhost) o navegador rejeita cookie com esse
// domínio, então só aplicamos em produção.
export const SUPABASE_COOKIE_OPTIONS =
  process.env.NODE_ENV === "production" ? { domain: ".portalwecare.com.br" } : undefined;
