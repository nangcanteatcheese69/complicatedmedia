/**
 * Builds the studio's sample plates and silent reel loops.
 * Re-run with `npm run plates` (needs sharp and ffmpeg).
 * Output is committed under public/media so the site works without this step.
 */
import { execFile } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const root = path.resolve(import.meta.dirname, "..");
const mediaDir = path.join(root, "public/media");
const reelDir = path.join(mediaDir, "reels");

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function svgDoc(w, h, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="36"/>
    </filter>
    <filter id="softer" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="70"/>
    </filter>
    <radialGradient id="vig" cx="50%" cy="44%" r="75%">
      <stop offset="50%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#1a1612" stop-opacity="0.42"/>
    </radialGradient>
  </defs>
  ${body}
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
</svg>`;
}

function wave(w, y, amp, seed, step = 48) {
  const rand = mulberry32(seed);
  let d = `M0 ${y.toFixed(1)}`;
  for (let x = step; x <= w + step; x += step) {
    const dy = (rand() - 0.5) * 2 * amp;
    d += ` L${Math.min(x, w).toFixed(1)} ${(y + dy).toFixed(1)}`;
  }
  return d;
}

async function grain(w, h, seed) {
  const gw = Math.max(2, Math.round(w / 2));
  const gh = Math.max(2, Math.round(h / 2));
  const rand = mulberry32(seed);
  const buf = Buffer.alloc(gw * gh * 4);
  for (let i = 0; i < gw * gh; i += 1) {
    const v = 70 + Math.floor(rand() * 170);
    buf[i * 4] = v;
    buf[i * 4 + 1] = v;
    buf[i * 4 + 2] = v;
    buf[i * 4 + 3] = 42;
  }
  return sharp(buf, { raw: { width: gw, height: gh, channels: 4 } })
    .resize(w, h)
    .png()
    .toBuffer();
}

async function render(file, w, h, body, seed) {
  const base = await sharp(Buffer.from(svgDoc(w, h, body)))
    .resize(w, h)
    .png()
    .toBuffer();
  const noise = await grain(w, h, seed);
  await sharp(base)
    .composite([{ input: noise, blend: "over" }])
    .jpeg({ quality: 80, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(path.join(mediaDir, file));
}

const plates = [
  {
    file: "salt-01.jpg",
    w: 2000,
    h: 1334,
    seed: 11,
    body: (w, h) => `
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#d7d5cc"/>
          <stop offset="46%" stop-color="#c3cdc8"/>
          <stop offset="100%" stop-color="#a9b7b2"/>
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#8ea29c"/>
          <stop offset="45%" stop-color="#6d827c"/>
          <stop offset="100%" stop-color="#4c615c"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#sky)"/>
      <rect y="760" width="${w}" height="${h - 760}" fill="url(#sea)"/>
      <path d="${wave(w, 790, 10, 21)}" fill="none" stroke="#e6e0d2" stroke-width="3" opacity="0.9"/>
      <path d="${wave(w, 806, 6, 22)}" fill="none" stroke="#f4f0e6" stroke-width="1.5" opacity="0.7"/>
      <ellipse cx="1460" cy="748" rx="620" ry="70" fill="#f3efe4" opacity="0.55" filter="url(#soft)"/>
      <polygon points="1540,770 1610,766 1648,${h} 1496,${h}" fill="#2f3836" opacity="0.5"/>
      <rect y="820" width="${w}" height="28" fill="#d5ded8" opacity="0.22"/>
    `,
  },
  {
    file: "salt-02.jpg",
    w: 1400,
    h: 1800,
    seed: 12,
    body: (w, h) => {
      const bands = ["#b7b3a8", "#cfc8ba", "#a8a89e", "#ddd6c8", "#9aa39c", "#c3beb2", "#8f9792"];
      const rects = bands
        .map((color, i) => {
          const y = Math.round((h / bands.length) * i);
          const height = Math.round(h / bands.length) + 2;
          return `<rect y="${y}" width="${w}" height="${height}" fill="${color}"/>`;
        })
        .join("");
      return `
        <rect width="${w}" height="${h}" fill="#cfc8ba"/>
        ${rects}
        <path d="${wave(w, 640, 18, 31)}" fill="none" stroke="#f3efe6" stroke-width="4" opacity="0.75"/>
        <path d="${wave(w, 1120, 14, 32)}" fill="none" stroke="#6d736e" stroke-width="2" opacity="0.35"/>
        <ellipse cx="700" cy="400" rx="500" ry="180" fill="#f7f3ea" opacity="0.25" filter="url(#softer)"/>
      `;
    },
  },
  {
    file: "salt-03.jpg",
    w: 2000,
    h: 1250,
    seed: 13,
    body: (w, h) => `
      <defs>
        <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#d9d6ce"/>
          <stop offset="100%" stop-color="#b7bdb8"/>
        </linearGradient>
        <linearGradient id="wet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7e8b86"/>
          <stop offset="30%" stop-color="#3e4a47"/>
          <stop offset="100%" stop-color="#2a3331"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#wet)"/>
      <rect width="${w}" height="340" fill="url(#dusk)"/>
      <ellipse cx="1000" cy="330" rx="900" ry="60" fill="#f4f1e8" opacity="0.45" filter="url(#soft)"/>
      <rect y="360" width="${w}" height="70" fill="#c5cec8" opacity="0.28"/>
      <path d="${wave(w, 390, 8, 41)}" fill="none" stroke="#ece7dc" stroke-width="2" opacity="0.8"/>
    `,
  },
  {
    file: "salt-04.jpg",
    w: 1800,
    h: 1500,
    seed: 14,
    body: (w, h) => `
      <rect width="${w}" height="${h}" fill="#d4cfc4"/>
      <rect y="180" width="${w}" height="220" fill="#e7e2d6" opacity="0.85"/>
      <rect y="430" width="${w}" height="160" fill="#c9c3b6"/>
      <rect y="620" width="${w}" height="90" fill="#f3efe6" opacity="0.7"/>
      <rect y="760" width="${w}" height="280" fill="#b7b1a4"/>
      <rect y="1080" width="${w}" height="${h - 1080}" fill="#9aa197"/>
      <path d="${wave(w, 610, 16, 51)}" fill="none" stroke="#f7f4ec" stroke-width="6" opacity="0.8"/>
      <path d="${wave(w, 980, 12, 52)}" fill="none" stroke="#efeadf" stroke-width="3" opacity="0.55"/>
      <ellipse cx="900" cy="300" rx="700" ry="160" fill="#fffaf2" opacity="0.35" filter="url(#softer)"/>
    `,
  },
  {
    file: "market-01.jpg",
    w: 1500,
    h: 1900,
    seed: 21,
    body: (w, h) => `
      <rect width="${w}" height="${h}" fill="#141311"/>
      <rect x="160" y="280" width="1180" height="1460" fill="#2a2118"/>
      <rect x="230" y="390" width="980" height="1220" fill="#c4844a" opacity="0.35" filter="url(#softer)"/>
      <rect x="300" y="520" width="820" height="980" fill="#1c1612"/>
      <rect x="340" y="860" width="740" height="90" fill="#a86b34"/>
      <rect x="340" y="980" width="740" height="70" fill="#6e4324"/>
      <rect x="340" y="1080" width="740" height="220" fill="#c98948" opacity="0.85"/>
      <rect x="340" y="1320" width="500" height="50" fill="#3a2a1e"/>
      <circle cx="720" cy="430" r="16" fill="#f6e7c4"/>
      <circle cx="720" cy="430" r="90" fill="#f0d7a4" opacity="0.45" filter="url(#soft)"/>
      <rect x="690" y="250" width="4" height="180" fill="#5a4a38" opacity="0.7"/>
    `,
  },
  {
    file: "market-02.jpg",
    w: 1900,
    h: 1400,
    seed: 22,
    body: (w, h) => {
      const rand = mulberry32(220);
      let rain = "";
      for (let i = 0; i < 70; i += 1) {
        const x = Math.round(rand() * w);
        const y = Math.round(rand() * h);
        const len = 40 + Math.round(rand() * 90);
        rain += `<line x1="${x}" y1="${y}" x2="${x + 8}" y2="${y + len}" stroke="#efe8dc" stroke-width="1.2" opacity="0.22"/>`;
      }
      return `
        <rect width="${w}" height="${h}" fill="#12110f"/>
        <ellipse cx="980" cy="760" rx="620" ry="280" fill="#e0a15a" opacity="0.55" filter="url(#softer)"/>
        <rect x="430" y="420" width="980" height="620" fill="#1a140f" opacity="0.35"/>
        <rect x="520" y="560" width="760" height="360" fill="#c17a3c" opacity="0.8"/>
        <rect x="560" y="620" width="680" height="40" fill="#f0d2a4" opacity="0.35"/>
        ${rain}
      `;
    },
  },
  {
    file: "market-03.jpg",
    w: 1700,
    h: 1700,
    seed: 23,
    body: (w, h) => `
      <rect width="${w}" height="${h}" fill="#181614"/>
      <ellipse cx="420" cy="480" rx="180" ry="70" fill="#e6b56a" opacity="0.75" filter="url(#soft)"/>
      <ellipse cx="860" cy="390" rx="140" ry="54" fill="#f0d7a6" opacity="0.8" filter="url(#soft)"/>
      <ellipse cx="1280" cy="560" rx="200" ry="80" fill="#c4844a" opacity="0.7" filter="url(#soft)"/>
      <ellipse cx="640" cy="980" rx="240" ry="90" fill="#a86b34" opacity="0.65" filter="url(#soft)"/>
      <ellipse cx="1180" cy="1120" rx="160" ry="60" fill="#f3e0bc" opacity="0.55" filter="url(#soft)"/>
      <circle cx="860" cy="390" r="10" fill="#fff6e4"/>
      <circle cx="420" cy="470" r="8" fill="#fff1d4"/>
      <circle cx="1280" cy="540" r="9" fill="#ffe7c2"/>
      <rect x="180" y="1240" width="1340" height="16" fill="#2a241e"/>
    `,
  },
  {
    file: "market-04.jpg",
    w: 1400,
    h: 1860,
    seed: 24,
    body: (w, h) => `
      <rect width="${w}" height="${h}" fill="#100f0e"/>
      <polygon points="520,0 880,0 760,${h} 640,${h}" fill="#2a241c"/>
      <polygon points="600,0 800,0 730,${h} 690,${h}" fill="#e0b074" opacity="0.18"/>
      <ellipse cx="700" cy="1500" rx="160" ry="60" fill="#f0c98a" opacity="0.7" filter="url(#soft)"/>
      <circle cx="700" cy="1460" r="14" fill="#f8ecc8"/>
      <rect x="250" y="0" width="90" height="${h}" fill="#1c1916"/>
      <rect x="1060" y="0" width="110" height="${h}" fill="#1a1714"/>
    `,
  },
  {
    file: "room-01.jpg",
    w: 1600,
    h: 2000,
    seed: 31,
    body: (w, h) => `
      <rect width="${w}" height="${h}" fill="#cbbfae"/>
      <rect y="1460" width="${w}" height="${h - 1460}" fill="#8d8274"/>
      <rect x="0" y="1454" width="${w}" height="8" fill="#6f675d"/>
      <rect x="250" y="180" width="620" height="860" fill="#f4ecdf"/>
      <rect x="274" y="204" width="572" height="812" fill="#d9d0c2" opacity="0.25"/>
      <polygon points="250,1040 870,1040 1180,${h} 40,${h}" fill="#f3eadc" opacity="0.82"/>
      <polygon points="360,1040 760,1040 980,${h} 180,${h}" fill="#fff8ee" opacity="0.28"/>
      <ellipse cx="560" cy="980" rx="420" ry="80" fill="#fff6ea" opacity="0.45" filter="url(#soft)"/>
    `,
  },
  {
    file: "room-02.jpg",
    w: 2000,
    h: 1400,
    seed: 32,
    body: (w, h) => `
      <rect width="${w}" height="${h}" fill="#6a6258"/>
      <rect x="180" y="160" width="1640" height="1100" fill="#5a534b"/>
      <rect x="430" y="210" width="760" height="1040" fill="#d9d0c2"/>
      <rect x="560" y="300" width="500" height="620" fill="#f6f1e6"/>
      <polygon points="560,920 1060,920 1120,1250 500,1250" fill="#efe6d6" opacity="0.9"/>
      <rect x="1280" y="260" width="420" height="900" fill="#7d7468"/>
      <rect x="0" y="1180" width="${w}" height="8" fill="#3e3934" opacity="0.45"/>
    `,
  },
  {
    file: "room-03.jpg",
    w: 1500,
    h: 1900,
    seed: 33,
    body: (w, h) => `
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#d5cbbd"/>
          <stop offset="100%" stop-color="#c3b7a6"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#wall)"/>
      <rect x="0" y="0" width="180" height="${h}" fill="#b7ab9b" opacity="0.7"/>
      <circle cx="640" cy="720" r="7" fill="#5c554c"/>
      <ellipse cx="640" cy="760" rx="18" ry="6" fill="#5c554c" opacity="0.28"/>
      <rect y="${h - 120}" width="${w}" height="120" fill="#a89c8c" opacity="0.55"/>
    `,
  },
  {
    file: "room-04.jpg",
    w: 2000,
    h: 1500,
    seed: 34,
    body: (w, h) => `
      <rect width="${w}" height="${h}" fill="#b7aea0"/>
      <rect x="150" y="0" width="520" height="${h}" fill="#f4efe4" opacity="0.92"/>
      <rect x="210" y="0" width="80" height="${h}" fill="#fffaf2" opacity="0.55"/>
      <rect x="430" y="0" width="36" height="${h}" fill="#e4d9c8" opacity="0.8"/>
      <rect x="150" y="0" width="14" height="${h}" fill="#8d8273"/>
      <rect x="656" y="0" width="14" height="${h}" fill="#8d8273"/>
      <ellipse cx="400" cy="200" rx="260" ry="80" fill="#fffaf3" opacity="0.5" filter="url(#soft)"/>
    `,
  },
  {
    file: "studio-01.jpg",
    w: 1800,
    h: 1450,
    seed: 41,
    body: (w, h) => `
      <rect width="${w}" height="${h}" fill="#cfc3b2"/>
      <polygon points="0,0 700,0 480,${h} 0,${h}" fill="#f6f1e6" opacity="0.55"/>
      <rect y="860" width="${w}" height="${h - 860}" fill="#8d7f6e"/>
      <g transform="translate(780 620)">
        <rect x="0" y="70" width="620" height="36" fill="#e7dfd1" transform="rotate(-2)"/>
        <rect x="16" y="48" width="600" height="34" fill="#f7f3ea" transform="rotate(1.4)"/>
        <rect x="8" y="24" width="610" height="34" fill="#efe6d6" transform="rotate(-1)"/>
        <rect x="24" y="0" width="590" height="32" fill="#fbf7f0" transform="rotate(0.6)"/>
      </g>
      <ellipse cx="1100" cy="760" rx="420" ry="40" fill="#2c261f" opacity="0.18" filter="url(#soft)"/>
    `,
  },
  {
    file: "studio-02.jpg",
    w: 2000,
    h: 1400,
    seed: 42,
    body: (w, h) => `
      <rect width="${w}" height="${h}" fill="#6e675f"/>
      <line x1="180" y1="250" x2="1820" y2="236" stroke="#d9d2c6" stroke-width="3"/>
      <g fill="#e6dfd2">
        <rect x="280" y="250" width="280" height="760"/>
        <rect x="640" y="236" width="300" height="820"/>
        <rect x="1020" y="260" width="260" height="700"/>
        <rect x="1360" y="244" width="290" height="790"/>
      </g>
      <g fill="#2a2622" opacity="0.22">
        <rect x="292" y="1000" width="280" height="18"/>
        <rect x="654" y="1044" width="300" height="18"/>
        <rect x="1032" y="948" width="260" height="16"/>
        <rect x="1374" y="1022" width="290" height="18"/>
      </g>
      <rect x="300" y="270" width="240" height="520" fill="#f7f3ea" opacity="0.35"/>
      <rect x="1380" y="270" width="250" height="400" fill="#d5c7b0" opacity="0.4"/>
    `,
  },
  {
    file: "studio-03.jpg",
    w: 1500,
    h: 1850,
    seed: 43,
    body: (w, h) => `
      <rect width="${w}" height="${h}" fill="#c8bba8"/>
      <rect x="160" y="120" width="1180" height="900" fill="#f3eee4"/>
      <rect x="210" y="170" width="1080" height="800" fill="#e4d9c8" opacity="0.35"/>
      <ellipse cx="750" cy="1320" rx="280" ry="70" fill="#3a3128" opacity="0.85"/>
      <ellipse cx="750" cy="1290" rx="180" ry="36" fill="#1c1814"/>
      <rect x="980" y="1180" width="18" height="280" fill="#4a3424" transform="rotate(18 989 1320)"/>
      <ellipse cx="400" cy="520" rx="260" ry="140" fill="#fffaf2" opacity="0.45" filter="url(#soft)"/>
    `,
  },
  {
    file: "studio-04.jpg",
    w: 1800,
    h: 1400,
    seed: 44,
    body: (w, h) => {
      const rand = mulberry32(440);
      let drops = "";
      for (let i = 0; i < 46; i += 1) {
        const x = 200 + Math.round(rand() * 1400);
        const y = 80 + Math.round(rand() * 1100);
        const r = 6 + Math.round(rand() * 16);
        drops += `<circle cx="${x}" cy="${y}" r="${r}" fill="#f7f4ee" opacity="${(0.18 + rand() * 0.35).toFixed(2)}"/>`;
      }
      return `
        <rect width="${w}" height="${h}" fill="#8d8680"/>
        <rect x="140" y="60" width="1520" height="1280" fill="#b7b1a8"/>
        <rect x="180" y="100" width="1440" height="1200" fill="#c9c3ba"/>
        ${drops}
        <rect x="140" y="60" width="18" height="1280" fill="#5e5954"/>
        <rect x="1642" y="60" width="18" height="1280" fill="#5e5954"/>
        <rect x="140" y="60" width="1520" height="18" fill="#5e5954"/>
        <rect x="140" y="1322" width="1520" height="18" fill="#5e5954"/>
      `;
    },
  },
];

const reels = [
  { id: "tide-study", source: "salt-02.jpg" },
  { id: "stall-light", source: "market-01.jpg" },
  { id: "one-window", source: "room-01.jpg" },
  { id: "proofs-drying", source: "studio-02.jpg" },
  { id: "alley-lamp", source: "market-04.jpg" },
];

async function makeReel(id, source) {
  const poster = path.join(reelDir, `${id}.jpg`);
  const mp4 = path.join(reelDir, `${id}.mp4`);
  await sharp(path.join(mediaDir, source))
    .resize(1080, 1920, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(poster);

  await execFileAsync("ffmpeg", [
    "-y",
    "-loop",
    "1",
    "-framerate",
    "24",
    "-i",
    poster,
    "-vf",
    "scale=2160:-1,zoompan=z='min(zoom+0.0008,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=120:s=720x1280:fps=24",
    "-frames:v",
    "120",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-an",
    "-movflags",
    "+faststart",
    "-crf",
    "28",
    "-preset",
    "veryfast",
    mp4,
  ]);
}

await mkdir(reelDir, { recursive: true });

for (const plate of plates) {
  process.stdout.write(`plate ${plate.file}\n`);
  await render(plate.file, plate.w, plate.h, plate.body(plate.w, plate.h), plate.seed);
}

for (const reel of reels) {
  process.stdout.write(`reel ${reel.id}\n`);
  await makeReel(reel.id, reel.source);
}

process.stdout.write("done\n");
