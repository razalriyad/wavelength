import { NextResponse } from 'next/server';

const BASE_URL = 'https://qobuz.squid.wtf/api';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim();
  if (!query) return NextResponse.json({ error: 'Enter a track or artist to search.' }, { status: 400 });
  if (query.length > 160) return NextResponse.json({ error: 'Search query is too long.' }, { status: 400 });
  try {
    const upstream = await fetch(`${BASE_URL}/get-music?q=${encodeURIComponent(query)}&offset=0`, {
      headers: { Accept: 'application/json', 'User-Agent': 'Qobuz8Spine/1.0' },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });
    if (!upstream.ok) throw new Error(`Provider returned HTTP ${upstream.status}`);
    const data = await upstream.json();
    if (!data?.success || !data?.data) throw new Error('Provider returned an unexpected search response.');
    const tracksData = data.data.tracks || {};
    const tracks = (tracksData.items || []).map((track) => ({
      id: String(track.id),
      title: `${track.title || 'Unknown Track'}${track.version ? ` (${track.version})` : ''}`,
      artist: track.performer?.name || 'Unknown Artist',
      album: `${track.album?.title || 'Unknown Album'}${track.album?.version ? ` (${track.album.version})` : ''}`,
      albumCover: track.album?.image?.large || track.album?.image?.small || null,
      duration: Number(track.duration || 0),
      trackNumber: track.track_number || null,
      audioQuality: track.maximum_technical_specifications || (track.maximum_bit_depth ? `${track.maximum_bit_depth} bits / ${track.maximum_sampling_rate || '?'} kHz` : 'Quality not supplied'),
    }));
    return NextResponse.json({ tracks, total: tracksData.total || tracks.length });
  } catch (error) {
    return NextResponse.json({ error: error.name === 'TimeoutError' ? 'Qobuz search timed out.' : error.message || 'Qobuz search failed.' }, { status: 502 });
  }
}
