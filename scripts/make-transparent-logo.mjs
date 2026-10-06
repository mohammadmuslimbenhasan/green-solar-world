// Converts the official logo (logo.jpg, white background) into transparent PNGs:
//  - public/images/logo-mark.png   — leaf symbol only (used in header/footer with the wordmark beside it)
//  - public/images/logo-full.png   — full logo incl. wordmark, background removed (login panel, dark sections)
// White becomes transparent via a whiteness->alpha ramp with un-premultiplied
// color, so dark text and colored leaves stay crisp without a white halo.
import sharp from 'sharp';

const SRC = "public/images/logo.jpg";

function keyOutWhite(png) {
  // Background min-channel clusters at 240+; content sits below ~230.
  // Fully opaque below LO, transparent at HI, smooth ramp between.
  const LO = 226, HI = 250;
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
    const m = Math.min(r, g, b);
    let alpha = Math.round(((HI - m) / (HI - LO)) * 255);
    alpha = alpha < 0 ? 0 : alpha > 255 ? 255 : alpha;
    png.data[i + 3] = alpha;
    if (alpha > 0) {
      const f = 255 / alpha;
      png.data[i] = Math.min(255, Math.round(r * f));
      png.data[i + 1] = Math.min(255, Math.round(g * f));
      png.data[i + 2] = Math.min(255, Math.round(b * f));
    }
  }
  return png;
}

const img = sharp(SRC);
const meta = await img.metadata();
const { width: W, height: H } = meta;

// Trim fully transparent borders after keying, so crops land tightly.
async function keyed(src) {
  const png = await src.raw().toBuffer({ resolveWithObject: true });
  return keyOutWhite(png);
}

// Full logo, keyed + trimmed.
const full = await keyed(img.clone());
const fullPng = sharp(full.data, { raw: full.info }).png().trim({ threshold: 10 });
await fullPng.toFile("public/images/logo-full.png");

// Leaf mark: crop the area above the wordmark, then key + trim.
// The wordmark starts ~62% down the original 170x95 JPEG; keep headroom.
const markSrc = img.clone().extract({ left: 0, top: 0, width: W, height: Math.round(H * 0.62) });
const mark = await keyed(markSrc);
await sharp(mark.data, { raw: mark.info }).png().trim({ threshold: 10 }).toFile("public/images/logo-mark.png");

console.log("wrote public/images/logo-full.png and public/images/logo-mark.png");
