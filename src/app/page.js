"use client";
import InstrumentWorkbench from "./InstrumentWorkbench";
import MusicAddonPanel from "./MusicAddonPanel";
import AudioEditorPage from "./audio-editor/page";
import SettingsPanel from "./SettingsPanel";
import SmartLibraryPanel from "./SmartLibraryPanel";
import LyricsPanel from "./LyricsPanel";
import HomeSearch from "./HomeSearch";
function ea({ name: a }) {
  const t = {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.4,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    n =
      "M4 26 C10 5 15 47 22 26 S34 5 40 26 S52 47 58 26 S70 5 76 26 S88 47 96 26",
    l = [
      [16, 15],
      [36, 8],
      [55, 19],
      [76, 10],
      [25, 37],
      [52, 42],
      [82, 37],
    ];
  let c;
  switch (a) {
    case "OSCILLOSCOPE":
      c = e("path", { d: n, ...t, className: "drawwave" });
      break;
    case "SPECTRUM 80":
      c = e("g", {
        children: Array.from({ length: 18 }, (r, a) =>
          e(
            "rect",
            {
              x: 5 + 5 * a,
              y: 48 - ((13 * a + 17) % 34),
              width: "2.5",
              height: ((13 * a + 17) % 34) + 3,
              rx: "1",
              fill: "currentColor",
              className: "spectrumbar",
              style: { animationDelay: 35 * a + "ms" },
            },
            a,
          ),
        ),
      });
      break;
    case "RADAR":
      c = r("g", {
        children: [
          e("circle", { cx: "50", cy: "26", r: "9", ...t }),
          e("circle", { cx: "50", cy: "26", r: "18", ...t }),
          e("circle", { cx: "50", cy: "26", r: "27", ...t }),
          e("path", { d: "M50 26 L77 8", ...t, className: "radarsweep" }),
          e("path", {
            d: "M50 26 L77 8 A28 28 0 0 1 76 42 Z",
            fill: "currentColor",
            opacity: ".13",
            className: "radartrail",
          }),
        ],
      });
      break;
    case "PULSE":
    case "VITAL SIGNS":
      c = r("g", {
        children: [
          e("path", {
            d: "M3 27 H21 L27 27 L32 12 L40 43 L47 20 L53 27 H96",
            ...t,
            className: "pulsepath",
          }),
          e("path", { d: "M3 49 H96", ...t, opacity: ".18" }),
        ],
      });
      break;
    case "STARFIELD":
    case "ABYSS":
      c = e("g", {
        children: Array.from({ length: 26 }, (r, a) =>
          e(
            "circle",
            {
              cx: ((31 * a) % 96) + 2,
              cy: ((19 * a) % 52) + 3,
              r: a % 5 == 0 ? 1.6 : 0.7,
              fill: "currentColor",
              className: "star",
              style: { animationDelay: 73 * a + "ms" },
            },
            a,
          ),
        ),
      });
      break;
    case "REACTOR":
      c = r("g", {
        children: [
          e("polygon", {
            points: "50,3 73,16 73,38 50,51 27,38 27,16",
            ...t,
            className: "reactorcore",
          }),
          e("polygon", { points: "50,12 65,21 65,33 50,42 35,33 35,21", ...t }),
          e("circle", { cx: "50", cy: "27", r: "4", fill: "currentColor" }),
        ],
      });
      break;
    case "TURBO DRIVE":
    case "NIGHT RIDER":
      c = r("g", {
        children: [
          e("path", {
            d: "M3 14 H40 M10 22 H36 M3 30 H42 M8 38 H36 M54 14 H94 M60 22 H94 M55 30 H94 M62 38 H94",
            ...t,
            className: "speedlines",
          }),
          e("path", {
            d: "M43 8 L58 27 L43 46 L49 27 Z",
            fill: "currentColor",
            opacity: ".65",
          }),
        ],
      });
      break;
    case "CASSETTE DECK":
    case "REEL TO REEL":
      c = r("g", {
        children: [
          e("rect", {
            x: "12",
            y: "8",
            width: "76",
            height: "36",
            rx: "3",
            ...t,
          }),
          e("circle", { cx: "32", cy: "25", r: "9", ...t, className: "reel" }),
          e("circle", { cx: "68", cy: "25", r: "9", ...t, className: "reel" }),
          e("path", {
            d: "M32 16 V34 M23 25 H41 M68 16 V34 M59 25 H77 M41 25 H59 M18 39 H78",
            ...t,
          }),
        ],
      });
      break;
    case "OXYGEN":
    case "BIOLUMINESCENCE":
      c = e("g", {
        children: Array.from({ length: 12 }, (r, a) =>
          e(
            "circle",
            {
              cx: 10 + ((23 * a) % 82),
              cy: 7 + ((17 * a) % 40),
              r: 1.5 + (a % 4),
              ...t,
              className: "bubble",
              style: { animationDelay: 130 * a + "ms" },
            },
            a,
          ),
        ),
      });
      break;
    case "SONOGRAPH":
      c = e("g", {
        children: Array.from({ length: 9 }, (r, a) =>
          e(
            "path",
            {
              d: `M4 ${7 + 5 * a} Q22 ${6 * a - 2} 40 ${8 + 5 * a} T76 ${8 + 5 * a} T96 ${7 + 5 * a}`,
              ...t,
              opacity: 0.35 + 0.07 * a,
              className: "sonowave",
            },
            a,
          ),
        ),
      });
      break;
    case "NEUROSCAN":
      c = e("g", {
        children: l.map(([a, n], c) =>
          r(
            "g",
            {
              children: [
                e("circle", {
                  cx: a,
                  cy: n,
                  r: "3",
                  fill: "currentColor",
                  className: "neuron",
                }),
                l
                  .slice(c + 1)
                  .filter((e, r) => (c + r) % 2 == 0)
                  .map(([r, l], c) =>
                    e(
                      "path",
                      { d: `M${a} ${n} L${r} ${l}`, ...t, opacity: ".45" },
                      c,
                    ),
                  ),
              ],
            },
            c,
          ),
        ),
      });
      break;
    case "HYPERDRIVE":
      c = e("g", {
        children: Array.from({ length: 12 }, (r, a) =>
          e(
            "path",
            {
              d: `M50 26 L${50 + 48 * Math.cos((a * Math.PI) / 6)} ${26 + 23 * Math.sin((a * Math.PI) / 6)}`,
              ...t,
              className: "streak",
              style: { animationDelay: 45 * a + "ms" },
            },
            a,
          ),
        ),
      });
      break;
    case "ORBITAL":
      c = r("g", {
        children: [
          e("ellipse", {
            cx: "50",
            cy: "26",
            rx: "35",
            ry: "10",
            transform: "rotate(-24 50 26)",
            ...t,
            className: "orbit",
          }),
          e("ellipse", {
            cx: "50",
            cy: "26",
            rx: "35",
            ry: "10",
            transform: "rotate(54 50 26)",
            ...t,
            className: "orbit orbit2",
          }),
          e("circle", { cx: "50", cy: "26", r: "4", fill: "currentColor" }),
        ],
      });
      break;
    case "PRESSURE":
      c = r("g", {
        children: [
          e("path", { d: "M17 43 A34 34 0 0 1 83 43", ...t }),
          e("path", { d: "M50 42 L70 18", ...t, className: "gaugehand" }),
          e("circle", { cx: "50", cy: "42", r: "3", fill: "currentColor" }),
          e("path", { d: "M22 42 L17 42 M78 42 L83 42", ...t }),
        ],
      });
      break;
    case "POWER GRID":
    case "GRIDSHIFT":
      c = e("g", {
        children: Array.from({ length: 7 }, (r, a) =>
          e(
            "path",
            {
              d: `M${8 + 13 * a} 5 V47 M5 ${8 + 6 * a} H95`,
              ...t,
              opacity: ".55",
            },
            a,
          ),
        ),
      });
      break;
    case "CLOCKWORK":
      c = r("g", {
        children: [
          e("circle", { cx: "50", cy: "26", r: "21", ...t }),
          e("circle", { cx: "50", cy: "26", r: "14", ...t }),
          e("path", {
            d: "M50 5 V18 M50 34 V47 M29 26 H42 M58 26 H71 M35 11 L44 20 M56 32 L65 41",
            ...t,
          }),
          e("circle", { cx: "50", cy: "26", r: "3", fill: "currentColor" }),
        ],
      });
      break;
    case "TURBINE":
      c = r("g", {
        children: [
          e("circle", { cx: "50", cy: "26", r: "5", ...t }),
          Array.from({ length: 8 }, (r, a) =>
            e(
              "path",
              {
                d: `M50 26 Q${50+Math.cos(a*Math.PI/4)*8} ${26+Math.sin(a*Math.PI/4)*8} ${50+Math.cos(a*Math.PI/4)*25} ${26+Math.sin(a*Math.PI/4)*25}`,
                ...t,
                className: "blade",
                style: {
                  transformOrigin: "50px 26px",
                  transform: `rotate(${45 * a}deg)`,
                },
              },
              a,
            ),
          ),
        ],
      });
      break;
    case "DATASTREAM":
      c = e("g", {
        children: Array.from({ length: 12 }, (a, n) =>
          r(
            "g",
            {
              className: "datacol",
              style: { animationDelay: 90 * n + "ms" },
              children: [
                e("path", { d: `M${8 + 7 * n} 4 V48`, ...t, opacity: ".35" }),
                e("rect", {
                  x: 5 + 7 * n,
                  y: 5 + ((9 * n) % 36),
                  width: "4",
                  height: "5",
                  fill: "currentColor",
                }),
              ],
            },
            n,
          ),
        ),
      });
      break;
    case "VECTOR 01":
      c = r("g", {
        children: [
          e("path", { d: "M12 39 L50 8 L85 39 L50 47 Z", ...t }),
          e("path", { d: "M50 8 V47 M12 39 H85", ...t }),
          e("path", { d: "M44 17 L50 8 L56 17", ...t }),
        ],
      });
      break;
    case "FLUID":
      c = e("g", {
        children: [0, 1, 2, 3, 4].map((r) =>
          e(
            "path",
            {
              d: `M2 ${12 + 8 * r} C20 ${8 * r - 4} 34 ${28 + 8 * r} 52 ${12 + 8 * r} S82 ${8 * r - 4} 98 ${12 + 8 * r}`,
              ...t,
              className: "fluidline",
              style: { animationDelay: 180 * r + "ms" },
            },
            r,
          ),
        ),
      });
      break;
    case "FRACTAL":
    case "ROOT SYSTEM":
      c = r("g", {
        children: [
          e("path", {
            d: "M50 47 V26 M50 34 L30 18 M50 34 L70 18 M30 18 L20 8 M30 18 L36 6 M70 18 L60 6 M70 18 L82 8 M50 26 L42 14 M50 26 L58 14",
            ...t,
            className: "branch",
          }),
          e("circle", { cx: "50", cy: "47", r: "2", fill: "currentColor" }),
        ],
      });
      break;
    case "SYNTH LAB":
      c = r("g", {
        children: [
          e("path", { d: n, ...t, className: "drawwave" }),
          e("circle", { cx: "15", cy: "9", r: "3", ...t }),
          e("circle", { cx: "85", cy: "9", r: "3", ...t }),
        ],
      });
      break;
    case "DRUM MACHINE":
      c = e("g", {
        children: Array.from({ length: 16 }, (r, a) =>
          e(
            "rect",
            {
              x: 8 + (a % 8) * 11,
              y: 8 + 19 * Math.floor(a / 8),
              width: "7",
              height: "12",
              rx: "1",
              fill: "currentColor",
              opacity: a % 3 == 0 ? 0.9 : 0.28,
              className: "drumpad",
              style: { animationDelay: 100 * a + "ms" },
            },
            a,
          ),
        ),
      });
      break;
    case "MIXING DESK":
      c = e("g", {
        children: Array.from({ length: 7 }, (a, n) =>
          r(
            "g",
            {
              children: [
                e("path", { d: `M${12 + 12 * n} 7 V46`, ...t, opacity: ".6" }),
                e("rect", {
                  x: 8 + 12 * n,
                  y: 9 + ((11 * n) % 30),
                  width: "8",
                  height: "5",
                  fill: "currentColor",
                  className: "fader",
                  style: { animationDelay: 120 * n + "ms" },
                }),
              ],
            },
            n,
          ),
        ),
      });
      break;
    case "TOPOGRAPHY":
      c = e("g", {
        children: [0, 1, 2, 3, 4].map((r) =>
          e(
            "ellipse",
            {
              cx: "50",
              cy: "26",
              rx: 10 + 9 * r,
              ry: 4 + 4 * r,
              transform: "rotate(-18 50 26)",
              ...t,
              className: "toporing",
              style: { animationDelay: 140 * r + "ms" },
            },
            r,
          ),
        ),
      });
      break;
    case "SKELETON HEAD":
    case "HUMAN HEAD / M":
    case "HUMAN HEAD / F":
      c = r("g", {
        children: [
          e("path", {
            d:
              "SKELETON HEAD" === a
                ? "M50 4 C27 4 23 22 29 36 L35 46 L65 46 L71 36 C77 22 73 4 50 4 Z"
                : "HUMAN HEAD / F" === a
                  ? "M50 4 C29 4 26 19 30 31 C32 39 38 47 50 49 C62 47 68 39 70 31 C74 19 71 4 50 4 Z"
                  : "M50 4 C25 4 24 19 28 32 C31 42 38 48 50 49 C64 47 72 37 72 24 C72 10 63 4 50 4 Z",
            ...t,
          }),
          e("path", {
            d: "M38 24 Q44 20 47 24 M53 24 Q58 20 63 24 M50 27 V36 M43 41 Q50 45 57 41",
            ...t,
          }),
          "SKELETON HEAD" === a &&
            e("path", {
              d: "M37 38 V47 M43 38 V48 M50 38 V48 M57 38 V48 M63 38 V47",
              ...t,
            }),
        ],
      });
      break;
    case "VHS SCAN":
      c = r("g", {
        children: [
          e("rect", { x: "5", y: "4", width: "90", height: "44", rx: "2", ...t }),
          ...Array.from({ length: 7 }, (_, i) =>
            e("path", {
              d: "M7 " + (10 + i * 5) + " H93",
              ...t,
              className: "vhsscanline",
              style: { animationDelay: 70 * i + "ms" },
            }, i),
          ),
          e("path", { d: "M8 35 H92 M8 37 H92", ...t, className: "vhstrack" }),
          e("path", { d: "M12 8 H25 M75 44 H88", ...t }),
        ],
      });
      break;
    default:
      c = e("path", { d: n, ...t });
  }
  return e("svg", {
    className: "visualpreview",
    viewBox: "0 0 100 52",
    "aria-hidden": "true",
    children: c,
  });
}
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
    Ae = k([]),
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
          (he.current.smoothingTimeConstant = 0.82),
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
            (he.current.smoothingTimeConstant = 0.82));
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
    const e = oe.current;
    if (!e) return void (Ee.current = requestAnimationFrame(Ie));
    const r = e.getBoundingClientRect(),
      a = Math.min(devicePixelRatio || 1, 2),
      t = r.width,
      n = r.height;
    if (!t || !n) return void (Ee.current = requestAnimationFrame(Ie));
    (e.width !== Math.round(t * a) || e.height !== Math.round(n * a)) &&
      ((e.width = Math.round(t * a)), (e.height = Math.round(n * a)));
    const l = e.getContext("2d");
    if (!l) return;
    (l.setTransform(a, 0, 0, a, 0, 0), l.clearRect(0, 0, t, n));
    const c = getComputedStyle(document.querySelector(".crt") || document.documentElement).getPropertyValue("--signal").trim() || ("green" === I ? "#9bff79" : "cyan" === I ? "#70eaff" : "#78c0ff");
    ((l.strokeStyle = c),
      (l.fillStyle = c),
      (l.shadowColor = c),
      (l.shadowBlur = 12),
      (l.lineWidth = 1.5));
    const i = performance.now() / 1e3;
    let o = Ae.current;
    if (he.current) {
      const e = new Uint8Array(he.current.frequencyBinCount);
      (he.current.getByteFrequencyData(e),
        (o = Array.from(e)),
        (Ae.current = o));
    }
    const s = (e) =>
        o.length
          ? (o[Math.min(o.length - 1, Math.floor((e / o.length) * 80))] || 0) /
            255
          : 0,
      h = (e) => {
        (l.beginPath(),
          e.forEach((e, r) => (r ? l.lineTo(e.x, e.y) : l.moveTo(e.x, e.y))),
          l.stroke());
      },
      d = t / 2,
      m = n / 2,
      u = Math.min(t, n);
    if ("OSCILLOSCOPE" === M || "PULSE" === M || "VITAL SIGNS" === M) {
      const e = [];
      for (let r = 0; t > r; r += 2) {
        const a = s(Math.floor((r / t) * 80)),
          l =
            "VITAL SIGNS" === M
              ? 0.08 * Math.sin(0.028 * r + 3 * i) +
                Math.sin(0.12 * r + i) *
                  Math.exp(-Math.pow(((r % 180) - 40) / 13, 2)) *
                  0.55
              : "PULSE" === M
                ? 0.1 * Math.sin(0.018 * r + 2 * i) +
                  0.04 * Math.sin(0.045 * r + 3 * i)
                : Math.sin(0.025 * r + 2 * i) * (0.06 + 0.36 * a);
        e.push({ x: r, y: m + l * n });
      }
      if ((h(e), "VITAL SIGNS" === M)) {
        l.globalAlpha = 0.4;
        for (let e = m - 0.32 * n; m + 0.32 * n > e; e += 0.16 * n)
          (l.beginPath(), l.moveTo(0, e), l.lineTo(t, e), l.stroke());
        l.globalAlpha = 1;
      }
    } else if ("SPECTRUM 80" === M || "SONOGRAPH" === M || "NEUROSCAN" === M) {
      const e = "SPECTRUM 80" === M ? 80 : 48;
      for (let r = 0; e > r; r++) {
        const a = s(r) + 0.06,
          c = (r * t) / e,
          i = a * n * ("SPECTRUM 80" === M ? 0.7 : 0.9);
        "SONOGRAPH" === M
          ? ((l.globalAlpha = 0.3 + a), l.fillRect(c, n - i, (t / e) * 0.8, i))
          : "NEUROSCAN" === M
            ? (l.beginPath(),
              l.arc(c, n / 2, 1 + a * u * 0.08, 0, 2 * Math.PI),
              l.stroke())
            : l.fillRect(c, n - i, (t / e) * 0.62, i);
      }
      l.globalAlpha = 1;
    } else if ("RADAR" === M || "NIGHT RIDER" === M) {
      for (let e = 1; 5 >= e; e++)
        (l.beginPath(), l.arc(d, m, e * u * 0.085, 0, 2 * Math.PI), l.stroke());
      const e = i * ("RADAR" === M ? 1.2 : 0.6);
      (l.beginPath(),
        l.moveTo(d, m),
        l.lineTo(d + Math.cos(e) * u * 0.48, m + Math.sin(e) * u * 0.48),
        l.stroke(),
        (l.globalAlpha = 0.14),
        l.beginPath(),
        l.moveTo(d, m),
        l.arc(d, m, 0.48 * u, e - 0.6, e),
        l.closePath(),
        l.fill(),
        (l.globalAlpha = 1));
    } else if ("STARFIELD" === M || "ABYSS" === M || "BIOLUMINESCENCE" === M) {
      for (let e = 0; 130 > e; e++) {
        const r = ((37 * e + i * ("STARFIELD" === M ? 45 : 13)) % 160) / 160,
          a = (0.5 * Math.sin(17.13 * e) + 0.5) * t,
          c = (0.5 * Math.cos(7.7 * e) + 0.5) * n,
          o = 0.7 + 2.5 * r + 3 * s(e);
        ((l.globalAlpha = 0.25 + 0.7 * r),
          l.beginPath(),
          l.arc(a, c, o, 0, 2 * Math.PI),
          l.fill());
      }
      l.globalAlpha = 1;
    } else if (
      "REACTOR" === M ||
      "TURBO DRIVE" === M ||
      "HYPERDRIVE" === M ||
      "ORBITAL" === M ||
      "PRESSURE" === M
    ) {
      for (let e = 0; 5 > e; e++)
        (l.beginPath(),
          l.ellipse(
            d,
            m,
            u * (0.12 + 0.065 * e),
            u * (0.045 + 0.023 * e),
            i * (e % 2 ? -0.3 : 0.3),
            0,
            2 * Math.PI,
          ),
          l.stroke());
      for (let e = 0; 32 > e; e++) {
        const r = (e / 32) * Math.PI * 2 + 1.3 * i,
          a = u * (0.12 + 0.2 * s(e));
        l.fillRect(d + Math.cos(r) * a - 1, m + Math.sin(r) * a - 1, 3, 3);
      }
    } else if ("CASSETTE DECK" === M || "REEL TO REEL" === M) {
      l.strokeRect(d - 0.38 * u, m - 0.2 * u, 0.76 * u, 0.4 * u);
      for (const e of [d - 0.2 * u, d + 0.2 * u]) {
        (l.beginPath(), l.arc(e, m, 0.1 * u, 0, 2 * Math.PI), l.stroke());
        for (let r = 0; 3 > r; r++) {
          const a = i + (r * Math.PI * 2) / 3;
          (l.beginPath(),
            l.moveTo(e, m),
            l.lineTo(e + Math.cos(a) * u * 0.085, m + Math.sin(a) * u * 0.085),
            l.stroke());
        }
      }
      (l.beginPath(),
        l.moveTo(d - 0.1 * u, m),
        l.lineTo(d + 0.1 * u, m),
        l.stroke());
    } else if (
      "DRUM MACHINE" === M ||
      "MIXING DESK" === M ||
      "POWER GRID" === M ||
      "CLOCKWORK" === M
    ) {
      const e = "MIXING DESK" === M ? 8 : 10,
        r = "DRUM MACHINE" === M ? 4 : 5;
      for (let a = 0; r > a; a++)
        for (let c = 0; e > c; c++) {
          const i = s(a * e + c),
            o = (t / e) * 0.68,
            h = (n / r) * 0.62;
          ((l.globalAlpha = 0.18 + 0.8 * i),
            l.fillRect(
              (c * t) / e + 0.2 * o,
              (a * n) / r + 0.2 * h,
              o * (0.3 + 0.7 * i),
              h,
            ));
        }
      l.globalAlpha = 1;
    } else if ("SKELETON HEAD" === M) {
      const e = 0.29 * u,
        r = 0.38 * u,
        a = 0.82 + 0.48 * s(3),
        t = [];
      for (let n = 0; n < 64; n++) {
        const l = -Math.PI / 2 + (n / 63) * Math.PI * 2,
          c = 1 - 0.12 * Math.max(0, Math.sin(l));
        t.push({ x: d + Math.cos(l) * e * c * a, y: m + Math.sin(l) * r * a });
      }
      ((l.globalAlpha = 0.86), h(t), (l.globalAlpha = 1));
      for (let e = 0; e < t.length; e++) {
        const r = t[e],
          a = t[(e + 1) % t.length];
        (l.beginPath(),
          l.moveTo(r.x, r.y),
          l.lineTo(a.x, a.y),
          l.stroke(),
          l.beginPath(),
          l.arc(r.x, r.y, 1.5 + 3 * s(e), 0, 2 * Math.PI),
          l.fill());
      }
      const n = m - 0.18 * r + 0.24 * r;
      for (const a of [-1, 1])
        (l.beginPath(),
          l.ellipse(
            d + a * e * 0.37,
            n,
            0.19 * e,
            0.105 * e,
            0.12 * a,
            0,
            2 * Math.PI,
          ),
          l.stroke(),
          l.beginPath(),
          l.moveTo(d + a * e * 0.18, n + 0.44 * r),
          l.lineTo(d + a * e * 0.3, n + 0.72 * r),
          l.lineTo(d + a * e * 0.42, n + 0.44 * r),
          l.stroke());
      (l.beginPath(),
        l.moveTo(d, n + 0.1 * r),
        l.lineTo(d - 0.07 * e, n + 0.36 * r),
        l.lineTo(d + 0.07 * e, n + 0.36 * r),
        l.stroke(),
        l.beginPath(),
        l.arc(d, m + 0.52 * r, 0.19 * e, 0.12 * Math.PI, 0.88 * Math.PI),
        l.stroke());
      for (let a = 0; a < 8; a++) {
        const t = m + 0.48 * r + a * r * 0.055,
          n = e * (0.17 + 0.012 * a);
        (l.beginPath(), l.moveTo(d - n, t), l.lineTo(d + n, t), l.stroke());
      }
      for (let r = 0; r < 18; r++) {
        const a = (r / 18) * Math.PI * 2,
          t = e * (1.12 + 0.22 * s(4 * r));
        (l.beginPath(),
          l.arc(
            d + Math.cos(a) * t,
            m + Math.sin(a) * t * 0.9,
            1 + 3 * s(3 * r),
            0,
            2 * Math.PI,
          ),
          l.fill());
      }
    } else if ("HUMAN HEAD / M" === M) {
      const e = 0.27 * u,
        r = 0.37 * u;
      s(2);
      (l.beginPath(),
        l.moveTo(d - 0.62 * e, m - 0.7 * r),
        l.bezierCurveTo(
          d - 1.05 * e,
          m - 0.45 * r,
          d - 0.83 * e,
          m + 0.1 * r,
          d - 0.62 * e,
          m + 0.36 * r,
        ),
        l.lineTo(d - 0.42 * e, m + 0.7 * r),
        l.lineTo(d + 0.35 * e, m + 0.7 * r),
        l.lineTo(d + 0.52 * e, m + 0.35 * r),
        l.bezierCurveTo(
          d + 0.94 * e,
          m + 0.05 * r,
          d + 0.92 * e,
          m - 0.45 * r,
          d + 0.55 * e,
          m - 0.68 * r,
        ),
        l.closePath(),
        l.stroke(),
        l.beginPath(),
        l.moveTo(d - 0.58 * e, m - 0.48 * r),
        l.quadraticCurveTo(d, m - 1.02 * r, d + 0.62 * e, m - 0.48 * r),
        l.stroke());
      for (const a of [-1, 1]) {
        const t = d + a * e * 0.3;
        (l.beginPath(),
          l.moveTo(t - a * e * 0.14, m - 0.12 * r),
          l.lineTo(t + a * e * 0.08, m - 0.1 * r),
          l.stroke(),
          l.beginPath(),
          l.arc(t, m - 0.08 * r, 2 + 3 * s(a < 0 ? 5 : 12), 0, 2 * Math.PI),
          l.fill());
      }
      (l.beginPath(),
        l.moveTo(d, m - 0.03 * r),
        l.lineTo(d - 0.08 * e, m + 0.27 * r),
        l.lineTo(d + 0.12 * e, m + 0.29 * r),
        l.stroke(),
        l.beginPath(),
        l.moveTo(d - 0.22 * e, m + 0.43 * r),
        l.quadraticCurveTo(
          d,
          m + r * (0.5 + 0.1 * s(8)),
          d + 0.22 * e,
          m + 0.43 * r,
        ),
        l.stroke());
      for (let a = 0; a < 12; a++) {
        const t = m - 0.52 * r + a * r * 0.09,
          n = d - 0.54 * e + (a % 3) * e * 0.035;
        ((l.globalAlpha = 0.3 + 0.7 * s(5 * a)),
          l.beginPath(),
          l.moveTo(n, t),
          l.lineTo(n + 0.18 * e, t + 0.018 * r),
          l.stroke());
      }
      l.globalAlpha = 1;
      for (let a = 0; a < 9; a++) {
        const t = m - 0.5 * r + a * r * 0.13;
        (l.beginPath(),
          l.moveTo(d - 0.7 * e, t),
          l.lineTo(d - 0.58 * e, t + 0.04 * r),
          l.stroke(),
          l.beginPath(),
          l.moveTo(d + 0.7 * e, t),
          l.lineTo(d + 0.58 * e, t + 0.04 * r),
          l.stroke());
      }
    } else if ("HUMAN HEAD / F" === M) {
      const e = 0.255 * u,
        r = 0.36 * u,
        a = 0.08 + 0.13 * s(4);
      (l.beginPath(),
        l.moveTo(d - 0.55 * e, m - 0.56 * r),
        l.bezierCurveTo(
          d - 0.95 * e,
          m - 1.02 * r,
          d + 0.82 * e,
          m - 1.03 * r,
          d + 0.58 * e,
          m - 0.48 * r,
        ),
        l.bezierCurveTo(
          d + 0.92 * e,
          m - 0.02 * r,
          d + 0.76 * e,
          m + 0.48 * r,
          d + 0.48 * e,
          m + 0.72 * r,
        ),
        l.stroke(),
        l.beginPath(),
        l.moveTo(d - 0.52 * e, m - 0.5 * r),
        l.bezierCurveTo(
          d - 0.9 * e,
          m - 0.06 * r,
          d - 0.53 * e,
          m + 0.5 * r,
          d - 0.34 * e,
          m + 0.68 * r,
        ),
        l.lineTo(d + 0.3 * e, m + 0.68 * r),
        l.bezierCurveTo(
          d + 0.7 * e,
          m + 0.3 * r,
          d + 0.82 * e,
          m - 0.18 * r,
          d + 0.52 * e,
          m - 0.5 * r,
        ),
        l.stroke());
      for (const a of [-1, 1]) {
        const t = d + a * e * 0.28;
        (l.beginPath(),
          l.moveTo(t - a * e * 0.1, m - 0.1 * r),
          l.quadraticCurveTo(t, m - 0.17 * r, t + a * e * 0.1, m - 0.1 * r),
          l.stroke(),
          l.beginPath(),
          l.arc(t, m - 0.08 * r, 1.8 + 2.5 * s(a < 0 ? 7 : 15), 0, 2 * Math.PI),
          l.fill());
      }
      (l.beginPath(),
        l.moveTo(d, m - 0.03 * r),
        l.lineTo(d - 0.06 * e, m + 0.24 * r),
        l.lineTo(d + 0.1 * e, m + 0.25 * r),
        l.stroke(),
        l.beginPath(),
        l.moveTo(d - 0.19 * e, m + 0.4 * r),
        l.quadraticCurveTo(
          d,
          m + r * (0.48 + 0.07 * s(9)),
          d + 0.19 * e,
          m + 0.4 * r,
        ),
        l.stroke());
      for (let t = 0; t < 13; t++) {
        const n = t % 2 ? 1 : -1,
          c = (t % 7) * 0.13 - 0.62,
          o = Math.sin(1.5 * i + t) * a;
        ((l.globalAlpha = 0.25 + (t % 4) * 0.15),
          l.beginPath(),
          l.moveTo(d + n * e * 0.48, m + r * c),
          l.bezierCurveTo(
            d + n * e * (0.92 + o),
            m - 0.1 * r,
            d + n * e * (0.78 - o),
            m + 0.5 * r,
            d + n * e * (0.58 + o),
            m + 0.78 * r,
          ),
          l.stroke());
      }
      l.globalAlpha = 1;
    } else if ("VHS SCAN" === M) {
      l.save();
      const band = (i * 46) % (n + 28) - 14;
      l.globalAlpha = 0.16;
      for (let y = 0; y < n; y += 4) l.fillRect(0, y, t, 1);
      l.globalAlpha = 0.34 + 0.32 * s(12);
      l.fillRect(0, band, t, 2 + 5 * s(28));
      l.globalAlpha = 0.7;
      l.fillRect(Math.sin(i * 2.3) * 5, band + 5, t * (0.3 + 0.55 * s(44)), 1);
      l.globalAlpha = 0.5;
      l.strokeRect(4, 4, t - 8, n - 8);
      l.globalAlpha = 0.35;
      l.font = "10px monospace";
      l.textAlign = "left";
      l.fillText("PLAY ▷ SP", 10, 17);
      l.textAlign = "right";
      l.fillText("CH 01", t - 10, 17);
      l.textAlign = "left";
      l.fillText("WAVELENGTH // VHS", 10, n - 9);
      for (let k = 0; k < 22; k++) {
        const x = (k * 47 + i * (18 + k % 5) * 8) % t;
        const y = (k * 29 + Math.floor(i * 37)) % n;
        l.globalAlpha = 0.12 + 0.55 * s(k * 3);
        l.fillRect(x, y, 2 + (k % 4) * 3, 1);
      }
      l.globalAlpha = 1;
      l.restore();
    } else if ("ROOT SYSTEM" === M || "FRACTAL" === M || "TOPOGRAPHY" === M) {
      const e = (r, a, t, n, c) => {
        if (0 === c) return;
        const i = r + Math.cos(t) * n,
          o = a + Math.sin(t) * n;
        ((l.globalAlpha = 0.2 + 0.1 * c),
          l.beginPath(),
          l.moveTo(r, a),
          l.lineTo(i, o),
          l.stroke(),
          e(i, o, t - 0.48, 0.72 * n, c - 1),
          e(i, o, t + 0.48, 0.72 * n, c - 1));
      };
      for (let r = 0; 5 > r; r++)
        e(d + (r - 2) * u * 0.05, 0.85 * n, -Math.PI / 2, 0.15 * u, 5);
    } else {
      for (let e = 0; 6 > e; e++)
        (l.beginPath(),
          l.arc(d, m, u * (0.06 + 0.07 * e), 0, 2 * Math.PI),
          l.stroke());
      l.beginPath();
      for (let e = 0; t > e; e += 3) {
        const r =
          m + Math.sin(0.03 * e + i) * n * 0.18 * (0.4 + s((e / t) * 80));
        e ? l.lineTo(e, r) : l.moveTo(e, r);
      }
      l.stroke();
    }
    ((l.globalAlpha = 1), (Ee.current = requestAnimationFrame(Ie)));
  }, [I, M]);
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
                      children: "VISUAL LIBRARY / 36 DISTINCT INSTRUMENTS",
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
                                children: e(ea, { name: a }),
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
                    e(InstrumentWorkbench, { name: M }),
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
    "REACTOR",
    "TURBO DRIVE",
    "CASSETTE DECK",
    "VITAL SIGNS",
    "OXYGEN",
    "SONOGRAPH",
    "NEUROSCAN",
    "NIGHT RIDER",
    "HYPERDRIVE",
    "ORBITAL",
    "PRESSURE",
    "POWER GRID",
    "CLOCKWORK",
    "TURBINE",
    "DATASTREAM",
    "VECTOR 01",
    "GRIDSHIFT",
    "FLUID",
    "FRACTAL",
    "SYNTH LAB",
    "REEL TO REEL",
    "DRUM MACHINE",
    "MIXING DESK",
    "BIOLUMINESCENCE",
    "ROOT SYSTEM",
    "ABYSS",
    "TOPOGRAPHY",
    "VHS SCAN",
    "SKELETON HEAD",
    "HUMAN HEAD / M",
    "HUMAN HEAD / F",
  ],
  te = (e) =>
    Number.isFinite(e) && e > 0
      ? (Math.floor(e / 60) + "").padStart(2, "0") +
        ":" +
        (Math.floor(e % 60) + "").padStart(2, "0")
      : "00:00";
export { aa as default };
