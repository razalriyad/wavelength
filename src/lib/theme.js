export const PALETTE = {
  cyan: "#70eaff",
  blue: "#68a8ff",
  violet: "#b58aff",
  pink: "#ff79c8",
  green: "#72f0a0",
  amber: "#ffc46b",
};

export function applyWavelengthTheme(ui = "cyan", signal = "green") {
  if (typeof document === "undefined") return;
  const colour = PALETTE[ui] || PALETTE.cyan;
  const wave = PALETTE[signal] || PALETTE.green;
  const targets = [document.documentElement, document.querySelector(".crt")].filter(Boolean);
  for (const target of targets) {
    target.style.setProperty("--ph", colour);
    target.style.setProperty("--line", colour + "66");
    target.style.setProperty("--dim", colour + "bb");
    target.style.setProperty("--glow", "0 0 8px " + colour + ", 0 0 24px " + colour + "55");
    target.style.setProperty("--signal", wave);
    target.style.setProperty("--signal-glow", "0 0 8px " + wave + ", 0 0 24px " + wave + "66");
    target.dataset.uiTone = ui;
    target.dataset.signalTone = signal;
  }
}
