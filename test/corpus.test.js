import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { data } from '../src/index.js';
const corpus = JSON.parse(readFileSync(new URL('../corpus/tales.json', import.meta.url), 'utf8'));
const ids = new Set(data.functions.map((f) => f.id));

test('corpus has 12 tales with known function codes and short cues', () => {
  assert.equal(corpus.tales.length, 12);
  for (const t of corpus.tales) for (const e of t.moves.flat()) {
    assert.ok(ids.has(e.f), `${t.id}: ${e.f}`);
    assert.ok(e.cue.split(/\s+/).length <= 15, `${t.id} cue too long: ${e.cue}`);
    assert.ok(e.line >= t.lines[0] && e.line <= t.lines[1], `${t.id} line ${e.line} outside tale`);
  }
});
const cache = new URL('../.cache/pg62509.txt', import.meta.url);
test('every cue is an exact quotation within 4 lines of its cited line', { skip: !existsSync(cache) && 'run npm run fetch-texts first' }, () => {
  const lines = readFileSync(cache, 'utf8').replace(/\r/g, '').split('\n');
  const norm = (s) => s.replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
  for (const t of corpus.tales) for (const e of t.moves.flat()) {
    const win = norm(lines.slice(Math.max(0, e.line - 5), e.line + 4).join(' '));
    assert.ok(win.includes(norm(e.cue)), `${t.id} line ${e.line}: "${e.cue}" not found`);
  }
});
test('grammar has the 31 functions plus alpha, the lack variant a, and X', () => {
  const numbered = data.functions.filter((f) => f.idx >= 1 && f.id !== 'a');
  assert.equal(numbered.length, 31);
  assert.equal(data.roles.length, 7);
});
