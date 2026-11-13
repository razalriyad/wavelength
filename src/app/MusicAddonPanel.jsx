"use client";
import { useState } from "react";
const ADDONS = {
  jiosaavn: { label: "JIOSAAVN / AAC", quality: "high", options: [{ value: "high", label: "320 KBPS AAC" }, { value: "low", label: "96 KBPS AAC" }] },
  audius: { label: "AUDIUS / OPEN CATALOGUE", quality: "standard", options: [{ value: "standard", label: "STANDARD STREAM" }] },
  jamendo: { label: "JAMENDO / LICENSED INDIE", quality: "standard", options: [{ value: "standard", label: "MP3 STREAM" }] },
  lbitches: { label: "L-BITCHES / LOSSLESS", quality: "lossless", options: [{ value: "lossless", label: "LOSSLESS" }, { value: "high", label: "HIGH QUALITY" }] },
};
const fmt = (value) => `${Math.floor((Number(value) || 0) / 60)}:${String(Math.floor((Number(value) || 0) % 60)).padStart(2, "0")}`;
export default function MusicAddonPanel({ onPlay }) {
  const [provider, setProvider] = useState("jiosaavn");
  const [quality, setQuality] = useState("high");
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  function changeProvider(value) { setProvider(value); setQuality(ADDONS[value].quality); setTracks([]); setError(""); setActiveId(""); setVisibleCount(6); }
  async function search(event) {
    event?.preventDefault(); const term = query.trim(); if (!term || busy) return;
    setBusy(true); setError(""); setTracks([]); setVisibleCount(6);
    try {
      const endpoint = `/api/addons/search?provider=${provider}&quality=${encodeURIComponent(quality)}&q=${encodeURIComponent(term)}`;
      const response = await fetch(endpoint, { cache: "no-store" }); const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Search failed (${response.status})`);
      setTracks(Array.isArray(data.tracks) ? data.tracks : []);
      if (!data.tracks?.length) setError("No tracks found. Try another title or artist.");
    } catch (err) { setError(err.message || "Search failed. Try another source."); }
    finally { setBusy(false); }
  }
  async function play(track) {
    setActiveId(String(track.id)); setError("");
    try { await onPlay(track, provider, quality); }
    catch (err) { setError(err.message || "Playback failed. Try another track or source."); setActiveId(""); }
  }
  return (
    <section className="panel addon-player-panel">
      <div className="panelhead addon-panel-head"><div><small>WAVELENGTH / MUSIC SOURCE</small><h2>STREAMING DECK</h2></div><span>MODULAR PROVIDERS / SHARED AUDIO ENGINE</span></div>
      <div className="addon-controls source-selects">
        <label className="addon-field"><span>SOURCE / PRIMARY + BACKUP</span><select value={provider} onChange={(e) => changeProvider(e.target.value)} aria-label="Music source">
          <optgroup label="PRIMARY SOURCES">
            <option value="jiosaavn">JioSaavn / Geo Sound</option>
            <option value="lbitches">L-Bitches / Hi-Res Backup</option>
          </optgroup>
          <optgroup label="MORE SOURCES">
            <option value="audius">Audius / Open Catalogue</option>
            <option value="jamendo">Jamendo / Licensed Indie</option>
          </optgroup>
        </select></label>
        <label className="addon-field"><span>STREAM QUALITY</span><select value={quality} onChange={(e) => setQuality(e.target.value)}>{ADDONS[provider].options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      </div>
      <form className="searchbar addon-searchbar" onSubmit={search}><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="SEARCH TRACK / ARTIST / ALBUM" aria-label="Search music"/><button type="submit" disabled={busy || !query.trim()}>{busy ? "SEARCHING…" : "SEARCH ↗"}</button></form>
      <div className="addon-statusline"><span>{ADDONS[provider].label}</span><span>{tracks.length ? `${Math.min(visibleCount, tracks.length)} / ${tracks.length} RESULTS` : provider === "jiosaavn" ? "PRIMARY SOURCE" : provider === "lbitches" ? "BACKUP SOURCE" : "READY"}</span></div>
      {error && <p className="addon-error" role="status">{error}</p>}
      <div className="results addon-results">{tracks.slice(0, visibleCount).map((track) => {
        const artwork = track.artworkURL || track.artwork || track.albumCover || track.image || "";
        return <button type="button" key={`${provider}-${track.id}`} className={`resultrow ${activeId === String(track.id) ? "active" : ""}`} onClick={() => play(track)}>
          <span className="cover">{artwork ? <img src={artwork} alt="" loading="lazy"/> : "W/"}</span>
          <span className="resulttext"><b>{track.title || "Untitled track"}</b><small>{track.artist || "Unknown artist"} · {track.album || "Single"}</small></span>
          <span className="addon-track-meta">{fmt(track.duration)}<br/>{activeId === String(track.id) ? "LOADING" : "▶"}</span>
        </button>;
      })}{!tracks.length && !error && <div className="addon-empty">SEARCH RESULTS WILL APPEAR HERE</div>}
      {tracks.length > visibleCount && <button type="button" className="addon-load-more" onClick={() => setVisibleCount((count) => Math.min(count + 6, tracks.length))}>LOAD MORE / +6 <span>{tracks.length - visibleCount} REMAINING</span></button>}
      {busy && tracks.length > 0 && <div className="addon-loading-more">UPDATING RESULTS…</div>}</div>
      <p className="addon-footnote">SOURCE SWITCHING ONLY CHANGES THE CATALOGUE. PLAYBACK, EQ AND VISUALISERS STAY IN THIS WINDOW.</p>
    </section>
  );
}
