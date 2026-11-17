"use client";
import MusicAddonPanel from "./MusicAddonPanel";
import AudioEditorPage from "./audio-editor/page";
import SettingsPanel from "./SettingsPanel";
import SmartLibraryPanel from "./SmartLibraryPanel";
import LyricsPanel from "./LyricsPanel";
import HomeSearch from "./HomeSearch";
import VisualizerPreview from "./VisualizerPreview";
import { drawVisualizer } from "./visualizers";
function aa() {
  const [a, t] = A("HOME"),
    [n, l] = A([]),
    [c, i] = A([]),
    [o, s] = A(null),
    [h, d] = A(null),
    [m, u] = A([]),
    [E, p] = A(""),
    [T, N] = A("lossless"),
    [M, S] = A(Z[0]),
    [I, R] = A("cyan"),
    [L, C] = A(0),
    [b, f] = A(0),
    [g, O] = A(70),
    [y, P] = A(38),
    [v, U] = A(72),
    [D, H] = A(18),
    [w, V] = A("player"),
    [Y, x] = A(0),
    [G, F] = A("SYSTEM ONLINE // WAITING FOR INPUT"),
    [B, W] = A(0),
    [K, $] = A(0),
    [q, j] = A(""),
    [z, Q] = A(""),
    [X, _] = A("spotify"),
    [J, ee] = A(""),
    [re, ae] = A(0),
    [ne, le] = A(0),
    [playQueue, setPlayQueue] = A([]),
    [fxEnabled, setFxEnabled] = A([]),
    [fxLevels, setFxLevels] = A({}),
    [selectedFx, setSelectedFx] = A("LO-FI"),
    [fxParams, setFxParams] = A({ MIX: 65, RATE: 45, TONE: 55, DEPTH: 35 }),
    [eqBass, setEqBass] = A(0),
    [eqMid, setEqMid] = A(0),
    [eqTreble, setEqTreble] = A(0),
    ce = k(null),
    ie = k(null),
    oe = k(null),
    se = k(null),
    he = k(null),
    de = k(null),
    ue = k(null),
    lowEq = k(null),
    midEq = k(null),
    highEq = k(null),
    fxNodesRef = k([]),
    playQueueRef = k([]),
    Ee = k(0),
    Ve = k({}),
    pe = je(
      () => n.filter((e) => e.title.toLowerCase().includes(J.toLowerCase())),
      [n, J],
    ),
    Te = ke(async () => {
      if (!se.current) {
        const e = window.AudioContext || window.webkitAudioContext;
        if (!e) throw Error("Web Audio is unavailable in this browser.");
        ((se.current = new e()),
          (he.current = se.current.createAnalyser()),
          (he.current.fftSize = 1024),
          (he.current.smoothingTimeConstant = 0.72),
          (lowEq.current = se.current.createBiquadFilter()),
          (lowEq.current.type = "lowshelf"),
          (lowEq.current.frequency.value = 180),
          (midEq.current = se.current.createBiquadFilter()),
          (midEq.current.type = "peaking"),
          (midEq.current.frequency.value = 1000),
          (midEq.current.Q.value = 0.8),
          (highEq.current = se.current.createBiquadFilter()),
          (highEq.current.type = "highshelf"),
          (highEq.current.frequency.value = 5000),
          (lowEq.current.gain.value = eqBass),
          (midEq.current.gain.value = eqMid),
          (highEq.current.gain.value = eqTreble),
          lowEq.current.connect(midEq.current),
          midEq.current.connect(highEq.current),
          highEq.current.connect(he.current),
          he.current.connect(se.current.destination));
      }
      (await se.current.resume(),
        ce.current &&
          !ue.current &&
          ((ue.current = se.current.createMediaElementSource(ce.current)),
          ue.current.connect(lowEq.current)));
    }, []),
    Ne = async () => {
      t("PLAYER");
    },
    Pe = ke(async (track, provider, quality) => {
      if (!ce.current)
        throw Error("The shared WAVELENGTH audio engine is unavailable.");
      try {
        let stream;
        let streamLabel = ({ lbitches: "L-BITCHES", audius: "AUDIUS", jamendo: "JAMENDO" })[provider] || "JIOSAAVN";
        if (provider === "qobuz") {
          const resolved = await fetch(
            "/api/qobuz/stream?trackId=" +
              encodeURIComponent(track.id) +
              "&quality=" +
              (quality === "mp3" ? "5" : "27"),
            { cache: "no-store" },
          );
          const payload = await resolved.json();
          if (!resolved.ok || !payload.streamUrl)
            throw Error(payload.error || "Qobuz could not resolve this track.");
          stream = payload.streamUrl;
          streamLabel = "QOBUZ";
        } else {
          stream =
            "/api/addons/stream?provider=" +
            encodeURIComponent(provider) +
            "&id=" +
            encodeURIComponent(track.id) +
            "&quality=" +
            encodeURIComponent(quality);
        }
        ce.current.pause();
        ce.current.crossOrigin = "anonymous";
        ce.current.src = stream;
        ce.current.load();
        await Te();
        await ce.current.play();
        d({ ...track, provider, quality });
        s(null);
        $(1);
        F(streamLabel + " // " + quality.toUpperCase() + " STREAM CONNECTED");
      } catch (error) {
        throw Error(
          error instanceof Error ? error.message : "Playback failed.",
        );
      }
    }, []),
    Me = async (e) => {
      if (ce.current)
        try {
          ((ce.current.crossOrigin = "anonymous"),
            (ce.current.src = e.url),
            ce.current.load(),
            await Te(),
            await ce.current.play(),
            d(e),
            s(null),
            $(1),
            F("LOCAL AUDIO // ANALYSER CONNECTED"));
        } catch (e) {
          F(e instanceof Error ? e.message : "Playback failed");
        }
    },
    Se = async () => {
      try {
        if (Y)
          return (
            de.current?.getTracks().forEach((e) => e.stop()),
            (de.current = null),
            x(0),
            V("player"),
            void F("MICROPHONE RELEASED")
          );
        if (!navigator.mediaDevices?.getUserMedia)
          throw Error(
            "Microphone input is unavailable. Use HTTPS and a supported browser.",
          );
        const e = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: 0,
            noiseSuppression: 0,
            autoGainControl: 0,
          },
          video: 0,
        });
        if (((de.current = e), !se.current)) {
          const e = window.AudioContext || window.webkitAudioContext;
          ((se.current = new e()),
            (he.current = se.current.createAnalyser()),
            (he.current.fftSize = 1024),
            (he.current.smoothingTimeConstant = 0.72));
        }
        (await se.current.resume(),
          se.current.createMediaStreamSource(e).connect(he.current),
          V("mic"),
          x(1),
          F("LIVE MIC // ROOM AUDIO CAPTURE ACTIVE"));
      } catch (e) {
        F(e instanceof Error ? e.message : "Microphone permission denied");
      }
    };
  (me(
    () => () => {
      (de.current?.getTracks().forEach((e) => e.stop()),
        cancelAnimationFrame(Ee.current));
    },
    [],
  ),
    me(() => {
      // The audio element lives inside the conditional PLAYER page. Rebind
      // whenever navigation changes so iOS receives metadata and seek events.
      const audio = ce.current;
      if (!audio) return;
      const syncTime = () => ae(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
      const syncDuration = () => le(Number.isFinite(audio.duration) ? audio.duration : 0);
      const resetPlayback = () => { $(0); syncTime(); };
      const syncAll = () => { syncDuration(); syncTime(); };
      audio.addEventListener("timeupdate", syncTime);
      audio.addEventListener("loadedmetadata", syncAll);
      audio.addEventListener("durationchange", syncDuration);
      audio.addEventListener("canplay", syncAll);
      audio.addEventListener("seeked", syncTime);
      audio.addEventListener("ended", resetPlayback);
      audio.addEventListener("emptied", () => le(0));
      syncAll();
      return () => {
        audio.removeEventListener("timeupdate", syncTime);
        audio.removeEventListener("loadedmetadata", syncAll);
        audio.removeEventListener("durationchange", syncDuration);
        audio.removeEventListener("canplay", syncAll);
        audio.removeEventListener("seeked", syncTime);
        audio.removeEventListener("ended", resetPlayback);
      };
    }, [a]));
  me(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const track = h || o;
    try {
      navigator.mediaSession.metadata = track ? new MediaMetadata({
        title: track.title || "WAVELENGTH",
        artist: track.artist || "Unknown artist",
        album: track.album || "WAVELENGTH",
        artwork: (track.artworkURL || track.artwork || track.image) ? [
          { src: track.artworkURL || track.artwork || track.image, sizes: "512x512", type: "image/jpeg" }
        ] : []
      }) : null;
      navigator.mediaSession.playbackState = K ? "playing" : "paused";
      navigator.mediaSession.setActionHandler("play", () => ce.current?.play().catch(() => {}));
      navigator.mediaSession.setActionHandler("pause", () => ce.current?.pause());
      navigator.mediaSession.setActionHandler("seekbackward", (details) => {
        if (ce.current) ce.current.currentTime = Math.max(0, ce.current.currentTime - (details.seekOffset || 10));
      });
      navigator.mediaSession.setActionHandler("seekforward", (details) => {
        if (ce.current && Number.isFinite(ce.current.duration)) ce.current.currentTime = Math.min(ce.current.duration, ce.current.currentTime + (details.seekOffset || 10));
      });
    } catch {}
  }, [h, o, K]);
  me(() => {
    // Keep the actual Web Audio filters in sync with the EQ controls,
    // including values changed before the first track starts.
    if (!se.current) return;
    const now = se.current.currentTime;
    if (lowEq.current) lowEq.current.gain.setTargetAtTime(eqBass, now, 0.015);
    if (midEq.current) midEq.current.gain.setTargetAtTime(eqMid, now, 0.015);
    if (highEq.current) highEq.current.gain.setTargetAtTime(eqTreble, now, 0.015);
  }, [eqBass, eqMid, eqTreble]);
  const Ie = ke(() => {
    const nowMs = performance.now();
    const state = Ve.current[M] || (Ve.current[M] = {});
    if (nowMs - (state.lastFrameAt || 0) < 32) {
      return void (Ee.current = requestAnimationFrame(Ie));
    }
    state.lastFrameAt = nowMs;
    const canvas = oe.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(devicePixelRatio || 1, 2);
    const width = bounds.width;
    const height = bounds.height;
    if (!width || !height) return void (Ee.current = requestAnimationFrame(Ie));
    const pixelWidth = Math.round(width * pixelRatio);
    const pixelHeight = Math.round(height * pixelRatio);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.filter = "none";
    ctx.clearRect(0, 0, width, height);
    const analyser = he.current;
    const spectrumSize = analyser?.frequencyBinCount || 512;
    const waveformSize = analyser?.fftSize || 512;
    const spectrum = state.spectrum?.length === spectrumSize
      ? state.spectrum
      : (state.spectrum = new Uint8Array(spectrumSize));
    const waveform = state.waveform?.length === waveformSize
      ? state.waveform
      : (state.waveform = new Uint8Array(waveformSize));
    if (analyser) {
      analyser.getByteFrequencyData(spectrum);
      analyser.getByteTimeDomainData(waveform);
    } else {
      spectrum.fill(0);
      waveform.fill(128);
    }
    const time = nowMs / 1000;
    drawVisualizer(ctx, { width, height, name: M, time, spectrum, waveform, state });
    Ee.current = requestAnimationFrame(Ie);
  }, [I, M, a]);
  me(
    () => (
      cancelAnimationFrame(Ee.current),
      (Ee.current = requestAnimationFrame(Ie)),
      () => cancelAnimationFrame(Ee.current)
    ),
    [Ie],
  );
  me(() => {
    if (!se.current || !highEq.current || !he.current) return;
    const ctx = se.current;
    const nodes = [];
    const oscillators = [];
    const mix = Math.max(0.05, Math.min(1, (fxParams.MIX ?? 65) / 100));
    const rate = Math.max(0, Math.min(1, (fxParams.RATE ?? 45) / 100));
    const tone = Math.max(0, Math.min(1, (fxParams.TONE ?? 55) / 100));
    const depth = Math.max(0, Math.min(1, (fxParams.DEPTH ?? 35) / 100));
    if (ce.current) ce.current.playbackRate = 1;
    const curve = (amount, steps = 0) => {
      const size = 2048;
      const values = new Float32Array(size);
      for (let i = 0; i < size; i++) {
        const x = (i * 2) / size - 1;
        values[i] = steps
          ? Math.round(x * steps) / steps
          : ((1 + amount) * x) / (1 + amount * Math.abs(x));
      }
      return values;
    };
    const add = (node) => { nodes.push(node); return node; };
    try {
      highEq.current.disconnect();
      let previous = highEq.current;
      for (const fx of fxEnabled) {
        const level = Math.max(0, Math.min(100, fxLevels[fx] ?? 50)) / 100;
        let node;
        if (["DISTORTION", "BITCRUSH", "SATURATION", "VINYL"].includes(fx)) {
          node = add(ctx.createWaveShaper());
          node.curve = curve(
            fx === "DISTORTION" ? 1 + level * 35 :
            fx === "BITCRUSH" ? 0.1 + level * 3 :
            fx === "VINYL" ? 1 + level * 5 : 1 + level * 12,
            fx === "BITCRUSH" ? Math.max(2, Math.round(32 - level * 29)) : 0
          );
          node.oversample = "4x";
        } else if (fx === "REVERB") {
          node = add(ctx.createConvolver());
          const seconds = 0.35 + level * 1.65;
          const impulse = ctx.createBuffer(2, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
          for (let channel = 0; channel < 2; channel++) {
            const data = impulse.getChannelData(channel);
            for (let i = 0; i < data.length; i++)
              data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.2);
          }
          node.buffer = impulse;
        } else if (["DELAY", "ECHO"].includes(fx)) {
          node = add(ctx.createDelay(1.5));
          node.delayTime.value = fx === "ECHO" ? 0.12 + rate * 0.55 : 0.04 + rate * 0.35;
        } else if (["CHORUS", "FLANGER"].includes(fx)) {
          node = add(ctx.createDelay(0.08));
          node.delayTime.value = fx === "CHORUS" ? 0.018 : 0.004;
          const lfo = ctx.createOscillator();
          const lfoDepth = ctx.createGain();
          lfo.frequency.value = fx === "CHORUS" ? 0.15 + rate * 1.8 : 0.05 + rate * 0.7;
          lfoDepth.gain.value = fx === "CHORUS" ? 0.002 + depth * 0.018 : 0.0005 + depth * 0.006;
          lfo.connect(lfoDepth).connect(node.delayTime);
          lfo.start();
          oscillators.push(lfo);
          nodes.push(lfoDepth);
        } else if (fx === "PHASER") {
          node = add(ctx.createBiquadFilter());
          node.type = "allpass";
          node.frequency.value = 250 + tone * 2600;
          node.Q.value = 0.8 + level * 7;
        } else if (fx === "TREMOLO") {
          node = add(ctx.createGain());
          node.gain.value = 0.72 + (1 - level) * 0.28;
          const lfo = ctx.createOscillator();
          const lfoDepth = ctx.createGain();
          lfo.frequency.value = 1 + rate * 11;
          lfoDepth.gain.value = 0.08 + depth * 0.42;
          lfo.connect(lfoDepth).connect(node.gain);
          lfo.start();
          oscillators.push(lfo);
          nodes.push(lfoDepth);
        } else if (fx === "FILTER" || fx === "LO-FI" || fx === "NOISE" || fx === "PITCH") {
          node = add(ctx.createBiquadFilter());
          node.type = fx === "FILTER" ? "lowpass" : fx === "LO-FI" ? "lowpass" : fx === "PITCH" ? "highpass" : "highpass";
          node.frequency.value = fx === "LO-FI" ? 18000 - tone * 15500 : fx === "FILTER" ? 18000 - tone * 17000 : fx === "NOISE" ? 15000 - level * 9000 : 30 + tone * 180;
          node.Q.value = fx === "FILTER" ? 0.7 + depth * 8 : 0.7;
          if (fx === "PITCH" && ce.current) ce.current.playbackRate = 0.75 + level * 0.5;
          if (fx === "NOISE") {
            const noise = ctx.createBufferSource();
            const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
            const samples = buffer.getChannelData(0);
            for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
            noise.buffer = buffer;
            noise.loop = true;
            const noiseGain = add(ctx.createGain());
            noiseGain.gain.value = level * 0.018;
            noise.connect(noiseGain).connect(he.current);
            noise.start();
            oscillators.push(noise);
          }
        } else if (fx === "STEREO") {
          node = add(ctx.createStereoPanner());
          node.pan.value = (level - 0.5) * 1.6;
        }
        if (node) {
          const wet = add(ctx.createGain());
          wet.gain.value = mix;
          previous.connect(node);
          node.connect(wet);
          previous = wet;
        }
      }
      previous.connect(he.current);
      fxNodesRef.current = [...nodes, ...oscillators];
    } catch (error) {
      console.warn("WAVELENGTH FX chain could not be rebuilt", error);
      try { highEq.current.connect(he.current); } catch {}
    }
    return () => {
      try { highEq.current?.disconnect(); } catch {}
      for (const node of fxNodesRef.current) {
        try { node.disconnect(); } catch {}
        try { node.stop?.(); } catch {}
      }
      fxNodesRef.current = [];
      if (ce.current) ce.current.playbackRate = 1;
    };
  }, [fxEnabled, fxLevels, fxParams]);
  me(() => {
    const track = h;
    if (!track || track.artworkURL || track.artwork || track.image) return;
    const query = [track.title, track.artist].filter(Boolean).join(" ").trim();
    if (!query) return;
    let cancelled = false;
    const trackId = String(track.id || track.url || track.title);
    fetch(`/api/addons/search?provider=jiosaavn&quality=high&q=${encodeURIComponent(query)}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Artwork lookup unavailable")))
      .then((data) => {
        if (cancelled) return;
        const candidates = Array.isArray(data.tracks) ? data.tracks : [];
        const normalize = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
        const title = normalize(track.title);
        const artist = normalize(track.artist);
        const match = candidates.find((candidate) => candidate.artworkURL && normalize(candidate.title) === title && (!artist || normalize(candidate.artist).includes(artist)))
          || candidates.find((candidate) => candidate.artworkURL && title && (normalize(candidate.title).includes(title) || title.includes(normalize(candidate.title))))
          || candidates.find((candidate) => candidate.artworkURL);
        if (!match?.artworkURL) return;
        d((current) => current && String(current.id || current.url || current.title) === trackId
          ? { ...current, artworkURL: match.artworkURL, artwork: match.artworkURL, album: current.album || match.album || "" }
          : current);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [h]);
  playQueueRef.current = playQueue;
  me(() => {
    const add = (event) => setPlayQueue((items) => [...items, event.detail].filter(Boolean));
    const next = (event) => setPlayQueue((items) => [event.detail, ...items].filter(Boolean));
    window.addEventListener("wavelength-queue-add", add);
    window.addEventListener("wavelength-play-next", next);
    return () => { window.removeEventListener("wavelength-queue-add", add); window.removeEventListener("wavelength-play-next", next); };
  }, []);
  const Re = h?.title || o?.title || "NO TRACK SELECTED",
    Le = h?.id || o?.id || "",
    Ce = "";
  const likesHydrated = k(false);
  me(() => {
    try { const saved = JSON.parse(localStorage.getItem("wavelength-liked-song-ids") || "[]"); if (Array.isArray(saved)) u(saved); } catch {}
    likesHydrated.current = true;
  }, []);
  me(() => { if (likesHydrated.current) { try { localStorage.setItem("wavelength-liked-song-ids", JSON.stringify(m)); } catch {} } }, [m]);
  me(() => {
    const track = h || o;
    if (!track?.id) return;
    try {
      const key = "wavelength-play-history";
      const history = JSON.parse(localStorage.getItem(key) || "[]");
      const item = { id: String(track.id), title: track.title || "Untitled track", artist: track.artist || "Unknown artist", album: track.album || "", artworkURL: track.artworkURL || track.artwork || track.image || "", provider: track.provider || (h ? "streaming" : "local"), playedAt: Date.now() };
      localStorage.setItem(key, JSON.stringify([item, ...history.filter((entry) => String(entry.id) !== item.id)].slice(0, 100)));
    } catch {}
  }, [h, o]);
  return r("div", {
    className: "crt",
    "data-tone": I,
    "data-crt": L ? "on" : "off",
    style: {
      "--crt-intensity": g / 100,
      "--crt-grain": y / 100,
      "--crt-curve": v / 100,
      "--crt-flicker": D / 100,
    },
    children: [
      // Keep one shared media element mounted for the entire app. If this lived
      // inside the conditional PLAYER view, switching views detached playback,
      // which is especially disruptive to iOS Safari background audio.
      e("audio", {
        ref: ce,
        crossOrigin: "anonymous",
        preload: "auto",
        playsInline: true,
        style: { display: "none" },
        onPlay: () => $(1),
        onPause: () => $(0),
        onEnded: () => { const [nextTrack, ...remaining] = playQueueRef.current; if (nextTrack) { setPlayQueue(remaining); Pe(nextTrack, nextTrack.provider || "jiosaavn", nextTrack.quality || "high"); } },
      }),
      r("div", {
        className: "topline",
        children: [
          e("span", { children: "WAVELENGTH // AUDIO VISUAL SYSTEM" }),
          e("i", {}),
          e("span", { children: K ? "SIGNAL ACTIVE" : "STANDBY" }),
          r("button", {
            className: L ? "active" : "",
            onClick: () => C((e) => !e),
            children: ["CRT ", L ? "LIVE ●" : "OFF ○"],
          }),
          e("button", { onClick: () => f((e) => !e), children: "TUNING" }),
        ],
      }),
      b &&
        r("div", {
          className: "crtpanel",
          children: [
            e("b", { children: "CRT CALIBRATION" }),
            [
              ["INTENSITY", g, O],
              ["GRAIN", y, P],
              ["CURVATURE", v, U],
              ["FLICKER", D, H],
            ].map(([a, t, n]) =>
              r(
                "label",
                {
                  children: [
                    a,
                    e("input", {
                      type: "range",
                      min: "0",
                      max: "100",
                      value: t,
                      onChange: (e) => n(+e.target.value),
                    }),
                    t,
                    "%",
                  ],
                },
                a,
              ),
            ),
            r("div", {
              className: "tone-picker",
              children: [
                e("b", { children: "PHOSPHOR COLOR" }),
                r("div", {
                  className: "tone-options",
                  children: [
                    ["green", "PHOSPHOR"],
                    ["blue", "ICE BLUE"],
                    ["cyan", "CYAN"],
                    ["violet", "VIOLET"],
                    ["pink", "PINK"],
                    ["amber", "AMBER"],
                  ].map(([tone, label]) =>
                    e(
                      "button",
                      {
                        type: "button",
                        className: I === tone ? "active" : "",
                        onClick: () => R(tone),
                        children: [
                          e("i", {
                            className: "tone-dot",
                            "data-tone-dot": tone,
                          }),
                          label,
                        ],
                      },
                      tone,
                    ),
                  ),
                }),
              ],
            }),
          ],
        }),
      r("div", {
        className: "app",
        children: [
          r("aside", {
            className: "nav",
            children: [
              r("div", {
                className: "logo",
                children: ["W", e("span", { children: "/" })],
              }),
              e("small", { children: "MAINFRAME / 01" }),
              e("div", {
                className: "navlinks",
                children: ze.map((n, l) =>
                  r(
                    "button",
                    {
                      className: a === n ? "active" : "",
                      onClick: () =>
                        "PLAYER" === n ? t("PLAYER") : t(n),
                      children: [
                        e("i", { children: (l + 1 + "").padStart(2, "0") }),
                        n,
                      ],
                    },
                    n,
                  ),
                ),
              }),
              r("div", {
                className: "navfoot",
                children: [
                  e("small", { children: "ENGINE STATUS" }),
                  r("p", { children: ["● ", K ? "PLAYING" : "READY"] }),
                  e("small", { children: "V 2.1 / PHOSPHOR" }),
                ],
              }),
            ],
          }),
          r("main", {
            className: "main",
            children: [
              r("div", {
                className: "heading",
                children: [
                  r("div", {
                    children: [
                      r("small", { children: ["WAVELENGTH / ", a] }),
                      e("h1", {
                        children: "HOME" === a ? "SIGNAL ARCHIVE" : a,
                      }),
                    ],
                  }),
                  e("span", { className: "micro", children: G }),
                ],
              }),
              "HOME" === a &&
                r("section", {
                  className: "panel homegrid",
                  children: [
                    r("div", {
                      children: [
                        e(HomeSearch, { onPlay: Pe, onOpenPlayer: () => t("PLAYER") }),
                        e("small", { children: "WELCOME TO THE SIGNAL" }),
                        r("h2", {
                          children: [
                            "LISTEN BEYOND",
                            e("br", {}),
                            "THE FREQUENCY.",
                          ],
                        }),
                        e("p", {
                          className: "notice",
                          children:
                            "Streaming, audio-reactive instruments and modular sound.",
                        }),
                      ],
                    }),
                    r("div", {
                      className: "homeart",
                      children: [
                        e("canvas", { ref: oe }),
                        e("span", { children: "LIVE SIGNAL / 001" }),
                      ],
                    }),
                    r("div", {
                      className: "homeactions",
                      children: [
                        e("button", {
                          onClick: () => t("VISUALIZER"),
                          children: "VISUAL INSTRUMENTS",
                        }),
                        r("button", {
                          onClick: () => t("LIBRARY"),
                          children: ["YOUR LIBRARY / ", n.length + c.length],
                        }),
                        e("button", {
                          onClick: () => t("PLAYER"),
                          children: "MUSIC PLAYER ↗",
                        }),
                      ],
                    }),
                  ],
                }),
              "SETTINGS" === a && e(SettingsPanel, {}),
              "PLAYER" === a &&
                r("section", {
                  className: "panel legacy-player",
                  children: [
                    r("div", {
                      className: "panelhead",
                      children: [
                        e("h2", { children: "STREAMING DECK" }),
                        e("span", {
                          children: "MUSIC ADDONS / EQUALISER",
                        }),
                      ],
                    }),
                    r("div", {
                      className: "playergrid",
                      children: [
                        r("div", {
                          className: "artwork",
                          children: [
                            (h?.artworkURL || o?.artworkURL) && e("img", {
                              className: "artwork-image",
                              src: h?.artworkURL || o?.artworkURL,
                              alt: `${h?.title || o?.title || "Track"} album artwork`,
                              loading: "eager",
                              decoding: "async",
                              referrerPolicy: "no-referrer",
                              onError: (event) => {
                                event.currentTarget.style.display = "none";
                                const fallback = event.currentTarget.parentElement?.querySelector(".artwork-fallback");
                                if (fallback) fallback.style.display = "grid";
                              },
                            }),
                            e("canvas", { ref: oe }),
                            e("b", {
                              className: "artwork-fallback",
                              style: { display: h?.artworkURL || o?.artworkURL ? "none" : "grid" },
                              children: "W/",
                            }),
                          ],
                        }),
                        r("div", {
                          className: "playerinfo",
                          children: [
                            e("small", { children: "NOW PLAYING" }),
                            e("h2", { children: Re }),
                            e("p", {
                              className: "micro",
                              children:
                                o?.artist ||
                                (h
                                  ? "LOCAL AUDIO"
                                  : "CHOOSE A STREAMING SOURCE"),
                            }),
                            r("div", {
                              className: "seek",
                              children: [
                                e("span", { children: te(re) }),
                                e("input", {
                                  type: "range",
                                  min: "0",
                                  max: ne || 0,
                                  value: Math.min(re, ne || 0),
                                  step: "0.1",
                                  disabled: !Number.isFinite(ne) || ne <= 0,
                                  onChange: (event) => {
                                    const audio = ce.current;
                                    const target = Number(event.target.value);
                                    if (audio && Number.isFinite(target) && Number.isFinite(audio.duration) && audio.duration > 0) {
                                      audio.currentTime = Math.max(0, Math.min(target, audio.duration));
                                      ae(audio.currentTime);
                                    }
                                  },
                                }),
                                e("span", { children: te(ne) }),
                              ],
                            }),
                            r("div", {
                              className: "transport",
                              children: [
                                e("button", {
                                  onClick: () => {
                                    ce.current &&
                                      (ce.current.currentTime = Math.max(
                                        0,
                                        ce.current.currentTime - 10,
                                      ));
                                  },
                                  children: "↶10",
                                }),
                                e("button", {
                                  className: "play",
                                  onClick: async () => {
                                    if (ce.current)
                                      try {
                                        (await Te(),
                                          K
                                            ? ce.current.pause()
                                            : await ce.current.play());
                                      } catch (e) {
                                        F(
                                          e instanceof Error
                                            ? e.message
                                            : "Playback error",
                                        );
                                      }
                                  },
                                  children: K ? "Ⅱ" : "▶",
                                }),
                                e("button", {
                                  onClick: () => {
                                    ce.current &&
                                      (ce.current.currentTime = Math.min(
                                        ne,
                                        ce.current.currentTime + 10,
                                      ));
                                  },
                                  children: "10↷",
                                }),
                                r("button", {
                                  onClick: () => {
                                    if (!Le) return;
                                    const wasLiked = m.includes(Le);
                                    u((e) => wasLiked ? e.filter((id) => id !== Le) : [...e, Le]);
                                    try {
                                      const key = "wavelength-liked-tracks";
                                      const saved = JSON.parse(localStorage.getItem(key) || "[]");
                                      const track = h || o || {};
                                      const next = wasLiked ? saved.filter((item) => String(item.id) !== String(Le)) : [{ id: String(Le), title: track.title || Re, artist: track.artist || "Unknown artist", album: track.album || "", artworkURL: track.artworkURL || track.artwork || track.image || "", provider: track.provider || (h ? "streaming" : "local"), likedAt: Date.now() }, ...saved.filter((item) => String(item.id) !== String(Le))];
                                      localStorage.setItem(key, JSON.stringify(next));
                                    } catch {}
                                  },
                                  children: [
                                    Le && m.includes(Le) ? "♥" : "♡",
                                    " ",
                                    "LIKE",
                                  ],
                                }),
                              ],
                            }),
                            r("div", {
                              className: "signalmeta",
                              children: [
                                e("span", {
                                  children: o?.quality || "LOCAL / PLAYER",
                                }),
                                e("span", {
                                  children: o?.format || "AUDIO INPUT",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    e(MusicAddonPanel, { onPlay: Pe }),
                    e(LyricsPanel, { track: h || o, currentTime: re }),
                    r("section", { className: "panel queue-panel", children: [r("div", { className: "panelhead", children: [e("h2", { children: "UP NEXT / " + playQueue.length }), e("button", { onClick: () => setPlayQueue([]), disabled: !playQueue.length, children: "CLEAR QUEUE" })] }), playQueue.length ? playQueue.map((track,index) => r("div", { className: "queue-row", key: String(track.id || track.title) + index, children: [e("span", { children: String(index + 1).padStart(2,"0") }), e("b", { children: track.title || "Untitled track" }), e("small", { children: track.artist || "Unknown artist" }), e("button", { onClick: () => { const selected=playQueue[index]; setPlayQueue(items=>items.filter((_,i)=>i!==index)); if(selected) Pe(selected,selected.provider||"jiosaavn",selected.quality||"high"); }, children: "PLAY" })] }, index)) : e("p", { className: "saved-empty", children: "Your playback queue is empty." })] }),
                    r("div", {
                      className: "sourcebox",
                      children: [
                        e("b", { children: "03 / LOCAL FILES" }),
                        e("button", {
                          onClick: () => ie.current?.click(),
                          children: "＋ IMPORT AUDIO",
                        }),
                        e("input", {
                          ref: ie,
                          hidden: 1,
                          type: "file",
                          accept: "audio/*",
                          multiple: 1,
                          onChange: (e) =>
                            ((e) => {
                              if (!e) return;
                              const r = Array.from(e)
                                .filter((e) => e.type.startsWith("audio/"))
                                .map((e) => ({
                                  id: crypto.randomUUID(),
                                  title: e.name.replace(/\.[^.]+$/, ""),
                                  url: URL.createObjectURL(e),
                                }));
                              (l((e) => [...e, ...r]),
                                F(r.length + " LOCAL TRACKS ADDED"));
                            })(e.target.files),
                        }),
                        n.map((a) =>
                          r(
                            "button",
                            {
                              className: "resultrow",
                              onClick: () => Me(a),
                              children: [
                                r("span", {
                                  className: "resulttext",
                                  children: [
                                    e("b", { children: a.title }),
                                    e("small", { children: "LOCAL FILE" }),
                                  ],
                                }),
                                e("span", { children: "▶" }),
                              ],
                            },
                            a.id,
                          ),
                        ),
                      ],
                    }),
                  ],
                }),
              "VISUALIZER" === a &&
                r("section", {
                  className: "panel",
                  children: [
                    r("div", {
                      className: "panelhead",
                      children: [
                        e("h2", { children: "LIVE VISUAL INSTRUMENT" }),
                        r("span", {
                          children: [
                            M,
                            " / ",
                            "mic" === w ? "MIC INPUT" : "PLAYER INPUT",
                          ],
                        }),
                      ],
                    }),
                    r("div", {
                      className: "scope",
                      children: [
                        e("canvas", { ref: oe }),
                        r("span", {
                          className: "corner",
                          children: [
                            "INSTRUMENT /",
                            " ",
                            (Z.indexOf(M) + 1 + "").padStart(2, "0"),
                            e("br", {}),
                            "PHOSPHOR RENDER",
                          ],
                        }),
                        r("span", {
                          className: "corner bottom",
                          children: [
                            "INPUT // ",
                            "mic" === w ? "MICROPHONE" : "PLAYER AUDIO",
                          ],
                        }),
                      ],
                    }),
                    r("div", {
                      className: "livecontrols",
                      children: [
                        r("div", {
                          className: "inputmode",
                          children: [
                            e("button", {
                              className: "player" === w ? "active" : "",
                              onClick: () => {
                                (V("player"), Y && Se());
                              },
                              children: "PLAYER AUDIO",
                            }),
                            r("button", {
                              className: "mic" === w ? "active" : "",
                              onClick: () => {
                                (V("mic"), Y || Se());
                              },
                              children: ["LIVE LISTEN / MIC ", Y ? "●" : "○"],
                            }),
                          ],
                        }),
                        r("label", {
                          children: [
                            "INSTRUMENT",
                            e("select", {
                              value: M,
                              onChange: (e) => S(e.target.value),
                              children: Z.map((r) =>
                                e("option", { children: r }, r),
                              ),
                            }),
                          ],
                        }),
                        r("button", {
                          onClick: () =>
                            R((e) => ("green" === e ? "blue" : "green")),
                          children: ["PHOSPHOR / ", I.toUpperCase()],
                        }),
                      ],
                    }),
                    e("p", {
                      className: "notice",
                      children:
                        "Mic mode listens to room audio. iOS blocks other apps audio. Player mode analyses in-app playback.",
                    }),
                    e("h3", {
                      children: ["VISUAL LIBRARY / ", Z.length, " AUDIO-REACTIVE INSTRUMENTS"],
                    }),
                    e("div", {
                      className: "visualtiles",
                      children: Z.map((a, t) =>
                        r(
                          "button",
                          {
                            className: M === a ? "active" : "",
                            onClick: () => S(a),
                            children: [
                              e("span", {
                                className: "thumb",
                                children: e(VisualizerPreview, { name: a }),
                              }),
                              e("strong", { children: a }),
                              r("small", {
                                children: [
                                  "INSTRUMENT / ",
                                  (t + 1 + "").padStart(2, "0"),
                                ],
                              }),
                            ],
                          },
                          a,
                        ),
                      ),
                    }),
                  ],
                }),
              "LIBRARY" === a &&
                e(SmartLibraryPanel, { onPlay: Pe, liked: (() => { try { return JSON.parse(localStorage.getItem("wavelength-liked-tracks") || "[]"); } catch { return []; } })(), history: (() => { try { return JSON.parse(localStorage.getItem("wavelength-play-history") || "[]"); } catch { return []; } })() }),
              "LIBRARY" === a &&
                r("section", {
                  className: "panel",
                  children: [
                    r("div", {
                      className: "panelhead",
                      children: [
                        e("h2", { children: "YOUR COLLECTION" }),
                        e("button", {
                          onClick: () => ie.current?.click(),
                          children: "＋ IMPORT AUDIO",
                        }),
                      ],
                    }),
                    r("div", {
                      className: "librarytabs",
                      children: [
                        r("button", {
                          className: J ? "" : "active",
                          onClick: () => ee(""),
                          children: ["ALL LOCAL / ", n.length],
                        }),
                        r("button", {
                          onClick: () => ee("♥ liked"),
                          children: ["LIKED SONGS / ", m.length],
                        }),
                      ],
                    }),
                    e("input", {
                      className: "fullinput",
                      placeholder: "SEARCH LOCAL LIBRARY",
                      value: "♥ liked" === J ? "" : J,
                      onChange: (e) => ee(e.target.value),
                    }),
                    ("♥ liked" === J
                      ? n.filter((e) => m.includes(e.id))
                      : pe
                    ).map((a) =>
                      r(
                        "button",
                        {
                          className: "resultrow",
                          onClick: () => Me(a),
                          children: [
                            r("span", {
                              className: "resulttext",
                              children: [
                                e("b", { children: a.title }),
                                e("small", { children: "LOCAL AUDIO" }),
                              ],
                            }),
                            e("span", {
                              children: m.includes(a.id) ? "♥" : "▶",
                            }),
                          ],
                        },
                        a.id,
                      ),
                    ),
                    !n.length &&
                      e("p", {
                        className: "empty",
                        children: "IMPORT AUDIO OR OPEN THE MUSIC ADDON DECK.",
                      }),
                  ],
                }),
              "FREQUENCY LAB" === a &&
                r("section", {
                  className: "panel fx-lab",
                  children: [
                    r("div", {
                      className: "panelhead",
                      children: [
                        e("h2", { children: "FREQUENCY LAB" }),
                        e("span", { children: "16 MODULE FX MATRIX" }),
                      ],
                    }),
                    e("p", {
                      className: "notice",
                      children:
                        "TOGGLE MODULES · SELECT TO EDIT PARAMETERS · STACK EFFECTS",
                    }),
                    r("div", {
                      className: "eq-console",
                      children: [
                        r("div", {
                          className: "panelhead",
                          children: [
                            e("h3", { children: "MASTER EQUALIZER" }),
                            e("span", {
                              children: "LIVE AUDIO PROCESSING / ±12 DB",
                            }),
                          ],
                        }),
                        r("div", {
                          className: "eq-sliders",
                          children: [
                            r("label", {
                              className: "eq-band",
                              children: [
                                e("span", { children: "BASS" }),
                                e("b", {
                                  children:
                                    (eqBass > 0 ? "+" : "") + eqBass + " dB",
                                }),
                                e("input", {
                                  type: "range",
                                  min: -12,
                                  max: 12,
                                  step: 1,
                                  value: eqBass,
                                  onChange: (ev) => {
                                    const v = Number(ev.target.value);
                                    setEqBass(v);
                                    if (lowEq.current && se.current)
                                      lowEq.current.gain.setTargetAtTime(
                                        v,
                                        se.current.currentTime,
                                        0.015,
                                      );
                                  },
                                }),
                              ],
                            }),
                            r("label", {
                              className: "eq-band",
                              children: [
                                e("span", { children: "MID" }),
                                e("b", {
                                  children:
                                    (eqMid > 0 ? "+" : "") + eqMid + " dB",
                                }),
                                e("input", {
                                  type: "range",
                                  min: -12,
                                  max: 12,
                                  step: 1,
                                  value: eqMid,
                                  onChange: (ev) => {
                                    const v = Number(ev.target.value);
                                    setEqMid(v);
                                    if (midEq.current && se.current)
                                      midEq.current.gain.setTargetAtTime(
                                        v,
                                        se.current.currentTime,
                                        0.015,
                                      );
                                  },
                                }),
                              ],
                            }),
                            r("label", {
                              className: "eq-band",
                              children: [
                                e("span", { children: "TREBLE" }),
                                e("b", {
                                  children:
                                    (eqTreble > 0 ? "+" : "") +
                                    eqTreble +
                                    " dB",
                                }),
                                e("input", {
                                  type: "range",
                                  min: -12,
                                  max: 12,
                                  step: 1,
                                  value: eqTreble,
                                  onChange: (ev) => {
                                    const v = Number(ev.target.value);
                                    setEqTreble(v);
                                    if (highEq.current && se.current)
                                      highEq.current.gain.setTargetAtTime(
                                        v,
                                        se.current.currentTime,
                                        0.015,
                                      );
                                  },
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    r("div", {
                      className: "fx-grid",
                      children: [
                        "REVERB",
                        "DELAY",
                        "DISTORTION",
                        "LO-FI",
                        "BITCRUSH",
                        "CHORUS",
                        "FLANGER",
                        "PHASER",
                        "TREMOLO",
                        "FILTER",
                        "ECHO",
                        "SATURATION",
                        "STEREO",
                        "VINYL",
                        "NOISE",
                        "PITCH",
                      ].map((fx) =>
                        r(
                          "div",
                          {
                            className:
                              "fx-tile fx-knob-tile " +
                              (fxEnabled.includes(fx) ? "is-on" : ""),
                            children: [
                              r("div", {
                                className: "fx-tile-top",
                                children: [
                                  e("button", {
                                    type: "button",
                                    className:
                                      "fx-led-toggle " +
                                      (fxEnabled.includes(fx) ? "led-on" : ""),
                                    "aria-label":
                                      (fxEnabled.includes(fx)
                                        ? "Disable "
                                        : "Enable ") + fx,
                                    onClick: () =>
                                      setFxEnabled((old) =>
                                        old.includes(fx)
                                          ? old.filter((x) => x !== fx)
                                          : [...old, fx],
                                      ),
                                  }),
                                  e("button", {
                                    type: "button",
                                    className: "fx-name",
                                    onClick: () => setSelectedFx(fx),
                                    children: fx,
                                  }),
                                  e("small", {
                                    className: "fx-status",
                                    children: fxEnabled.includes(fx)
                                      ? "ACTIVE"
                                      : "BYPASS",
                                  }),
                                ],
                              }),
                              r("div", {
                                className: "fx-scrub-row",
                                children: [
                                  r("div", {
                                    className: "fx-scrub-control",
                                    children: [
                                      e("span", {
                                        className: "fx-scrub-min",
                                        children: "0",
                                      }),
                                      e("input", {
                                        className: "fx-scrub-input",
                                        type: "range",
                                        min: 0,
                                        max: 100,
                                        step: 1,
                                        value: fxLevels[fx] ?? 50,
                                        "aria-label":
                                          fx + " intensity, drag sideways",
                                        onChange: (ev) =>
                                          setFxLevels((old) => ({
                                            ...old,
                                            [fx]: Number(ev.target.value),
                                          })),
                                      }),
                                      e("span", {
                                        className: "fx-scrub-max",
                                        children: "100",
                                      }),
                                    ],
                                  }),
                                  e("span", {
                                    className: "fx-knob-value",
                                    children: (fxLevels[fx] ?? 50) + "%",
                                  }),
                                ],
                              }),
                            ],
                          },
                          fx,
                        ),
                      ),
                    }),
                    r("div", {
                      className: "fx-editor",
                      children: [
                        r("div", {
                          className: "panelhead",
                          children: [
                            e("h3", { children: selectedFx + " / PARAMETERS" }),
                            e("span", {
                              children: fxEnabled.includes(selectedFx)
                                ? "PROCESSING ON"
                                : "BYPASSED",
                            }),
                          ],
                        }),
                        r("div", {
                          className: "fx-controls",
                          children: ["MIX", "RATE", "TONE", "DEPTH"].map(
                            (key) =>
                              r(
                                "label",
                                {
                                  className: "fx-control",
                                  children: [
                                    r("span", {
                                      children: [
                                        key,
                                        e("b", {
                                          children: (fxParams[key] ?? 50) + "%",
                                        }),
                                      ],
                                    }),
                                    e("input", {
                                      type: "range",
                                      min: 0,
                                      max: 100,
                                      value: fxParams[key] ?? 50,
                                      onChange: (ev) =>
                                        setFxParams((old) => ({
                                          ...old,
                                          [key]: Number(ev.target.value),
                                        })),
                                    }),
                                  ],
                                },
                                key,
                              ),
                          ),
                        }),
                        r("div", {
                          className: "fx-actions",
                          children: [
                            e("button", {
                              onClick: () => setFxEnabled([]),
                              children: "BYPASS ALL",
                            }),
                            e("button", {
                              onClick: () =>
                                setFxParams({
                                  MIX: 65,
                                  RATE: 45,
                                  TONE: 55,
                                  DEPTH: 35,
                                }),
                              children: "RESET PARAMETERS",
                            }),
                            e("span", {
                              children:
                                fxEnabled.length + " / 16 MODULES ACTIVE",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              false &&
                "LASTWAVE" === a &&
                r("section", {
                  className: "panel",
                  children: [
                    r("div", {
                      className: "panelhead",
                      children: [
                        e("h2", { children: "LASTWAVE / PROVIDER MODULE" }),
                        e("span", { children: "CONNECTED VIA SERVER PROXY" }),
                      ],
                    }),
                    e("p", {
                      className: "notice",
                      children:
                        "Private addon URL stays server-side. Search and stream use the official LastWave HTTP contract.",
                    }),
                    r("div", {
                      className: "moduleinfo",
                      children: [
                        e("b", { children: "MANIFEST" }),
                        e("span", { children: "com.lastwave.addon / v1.0.0" }),
                        e("b", { children: "RESOURCES" }),
                        e("span", { children: "SEARCH / STREAM" }),
                        e("b", { children: "QUALITY TIERS" }),
                        e("span", {
                          children: "LOSSLESS / DOLBY ATMOS / HIGH / LOW",
                        }),
                        e("b", { children: "QUOTA" }),
                        e("span", { children: "PROVIDER ENFORCED" }),
                      ],
                    }),
                    e("button", {
                      onClick: () => t("PLAYER"),
                      children: "OPEN STREAMING DECK ↗",
                    }),
                    e("p", {
                      className: "notice warning",
                      children:
                        "Provider labels this Lossless, but returned audio/mp4. Codec is not verified as FLAC.",
                    }),
                    e("a", {
                      className: "addonlink",
                      href: "https://github.com/Clash-Projects/LastWave-native",
                      target: "_blank",
                      rel: "noreferrer",
                      children: "LASTWAVE OPEN SOURCE ENGINE ↗",
                    }),
                  ],
                }),
              false &&
                "SYSTEM" === a &&
                r("section", {
                  className: "panel",
                  children: [
                    e("h2", { children: "SYSTEM DIAGNOSTICS" }),
                    [
                      ["AUDIO ENGINE", K ? "PLAYING" : "STANDBY"],
                      ["VISUAL MODELS", Z.length + " INSTRUMENTS"],
                      ["LASTWAVE", "SERVER PROXY / CONFIGURED"],
                      ["MIC INPUT", Y ? "ACTIVE" : "OFF"],
                      ["CRT LIVE", L ? "ACTIVE" : "OFF"],
                    ].map(([a, t]) =>
                      r(
                        "div",
                        {
                          className: "diagrow",
                          children: [
                            e("span", { children: a }),
                            e("b", { children: t }),
                          ],
                        },
                        a,
                      ),
                    ),
                    e("button", {
                      onClick: () => f((e) => !e),
                      children: "DISPLAY CALIBRATION",
                    }),
                  ],
                }),
              "AUDIO EDITOR" === a && r(AudioEditorPage, { embedded: true, sharedAudioRef: ce, sharedContextRef: se, sharedAnalyserRef: he, sharedPreAnalyserRef: highEq, ensureSharedAudio: Te }),
            ],
          }),
        ],
      }),
      r("footer", {
        className: "playerbar",
        children: [
          r("div", {
            children: [
              e("b", { children: Re }),
              e("small", { children: K ? "PLAYING NOW" : "READY FOR INPUT" }),
            ],
          }),
          r("div", {
            className: "barbuttons",
            children: [
              e("button", {
                onClick: () => {
                  ce.current &&
                    (ce.current.currentTime = Math.max(
                      0,
                      ce.current.currentTime - 10,
                    ));
                },
                children: "↶",
              }),
              e("button", {
                onClick: async () => {
                  if (ce.current)
                    try {
                      (await Te(),
                        K ? ce.current.pause() : await ce.current.play());
                    } catch (e) {
                      F(e instanceof Error ? e.message : "Playback error");
                    }
                },
                children: K ? "Ⅱ" : "▶",
              }),
              e("button", {
                onClick: () => {
                  ce.current &&
                    (ce.current.currentTime = Math.min(
                      ne,
                      ce.current.currentTime + 10,
                    ));
                },
                children: "↷",
              }),
              r("span", { children: [te(re), " / ", te(ne)] }),
            ],
          }),
          r("small", { children: [n.length, " LOCAL / ", m.length, " LIKED"] }),
        ],
      }),
    ],
  });
}
import { jsx as e, jsxs as r } from "react/jsx-runtime";
import {
  useCallback as ke,
  useEffect as me,
  useMemo as je,
  useRef as k,
  useState as A,
} from "react";
const ze = [
    "HOME",
    "VISUALIZER",
    "LIBRARY",
    "FREQUENCY LAB",
    "AUDIO EDITOR",
    "SETTINGS",
  ],
  Z = [
    "OSCILLOSCOPE",
    "SPECTRUM 80",
    "RADAR",
    "PULSE",
    "STARFIELD",
    "SONOGRAPH",
    "NEUROSCAN",
    "EVENT HORIZON",
    "PRISM",
    "VORTEX",
    "SPECTRAL TERRAIN",
    "AURORA"
  ],
  te = (e) =>
    Number.isFinite(e) && e > 0
      ? (Math.floor(e / 60) + "").padStart(2, "0") +
        ":" +
        (Math.floor(e % 60) + "").padStart(2, "0")
      : "00:00";
export { aa as default };
