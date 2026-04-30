import sharp from "sharp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

async function main() {
  const svg = readFileSync(join(root, "resources/icon.svg"));

  // 1024x1024 main icon
  await sharp(svg, { density: 300 })
    .resize(1024, 1024)
    .png()
    .toFile(join(root, "resources/icon.png"));
  console.log("✓ resources/icon.png");

  // Foreground (logo on transparent)
  await sharp(svg, { density: 300 })
    .resize(1024, 1024)
    .png()
    .toFile(join(root, "resources/icon-foreground.png"));
  console.log("✓ resources/icon-foreground.png");

  // Splash screen 2732x2732
  const bg = await sharp({
    create: {
      width: 2732, height: 2732, channels: 4,
      background: { r: 10, g: 14, b: 34, alpha: 1 },
    },
  }).png().toBuffer();

  const logoSized = await sharp(svg, { density: 300 })
    .resize(800, 800)
    .png()
    .toBuffer();

  await sharp(bg)
    .composite([{ input: logoSized, gravity: "center" }])
    .png()
    .toFile(join(root, "resources/splash.png"));
  console.log("✓ resources/splash.png");
}

main().catch((e) => { console.error(e); process.exit(1); });
