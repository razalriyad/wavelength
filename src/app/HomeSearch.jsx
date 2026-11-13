"use client";
import { useEffect, useRef, useState } from "react";

export default function HomeSearch({ onPlay, onOpenPlayer }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const root = useRef(null);

  useEffect(() => {
    const term = query.trim();
    if (!term) { setResults([]); setLoading(false); setError(""); return; }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true); setError(""); setOpen(true);
      try {
        const response = await fetch(`/api/addons/search?provider=jiosaavn&quality=high&q=${encodeURIComponent(term)}`, { signal: controller.signal, cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Search unavailable");
        setResults(Array.isArray(data.tracks) ? data.tracks : []);
      } catch (err) {
        if (err.name !== "AbortError") { setResults([]); setError("SEARCH SIGNAL UNAVAILABLE"); }
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, 320);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  useEffect(() => {
    const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false); };
    const key = (event) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", key); };
  }, []);

  const choose = (track) => { onPlay?.(track, "jiosaavn", "high"); setOpen(false); };
  return <div className="home-search-wrap" ref={root}>
    <div className="home-search-box">
      <span className="home-search-icon" aria-hidden="true">⌕</span>
      <input value={query} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onFocus={() => query.trim() && setOpen(true)} placeholder="SEARCH TRACKS, ARTISTS, ALBUMS..." aria-label="Search music" />
      {query && <button className="home-search-clear" onClick={() => { setQuery(""); setResults([]); setOpen(false); }} aria-label="Clear search">×</button>}
      <span className="home-search-key">ENTER SIGNAL</span>
    </div>
    {open && query.trim() && <div className="home-search-results" role="listbox" aria-label="Music search results">
      <div className="home-search-results-head"><span>SEARCH RESULTS</span><span>{loading ? "SCANNING..." : `${results.length} FOUND`}</span></div>
      {loading && <div className="home-search-empty">TUNING INTO THE SIGNAL...</div>}
      {!loading && error && <div className="home-search-empty">{error}</div>}
      {!loading && !error && results.length === 0 && <div className="home-search-empty">NO MATCHING SIGNALS FOUND</div>}
      {!loading && results.map((track, index) => <button className="home-search-result" key={track.id || `${track.title}-${index}`} onClick={() => choose(track)} role="option">
        <span className="home-result-art">{track.artworkURL || track.artwork || track.image ? <img src={track.artworkURL || track.artwork || track.image} alt="" /> : "W/"}</span>
        <span className="home-result-meta"><b>{track.title || "Untitled track"}</b><small>{track.artist || "Unknown artist"}{track.album ? ` / ${track.album}` : ""}</small></span>
        <span className="home-result-play">▶</span>
      </button>)}
    </div>}
    <button className="home-open-player" onClick={onOpenPlayer}>OPEN MUSIC PLAYER <span>↗</span></button>
  </div>;
}
