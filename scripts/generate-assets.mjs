/**
 * Generate PNG assets from SVG sources for SEO & PWA compatibility.
 * Run: node scripts/generate-assets.mjs
 */
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');

async function generate() {
  const faviconSvg = readFileSync(resolve(publicDir, 'favicon.svg'));
  const ogImageSvg = readFileSync(resolve(publicDir, 'og-image.svg'));

  // Favicon PNGs
  await sharp(faviconSvg).resize(32, 32).png().toFile(resolve(publicDir, 'favicon-32.png'));
  console.log('✓ favicon-32.png (32x32)');

  await sharp(faviconSvg).resize(180, 180).png().toFile(resolve(publicDir, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png (180x180)');

  await sharp(faviconSvg).resize(192, 192).png().toFile(resolve(publicDir, 'icon-192.png'));
  console.log('✓ icon-192.png (192x192)');

  await sharp(faviconSvg).resize(512, 512).png().toFile(resolve(publicDir, 'icon-512.png'));
  console.log('✓ icon-512.png (512x512)');

  // OG image PNG (for Facebook/LinkedIn compatibility)
  await sharp(ogImageSvg).resize(1200, 630).png().toFile(resolve(publicDir, 'og-image.png'));
  console.log('✓ og-image.png (1200x630)');

  console.log('\nAll assets generated successfully!');
}

generate().catch(console.error);
