# WAVELENGTH
CRT-inspired personal audio instrument. The existing production deployment is preserved as a baseline. This source tree is a structured rebuild.

## Core systems
- Local audio playback and a shared Web Audio graph.
- Track archive with search and file/folder import.
- FFT visualizer engine and named visualizer catalogue.
- Live 10-band parametric EQ and preamp.
- W.E.M. manifest registration. Provider execution is deliberately disabled until sandboxing and permission enforcement exist.
- CRT display controls and system diagnostics.

## Known limitations in this foundation
Browser codec support varies. The file picker accepts common formats, but acceptance does not guarantee decoding. Local files and metadata are session-scoped. Additional DSP effects are not yet connected. Spotify requires official OAuth and eligible playback configuration. YouTube Music currently has no native playback integration here. Imported module manifests are not executable.

## Roadmap
1. Audio engine hardening, codec detection, metadata, IndexedDB persistence, playlists and queue.
2. DSP graph, effect chain, Lo-Fi Lab and offline export.
3. 32 unique visualizers, each with distinct rendering, controls, presets and fullscreen mode.
4. W.E.M. package validation, permission prompts, isolated runtime and 8SPINE adapter.
5. Official connected-source integrations where APIs permit.
6. Mobile and desktop QA, accessibility and deployment smoke tests.

Never execute imported provider code with eval or new Function. No DRM circumvention or unauthorized stream extraction.
