import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
execSync('npx vite build', { stdio: 'inherit', cwd: ROOT });
const html = readFileSync(path.join(ROOT, 'dist/index.html'), 'utf8');
const slugs = ['by-the-wangs', 'mrs-drippy', 'frwd-club', 'spendquest', 'rasa-rose', 'puncak-mas', 'protein-bar', 'photography'];
for (const s of slugs) if (!html.includes(`data-slug="${s}"`)) throw new Error(`missing project: ${s}`);
if (!html.includes('BELLAWANGSAA@GMAIL.COM')) throw new Error('missing contact email');
if (!html.includes('data-lenis-prevent')) throw new Error('casestudy missing data-lenis-prevent');
if (!html.includes('Instagram') || !html.includes('Behance') || !html.includes('Whatsapp')) throw new Error('missing social links');
console.log('smoke ok');
