"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PRESETS = [
  { id:"clean", name:"CLEAN", family:"Reference", desc:"Unprocessed playback, a neutral starting point.", controls:[["Output",0,150,100,"%"],["Pan", -100,100,0,""]]},
  { id:"speed", name:"SPEED UP", family:"Time", desc:"Raise playback speed and pitch together.", controls:[["Speed",110,180,125,"%"],["Tone", -4,4,0,"st"]]},
  { id:"slow", name:"SLOW MOTION", family:"Time", desc:"Lower playback speed for a stretched, intimate feel.", controls:[["Speed",55,95,75,"%"],["Tone",-4,4,0,"st"]]},
  { id:"nightcore", name:"NIGHTCORE", family:"Time", desc:"Fast, bright playback with a lifted top end.", controls:[["Speed",110,160,130,"%"],["Air",0,100,65,"%"]]},
  { id:"slowed", name:"SLOWED + SPACE", family:"Space", desc:"Half speed with a soft stereo reverb tail.", controls:[["Speed",55,95,78,"%"],["Space",0,100,58,"%"],["Damping",0,100,35,"%"]]},
  { id:"orbit", name:"SPATIAL 8D", family:"Space", desc:"A slow automatic stereo orbit around the listener.", controls:[["Orbit",0,100,55,"%"],["Rate",0.05,1,0.22,"Hz"],["Width",0,100,85,"%"]]},
  { id:"lofi", name:"LO-FI TAPE", family:"Texture", desc:"Band-limited tape tone with gentle saturation and wobble.", controls:[["Warmth",0,100,65,"%"],["Dust",0,100,24,"%"],["Wobble",0,100,18,"%"]]},
  { id:"radio", name:"AM RADIO", family:"Texture", desc:"Narrow mono radio bandwidth with a little grit.", controls:[["Bandwidth",0,100,42,"%"],["Drive",0,100,18,"%"]]},
  { id:"vinyl", name:"VINYL ROOM", family:"Texture", desc:"Warm low end, softened highs and subtle record noise.", controls:[["Warmth",0,100,58,"%"],["Crackle",0,100,12,"%"]]},
  { id:"bass", name:"SUB BASS", family:"Tone", desc:"A controlled low shelf for weight without mud.", controls:[["Bass",0,100,68,"%"],["Presence",0,100,48,"%"]]},
  { id:"vocal", name:"VOCAL FOCUS", family:"Tone", desc:"Bring the midrange forward and tame the extremes.", controls:[["Focus",0,100,62,"%"],["Air",0,100,35,"%"]]},
  { id:"wide", name:"STEREO WIDE", family:"Space", desc:"Increase perceived width while keeping the centre stable.", controls:[["Width",0,100,72,"%"],["Centre",0,100,60,"%"]]},
  { id:"echo", name:"ECHO CHAMBER", family:"Space", desc:"Tempo-independent echo with adjustable feedback.", controls:[["Time",80,700,260,"ms"],["Feedback",0,80,28,"%"],["Mix",0,100,28,"%"]]},
  { id:"dream", name:"DREAM HAZE", family:"Space", desc:"Soft filtering and a diffuse reverb wash.", controls:[["Haze",0,100,55,"%"],["Space",0,100,64,"%"]]},
  { id:"telephone", name:"TELEPHONE", family:"Texture", desc:"A focused midrange band-pass voice effect.", controls:[["Body",0,100,45,"%"],["Edge",0,100,55,"%"]]},
  { id:"underwater", name:"UNDERWATER", family:"Texture", desc:"Dark low-pass filtering with a resonant submerged tone.", controls:[["Depth",0,100,68,"%"],["Resonance",0,100,22,"%"]]},
];

export default function AudioEditorPage({ embedded = false, sharedAudioRef = null, sharedContextRef = null, sharedAnalyserRef = null, sharedPreAnalyserRef = null, ensureSharedAudio = null } = {}) {
  const [presetId,setPresetId]=useState("lofi");
  const [values,setValues]=useState({});
  const [fileName,setFileName]=useState("");
  const [url,setUrl]=useState("");
  const [playing,setPlaying]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const orbitFrame=useRef(0);
  const localAudioRef=useRef(null), localCtxRef=useRef(null), sourceRef=useRef(null), nodesRef=useRef({});
  const audioRef=sharedAudioRef || localAudioRef;
  const ctxRef=sharedContextRef || localCtxRef;
  const [enabled,setEnabled]=useState({});
  const active=PRESETS.find(p=>p.id===presetId)||PRESETS[0];
  const getVal=(name,def)=>values[presetId]?.[name] ?? def;
  const setVal=(name,val)=>setValues(v=>({...v,[presetId]:{...(v[presetId]||{}),[name]:val}}));

  const setupAudio=useCallback(async()=>{
    const audio=audioRef.current;
    if(sharedAudioRef) {
      await ensureSharedAudio?.();
      const ctx=ctxRef.current, inputNode=sharedPreAnalyserRef?.current, analyser=sharedAnalyserRef?.current;
      if(!ctx || !inputNode || !analyser) return;
      if(!nodesRef.current.input) {
        const input=ctx.createGain(), filter=ctx.createBiquadFilter(), shaper=ctx.createWaveShaper();
        const delay=ctx.createDelay(1), feedback=ctx.createGain(), wet=ctx.createGain(), dry=ctx.createGain();
        const pan=ctx.createStereoPanner(), output=ctx.createGain();
        filter.type="allpass"; delay.delayTime.value=.26; feedback.gain.value=0; wet.gain.value=0;
        try { inputNode.disconnect(analyser); } catch {}
        inputNode.connect(input); input.connect(filter); filter.connect(shaper); shaper.connect(dry); shaper.connect(delay);
        delay.connect(feedback); feedback.connect(delay); delay.connect(wet); dry.connect(pan); wet.connect(pan);
        pan.connect(output); output.connect(analyser);
        nodesRef.current={input,filter,shaper,delay,feedback,wet,dry,pan,output,analyser,shared:true};
      }
      if(ctx.state==="suspended") await ctx.resume();
      return;
    }
    if(!audio) return;
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC) return;
    if(!ctxRef.current) {
      const ctx=new AC(), source=ctx.createMediaElementSource(audio);
      const input=ctx.createGain(), filter=ctx.createBiquadFilter(), shaper=ctx.createWaveShaper();
      const delay=ctx.createDelay(1), feedback=ctx.createGain(), wet=ctx.createGain(), dry=ctx.createGain();
      const pan=ctx.createStereoPanner(), output=ctx.createGain(), analyser=ctx.createAnalyser();
      filter.type="allpass"; shaper.curve=null; delay.delayTime.value=.26; feedback.gain.value=0; wet.gain.value=0;
      source.connect(input); input.connect(filter); filter.connect(shaper); shaper.connect(dry); shaper.connect(delay);
      delay.connect(feedback); feedback.connect(delay); delay.connect(wet); dry.connect(pan); wet.connect(pan);
      pan.connect(output); output.connect(analyser); analyser.connect(ctx.destination);
      ctxRef.current=ctx; sourceRef.current=source;
      nodesRef.current={input,filter,shaper,delay,feedback,wet,dry,pan,output,analyser};
    }
    if(ctxRef.current.state==="suspended") await ctxRef.current.resume();
  },[]);

  const applyPreset=useCallback(async(id,vals={})=>{
    const audio=audioRef.current, ctx=ctxRef.current, n=nodesRef.current;
    if(!audio||!ctx) return;
    const preset=PRESETS.find(p=>p.id===id)||PRESETS[0];
    const val=(label,def)=>vals[label] ?? preset.controls.find(c=>c[0]===label)?.[3] ?? def;
    const pct=x=>Math.max(0,Math.min(1,x/100));
    audio.playbackRate=id==="speed"?val("Speed",125)/100:id==="slow"?val("Speed",75)/100:id==="nightcore"?val("Speed",130)/100:id==="slowed"?val("Speed",78)/100:1;
    const filter=n.filter, now=ctx.currentTime;
    filter.type="allpass"; filter.frequency.setTargetAtTime(1000,now,.03); filter.Q.setTargetAtTime(.7,now,.03);
    n.feedback.gain.setTargetAtTime(0,now,.03); n.wet.gain.setTargetAtTime(0,now,.03); n.dry.gain.setTargetAtTime(1,now,.03);
    n.pan.pan.setTargetAtTime(0,now,.03); n.output.gain.setTargetAtTime(val("Output",100)/100,now,.03);
    if(id==="radio"||id==="telephone"){filter.type="bandpass";filter.frequency.setTargetAtTime(id==="radio"?1200:1500,now,.03);filter.Q.setTargetAtTime(id==="radio"?0.65:1.2,now,.03);}
    if(id==="underwater"||id==="dream"){filter.type="lowpass";filter.frequency.setTargetAtTime(id==="underwater"?350+val("Depth",68)*24:1800-val("Haze",55)*10,now,.03);filter.Q.setTargetAtTime(.7+pct(val("Resonance",22))*4,now,.03);}
    if(id==="bass"){filter.type="lowshelf";filter.frequency.setTargetAtTime(150,now,.03);filter.gain.setTargetAtTime(pct(val("Bass",68))*12,now,.03);}
    if(id==="vocal"){filter.type="peaking";filter.frequency.setTargetAtTime(1800,now,.03);filter.Q.setTargetAtTime(.8,now,.03);filter.gain.setTargetAtTime(pct(val("Focus",62))*8,now,.03);}
    if(id==="lofi"||id==="vinyl"){filter.type="lowpass";filter.frequency.setTargetAtTime(id==="lofi"?4200+val("Warmth",65)*35:9000-val("Warmth",58)*25,now,.03);}
    if(id==="echo"){n.delay.delayTime.setTargetAtTime(val("Time",260)/1000,now,.03);n.feedback.gain.setTargetAtTime(pct(val("Feedback",28))*.72,now,.03);n.wet.gain.setTargetAtTime(pct(val("Mix",28))*.8,now,.03);}
    if(id==="slowed"||id==="dream"){n.delay.delayTime.setTargetAtTime(.18,now,.03);n.feedback.gain.setTargetAtTime(.24,now,.03);n.wet.gain.setTargetAtTime(pct(val("Space",58))*.5,now,.03);}
    if(id==="orbit"||id==="wide"){const depth=pct(val("Orbit",55));if(id==="wide") n.pan.pan.setTargetAtTime((val("Centre",60)-50)/100,now,.03); }
    if(id==="nightcore"||id==="vocal") { filter.type="highshelf"; filter.frequency.setTargetAtTime(4200,now,.03); filter.gain.setTargetAtTime(pct(val("Air",65))*8,now,.03); }
    if(id==="telephone"){filter.frequency.setTargetAtTime(1100+val("Body",45)*8,now,.03);filter.gain.setTargetAtTime((val("Edge",55)-50)/5,now,.03);}
    if(id==="lofi"){n.output.gain.setTargetAtTime(0.92+pct(val("Dust",24))*.08,now,.03);}
    if(id==="vinyl"){n.wet.gain.setTargetAtTime(pct(val("Crackle",12))*.12,now,.03);}
    if(id==="slowed"){n.wet.gain.setTargetAtTime(pct(val("Damping",35))*.35,now,.03);}
    if(id==="bass"){n.output.gain.setTargetAtTime(0.85+pct(val("Presence",48))*.15,now,.03);}
    if(id==="wide"){n.output.gain.setTargetAtTime(.9+pct(val("Width",72))*.1,now,.03);}
    if(id==="clean"){n.pan.pan.setTargetAtTime(val("Pan",0)/100,now,.03);}
  },[]);

  useEffect(()=>{
    if(enabled[presetId]) setupAudio().then(()=>applyPreset(presetId,values[presetId]||{})).catch((error)=>console.warn("Sonic Forge could not connect",error));
    else if(ctxRef.current) applyPreset("clean",{});
  },[presetId,values,enabled,setupAudio,applyPreset]);
  useEffect(()=>{
    let raf=0, start=0;
    const animate=(time)=>{
      if(!start) start=time;
      if(presetId==="orbit" && ctxRef.current && nodesRef.current.pan){
        const vals=values.orbit||{}, depth=(vals.Orbit??55)/100, rate=vals.Rate??.22;
        nodesRef.current.pan.pan.setTargetAtTime(Math.sin((time-start)/1000*rate*Math.PI*2)*depth,ctxRef.current.currentTime,.04);
      } else if(presetId==="wide" && nodesRef.current.pan){
        nodesRef.current.pan.pan.setTargetAtTime(((values.wide?.Centre??60)-50)/100,ctxRef.current.currentTime,.04);
      }
      raf=requestAnimationFrame(animate);
    };
    raf=requestAnimationFrame(animate);
    return ()=>cancelAnimationFrame(raf);
  },[presetId,values]);
  useEffect(()=>{
    if(!sharedAudioRef?.current) return;
    const audio=sharedAudioRef.current;
    const sync=()=>{setLoaded(Boolean(audio.currentSrc||audio.src));setPlaying(!audio.paused);};
    audio.addEventListener("loadedmetadata",sync); audio.addEventListener("play",sync); audio.addEventListener("pause",sync); audio.addEventListener("emptied",sync); sync();
    return ()=>{audio.removeEventListener("loadedmetadata",sync);audio.removeEventListener("play",sync);audio.removeEventListener("pause",sync);audio.removeEventListener("emptied",sync);};
  },[sharedAudioRef]);
  useEffect(()=>()=>{if(!sharedContextRef){try{ctxRef.current?.close();}catch{}}},[]);
  async function loadFile(file){if(embedded || !file)return;const objectUrl=URL.createObjectURL(file);setUrl(objectUrl);setFileName(file.name);setLoaded(true);setPlaying(false);if(audioRef.current){audioRef.current.pause();audioRef.current.src=objectUrl;audioRef.current.load();}}
  async function togglePlay(){if(embedded || !audioRef.current)return;if(!loaded)return;await setupAudio();if(audioRef.current.paused){await audioRef.current.play();setPlaying(true);}else{audioRef.current.pause();setPlaying(false);}}
  function selectPreset(id){setPresetId(id);setEnabled({[id]:true});}
  function togglePreset(id){const next=!enabled[id];setEnabled(next?{[id]:true}:{});if(next){setPresetId(id);}else if(presetId===id){setPresetId("clean");}}

  return <section className={`ae-page${embedded ? " ae-embedded" : ""}`}>
    <header className="ae-header"><div><p className="ae-kicker">WAVELENGTH / SIGNAL PROCESSING SUITE</p><h1>SONIC <span>FORGE</span></h1><p className="ae-sub">AUDIO EDITOR // 16 REAL-TIME CHAINS</p></div>{!embedded && <a href="/" className="ae-back">← BACK TO SYSTEM</a>}</header>
    <section className="ae-deck"><div className="ae-deck-head"><div><p className="ae-kicker">01 / SOURCE DECK</p><h2>{embedded ? "WAVELENGTH PLAYER INPUT" : (fileName||"LOAD AN AUDIO SOURCE")}</h2><p>{embedded ? "Sonic Forge is connected directly to the active player stream." : "Import an audio file to audition and process it in real time."}</p></div>{!embedded && <label className="ae-load">LOAD AUDIO<input type="file" accept="audio/*" onChange={e=>loadFile(e.target.files?.[0])}/></label>}</div>
      {!embedded && <audio ref={audioRef} onEnded={()=>setPlaying(false)} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} controls className="ae-audio"/>}
      <div className="ae-transport">{!embedded && <button onClick={togglePlay} disabled={!loaded}>{playing?"Ⅱ PAUSE":"▶ PLAY"}</button>}<span>{embedded ? (loaded ? "LINKED TO WAVELENGTH PLAYER" : "WAITING FOR PLAYER AUDIO") : (loaded?"SOURCE READY":"WAITING FOR INPUT")}</span><span className="ae-note">{embedded ? "Live effects process the same audio playing in WAVELENGTH." : "Browser audio effects are applied to imported audio."}</span></div>
    </section>
    <section className="ae-workspace">
      <div className="ae-section-head"><div><p className="ae-kicker">02 / EFFECT MATRIX</p><h2>CHOOSE YOUR SIGNAL</h2><p>Each module has its own controls. Select one to open its parameter rack.</p></div><span className="ae-count">16 / CHAINS</span></div>
      <div className="ae-grid">{PRESETS.map((p,i)=><div key={p.id} className={"ae-pad-wrap "+(enabled[p.id] ? "enabled" : "")}><button type="button" className={"ae-pad "+(presetId===p.id?"active":"")} onClick={()=>selectPreset(p.id)}><span className="ae-pad-no">{String(i+1).padStart(2,"0")} // {p.family}</span><span className="ae-pad-name">{p.name}</span><span className="ae-pad-desc">{p.desc}</span><span className="ae-pad-led"/></button><label className="ae-toggle" aria-label={`Toggle ${p.name}`}><input type="checkbox" checked={Boolean(enabled[p.id])} onChange={()=>togglePreset(p.id)}/><span className="ae-toggle-track"/><small>{enabled[p.id] ? "ON" : "OFF"}</small></label></div>)}</div>
    </section>
    <section className="ae-rack"><div className="ae-rack-title"><div><p className="ae-kicker">03 / PARAMETER RACK</p><h2>{active.name}</h2><p>{active.desc}</p></div><span className="ae-live">● {embedded ? (loaded?"PLAYER LINKED":"WAITING FOR PLAYER") : (loaded?"SOURCE LINKED":"STANDBY")}</span></div>
      <div className="ae-controls">{active.controls.map(([name,min,max,def,unit])=><label className="ae-control" key={name}><span><b>{name}</b><output>{getVal(name,def)}{unit}</output></span><input type="range" min={min} max={max} step={unit==="Hz"?.01:1} value={getVal(name,def)} onChange={e=>setVal(name,Number(e.target.value))}/><small>{name==="Speed"?"Playback rate":name==="Orbit"?"Stereo movement depth":name==="Space"?"Reverb send":name==="Feedback"?"Echo regeneration":name==="Bandwidth"?"Radio tone width":"Effect intensity"}</small></label>)}</div>
      <div className="ae-rack-foot"><button onClick={()=>setValues(v=>({...v,[presetId]:{}}))}>RESET THIS CHAIN</button><span>CHANGES APPLY LIVE WHEN A SOURCE IS LOADED</span></div>
    </section>
    <p className="ae-footnote">WAVELENGTH // SONIC FORGE. YouTube playback remains inside the official YouTube player. Browser security does not allow external iframe audio to be routed through this effects engine, so these processing chains work on imported audio files.</p>
  </section>;
}
