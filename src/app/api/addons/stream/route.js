import { NextResponse } from "next/server";
import { getJioSaavnStream } from "@/lib/jiosaavn/client.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LB = "https://l-bitches.clashgram.workers.dev";
const AUDIUS_HOSTS = ["https://api.audius.co/v1", "https://discoveryprovider.audius.co/v1"];
const APP_NAME = "WAVELENGTH";
const ALLOWED_HOSTS = {
  jiosaavn: ["aac.saavncdn.com", "h.saavncdn.com"],
  audius: ["api.audius.co", "discoveryprovider.audius.co", "r2.cloudflarestorage.com"],
  jamendo: ["mp3d.jamendo.com", "prod-1.storage.jamendo.com", "storage.jamendo.com"],
  lbitches: ["l-bitches.clashgram.workers.dev"],
};

function allowedHost(hostname, provider) {
  return (ALLOWED_HOSTS[provider] || []).some((host) => hostname === host || hostname.endsWith(`.${host}`));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const provider = (searchParams.get("provider") || "jiosaavn").toLowerCase();
  const id = (searchParams.get("id") || "").trim();
  const quality = searchParams.get("quality") || "high";
  if (!id || id.length > 200) return NextResponse.json({ error: "Invalid track ID." }, { status: 400 });
  if (!ALLOWED_HOSTS[provider]) return NextResponse.json({ error: "Unknown music provider." }, { status: 400 });

  try {
    let streamUrl;
    if (provider === "jiosaavn") {
      const stream = await getJioSaavnStream(id, quality === "low" ? "low" : "high");
      streamUrl = stream?.url;
    } else if (provider === "audius") {
      if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error("Invalid Audius track ID.");
      streamUrl = `${AUDIUS_HOSTS[0]}/tracks/${encodeURIComponent(id)}/stream?app_name=${APP_NAME}`;
    } else if (provider === "jamendo") {
      const clientId = process.env.JAMENDO_CLIENT_ID;
      if (!clientId) return NextResponse.json({ error: "Jamendo needs a free JAMENDO_CLIENT_ID in Vercel environment variables." }, { status: 503 });
      const url = new URL("https://api.jamendo.com/v3.0/tracks/");
      url.searchParams.set("client_id", clientId);
      url.searchParams.set("format", "json");
      url.searchParams.set("id", id);
      url.searchParams.set("audioformat", "mp32");
      const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(18000) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.headers?.status !== "success") throw new Error(data.headers?.error_message || "Jamendo could not resolve this track.");
      streamUrl = data.results?.[0]?.audio;
    } else if (provider === "lbitches") {
      const resolved = await fetch(`${LB}/stream/${encodeURIComponent(id)}?quality=${encodeURIComponent(quality)}&atmos=none`, {
        headers: { Accept: "application/json", "User-Agent": "WAVELENGTH/1.0" },
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
      });
      const data = await resolved.json().catch(() => ({}));
      if (!resolved.ok) throw new Error(data.error || `L-Bitches returned HTTP ${resolved.status}`);
      streamUrl = data.streamURL || data.streamUrl || data.url;
    }

    if (!streamUrl) throw new Error("The provider did not return a playable stream URL.");
    const target = new URL(streamUrl);
    if (target.protocol !== "https:" || !allowedHost(target.hostname, provider)) {
      throw new Error("The provider returned an unexpected stream host.");
    }

    // Proxy the actual audio bytes through this same-origin route. This keeps
    // Web Audio analyser access working and preserves byte-range seeking.
    const upstreamHeaders = { Accept: "audio/*, */*;q=0.8", "User-Agent": "Mozilla/5.0 WAVELENGTH/1.0" };
    const range = request.headers.get("range");
    if (range) upstreamHeaders.Range = range;
    const upstream = await fetch(target, {
      headers: upstreamHeaders,
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(30000),
    });
    if (!upstream.ok && upstream.status !== 206) {
      const message = `Audio source returned HTTP ${upstream.status}.`;
      return NextResponse.json({ error: message }, { status: 502 });
    }
    const finalUrl = new URL(upstream.url || target.href);
    if (finalUrl.protocol !== "https:" || !allowedHost(finalUrl.hostname, provider)) {
      return NextResponse.json({ error: "Audio source redirected to an untrusted host." }, { status: 502 });
    }

    const headers = new Headers({
      "Content-Type": upstream.headers.get("content-type") || (provider === "jiosaavn" ? "audio/mp4" : "audio/mpeg"),
      "Cache-Control": "no-store, no-transform",
      "Accept-Ranges": upstream.headers.get("accept-ranges") || "bytes",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges",
    });
    for (const name of ["content-length", "content-range", "etag", "last-modified"]) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }
    return new Response(upstream.body, { status: upstream.status, headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not connect to this audio stream.";
    return NextResponse.json({ error: message }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
