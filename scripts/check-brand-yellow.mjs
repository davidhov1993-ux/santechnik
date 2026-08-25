import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const brandColorHex = "#00aeef";
const brandColorRgb = "rgb(0, 174, 239)";

const sourceFiles = [
  "index.html",
  "public/site.webmanifest",
  "scripts/enhance-static-seo.mjs",
  "src/components/Seo.tsx",
  "src/index.clean.css",
  "src/lib/seo.ts",
  "src/pages/HomePage.tsx",
];

const disallowedTokens = [
  "#fed400",
  "rgb(254, 212, 0)",
  "rgba(254, 212, 0,",
  "#fdd31b",
  "#ffd500",
  "rgb(253, 211, 27)",
  "rgba(253, 211, 27,",
  "rgb(255, 213, 0)",
  "rgba(255, 213, 0,",
  "253,211,27",
  "local-match",
  "bg-matched-poster",
];

const requiredHomeText = [
  "САНТЕХНИК",
  "В ЕРЕВАНЕ",
  "ПОЗВОНИТЬ СЕЙЧАС",
  "WHATSAPP",
];

const requiredHeroAssets = [
  "hero-ru-cutout.png",
  "hero-hy-cutout.png",
  "ABED11A4-D50A-4449-8F3C-399D085CACC0.png",
  "ABED11A4-D50A-4449-8F3C-399D085CACC0 13.44.03.png",
];

const errors = [];

function readText(path) {
  return readFileSync(join(root, path), "utf8");
}

for (const file of sourceFiles) {
  const text = readText(file);
  const lowerText = text.toLowerCase();

  for (const token of disallowedTokens) {
    if (lowerText.includes(token.toLowerCase())) {
      errors.push(`${file} contains disallowed hero color/media token: ${token}`);
    }
  }
}

const css = readText("src/index.clean.css");
if (!css.includes(`--plumber-water: ${brandColorRgb}`)) {
  errors.push(`src/index.clean.css must define --plumber-water as ${brandColorRgb}`);
}

const indexHtml = readText("index.html");
if (!indexHtml.includes(`name="theme-color" content="${brandColorHex}"`)) {
  errors.push(`index.html theme-color must be ${brandColorHex}`);
}

const manifest = readText("public/site.webmanifest");
if (!manifest.includes(`"theme_color": "${brandColorHex}"`) || !manifest.includes(`"background_color": "${brandColorHex}"`)) {
  errors.push(`public/site.webmanifest colors must be ${brandColorHex}`);
}

const homePage = readText("src/pages/HomePage.tsx");
for (const text of requiredHomeText) {
  if (!homePage.includes(text)) {
    errors.push(`src/pages/HomePage.tsx must contain hero text: ${text}`);
  }
}

for (const asset of requiredHeroAssets) {
  if (!homePage.includes(asset)) {
    errors.push(`src/pages/HomePage.tsx must reference hero asset: ${asset}`);
  }
}

if (errors.length > 0) {
  console.error("Brand color guard failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Brand color guard passed (${brandColorHex}).`);
