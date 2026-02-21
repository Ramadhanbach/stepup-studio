import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = path.resolve('public', 'images');

async function ensureWebp(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;
  const base = path.basename(file, ext);
  const dir = path.dirname(file);
  const webpPath = path.join(dir, `${base}.webp`);
  try {
    await fs.access(webpPath);
    return;
  } catch {}
  await sharp(file)
    .webp({ quality: 70 })
    .toFile(webpPath);
}

async function run() {
  try {
    const files = await fs.readdir(IMAGES_DIR);
    const targets = files.map(f => path.join(IMAGES_DIR, f));
    for (const f of targets) {
      await ensureWebp(f);
    }
    console.log('Images optimized to WebP where applicable.');
  } catch (e) {
    console.warn('Image optimization skipped:', e?.message || e);
  }
}

run();
