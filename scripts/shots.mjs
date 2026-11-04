// Headless test of the reader: scripted choices through a complete tale, screenshots, and assertions.
// Usage: node scripts/shots.mjs [--url file|http] ; uses /usr/bin/google-chrome via playwright-core.
import { chromium } from 'playwright-core';
import { mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { validate, explain } from '../src/index.js';
const root = fileURLToPath(new URL('..', import.meta.url));
const shots = root + 'shots/';
mkdirSync(shots, { recursive: true });
const base = process.env.READER_URL || pathToFileURL(root + 'reader/index.html').href;
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const errors = [];
const results = [];
async function run(name, seed, script, viewport, shotsAt) {
  const page = await browser.newPage({ viewport });
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${name}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
  await page.goto(`${base}?seed=${encodeURIComponent(seed)}`);
  await page.waitForSelector('#art svg');
  const taken = [];
  const snap = async (label) => { await page.waitForTimeout(450); const f = `${shots}${name}-${String(taken.length + 1).padStart(2, '0')}-${label}.png`; await page.screenshot({ path: f, fullPage: viewport.width < 700 }); taken.push(f); };
  if (shotsAt.has('start')) await snap('opening');
  for (let guard = 0; guard < 80; guard++) {
    const choice = await page.$('#choices button');
    if (choice) {
      const key = await choice.getAttribute('data-choice');
      if (shotsAt.has(key)) await snap('choice-' + key);
      const want = script[key];
      const btn = want ? await page.$(`#choices button[data-value="${want}"]`) : choice;
      if (!btn) throw new Error(`${name}: option ${want} for ${key} not offered`);
      await btn.click();
      if (shotsAt.has(key + '-after')) await snap('after-' + key);
      continue;
    }
    if (await page.$('#verdict')) break;
    await page.keyboard.press('ArrowRight');
  }
  if (shotsAt.has('end')) { await page.click('#text details summary'); await snap('the-end'); }
  const st = await page.evaluate(() => ({ moves: window.PROPP_READER.state.tale.moves, choices: window.PROPP_READER.state.choices, verdict: document.getElementById('verdict')?.textContent, status: document.getElementById('status').textContent }));
  const res = validate(st.moves, { mode: 'strict' });
  results.push({ name, seed, choices: st.choices, functions: st.moves.flat().length, browserVerdict: st.verdict, nodeStrict: res.ok, nodeExplain: res.ok ? '' : explain(res), shots: taken });
  await page.close();
}
await run('desktop', 'birch-31', { interdiction: 'disobey', donorTest: 'kind', path: 'forest', confront: 'fight' }, { width: 1360, height: 860 }, new Set(['start', 'interdiction', 'donorTest', 'gift', 'path-after', 'confront', 'confront-after', 'end']));
await run('rude', 'owl-7', { interdiction: 'obey', donorTest: 'rude', path: 'sea', confront: 'trick' }, { width: 1360, height: 860 }, new Set(['confront-after', 'end']));
await run('phone', 'moth-404', { interdiction: 'obey', donorTest: 'clever', path: 'below', confront: 'contest' }, { width: 390, height: 844 }, new Set(['start', 'confront-after', 'end']));
await browser.close();
for (const r of results) for (const f of r.shots) { mkdirSync('/workspace/propp-shots', { recursive: true }); copyFileSync(f, '/workspace/propp-shots/' + f.split('/').pop()); }
console.log(JSON.stringify({ base, errors, results: results.map(({ shots, ...r }) => ({ ...r, shots: shots.map((s) => s.replace(root, '')) })) }, null, 2));
const ok = errors.length === 0 && results.every((r) => r.nodeStrict && /Valid tale/.test(r.browserVerdict || ''));
console.log(ok ? 'READER TEST: PASS' : 'READER TEST: FAIL');
process.exit(ok ? 0 : 1);
