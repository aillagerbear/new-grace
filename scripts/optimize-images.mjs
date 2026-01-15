import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import path from 'path';

const PUBLIC_DIR = './public';

async function optimizeImage(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;

  const stats = await stat(inputPath);
  const sizeMB = stats.size / (1024 * 1024);

  if (sizeMB < 0.5) return; // Skip small images

  console.log(`Optimizing: ${inputPath} (${sizeMB.toFixed(2)} MB)`);

  const baseName = path.basename(inputPath, ext);
  const dir = path.dirname(inputPath);

  // Create WebP version
  const webpPath = path.join(dir, `${baseName}.webp`);
  await sharp(inputPath)
    .resize(1920, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(webpPath);

  const webpStats = await stat(webpPath);
  console.log(`  → WebP: ${(webpStats.size / 1024).toFixed(0)} KB`);

  // Create optimized PNG fallback
  const optimizedPath = path.join(dir, `${baseName}_optimized.png`);
  await sharp(inputPath)
    .resize(1920, null, { withoutEnlargement: true })
    .png({ quality: 80, compressionLevel: 9 })
    .toFile(optimizedPath);

  const optimizedStats = await stat(optimizedPath);
  console.log(`  → PNG: ${(optimizedStats.size / 1024).toFixed(0)} KB`);
}

async function main() {
  const files = await readdir(PUBLIC_DIR);
  for (const file of files) {
    const filePath = path.join(PUBLIC_DIR, file);
    const stats = await stat(filePath);
    if (stats.isFile()) {
      await optimizeImage(filePath);
    }
  }
  console.log('Done!');
}

main().catch(console.error);
