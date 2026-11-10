"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// O Radar e o Portal usam o mesmo projeto Supabase, e o template de e-mail
// de redefinicao de senha e compartilhado e aponta sempre pro dominio do
// Portal (ver README do Portal, secao de Email Templates). Por isso o link
// do e-mail sempre abre em portalwecare.com.br/confirmar-redefinicao, nunca
// aqui no Radar — mas como o login e compartilhado entre os dois (cookie de
// sessao no dominio .portalwecare.com.br), depois de trocar a senha la a
// pessoa ja volta logada aqui tambem, sem precisar entrar de novo.
export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://portalwecare.com.br/confirmar-redefinicao",
    });

    setBusy(false);
    if (resetError) {
      setError("Não foi possível enviar o link. Confira o e-mail e tente de novo.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-1 pb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">WeCare Radar</p>
        <h1 className="text-xl font-semibold text-white">Esqueci minha senha</h1>
        <p className="text-sm text-zinc-400">
          Informe seu e-mail de login e enviaremos um link pra você criar uma nova senha.
        </p>
      </div>

      {sent ? (
        <p className="text-sm text-zinc-300">
          Se esse e-mail tiver uma conta, enviamos um link de redefinição pra ele. Confira também a caixa de
          spam. O link abre no Portal — depois de trocar a senha lá, você já volta logada aqui no Radar
          também.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-zinc-400">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@wecare.com"
              className="w-full rounded-md border border-brand-border bg-black/40 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-brand-red focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-brand-red">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 rounded-md bg-brand-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-red-dark disabled:opacity-60"
          >
            {busy ? "Enviando…" : "Enviar link"}
          </button>
        </form>
      )}

      <Link href="/login" className="mt-4 text-center text-sm text-zinc-500 hover:text-white">
        Voltar para o login
      </Link>
    </div>
  );
}
