export function thumbOf(c: { thumbnail_url?: string | null; video_url?: string | null }) {
  if (c.thumbnail_url) return c.thumbnail_url;
  const m = c.video_url?.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}

/** Turns watch/share links into embeddable player URLs (YouTube/Vimeo). */
export function embedOf(url?: string | null) {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
}

/** Adds autoplay to an embed URL, used when the viewer clicks the cover to start the lesson. */
export function withAutoplay(embed: string) {
  if (/[?&]autoplay=/.test(embed)) return embed;
  return embed + (embed.includes("?") ? "&" : "?") + "autoplay=1";
}
