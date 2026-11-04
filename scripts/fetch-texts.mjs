// Downloads the public-domain source text into the gitignored .cache/ directory.
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
const url = 'https://www.gutenberg.org/cache/epub/62509/pg62509.txt';
const out = new URL('../.cache/pg62509.txt', import.meta.url);
mkdirSync(new URL('../.cache/', import.meta.url), { recursive: true });
if (existsSync(out)) { console.log('cached:', out.pathname); process.exit(0); }
const res = await fetch(url);
if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
writeFileSync(out, await res.text());
console.log('saved', out.pathname);
