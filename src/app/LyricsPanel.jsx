"use client";
import { useEffect, useMemo, useState } from "react";

function parseLrc(value) {
  return String(value || "").split(/\r?\n/).map((line) => {
    const match = line.match(/^\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]\s*(.*)$/);
    if (!match || !match[4].trim()) return null;
    return { time: Number(match[1]) * 60 + Number(match[2]) + Number("0." + (match[3] || "0")), text: match[4].trim() };
  }).filter(Boolean).sort((a, b) => a.time - b.time);
}

const STYLE_OPTIONS = [
  { id: "social", label: "SOCIAL FLOW" },
  { id: "karaoke", label: "WORD GLOW" },
  { id: "minimal", label: "MINIMAL" },
  { id: "classic", label: "CLASSIC" },
];
const FONT_OPTIONS = ["SYSTEM", "ROUND", "SERIF", "MONO"];

export default function LyricsPanel({ track, currentTime = 0 }) {
  const [lyrics, setLyrics] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [full, setFull] = useState(false);
  const [style, setStyle] = useState("social");
  const [font, setFont] = useState("ROUND");
  const [showSettings, setShowSettings] = useState(false);
  const title = track?.title || "";
  const artist = track?.artist || "";

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("wavelength-lyrics-style") || "{}");
      if (saved.style) setStyle(saved.style);
      if (saved.font) setFont(saved.font);
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("wavelength-lyrics-style", JSON.stringify({ style, font })); } catch {}
  }, [style, font]);

  useEffect(() => {
    if (!title) { setLyrics(null); setError(""); return; }
    const controller = new AbortController();
    setBusy(true); setError(""); setLyrics(null);
    fetch("/api/lyrics/search?track=" + encodeURIComponent(title) + "&artist=" + encodeURIComponent(artist) + "&album=" + encodeURIComponent(track?.album || "") + "&duration=" + encodeURIComponent(track?.duration || ""), { signal: controller.signal, cache: "no-store" })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw Error(data.error || "Lyrics unavailable"); return data; })
      .then(setLyrics)
      .catch((err) => { if (err.name !== "AbortError") { setLyrics(null); setError(err.message || "No lyrics found"); } })
      .finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, [title, artist, track?.album, track?.duration, track?.id]);

  const lines = useMemo(() => parseLrc(lyrics?.syncedLyrics), [lyrics]);
  const active = lines.reduce((found, line, index) => line.time <= currentTime ? index : found, -1);
  const nextLine = lines[active + 1];
  const activeLine = lines[active];
  const progress = activeLine ? Math.max(0, Math.min(0.999, (currentTime - activeLine.time) / Math.max(0.8, (nextLine?.time || activeLine.time + 4) - activeLine.time))) : 0;

  useEffect(() => {
    if (full && active >= 0) document.querySelector(".lyrics-line.active")?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [active, full]);

  if (!track) return <section className="lyrics-panel"><div className="panelhead"><h2>LIVE LYRICS</h2><span>AWAITING TRACK</span></div><p className="saved-empty">Play a track to find synchronized lyrics.</p></section>;

  const renderWords = (line, lineIndex, isActive) => {
    const words = line.text.split(/(\s+)/).filter(Boolean);
    const actualWords = words.filter((word) => !/^\s+$/.test(word)).length;
    let wordIndex = 0;
    return words.map((word, index) => {
      if (/^\s+$/.test(word)) return <span key={index}>{word}</span>;
      const position = wordIndex++;
      const start = position / Math.max(1, actualWords);
      const end = (position + 1) / Math.max(1, actualWords);
      const lit = isActive && progress >= start;
      const fraction = lit ? Math.max(0, Math.min(1, (progress - start) / Math.max(0.04, end - start))) : 0;
      const socialScale = style === "social" ? [1.12, 0.82, 1.28, 0.92, 1.04, 0.76][(lineIndex * 3 + position) % 6] : 1;
      return <span key={index} className={"lyric-word" + (lit ? " word-lit" : "") + (isActive && fraction > 0.02 ? " word-current" : "")} style={{ "--word-progress": fraction, "--word-scale": socialScale, "--word-index": position }}>{word}</span>;
    });
  };

  return <section className={"lyrics-panel" + (full ? " lyrics-fullscreen" : "")}>
    <div className="panelhead lyrics-heading">
      <div><small>LYRIC SIGNAL / LRCLIB</small><h2>LIVE LYRICS</h2><span>{title} / {artist}</span></div>
      <div className="lyrics-actions"><button type="button" onClick={() => setShowSettings((value) => !value)}>STYLE</button><button type="button" onClick={() => setFull((value) => !value)}>{full ? "CLOSE" : "EXPAND"}</button></div>
    </div>
    {showSettings && <div className="lyrics-settings">
      <label>LYRIC LOOK<div className="lyrics-choice-row">{STYLE_OPTIONS.map((option) => <button type="button" key={option.id} className={style === option.id ? "active" : ""} onClick={() => setStyle(option.id)}>{option.label}</button>)}</div></label>
      <label>TYPEFACE<div className="lyrics-choice-row">{FONT_OPTIONS.map((option) => <button type="button" key={option} className={font === option ? "active" : ""} onClick={() => setFont(option)}>{option}</button>)}</div></label>
    </div>}
    {busy && <p className="saved-empty">TUNING INTO LYRICS…</p>}
    {!busy && error && <p className="saved-empty">{error}</p>}
    {!busy && lyrics && <div className={"lyrics-stage lyrics-style-" + style + " lyrics-font-" + font.toLowerCase()}>
      {lines.length ? <div className="lyrics-lines">{lines.map((line, index) => <p key={index} className={"lyrics-line" + (index === active ? " active" : "") + (index < active ? " passed" : "")} aria-current={index === active ? "true" : undefined}>{renderWords(line, index, index === active)}</p>)}</div>
      : <div className="lyrics-plain">{lyrics.plainLyrics || "Synced lyrics are not available for this track."}</div>}
    </div>}
    {lyrics && <div className="lyrics-foot"><span>{lines.length ? "WORD FLOW / APPROXIMATED FROM LINE TIMESTAMPS" : "PLAIN LYRICS / NO WORD TIMESTAMPS"}</span><span>{lyrics.source || "LRCLIB"}</span></div>}
  </section>;
}
