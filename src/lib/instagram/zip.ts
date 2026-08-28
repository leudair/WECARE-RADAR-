import JSZip from "jszip";
import type { AnalysisOutcome, ExportEntry } from "./types";

// Basename matchers for the files we actually process.
const FOLLOWERS_JSON = /^followers(_\d+)?\.json$/i;
const FOLLOWING_JSON = /^following\.json$/i;

// Companion files that ship inside the same "Followers and following"
// export category but aren't needed for the reciprocity calculation.
// Their presence is expected and must NOT trigger the full-export block.
const KNOWN_COMPANION_JSON = new Set(
  [
    "following_hashtags.json",
    "pending_follow_requests.json",
    "recently_unfollowed_profiles.json",
    "blocked_profiles.json",
    "close_friends.json",
    "follow_requests_you've_received.json",
    "follow_requests_you_ve_received.json",
    "follow_requests_you_have_received.json",
    "hashtags.json",
  ].map((name) => name.toLowerCase()),
);

const FOLLOWERS_OR_FOLLOWING_HTML = /^(followers(_\d+)?|following)\.html$/i;

function basename(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1];
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

function parseFollowersJson(raw: string): ExportEntry[] {
  const json = JSON.parse(raw);
  const items: RawStringListItem[] = Array.isArray(json) ? json : [];
  return entriesFromStringListItems(items);
}

function parseFollowingJson(raw: string): ExportEntry[] {
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

  // 1. Detect an HTML-format export before anything else — same category,
  // wrong format, needs a fresh JSON export.
  if (paths.some((p) => FOLLOWERS_OR_FOLLOWING_HTML.test(basename(p)))) {
    return { ok: false, code: "html-export" };
  }

  // 2. Detect a full ("Todas as suas informações") export: any .json file
  // whose basename isn't one we recognize from the "Followers and
  // following" category signals other categories are present.
  const unexpectedJson = paths.find((p) => {
    const name = basename(p);
    if (!/\.json$/i.test(name)) return false;
    if (FOLLOWERS_JSON.test(name) || FOLLOWING_JSON.test(name)) return false;
    return !KNOWN_COMPANION_JSON.has(name.toLowerCase());
  });
  if (unexpectedJson) {
    return { ok: false, code: "full-export", detail: unexpectedJson };
  }

  const followerPaths = paths.filter((p) => FOLLOWERS_JSON.test(basename(p)));
  const followingPaths = paths.filter((p) => FOLLOWING_JSON.test(basename(p)));

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
      for (const entry of parseFollowersJson(raw)) {
        if (!followersMap.has(entry.username)) followersMap.set(entry.username, entry);
      }
    }

    // If several following.json show up (shouldn't normally happen), merge them.
    const followingMap = new Map<string, ExportEntry>();
    for (const path of followingPaths) {
      const raw = await zip.file(path)!.async("string");
      for (const entry of parseFollowingJson(raw)) {
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
