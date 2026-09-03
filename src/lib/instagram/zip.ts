import JSZip from "jszip";
import type { AnalysisOutcome, ExportEntry } from "./types";

// Basename matchers for the files we actually process. O Instagram exporta
// "Seguidores e seguindo" tanto em JSON quanto em HTML — aceitamos os dois,
// pra atendente nao precisar se preocupar em escolher o formato certo.
const FOLLOWERS_FILE = /^followers(_\d+)?\.(json|html)$/i;
const FOLLOWING_FILE = /^following\.(json|html)$/i;

// Companion files that ship inside the same "Followers and following"
// export category but aren't needed for the reciprocity calculation.
// Their presence is expected and must NOT trigger the full-export block.
const KNOWN_COMPANION_STEMS = new Set([
  "following_hashtags",
  "pending_follow_requests",
  "recently_unfollowed_profiles",
  "blocked_profiles",
  "close_friends",
  "follow_requests_you've_received",
  "follow_requests_you_ve_received",
  "follow_requests_you_have_received",
  "hashtags",
]);

function basename(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1];
}

function stem(name: string): string {
  return name.replace(/\.(json|html)$/i, "").toLowerCase();
}

function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

interface RawStringListItem {
  string_list_data?: Array<{ href?: string; value?: string }>;
}

function entriesFromStringListItems(items: RawStringListItem[]): ExportEntry[] {
  const out: ExportEntry[] = [];
  for (const item of items) {
    for (const data of item.string_list_data ?? []) {
      const value = data.value;
      if (!value) continue;
      const username = normalizeUsername(value);
      if (!username) continue;
      const href = data.href || `https://www.instagram.com/${username}`;
      out.push({ username, href });
    }
  }
  return out;
}

// Nas paginas HTML do export, cada conta e um link pro perfil — mesmo
// padrao tanto na lista de seguidores quanto na de seguindo.
function parseInstagramHtml(raw: string): ExportEntry[] {
  const doc = new DOMParser().parseFromString(raw, "text/html");
  const anchors = doc.querySelectorAll<HTMLAnchorElement>('a[href^="https://www.instagram.com/"]');
  const out: ExportEntry[] = [];
  anchors.forEach((a) => {
    const href = a.getAttribute("href") || "";
    const username = normalizeUsername(a.textContent || href.replace("https://www.instagram.com/", ""));
    if (!username) return;
    out.push({ username, href });
  });
  return out;
}

function parseFollowersEntries(path: string, raw: string): ExportEntry[] {
  if (/\.html$/i.test(path)) return parseInstagramHtml(raw);
  const json = JSON.parse(raw);
  const items: RawStringListItem[] = Array.isArray(json) ? json : [];
  return entriesFromStringListItems(items);
}

function parseFollowingEntries(path: string, raw: string): ExportEntry[] {
  if (/\.html$/i.test(path)) return parseInstagramHtml(raw);
  const json = JSON.parse(raw);
  const items: RawStringListItem[] = Array.isArray(json?.relationships_following)
    ? json.relationships_following
    : [];
  return entriesFromStringListItems(items);
}

export async function analyzeExportZip(file: File): Promise<AnalysisOutcome> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    return { ok: false, code: "not-a-zip" };
  }

  const paths = Object.keys(zip.files).filter((p) => !zip.files[p].dir);
  if (paths.length === 0) {
    return { ok: false, code: "empty-zip" };
  }

  // Detecta um export completo ("Todas as suas informações"): qualquer
  // .json/.html cujo nome nao seja um dos esperados na categoria
  // "Seguidores e seguindo" sinaliza que outras categorias vieram junto.
  const unexpected = paths.find((p) => {
    const name = basename(p);
    if (!/\.(json|html)$/i.test(name)) return false;
    if (FOLLOWERS_FILE.test(name) || FOLLOWING_FILE.test(name)) return false;
    return !KNOWN_COMPANION_STEMS.has(stem(name));
  });
  if (unexpected) {
    return { ok: false, code: "full-export", detail: unexpected };
  }

  const followerPaths = paths.filter((p) => FOLLOWERS_FILE.test(basename(p)));
  const followingPaths = paths.filter((p) => FOLLOWING_FILE.test(basename(p)));

  if (followerPaths.length === 0) {
    return { ok: false, code: "missing-followers" };
  }
  if (followingPaths.length === 0) {
    return { ok: false, code: "missing-following" };
  }

  try {
    const followersMap = new Map<string, ExportEntry>();
    for (const path of followerPaths) {
      const raw = await zip.file(path)!.async("string");
      for (const entry of parseFollowersEntries(path, raw)) {
        if (!followersMap.has(entry.username)) followersMap.set(entry.username, entry);
      }
    }

    // If several following.json show up (shouldn't normally happen), merge them.
    const followingMap = new Map<string, ExportEntry>();
    for (const path of followingPaths) {
      const raw = await zip.file(path)!.async("string");
      for (const entry of parseFollowingEntries(path, raw)) {
        if (!followingMap.has(entry.username)) followingMap.set(entry.username, entry);
      }
    }

    const naoReciprocos: ExportEntry[] = [];
    let totalReciprocos = 0;
    for (const [username, entry] of followingMap) {
      if (followersMap.has(username)) {
        totalReciprocos += 1;
      } else {
        naoReciprocos.push(entry);
      }
    }
    naoReciprocos.sort((a, b) => a.username.localeCompare(b.username));

    const totalSeguindo = followingMap.size;
    const totalSeguidores = followersMap.size;
    const percentualReciprocidade =
      totalSeguindo === 0 ? 0 : (totalReciprocos / totalSeguindo) * 100;

    return {
      ok: true,
      totals: {
        totalSeguindo,
        totalSeguidores,
        totalReciprocos,
        totalNaoReciprocos: naoReciprocos.length,
        percentualReciprocidade,
      },
      naoReciprocos,
      followersFilesFound: followerPaths.length,
    };
  } catch (err) {
    return { ok: false, code: "parse-error", detail: err instanceof Error ? err.message : String(err) };
  }
}
