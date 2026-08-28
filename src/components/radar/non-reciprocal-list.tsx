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
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <div className="max-h-80 overflow-y-auto rounded-md border border-zinc-200 dark:border-zinc-800">
        {filtered.length === 0 ? (
          <p className="p-4 text-sm text-zinc-500">Nenhum usuário encontrado.</p>
        ) : (
          <ol className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map((entry, i) => (
              <li key={entry.username} className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="text-zinc-500">{i + 1}.</span>
                <a
                  href={entry.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 truncate px-2 font-medium text-zinc-800 hover:underline dark:text-zinc-100"
                >
                  @{entry.username}
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {filtered.length.toLocaleString("pt-BR")} de {entries.length.toLocaleString("pt-BR")} contas
      </p>
    </div>
  );
}
