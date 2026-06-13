// Generate circular (round) icons from public/profile.jpg.
// JPEG can't have transparent corners, so the square photo renders as a square in
// browser tabs. These PNGs mask the photo to a circle with transparent corners so
// the favicon, apple-touch-icon, and PWA icons all appear round.
//
// Run once after changing the photo: `npm run gen-icons`

import sharp from 'sharp';
import path from 'node:path';

// npm run sets cwd to the package root; write straight into public/.
const OUT = path.resolve(process.cwd(), 'public');
const SRC = path.join(OUT, 'profile.jpg');

/** Build a circular PNG of the given size with fully transparent corners. */
async function roundIcon(size, file) {
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  );
  await sharp(SRC)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toFile(path.join(OUT, file));
  console.log(`  ✓ ${file} (${size}×${size}, round)`);
}

/**
 * Maskable PWA icon: full-bleed square (NO transparency). Android/iOS apply their own
 * circle/squircle mask, so the source must fill the safe area edge-to-edge.
 */
async function maskableIcon(size, file) {
  await sharp(SRC)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .png()
    .toFile(path.join(OUT, file));
  console.log(`  ✓ ${file} (${size}×${size}, maskable square)`);
}

console.log('Generating round icons from profile.jpg …');
await roundIcon(32, 'favicon-32.png');
await roundIcon(180, 'apple-touch-icon.png');
await roundIcon(192, 'icon-192.png');
await roundIcon(512, 'icon-512.png');
await maskableIcon(512, 'icon-maskable-512.png');
console.log('Done.');
