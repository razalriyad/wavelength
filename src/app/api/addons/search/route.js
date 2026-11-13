import { NextResponse } from "next/server";
import { searchJioSaavn } from "@/lib/jiosaavn/client.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const LB = "https://l-bitches.clashgram.workers.dev";
const AUDIUS_HOSTS = ["https://api.audius.co/v1", "https://discoveryprovider.audius.co/v1"];
const APP_NAME = "WAVELENGTH";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const provider = (searchParams.get("provider") || "jiosaavn").toLowerCase();
  const q = (searchParams.get("q") || "").trim();
  const quality = searchParams.get("quality") || "high";
  if (!q) return NextResponse.json({ error: "Enter a track, artist or album." }, { status: 400 });
  if (q.length > 160) return NextResponse.json({ error: "Search query is too long." }, { status: 400 });
  try {
    let tracks = [];
    if (provider === "jiosaavn") {
      tracks = await searchJioSaavn(q, quality === "low" ? "low" : "high", 25);
      const terms = q.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 1);
      const score = (track) => {
        const title = String(track.title || "").toLowerCase();
        const artist = String(track.artist || "").toLowerCase();
        const album = String(track.album || "").toLowerCase();
        let points = 0;
        if (title === q.toLowerCase()) points += 12;
        else if (title.includes(q.toLowerCase())) points += 8;
        if (artist.includes(q.toLowerCase())) points += 10;
        if (album.includes(q.toLowerCase())) points += 2;
        for (const term of terms) {
          if (title.includes(term)) points += 3;
          if (artist.includes(term)) points += 4;
          if (album.includes(term)) points += 1;
        }
        return points;
      };
      tracks = tracks.filter((track) => track.id && track.streamURL).sort((a, b) => score(b) - score(a));
    } else if (provider === "audius") {
      let payload = null;
      let audiusError = "Audius is temporarily unavailable.";
      for (const host of AUDIUS_HOSTS) {
        const url = new URL(`${host}/tracks/search`);
        url.searchParams.set("query", q); url.searchParams.set("limit", "20"); url.searchParams.set("app_name", APP_NAME);
        try {
          const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(12000) });
          const data = await response.json().catch(() => ({}));
          if (response.ok && Array.isArray(data.data)) { payload = data; break; }
          audiusError = data?.error || `Audius returned HTTP ${response.status}`;
        } catch (error) { audiusError = error instanceof Error ? error.message : audiusError; }
      }
      if (!payload) throw new Error(audiusError);
      tracks = (payload.data || []).map((item) => ({
        id: String(item.id), title: item.title || "Untitled track",
        artist: item.user?.name || "Unknown artist", album: item.playlist_name || "Audius",
        duration: Number(item.duration) || 0,
        artworkURL: item.artwork?.["480x480"] || item.artwork?.["150x150"] || "",
        streamURL: `${AUDIUS_HOSTS[0]}/tracks/${encodeURIComponent(item.id)}/stream?app_name=${APP_NAME}`,
        provider: "audius", quality: item.mood || "standard", permalink: item.permalink,
      }));
    } else if (provider === "jamendo") {
      const clientId = process.env.JAMENDO_CLIENT_ID;
      if (!clientId) return NextResponse.json({ error: "Jamendo is ready to connect, but needs a free JAMENDO_CLIENT_ID in Vercel project environment variables." }, { status: 503 });
      const url = new URL("https://api.jamendo.com/v3.0/tracks/");
      url.searchParams.set("client_id", clientId); url.searchParams.set("format", "json");
      url.searchParams.set("namesearch", q); url.searchParams.set("limit", "20");
      url.searchParams.set("audioformat", "mp32"); url.searchParams.set("include", "musicinfo");
      const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(18000) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.headers?.status !== "success") throw new Error(payload.headers?.error_message || `Jamendo returned HTTP ${response.status}`);
      tracks = (payload.results || []).map((item) => ({
        id: String(item.id), title: item.name || "Untitled track", artist: item.artist_name || "Unknown artist",
        album: item.album_name || "Single", duration: Number(item.duration) || 0,
        artworkURL: item.album_image || "", streamURL: item.audio || "", license: item.license_ccurl || "",
        provider: "jamendo", quality: "MP3",
      }));
    } else if (provider === "lbitches") {
      const upstream = await fetch(`${LB}/search?q=${encodeURIComponent(q)}&quality=${encodeURIComponent(quality)}&atmos=none`, { headers: { Accept: "application/json", "User-Agent": "WAVELENGTH/1.0" }, cache: "no-store", signal: AbortSignal.timeout(20000) });
      const data = await upstream.json().catch(() => ({}));
      if (!upstream.ok) throw new Error(data.error || `L-Bitches returned HTTP ${upstream.status}`);
      tracks = Array.isArray(data.tracks) ? data.tracks : [];
    } else return NextResponse.json({ error: "Unknown music provider." }, { status: 400 });
    return NextResponse.json({ provider, tracks, total: tracks.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Music search failed." }, { status: 502 });
  }
}
