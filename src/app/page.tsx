import { RadarTool } from "@/components/radar/radar-tool";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">
          WeCare Radar
        </p>
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">
          Quem não te segue de volta
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
          Suba o export oficial do Instagram do cliente para identificar, em segundos, quem ele
          segue e não é seguido de volta. Todo o processamento roda no navegador — nenhum arquivo
          é enviado a servidor nenhum.
        </p>
      </header>

      <RadarTool />
    </div>
  );
}
