'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

function clock(value) {
  if (!Number.isFinite(value)) return '0:00';
  return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
}

export default function QobuzPage() {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quality, setQuality] = useState('27');
  const [busy, setBusy] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const searchRef = useRef(null);

  async function search(event) {
    event?.preventDefault();
    const term = query.trim();
    if (!term) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/qobuz/search?q=${encodeURIComponent(term)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Search failed.');
      setTracks(data.tracks || []);
      if (!data.tracks?.length) setError('No matching tracks found. Try another search.');
    } catch (err) {
      setError(err.message || 'Qobuz search failed.');
    } finally { setBusy(false); }
  }

  async function playTrack(track) {
    setSelected(track);
    setLoadingTrack(true);
    setError('');
    try {
      const response = await fetch(`/api/qobuz/stream?trackId=${encodeURIComponent(track.id)}&quality=${quality}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Playback could not be started.');
      const audio = audioRef.current;
      audio.src = data.streamUrl;
      audio.load();
      await audio.play();
      setPlaying(true);
    } catch (err) {
      setPlaying(false);
      setError(err.message || 'Playback failed.');
    } finally { setLoadingTrack(false); }
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !selected) return;
    try {
      if (audio.paused) { await audio.play(); setPlaying(true); }
      else { audio.pause(); setPlaying(false); }
    } catch (err) { setError(err.message || 'Playback control failed.'); }
  }

  useEffect(() => { searchRef.current?.focus(); }, []);

  return (
    <main className="qb-page">
      <header className="qb-head">
        <div><p className="qb-kicker">WAVELENGTH / SOURCE MODULE 02</p><h1>QOBUZ <span>HI-FI</span></h1><p className="qb-sub">Qobuz module adapter · via Squid.wtf · search and playback</p></div>
        <Link href="/" className="qb-back">← BACK TO WAVELENGTH</Link>
      </header>
      <form className="qb-search" onSubmit={search}>
        <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="SEARCH TRACK / ARTIST / ALBUM" aria-label="Search Qobuz" />
        <button type="submit" disabled={busy}>{busy ? 'SEARCHING…' : 'SEARCH ↗'}</button>
      </form>
      <div className="qb-toolbar"><span>PROVIDER: QOBUZ MODULE</span><label>STREAM QUALITY <select value={quality} onChange={(e) => setQuality(e.target.value)}><option value="27">LOSSLESS · MODULE DEFAULT</option><option value="5">LOSSY</option></select></label></div>
      {error && <p className="qb-error" role="status">{error}</p>}
      <section className="qb-grid">
        <div className="qb-results">
          <div className="qb-section-title"><span>SEARCH RESULTS</span><span>{tracks.length} TRACKS</span></div>
          {tracks.map((track) => <button className={`qb-track ${selected?.id === track.id ? 'active' : ''}`} key={track.id} onClick={() => playTrack(track)}>
            {track.albumCover ? <img src={track.albumCover} alt="" /> : <div className="qb-art-empty">W</div>}
            <span className="qb-track-copy"><strong>{track.title}</strong><small>{track.artist} · {track.album}</small><small className="qb-quality">{track.audioQuality}</small></span>
            <span className="qb-track-time">{clock(track.duration)}</span><span className="qb-play-mark">{selected?.id === track.id && playing ? 'Ⅱ' : '▶'}</span>
          </button>)}
          {!tracks.length && <div className="qb-empty">SEARCH FOR A TRACK TO BEGIN</div>}
        </div>
        <aside className="qb-now">
          <div className="qb-section-title"><span>NOW PLAYING</span><span className="qb-live">● SOURCE LIVE</span></div>
          {selected ? <>
            {selected.albumCover ? <img className="qb-cover" src={selected.albumCover} alt={`${selected.album} cover`} /> : <div className="qb-cover qb-cover-empty">WAVELENGTH</div>}
            <h2>{selected.title}</h2><p>{selected.artist}</p><small>{selected.album}</small>
          </> : <div className="qb-cover qb-cover-empty">AWAITING SIGNAL</div>}
          <div className="qb-progress"><input aria-label="Playback position" type="range" min="0" max={duration || 0} step="0.1" value={Math.min(currentTime, duration || 0)} onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); }} /><div><span>{clock(currentTime)}</span><span>{clock(duration)}</span></div></div>
          <div className="qb-controls"><button onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }} aria-label="Restart">↺</button><button className="qb-main-play" onClick={togglePlayback} disabled={!selected || loadingTrack}>{loadingTrack ? '…' : playing ? 'Ⅱ' : '▶'}</button><button onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + 15); }} aria-label="Skip forward 15 seconds">+15</button></div>
          <div className="qb-footer">{quality === '27' ? 'LOSSLESS REQUESTED' : 'LOSSY REQUESTED'} · AUDIO STREAM</div>
        </aside>
      </section>
      <audio ref={audioRef} onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime || 0)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
    </main>
  );
}
