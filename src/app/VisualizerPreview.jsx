"use client";

import { useEffect, useRef } from "react";
import { drawVisualizer } from "./visualizers";

export default function VisualizerPreview({ name }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const state = {};
    const spectrum = new Uint8Array(512);
    const waveform = new Uint8Array(512);
    let raf = 0;
    let width = 0;
    let height = 0;
    let lastPaint = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const paint = (now) => {
      raf = requestAnimationFrame(paint);
      if (!ctx || now - lastPaint < 140 || !width || !height) return;
      lastPaint = now;
      const time = now / 1000;
      const beat = Math.pow(Math.max(0, Math.sin(time * Math.PI * 2 * 1.45)), 7);
      for (let index = 0; index < spectrum.length; index++) {
        const x = index / spectrum.length;
        const bass = Math.exp(-Math.pow((x - 0.035) / 0.027, 2));
        const mid = Math.exp(-Math.pow((x - (0.2 + Math.sin(time * 0.3) * 0.035)) / 0.08, 2));
        const high = Math.exp(-Math.pow((x - (0.56 + Math.sin(time * 0.23) * 0.08)) / 0.15, 2));
        const texture = 0.08 + Math.abs(Math.sin(index * 0.37 + time * 2.6)) * 0.2;
        spectrum[index] = Math.round(Math.min(255, (bass * (0.24 + beat * 0.68) + mid * 0.28 + high * 0.23 + texture) * 220));
        waveform[index] = 128 + Math.round(Math.sin(index * 0.09 + time * 4) * (18 + beat * 80) + Math.sin(index * 0.17 - time * 2) * 10);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.shadowBlur = 5;
      drawVisualizer(ctx, { width, height, name, time, spectrum, waveform, state });
    };

    raf = requestAnimationFrame(paint);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [name]);

  return <canvas ref={canvasRef} className="visual-preview-canvas" aria-hidden="true" />;
}
