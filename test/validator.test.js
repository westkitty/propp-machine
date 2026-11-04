import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate, frontier } from '../src/index.js';

test('canonical dragon-slayer sequence is valid in strict mode', () => {
  const r = validate(['alpha', 'beta', 'gamma', 'delta', 'A', 'B', 'C', 'up', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'down', 'Pr', 'Rs', 'W']);
  assert.equal(r.ok, true, JSON.stringify(r.violations));
});
test('order regression is reported with a plain-words message', () => {
  const r = validate(['alpha', 'A', 'K', 'D', 'E', 'F']);
  assert.equal(r.ok, false);
  const v = r.violations.find((x) => x.code === 'ORDER');
  assert.ok(v && /fixed order/.test(v.message));
});
test('interdiction without violation is UNPAIRED in strict, allowed in refined (R-VIRTUAL)', () => {
  const seq = ['alpha', 'gamma', 'A', 'K'];
  assert.ok(validate(seq).violations.some((v) => v.code === 'UNPAIRED' && v.f === 'gamma'));
  const r = validate(seq, { mode: 'refined' });
  assert.equal(r.ok, true); assert.ok(r.refinementsUsed.includes('R-VIRTUAL'));
});
test('villainy without liquidation fails in both modes', () => {
  for (const mode of ['strict', 'refined']) assert.ok(validate(['alpha', 'A', 'up', 'H', 'I'], { mode }).violations.some((v) => v.code === 'UNPAIRED' && v.f === 'A'));
});
test('a move without A or a is NO_COMPLICATION', () => {
  assert.ok(validate(['alpha', 'D', 'E', 'F']).violations.some((v) => v.code === 'NO_COMPLICATION'));
});
test('trebling is excused only in refined mode', () => {
  const seq = ['alpha', 'a', 'B', 'up', 'D', 'E', 'D', 'E', 'F', 'K', 'down'];
  assert.equal(validate(seq).ok, false);
  const r = validate(seq, { mode: 'refined' });
  assert.equal(r.ok, true, JSON.stringify(r.violations)); assert.ok(r.refinementsUsed.includes('R-TREBLE'));
});
test('implicit entries are dropped in strict mode, counted in refined', () => {
  const tale = { moves: [[{ f: 'alpha' }, { f: 'A' }, { f: 'H' }, { f: 'I' }, { f: 'K', implicit: true }]] };
  assert.equal(validate(tale).ok, false);
  assert.equal(validate(tale, { mode: 'refined' }).ok, true);
});
test('unmapped X: strict rejects any; refined allows up to 20%', () => {
  const few = ['alpha', 'A', 'B', 'C', 'up', 'X', 'H', 'I', 'K', 'down'];
  assert.equal(validate(few).ok, false);
  assert.equal(validate(few, { mode: 'refined' }).ok, true);
  const many = ['alpha', 'a', 'X', 'X', 'K'];
  assert.ok(validate(many, { mode: 'refined' }).violations.some((v) => v.code === 'UNMAPPED_EXCESS'));
});
test('two moves: K must be in the same move as its A; Q may use an N from an earlier move', () => {
  const ok = validate([['alpha', 'a', 'up', 'K', 'M', 'N'], ['A', 'K', 'down', 'Q', 'W']]);
  assert.equal(ok.ok, true, JSON.stringify(ok.violations));
  const bad = validate([['alpha', 'A', 'up'], ['a', 'K', 'K']]);
  assert.ok(bad.violations.some((v) => v.code === 'UNPAIRED' && v.move === 0));
});
test('unknown codes are reported', () => {
  assert.ok(validate(['alpha', 'Z', 'A', 'K']).violations.some((v) => v.code === 'UNKNOWN_CODE'));
});
test('frontier lists allowed next functions and owed pairings', () => {
  const f = frontier(['alpha', 'gamma', 'A', 'up']);
  assert.ok(f.allowed.includes('D') && !f.allowed.includes('B'));
  assert.deepEqual(f.owed.sort(), ['A→K', 'γ→δ'].sort());
});
