export function safeHost(url: string) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function faviconUrl(url: string) {
  const host = safeHost(url);
  if (!host) return null;

  // Google S2 favicon (reliable & fast)
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
    host
  )}&sz=64`;
}

export function timeAgo(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();

  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;

  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;

  const mon = Math.floor(day / 30);
  if (mon < 12) return `${mon}mo ago`;

  const yr = Math.floor(mon / 12);
  return `${yr}y ago`;
}
