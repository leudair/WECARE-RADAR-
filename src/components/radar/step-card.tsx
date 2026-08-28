export function StepCard({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-brand-border bg-brand-surface p-5 shadow-[0_0_0_1px_rgba(200,20,20,0.04)] sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-red text-sm font-semibold text-white">
          {step}
        </span>
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-zinc-400">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}
