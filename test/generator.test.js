import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generator, validate, explain } from '../src/index.js';

test('every one of 2000 generated tales passes the strict validator', () => {
  for (let s = 1; s <= 2000; s++) {
    const t = generator.generate(s);
    const r = validate(t.moves);
    assert.equal(r.ok, true, `seed ${s}: ${explain(r)}`);
  }
});
test('generation is deterministic for a seed', () => {
  assert.equal(generator.generate('owl').text, generator.generate('owl').text);
  assert.notEqual(generator.generate('owl').text, generator.generate('crow').text);
});
test('no unfilled template slots in any template version', () => {
  for (const v of ['v1', 'v2', 'v3']) for (let s = 1; s <= 400; s++) {
    const t = generator.generate(s, { templates: v });
    assert.doesNotMatch(t.text, /\{\w+\}|undefined|\[|\]/, `seed ${s} ${v}`);
  }
});
test('playable mode always offers every choice point and every choice combination stays valid', () => {
  const C = generator.CHOICES;
  for (let s = 1; s <= 30; s++) {
    const base = generator.generate(s, { playable: true });
    for (const k of ['interdiction', 'donorTest', 'path', 'confront']) assert.ok(base.pages.some((p) => p.choice === k), `seed ${s} lacks ${k}`);
    for (const i of C.interdiction.options) for (const d of C.donorTest.options) for (const c of C.confront.options) for (const p of C.path.options) {
      const t = generator.generate(s, { playable: true, choices: { interdiction: i[0], donorTest: d[0], confront: c[0], path: p[0] } });
      assert.equal(validate(t.moves).ok, true, `seed ${s} ${i[0]} ${d[0]} ${c[0]} ${p[0]}`);
    }
  }
});
test('a choice never changes the pages before it (prefix stability)', () => {
  for (let s = 1; s <= 40; s++) {
    const a = generator.generate(s, { playable: true, choices: { donorTest: 'kind' } });
    const b = generator.generate(s, { playable: true, choices: { donorTest: 'rude' } });
    const at = a.pages.findIndex((p) => p.choice === 'donorTest');
    assert.deepEqual(a.pages.slice(0, at + 1).map((p) => p.pre), b.pages.slice(0, at + 1).map((p) => p.pre), `seed ${s}`);
  }
});
