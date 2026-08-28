import { RadarTool } from "@/components/radar/radar-tool";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">WeCare Radar</h1>
        <p className="max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Suba o .zip do export do Instagram do cliente (Central de Contas → Baixar suas
          informações → apenas &quot;Seguidores e seguindo&quot; → formato JSON) para identificar
          quem não retribui o follow. Tudo roda no navegador — nenhum arquivo é enviado a servidor
          nenhum.
        </p>
      </header>

      <RadarTool />
    </div>
  );
}
