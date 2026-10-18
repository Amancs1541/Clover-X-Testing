// Generates every brand asset from the supplied logo files.
// Run with:  npm install  then  npm run brand
// (Only needed when the logo changes. The website itself needs no build step.)
//
// Sources (brand/source/):
//   logo.png      – the clover mark, as supplied
//   wordmark.png  – the "CLOVER-X" wordmark, extracted from loader-ref.html
//
// 1. Traces both PNGs into vector paths with potrace and verifies each trace against the original.
// 2. Writes the logo set (lockup + mark, dark/white), favicons, app icons and the Open Graph image.
//
// When the designer supplies official SVGs, replace the traced paths with them.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import potrace from 'potrace';
import opentype from 'opentype.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(ROOT, 'brand/source');
const BRAND = path.join(ROOT, 'brand');
const SITE_BRAND = path.join(ROOT, 'assets/img/brand');
const SCALE = 4;

// Brand colours from the Clover-X UI kit (brand/source/buttons reference.pdf).
const PRIMARY = '#163944';
const DEEP = '#0F2B36';
const WHITE = '#FFFFFF';
const MINT = '#5CD0C2';

const fontFile = (w) => path.join(ROOT, `node_modules/@fontsource/outfit/files/outfit-latin-${w}-normal.woff`);

// Trace the dark shapes of a PNG into one SVG path. Returns the path data and its box (in SCALE units).
async function trace(file, { blur = SCALE * 0.7, alphaMax = 0.9, turdSize = 100 } = {}) {
  const { data, info } = await sharp(file).flatten({ background: '#fff' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  let minX = info.width, minY = info.height, maxX = 0, maxY = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[y * info.width + x] < 128) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  }
  const pad = 3;
  const crop = {
    left: Math.max(0, minX - pad), top: Math.max(0, minY - pad),
    width: Math.min(info.width, maxX + pad + 1) - Math.max(0, minX - pad),
    height: Math.min(info.height, maxY + pad + 1) - Math.max(0, minY - pad),
  };
  const big = await sharp(file).flatten({ background: '#fff' }).extract(crop)
    .resize(crop.width * SCALE, crop.height * SCALE, { kernel: 'lanczos3' })
    .greyscale().blur(blur) // suppress compression noise on the source edges so curves come out clean
    .png().toBuffer();
  const tracer = new potrace.Potrace();
  tracer.setParameters({ threshold: 128, turdSize, optCurve: true, optTolerance: 0.5, alphaMax, blackOnWhite: true });
  await new Promise((res, rej) => tracer.loadImage(big, (err) => (err ? rej(err) : res())));
  const d = tracer.getPathTag('#000').match(/ d="([^"]+)"/)[1];
  const w = crop.width * SCALE, h = crop.height * SCALE;

  // Verify: rasterise the trace back to source size and compare ink pixels.
  const orig = await sharp(file).flatten({ background: '#fff' }).extract(crop).greyscale().raw().toBuffer();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><path fill-rule="evenodd" d="${d}"/></svg>`;
  const back = await sharp(Buffer.from(svg)).resize(crop.width, crop.height).flatten({ background: '#fff' }).greyscale().raw().toBuffer();
  let diff = 0, ink = 0;
  for (let i = 0; i < orig.length; i++) { const a = orig[i] < 128, b = back[i] < 128; if (a) ink++; if (a !== b) diff++; }
  console.log(`${path.basename(file)}: trace differs on ${((diff / ink) * 100).toFixed(2)}% of ink pixels (edge anti-aliasing)`);

  // 400% side-by-side check image.
  const zoom = 4;
  const region = { left: Math.round(crop.width * 0.3), top: Math.round(crop.height * 0.2), width: Math.round(crop.width * 0.4), height: Math.round(crop.height * 0.6) };
  const a = await sharp(file).flatten({ background: '#fff' }).extract({ ...region, left: crop.left + region.left, top: crop.top + region.top })
    .resize(region.width * zoom, region.height * zoom, { kernel: 'nearest' }).png().toBuffer();
  const b = await sharp(Buffer.from(svg), { density: 72 * zoom / SCALE }).flatten({ background: '#fff' })
    .extract({ left: region.left * zoom, top: region.top * zoom, width: region.width * zoom, height: region.height * zoom }).png().toBuffer();
  await sharp({ create: { width: region.width * zoom * 2 + 16, height: region.height * zoom, channels: 3, background: '#ff00ff' } })
    .composite([{ input: a, left: 0, top: 0 }, { input: b, left: region.width * zoom + 16, top: 0 }])
    .png().toFile(path.join(BRAND, `check/compare-400pct-${path.basename(file, '.png')}.png`));

  return { d, w, h };
}

async function main() {
  for (const dir of ['svg', 'png', 'check']) await fs.mkdir(path.join(BRAND, dir), { recursive: true });
  await fs.mkdir(SITE_BRAND, { recursive: true });

  const mark = await trace(path.join(SOURCE, 'logo.png'), { blur: SCALE * 1.2, alphaMax: 1 });
  const word = await trace(path.join(SOURCE, 'wordmark.png'), { blur: SCALE * 0.75, alphaMax: 1, turdSize: 20 });

  const markSvg = (fill) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${mark.w} ${mark.h}" role="img" aria-label="Clover-X"><path fill="${fill}" fill-rule="evenodd" d="${mark.d}"/></svg>\n`;

  // Lockup: mark centred above the wordmark.
  const lockupParts = (fill) => {
    const wordW = mark.w * 1.75;               // wordmark width relative to the mark
    const k = wordW / word.w;                   // scale the traced wordmark to that width
    const wordH = word.h * k;
    const gap = mark.h * 0.17;
    const markX = (wordW - mark.w) / 2;
    const wordY = mark.h + gap;
    const inner =
      `<path fill="${fill}" fill-rule="evenodd" transform="translate(${r(markX)} 0)" d="${mark.d}"/>` +
      `<path fill="${fill}" fill-rule="evenodd" transform="translate(0 ${r(wordY)}) scale(${k.toFixed(5)})" d="${word.d}"/>`;
    return { inner, w: r(wordW), h: r(wordY + wordH) };
  };
  const lockupSvg = (fill) => {
    const { inner, w, h } = lockupParts(fill);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Clover-X">${inner}</svg>\n`;
  };
  const wordmarkSvg = (fill) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${word.w} ${word.h}" role="img" aria-label="Clover-X"><path fill="${fill}" fill-rule="evenodd" d="${word.d}"/></svg>\n`;

  const files = {
    'clover-x-logo-dark.svg': lockupSvg(PRIMARY),
    'clover-x-logo-white.svg': lockupSvg(WHITE),
    'clover-x-mark-dark.svg': markSvg(PRIMARY),
    'clover-x-mark-white.svg': markSvg(WHITE),
    'clover-x-wordmark-dark.svg': wordmarkSvg(PRIMARY),
    'clover-x-wordmark-white.svg': wordmarkSvg(WHITE),
  };
  for (const [name, svg] of Object.entries(files)) {
    await fs.writeFile(path.join(BRAND, 'svg', name), svg);
    await fs.writeFile(path.join(SITE_BRAND, name), svg);
    const width = name.includes('mark-') ? 1024 : 1600;
    await sharp(Buffer.from(svg), { density: 200 }).resize({ width }).png()
      .toFile(path.join(BRAND, 'png', name.replace('.svg', `-${width}w.png`)));
  }
  const { w: LW, h: LH } = lockupParts(PRIMARY);
  console.log(`Lockup aspect ratio ${(LW / LH).toFixed(3)} (width / height)`);

  // Favicons / app icons: mark only, white on brand teal.
  const iconSvg = (size, radius, markScale) => {
    const s = (size * markScale) / Math.max(mark.w, mark.h);
    const tx = (size - mark.w * s) / 2, ty = (size - mark.h * s) / 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${PRIMARY}"/>` +
      `<path fill="${WHITE}" fill-rule="evenodd" transform="translate(${r(tx)} ${r(ty)}) scale(${s.toFixed(5)})" d="${mark.d}"/></svg>\n`;
  };
  const out = {
    'favicon.svg': iconSvg(512, 112, 0.66),
    'favicon-32x32.png': await sharp(Buffer.from(iconSvg(512, 112, 0.7))).resize(32, 32).png().toBuffer(),
    'apple-touch-icon.png': await sharp(Buffer.from(iconSvg(512, 0, 0.6))).resize(180, 180).png().toBuffer(),
    'icon-192.png': await sharp(Buffer.from(iconSvg(512, 0, 0.6))).resize(192, 192).png().toBuffer(),
    'icon-512.png': await sharp(Buffer.from(iconSvg(512, 0, 0.6))).png().toBuffer(),
  };
  out['favicon.ico'] = pngToIco(out['favicon-32x32.png'], 32);
  for (const [name, buf] of Object.entries(out)) {
    await fs.writeFile(path.join(ROOT, name), buf);
    await fs.writeFile(path.join(BRAND, name.endsWith('.svg') ? 'svg' : 'png', name), buf);
  }

  // Open Graph / social preview image (1200x630).
  const ogFont = opentype.parse(toArrayBuffer(await fs.readFile(fontFile(500))));
  const lines = ['Secure, connected technology', 'for businesses that mean to grow.']
    .map((t, i) => ogFont.getPath(t, 80, 400 + i * 66, 54).toPathData(1)).join('');
  const lock = lockupParts(WHITE);
  const lockScale = 230 / lock.w;
  const bgScale = 620 / mark.h;
  const og = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${DEEP}"/>` +
    `<path fill="${WHITE}" fill-opacity="0.05" fill-rule="evenodd" transform="translate(${r(1200 - mark.w * bgScale + 60)} 20) scale(${bgScale.toFixed(5)})" d="${mark.d}"/>` +
    `<g transform="translate(80 80) scale(${lockScale.toFixed(5)})">${lock.inner}</g>` +
    `<rect x="80" y="318" width="56" height="4" rx="2" fill="${MINT}"/><path fill="${WHITE}" d="${lines}"/></svg>`;
  await sharp(Buffer.from(og)).png({ compressionLevel: 9, palette: true }).toFile(path.join(ROOT, 'assets/img/og-image.png'));

  console.log('Brand assets written to brand/, assets/img/brand/ and the site root.');
}

function r(n) { return Math.round(n * 100) / 100; }
function toArrayBuffer(buf) { return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength); }

// Wrap a PNG in a single-image ICO container (supported by all current browsers).
function pngToIco(png, size) {
  const h = Buffer.alloc(22);
  h.writeUInt16LE(0, 0); h.writeUInt16LE(1, 2); h.writeUInt16LE(1, 4);
  h.writeUInt8(size, 6); h.writeUInt8(size, 7); h.writeUInt16LE(1, 10); h.writeUInt16LE(32, 12);
  h.writeUInt32LE(png.length, 14); h.writeUInt32LE(22, 18);
  return Buffer.concat([h, png]);
}

main().catch((e) => { console.error(e); process.exit(1); });
