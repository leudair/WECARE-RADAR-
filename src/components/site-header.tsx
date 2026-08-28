import Image from "next/image";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-brand-border bg-brand-black">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-wecare.png"
            alt="Agência WeCare Mídias Sociais"
            width={140}
            height={59}
            priority
            className="h-9 w-auto sm:h-10"
          />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold tracking-wide text-white">RADAR</span>
            <span className="text-[11px] text-zinc-500">Não-recíprocos do Instagram</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link href="/relatorio" className="text-xs font-medium text-zinc-400 hover:text-white">
                Relatório
              </Link>
              <span className="hidden text-xs text-zinc-500 sm:inline">{user.email}</span>
              <LogoutButton />
            </>
          )}
          <span className="rounded-full border border-brand-red/40 bg-brand-red-soft px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-red-300">
            Uso interno
          </span>
        </div>
      </div>
    </header>
  );
}
