"use client";

import { useMemo, useState } from "react";
import type { ExportEntry } from "@/lib/instagram/types";

export function NonReciprocalList({ entries }: { entries: ExportEntry[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.username.includes(q));
  }, [entries, query]);

  return (
    <div className="flex flex-col gap-3">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar usuário…"
        className="w-full rounded-md border border-brand-border bg-black/40 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-brand-red focus:outline-none"
      />
      <div className="max-h-80 overflow-y-auto rounded-md border border-brand-border">
        {filtered.length === 0 ? (
          <p className="p-4 text-sm text-zinc-500">Nenhum usuário encontrado.</p>
        ) : (
          <ol className="divide-y divide-brand-border">
            {filtered.map((entry, i) => (
              <li key={entry.username} className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="text-zinc-600">{i + 1}.</span>
                <a
                  href={entry.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 truncate px-2 font-medium text-zinc-200 hover:text-brand-red hover:underline"
                >
                  @{entry.username}
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>
      <p className="text-xs text-zinc-500">
        {filtered.length.toLocaleString("pt-BR")} de {entries.length.toLocaleString("pt-BR")} contas
      </p>
    </div>
  );
}
