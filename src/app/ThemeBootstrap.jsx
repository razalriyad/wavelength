"use client";
import { useEffect } from "react";
import { PALETTE, applyWavelengthTheme } from "@/lib/theme.js";

export default function ThemeBootstrap() {
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("wavelength-theme-settings") || "{}");
      const ui = PALETTE[saved.uiTheme] ? saved.uiTheme : "cyan";
      const signal = PALETTE[saved.signalTheme] ? saved.signalTheme : "green";
      applyWavelengthTheme(ui, signal);
    } catch {
      applyWavelengthTheme("cyan", "green");
    }
  }, []);
  return null;
}
