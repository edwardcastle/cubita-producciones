import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const logoPath = join(publicDir, 'logo.jpeg');

async function generateFavicons() {
  console.log('Generating favicons from logo.jpeg...');

  // Generate favicon.ico (32x32)
  const favicon32 = await sharp(logoPath)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Generate favicon-16x16.png
  await sharp(logoPath)
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(publicDir, 'favicon-16x16.png'));
  console.log('Created favicon-16x16.png');

  // Generate favicon-32x32.png
  await sharp(logoPath)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(publicDir, 'favicon-32x32.png'));
  console.log('Created favicon-32x32.png');

  // Generate apple-touch-icon.png (180x180)
  await sharp(logoPath)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Generate android-chrome icons
  await sharp(logoPath)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toFile(join(publicDir, 'android-chrome-192x192.png'));
  console.log('Created android-chrome-192x192.png');

  await sharp(logoPath)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toFile(join(publicDir, 'android-chrome-512x512.png'));
  console.log('Created android-chrome-512x512.png');

  // Generate OG image (1200x630)
  await sharp(logoPath)
    .resize(1200, 630, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .jpeg({ quality: 90 })
    .toFile(join(publicDir, 'og-image.jpg'));
  console.log('Created og-image.jpg');

  // Create favicon.ico (using png as fallback - browsers accept png)
  await sharp(logoPath)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toFile(join(publicDir, 'favicon.ico'));
  console.log('Created favicon.ico (as PNG)');

  console.log('\nAll favicons generated successfully!');
}

generateFavicons().catch(console.error);
