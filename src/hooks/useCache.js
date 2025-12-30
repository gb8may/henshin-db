export function cacheKey(kind, franchise) {
  const f = String(franchise || "").trim() || "global";
  return `henshin_cache_v1:${kind}:${f}`;
}

export function saveCache(kind, franchise, data) {
  try {
    localStorage.setItem(cacheKey(kind, franchise), JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

export function loadCache(kind, franchise) {
  try {
    const raw = localStorage.getItem(cacheKey(kind, franchise));
    if (!raw) return { ts: 0, data: null };
    const parsed = JSON.parse(raw);
    return { ts: Number(parsed.ts || 0), data: parsed.data ?? null };
  } catch {
    return { ts: 0, data: null };
  }
}

export function fmtAge(ts) {
  if (!ts) return "";
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return "justNow";
  if (mins < 60) return `${mins} minutesShort`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hoursShort`;
  const days = Math.round(hrs / 24);
  return `${days} daysShort`;
}










