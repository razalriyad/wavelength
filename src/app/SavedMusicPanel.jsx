"use client";
import { useEffect, useState } from "react";
export default function SavedMusicPanel(){
  const [liked,setLiked]=useState([]),[history,setHistory]=useState([]);
  const refresh=()=>{try{setLiked(JSON.parse(localStorage.getItem("wavelength-liked-tracks")||"[]"));}catch{setLiked([]);}try{setHistory(JSON.parse(localStorage.getItem("wavelength-play-history")||"[]"));}catch{setHistory([]);}};
  useEffect(()=>{refresh();window.addEventListener("storage",refresh);window.addEventListener("wavelength-library-update",refresh);return()=>{window.removeEventListener("storage",refresh);window.removeEventListener("wavelength-library-update",refresh);};},[]);
  function clearHistory(){localStorage.removeItem("wavelength-play-history");setHistory([]);}
  const list=(items,empty)=>items.length?items.slice(0,8).map((track,i)=><div className="saved-track" key={`${track.id}-${i}`}><span className="saved-cover">{track.artworkURL?<img src={track.artworkURL} alt="" loading="lazy"/>:"W/"}</span><span><b>{track.title||"Untitled track"}</b><small>{track.artist||"Unknown artist"}</small></span></div>):<p className="saved-empty">{empty}</p>;
  return <section className="panel saved-music-panel"><div className="panelhead"><div><small>LOCAL STORAGE / NO ACCOUNT</small><h2>YOUR MUSIC MEMORY</h2></div><span>THIS BROWSER ONLY</span></div><div className="saved-music-grid"><div><div className="saved-head"><h3>♥ LIKED SONGS / {liked.length}</h3></div>{list(liked,"No liked songs saved yet.")}</div><div><div className="saved-head"><h3>RECENTLY PLAYED / {history.length}</h3><button type="button" onClick={clearHistory} disabled={!history.length}>CLEAR HISTORY</button></div>{list(history,"Your listening history will appear here.")}</div></div><p className="saved-note">Saved on this device until WAVELENGTH site data is cleared. History can also be cleared here.</p></section>;
}
