export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);
  const target = url.searchParams.get('url');
  if (!target) return Response.json({ error: 'Missing stream URL' }, { status: 400 });
  let parsed;
  try { parsed = new URL(target); } catch { return Response.json({ error: 'Invalid stream URL' }, { status: 400 }); }
  if (parsed.protocol !== 'https:' || !['aac.saavncdn.com', 'h.saavncdn.com'].includes(parsed.hostname)) {
    return Response.json({ error: 'Unsupported stream host' }, { status: 403 });
  }
  try {
    const headers = {};
    const range = request.headers.get('range');
    if (range) headers.Range = range;
    const upstream = await fetch(parsed.toString(), { headers, redirect: 'follow', cache: 'no-store' });
    if (!upstream.ok && upstream.status !== 206) return Response.json({ error: `Audio source returned ${upstream.status}` }, { status: upstream.status });
    const responseHeaders = new Headers({
      'Content-Type': upstream.headers.get('content-type') || 'audio/mp4',
      'Accept-Ranges': upstream.headers.get('accept-ranges') || 'bytes',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    for (const key of ['content-length', 'content-range']) {
      const value = upstream.headers.get(key);
      if (value) responseHeaders.set(key, value);
    }
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch (error) {
    return Response.json({ error: error.message || 'Stream proxy failed' }, { status: 502 });
  }
}
