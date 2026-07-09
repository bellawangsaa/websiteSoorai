import { readdir, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SRC = '/Users/raff.melvern/Documents/Bella-ngoding/Brandasset/PORTFOLIO';
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'public/works');

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => f.endsWith('.png')).sort();
await Promise.all(
  files.map((f, i) =>
    sharp(path.join(SRC, f))
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(OUT, `${String(i + 1).padStart(2, '0')}.webp`))
  )
);
await copyFile(path.join(SRC, '..', 'Logo1.png'), path.join(ROOT, 'public/logo-black.png'));
await copyFile(path.join(SRC, '..', 'Logo2.png'), path.join(ROOT, 'public/logo-white.png'));
console.log(`converted ${files.length} images`);
