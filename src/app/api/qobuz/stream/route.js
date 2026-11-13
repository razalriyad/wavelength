import { NextResponse } from 'next/server';

const BASE_URL = 'https://qobuz.squid.wtf/api';
const ALLOWED_QUALITIES = new Set(['5', '27']);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const trackId = (searchParams.get('trackId') || '').trim();
  const requestedQuality = searchParams.get('quality') || '27';
  const quality = ALLOWED_QUALITIES.has(requestedQuality) ? requestedQuality : '27';
  if (!/^\d{1,20}$/.test(trackId)) return NextResponse.json({ error: 'Invalid Qobuz track ID.' }, { status: 400 });
  try {
    const upstream = await fetch(`${BASE_URL}/download-music?track_id=${encodeURIComponent(trackId)}&quality=${quality}`, {
      headers: { Accept: 'application/json', 'User-Agent': 'Qobuz8Spine/1.0' },
      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    });
    if (!upstream.ok) throw new Error(`Provider returned HTTP ${upstream.status}`);
    const data = await upstream.json();
    const streamUrl = data?.success && data?.data?.url;
    if (!streamUrl) throw new Error('Provider did not return a playable stream URL.');
    const parsed = new URL(streamUrl);
    if (parsed.protocol !== 'https:') throw new Error('Provider returned an unsupported stream URL.');
    return NextResponse.json({ streamUrl: parsed.toString(), quality: quality === '27' ? 'Lossless' : 'Lossy' });
  } catch (error) {
    return NextResponse.json({ error: error.name === 'TimeoutError' ? 'Qobuz stream request timed out.' : error.message || 'Could not resolve this track.' }, { status: 502 });
  }
}
