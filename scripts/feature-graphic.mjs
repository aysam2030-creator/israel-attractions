import sharp from "sharp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

async function main() {
  const W = 1024, H = 500;

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0e22"/>
        <stop offset="100%" stop-color="#1a1238"/>
      </linearGradient>
      <linearGradient id="text" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#a78bfa"/>
        <stop offset="50%" stop-color="#ec4899"/>
        <stop offset="100%" stop-color="#fbbf24"/>
      </linearGradient>
      <radialGradient id="orb1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="orb2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ec4899" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#ec4899" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <circle cx="100" cy="100" r="180" fill="url(#orb1)"/>
    <circle cx="900" cy="400" r="200" fill="url(#orb2)"/>

    <text x="60" y="180" font-family="Inter, Helvetica, sans-serif" font-size="68" font-weight="800" fill="url(#text)">Israel</text>
    <text x="60" y="260" font-family="Inter, Helvetica, sans-serif" font-size="68" font-weight="800" fill="url(#text)">Attractions</text>

    <text x="60" y="320" font-family="Inter, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#cbd5e1">Discover · Plan · Share — your trip, your way</text>

    <g transform="translate(60 360)">
      <rect x="0" y="0" width="120" height="40" rx="20" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)"/>
      <text x="60" y="26" font-size="16" fill="#a78bfa" text-anchor="middle" font-weight="600">🗺  Maps</text>

      <rect x="135" y="0" width="140" height="40" rx="20" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)"/>
      <text x="205" y="26" font-size="16" fill="#ec4899" text-anchor="middle" font-weight="600">⭐  Trip Planner</text>

      <rect x="290" y="0" width="120" height="40" rx="20" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)"/>
      <text x="350" y="26" font-size="16" fill="#22d3ee" text-anchor="middle" font-weight="600">💬  Chat</text>

      <rect x="425" y="0" width="120" height="40" rx="20" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)"/>
      <text x="485" y="26" font-size="16" fill="#fbbf24" text-anchor="middle" font-weight="600">🌐  3 langs</text>
    </g>

    <!-- Pin illustration -->
    <g transform="translate(800 250) scale(2)">
      <path d="M 0 -60 C -35 -60 -60 -35 -60 0 C -60 42 0 90 0 90 C 0 90 60 42 60 0 C 60 -35 35 -60 0 -60 Z" fill="#ec4899" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
      <circle cx="0" cy="-10" r="20" fill="#0a0e22"/>
      <text x="0" y="0" font-size="22" text-anchor="middle" fill="#fbbf24">🇮🇱</text>
    </g>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(join(root, "resources/feature-graphic.png"));
  console.log("✓ resources/feature-graphic.png (1024×500)");
}

main().catch((e) => { console.error(e); process.exit(1); });
