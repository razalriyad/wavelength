const TAU = Math.PI * 2;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const seeded = (index) => {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

export function drawVisualizer(ctx, { width, height, name, time, spectrum, waveform, state }) {
  const w = width;
  const h = height;
  const cx = w / 2;
  const cy = h / 2;
  const size = Math.min(w, h);
  const band = (position) => {
    if (!spectrum?.length) return 0.035 + 0.025 * Math.sin(time * 2.4 + position * 0.7);
    const index = Math.floor(Math.pow(clamp(position / 96), 1.8) * (spectrum.length - 1));
    const raw = spectrum[index] || 0;
    return clamp(raw / 255 + 0.018 * Math.sin(time * 2 + position));
  };
  const level = clamp((band(4) + band(15) + band(35) + band(68)) / 2.1);
  const signal = getComputedStyle(document.querySelector(".crt") || document.documentElement)
    .getPropertyValue("--signal").trim() || "#9bff79";
  const line = (points, alpha = 1, widthPx = 1.4) => {
    if (!points.length) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineWidth = widthPx;
    ctx.beginPath();
    points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
    ctx.stroke();
    ctx.restore();
  };
  const ring = (x, y, radius, alpha = 1, widthPx = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineWidth = widthPx;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(0.1, radius), 0, TAU);
    ctx.stroke();
    ctx.restore();
  };

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = signal;
  ctx.fillStyle = signal;
  ctx.shadowColor = signal;
  ctx.shadowBlur = 9;
  ctx.lineWidth = Math.max(1, size * 0.0035);

  if (name === "OSCILLOSCOPE") {
    for (let trace = 0; trace < 3; trace++) {
      const points = [];
      const step = Math.max(2, w / 400);
      for (let x = 0; x <= w; x += step) {
        const sample = waveform?.length
          ? (waveform[Math.floor((x / w) * (waveform.length - 1))] - 128) / 128
          : Math.sin(x * 0.045 + time * 3);
        const harmonic = Math.sin(x * (0.026 + trace * 0.008) - time * (2 + trace) + band(Math.floor((x / w) * 90)) * 4);
        points.push({ x, y: cy + sample * size * (0.14 + 0.22 * level) + harmonic * size * 0.035 * (trace + 1) });
      }
      line(points, 0.28 + trace * 0.25, trace === 1 ? 2 : 1);
    }
    for (let x = 0; x < w; x += Math.max(9, w / 48)) {
      const energy = band(Math.floor((x / w) * 90));
      ctx.globalAlpha = 0.12 + energy * 0.45;
      ctx.fillRect(x, h * 0.84, Math.max(1, w / 180), -energy * h * 0.15);
    }
  } else if (name === "SPECTRUM 80") {
    const count = 80;
    const gap = Math.max(1, w * 0.0035);
    const barW = Math.max(1, w / count - gap);
    for (let index = 0; index < count; index++) {
      const energy = band(index * 96 / count);
      const shaped = Math.pow(energy, 0.72);
      const barH = Math.max(2, shaped * h * 0.76);
      const x = (index / count) * w + gap / 2;
      const y = h - barH;
      ctx.globalAlpha = 0.34 + shaped * 0.66;
      ctx.fillRect(x, y, barW, barH);
      ctx.globalAlpha = 0.55 + shaped * 0.45;
      ctx.fillRect(x, y - 2 - shaped * 4, barW, 2);
      ctx.globalAlpha = 0.16 + shaped * 0.2;
      ctx.fillRect(x, y + barH * 0.25, barW, 1);
    }
    ctx.globalAlpha = 0.22;
    for (let y = h * 0.25; y < h; y += h * 0.25) ctx.fillRect(0, y, w, 1);
  } else if (name === "RADAR") {
    const radius = size * 0.44;
    for (let index = 1; index <= 5; index++) ring(cx, cy, radius * index / 5, 0.14 + index * 0.045, 1);
    for (let index = 0; index < 16; index++) {
      const angle = index * TAU / 16;
      ctx.globalAlpha = 0.22;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius); ctx.stroke();
    }
    const sweep = time * (0.55 + level * 0.8);
    for (let trail = 0; trail < 28; trail++) {
      const angle = sweep - trail * 0.012;
      ctx.globalAlpha = 0.02 + (1 - trail / 28) * 0.22;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius); ctx.stroke();
    }
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(sweep);
    const wedge = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    wedge.addColorStop(0, "rgba(130,255,190,.25)");
    wedge.addColorStop(1, "rgba(100,255,150,0)");
    ctx.fillStyle = wedge; ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, -0.6, 0.05); ctx.closePath(); ctx.fill();
    ctx.restore();
    for (let index = 0; index < 44; index++) {
      const angle = seeded(index) * TAU;
      const r = Math.sqrt(seeded(index + 91)) * radius;
      const targetBand = band(index * 2.1);
      const alignment = Math.cos(angle - sweep);
      const flash = Math.pow(Math.max(0, alignment), 18) * (0.3 + targetBand);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      ctx.globalAlpha = 0.18 + flash * 0.82;
      ctx.beginPath(); ctx.arc(x, y, 1 + targetBand * size * 0.012 + flash * 2.5, 0, TAU); ctx.fill();
      if (flash > 0.16) ring(x, y, 3 + flash * 12, flash * 0.55, 0.8);
    }
    ring(cx, cy, Math.max(2, size * 0.012), 0.9, 1.5);
  } else if (name === "PULSE") {
    const pulse = band(5);
    const baseline = cy;
    const points = [];
    const beatPhase = (time * (1.35 + pulse * 1.6)) % 1;
    for (let x = 0; x <= w; x += Math.max(2, w / 420)) {
      const pos = (x / w + beatPhase) % 1;
      const beat = Math.exp(-Math.pow((pos - 0.72) / 0.018, 2));
      const recovery = Math.exp(-Math.pow((pos - 0.79) / 0.045, 2));
      const sample = waveform?.length ? (waveform[Math.floor((x / w) * (waveform.length - 1))] - 128) / 128 : 0;
      const y = baseline + sample * h * 0.07 + (Math.sin(pos * TAU * 2) * 0.035 - beat * 0.45 + recovery * 0.12) * h * (0.45 + pulse * 0.55);
      points.push({ x, y });
    }
    for (let index = 0; index < 5; index++) ring(cx, cy, size * (0.08 + index * 0.075) * (0.85 + pulse * 0.22), 0.08 + pulse * 0.08, 0.8);
    line(points, 0.96, Math.max(1.5, size * 0.005));
    ctx.globalAlpha = 0.28;
    for (let x = 0; x < w; x += 12) ctx.fillRect(x, baseline, 1, 1);
    ctx.globalAlpha = 0.75;
    ctx.beginPath(); ctx.arc(cx, cy - size * 0.23, 2 + pulse * size * 0.035, 0, TAU); ctx.fill();
  } else if (name === "STARFIELD") {
    const speed = 0.075 + level * 0.17;
    for (let index = 0; index < 230; index++) {
      const z0 = seeded(index + 4);
      const z = ((z0 + time * speed * (0.35 + seeded(index + 88))) % 1);
      const x0 = (seeded(index + 15) - 0.5) * 2;
      const y0 = (seeded(index + 27) - 0.5) * 2;
      const perspective = 0.08 + z * z * 1.15;
      const x = cx + x0 * w * 0.52 * perspective;
      const y = cy + y0 * h * 0.58 * perspective;
      if (x < -8 || x > w + 8 || y < -8 || y > h + 8) continue;
      const radius = 0.5 + z * (1.2 + level * 3.2) + band(index * 0.41) * 2;
      const tail = 2 + z * (8 + level * 22);
      ctx.globalAlpha = 0.18 + z * 0.78;
      ctx.lineWidth = Math.max(0.6, radius * 0.45);
      ctx.beginPath(); ctx.moveTo(cx + (x - cx) * Math.max(0, 1 - tail / Math.max(w, h)), cy + (y - cy) * Math.max(0, 1 - tail / Math.max(w, h)));
      ctx.lineTo(x, y); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, radius, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 0.34;
    ring(cx, cy, size * (0.05 + level * 0.025), 0.5, 1);
  } else if (name === "SONOGRAPH") {
    const columns = Math.max(72, Math.min(150, Math.floor(w / 3)));
    const rows = 42;
    const history = state.sonogram || (state.sonogram = { last: -1, frames: [] });
    if (time - history.last > 0.035) {
      history.frames.push(Array.from({ length: rows }, (_, row) => band((row / rows) * 96)));
      history.frames = history.frames.slice(-columns);
      history.last = time;
    }
    const cellW = w / columns;
    const cellH = h / rows;
    for (let x = 0; x < columns; x++) {
      const frame = history.frames[Math.max(0, history.frames.length - columns + x)];
      if (!frame) continue;
      for (let row = 0; row < rows; row++) {
        const amplitude = frame[row];
        const age = x / columns;
        const glow = clamp(amplitude * (0.68 + age * 0.32));
        if (glow < 0.035) continue;
        ctx.fillStyle = `hsla(${178 - glow * 135},100%,${15 + glow * 48}%,${0.18 + glow * 0.82})`;
        ctx.fillRect(x * cellW, h - (row + 1) * cellH, cellW + 0.4, cellH + 0.35);
      }
    }
    ctx.strokeStyle = signal;
    ctx.globalAlpha = 0.75;
    const sweepX = (time * 52) % w;
    ctx.beginPath(); ctx.moveTo(sweepX, 0); ctx.lineTo(sweepX, h); ctx.stroke();
    const waveLine = [];
    for (let x = 0; x < w; x += Math.max(2, w / 300)) {
      const amplitude = band(Math.floor((x / w) * 96));
      waveLine.push({ x, y: h * 0.82 - amplitude * h * 0.42 });
    }
    line(waveLine, 0.76, 1);
  } else if (name === "NEUROSCAN") {
    const count = 72;
    const nodes = Array.from({ length: count }, (_, index) => {
      const angle = index * 2.399963;
      const radius = Math.sqrt((index + 0.5) / count);
      const x = cx + Math.cos(angle) * radius * w * 0.39;
      const y = cy + Math.sin(angle) * radius * h * 0.41;
      const activity = clamp(0.18 + band(index * 1.28) * 0.65 + Math.sin(time * 2.2 + index * 0.7) * 0.14);
      return { x, y, activity, radius: 1 + activity * 2.8 };
    });
    for (let a = 0; a < count; a++) {
      for (let b = a + 1; b < count; b++) {
        const first = nodes[a]; const second = nodes[b];
        const dx = first.x - second.x; const dy = first.y - second.y;
        const distance = Math.hypot(dx, dy);
        if (distance > size * 0.105) continue;
        const pulse = (Math.sin(time * 3 - distance * 0.018 + a * 0.2) + 1) * 0.5;
        ctx.globalAlpha = 0.045 + pulse * Math.min(first.activity, second.activity) * 0.38;
        ctx.lineWidth = 0.55 + pulse * 0.7;
        ctx.beginPath(); ctx.moveTo(first.x, first.y); ctx.lineTo(second.x, second.y); ctx.stroke();
      }
    }
    for (const node of nodes) {
      ctx.globalAlpha = 0.2 + node.activity * 0.8;
      ctx.beginPath(); ctx.arc(node.x, node.y, node.radius, 0, TAU); ctx.fill();
      if (node.activity > 0.58) ring(node.x, node.y, node.radius * (1.7 + Math.sin(time * 5) * 0.25), node.activity * 0.28, 0.7);
    }
    ctx.globalAlpha = 0.18;
    for (let fold = 0; fold < 5; fold++) {
      const points = [];
      for (let step = 0; step <= 40; step++) {
        const angle = (step / 40) * Math.PI;
        points.push({ x: cx + Math.cos(angle) * size * (0.11 + fold * 0.035), y: cy + Math.sin(angle) * size * 0.22 + Math.sin(angle * 3 + time) * 2 });
      }
      line(points, 0.18, 0.8);
    }
  } else if (name === "EVENT HORIZON") {
    const pulse = band(8);
    const radius = size * (0.105 + pulse * 0.045);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.22);
    const glow = ctx.createRadialGradient(0, 0, radius * 0.15, 0, 0, size * 0.45);
    glow.addColorStop(0, "rgba(0,0,0,0)");
    glow.addColorStop(0.25, "rgba(255,255,255,.06)");
    glow.addColorStop(0.42, "rgba(80,255,180,.28)");
    glow.addColorStop(0.6, "rgba(80,210,255,.1)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow; ctx.beginPath(); ctx.ellipse(0, 0, size * 0.46, size * 0.22, 0, 0, TAU); ctx.fill();
    for (let orbit = 0; orbit < 7; orbit++) {
      const orbitRadius = size * (0.18 + orbit * 0.036);
      ctx.globalAlpha = 0.08 + 0.06 * (6 - orbit) + pulse * 0.1;
      ctx.lineWidth = 1 + (7 - orbit) * 0.25;
      ctx.beginPath(); ctx.ellipse(0, 0, orbitRadius, orbitRadius * 0.42, time * (orbit % 2 ? -0.11 : 0.11), 0, TAU); ctx.stroke();
    }
    for (let particle = 0; particle < 150; particle++) {
      const angle = time * (0.35 + seeded(particle) * 0.8) + particle * 2.4;
      const orbit = size * (0.19 + seeded(particle + 70) * 0.25);
      const x = Math.cos(angle) * orbit;
      const y = Math.sin(angle) * orbit * 0.42;
      ctx.globalAlpha = 0.12 + seeded(particle + 31) * 0.7 + pulse * 0.14;
      ctx.beginPath(); ctx.arc(x, y, 0.6 + seeded(particle + 17) * 1.5, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.fillStyle = "#010303"; ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(0, 0, radius, 0, TAU); ctx.fill();
    ctx.strokeStyle = signal; ctx.shadowColor = signal; ctx.shadowBlur = 18;
    ring(0, 0, radius * (1.13 + pulse * 0.22), 0.9, 1.8);
    ctx.restore();
  } else if (name === "PRISM") {
    const latitudes = 11;
    const longitudes = 38;
    const points = [];
    const rotY = time * 0.28;
    const rotX = Math.sin(time * 0.21) * 0.6;
    for (let lat = 0; lat <= latitudes; lat++) {
      const phi = Math.PI * (lat / latitudes);
      for (let lon = 0; lon < longitudes; lon++) {
        const theta = TAU * lon / longitudes;
        const frequency = band((lat * 5 + lon * 1.3) % 96);
        const r = size * (0.3 + frequency * 0.12);
        const sx = Math.sin(phi) * Math.cos(theta) * r;
        const sy = Math.cos(phi) * r;
        const sz = Math.sin(phi) * Math.sin(theta) * r;
        const x1 = sx * Math.cos(rotY) - sz * Math.sin(rotY);
        const z1 = sx * Math.sin(rotY) + sz * Math.cos(rotY);
        const y2 = sy * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = sy * Math.sin(rotX) + z1 * Math.cos(rotX);
        const perspective = 2.4 / (2.4 + z2 / size);
        points.push({ x: cx + x1 * perspective, y: cy + y2 * perspective, z: z2, energy: frequency });
      }
    }
    for (let lat = 0; lat <= latitudes; lat++) {
      for (let lon = 0; lon < longitudes; lon++) {
        const here = points[lat * longitudes + lon];
        const next = points[lat * longitudes + (lon + 1) % longitudes];
        ctx.globalAlpha = 0.12 + clamp((here.z / size + 0.6) * 0.48) * 0.45 + here.energy * 0.25;
        ctx.beginPath(); ctx.moveTo(here.x, here.y); ctx.lineTo(next.x, next.y); ctx.stroke();
        if (lat < latitudes) {
          const below = points[(lat + 1) * longitudes + lon];
          ctx.globalAlpha *= 0.78;
          ctx.beginPath(); ctx.moveTo(here.x, here.y); ctx.lineTo(below.x, below.y); ctx.stroke();
        }
      }
    }
    for (let index = 0; index < points.length; index += 5) {
      const point = points[index];
      if (point.z < 0) continue;
      ctx.globalAlpha = 0.32 + point.energy * 0.68;
      ctx.beginPath(); ctx.arc(point.x, point.y, 0.6 + point.energy * 1.5, 0, TAU); ctx.fill();
    }
  } else if (name === "VORTEX") {
    const arms = 5;
    const particles = 42;
    for (let arm = 0; arm < arms; arm++) {
      const points = [];
      for (let step = 0; step < particles; step++) {
        const p = step / (particles - 1);
        const angle = arm * TAU / arms + p * 4.8 - time * (0.45 + band(arm * 12) * 0.6);
        const radius = size * (0.025 + p * 0.44);
        const ripple = band(Math.floor(p * 96)) * size * 0.04;
        points.push({ x: cx + Math.cos(angle) * (radius + ripple), y: cy + Math.sin(angle) * (radius + ripple) * 0.58 });
      }
      line(points, 0.32 + band(arm * 15) * 0.58, 1 + band(arm * 12) * 1.6);
      for (let particle = 0; particle < particles; particle += 3) {
        const point = points[particle];
        const energy = band(arm * 10 + particle);
        ctx.globalAlpha = 0.25 + energy * 0.75;
        ctx.beginPath(); ctx.arc(point.x, point.y, 0.7 + energy * 2.4, 0, TAU); ctx.fill();
      }
    }
    for (let ringIndex = 0; ringIndex < 6; ringIndex++) {
      const radius = size * (0.06 + ringIndex * 0.064);
      ring(cx, cy, radius, 0.06 + band(ringIndex * 9) * 0.18, 0.8);
    }
  } else if (name === "SPECTRAL TERRAIN") {
    const columns = 32;
    const rows = 22;
    const project = (x, z, elevation) => {
      const perspective = 1 / (1 + z * 0.78);
      return { x: cx + x * size * 0.67 * perspective, y: h * 0.78 + z * size * 0.24 - elevation * size * 0.4 * perspective };
    };
    for (let row = 0; row <= rows; row++) {
      const z = row / rows;
      const points = [];
      for (let column = 0; column <= columns; column++) {
        const x = column / columns * 2 - 1;
        const frequency = band(Math.floor(column / columns * 95));
        const ridge = Math.sin(x * 9 + time * 0.5 + z * 4) * 0.09 + Math.cos(x * 17 - z * 9 - time * 0.38) * 0.045;
        const elevation = ridge + frequency * (0.18 + 0.2 * Math.sin(z * 9 + time + column * 0.12));
        points.push(project(x, z, elevation));
      }
      line(points, 0.18 + (1 - z) * 0.4, 0.7 + (1 - z) * 0.55);
    }
    for (let column = 0; column <= columns; column += 2) {
      const points = [];
      const x = column / columns * 2 - 1;
      for (let row = 0; row <= rows; row++) {
        const z = row / rows;
        const frequency = band(Math.floor(column / columns * 95));
        const ridge = Math.sin(x * 9 + time * 0.5 + z * 4) * 0.09 + Math.cos(x * 17 - z * 9 - time * 0.38) * 0.045;
        points.push(project(x, z, ridge + frequency * (0.18 + 0.2 * Math.sin(z * 9 + time + column * 0.12))));
      }
      line(points, 0.1 + band(column * 3) * 0.34, 0.65);
    }
  } else if (name === "AURORA") {
    for (let layer = 0; layer < 9; layer++) {
      const points = [];
      const energyBand = band(layer * 11);
      for (let index = 0; index <= 240; index++) {
        const x = (index / 240) * w;
        const envelope = Math.pow(Math.sin(Math.PI * index / 240), 0.48);
        const waveA = Math.sin(index * 0.035 + time * (0.4 + layer * 0.03) + layer * 0.6);
        const waveB = Math.sin(index * 0.012 - time * 0.22 + layer) * 0.65;
        const y = h * (0.3 + layer * 0.055) + (waveA * 0.12 + waveB * 0.07) * h * envelope * (0.55 + energyBand);
        points.push({ x, y });
      }
      ctx.strokeStyle = `hsla(${145 + layer * 21},100%,${48 + energyBand * 25}%,1)`;
      line(points, 0.11 + energyBand * 0.13, 2 + energyBand * 5);
      ctx.strokeStyle = signal;
    }
    for (let stream = 0; stream < 34; stream++) {
      const x = (seeded(stream) * w + time * (10 + stream % 7 * 3)) % w;
      const y = h * (0.15 + seeded(stream + 3) * 0.65);
      const length = 5 + band(stream * 2) * 32;
      ctx.globalAlpha = 0.16 + band(stream * 3) * 0.55;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + length * 0.25, y - length); ctx.stroke();
    }
  }

  ctx.restore();
}
