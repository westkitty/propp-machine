// Diversity metrics for generated tales vs. the annotated real tales.
// Usage: node scripts/metrics.mjs [--n 1000] [--prose 50] [--templates v1,v2,...] [--label name]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { generator } from '../src/index.js';
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const N = +arg('n', 1000), NP = +arg('prose', 50);
const versions = arg('templates', 'v1,v2').split(',');

const H = (counts) => { const tot = counts.reduce((a, b) => a + b, 0); return -counts.reduce((h, c) => h + (c ? (c / tot) * Math.log2(c / tot) : 0), 0); };
function seqStats(seqs) {
  const key = (s) => s.map((m) => m.join(' ')).join(' | ');
  const dist = {}; seqs.forEach((s) => (dist[key(s)] = (dist[key(s)] || 0) + 1));
  const uni = {}, big = {}, ctx = {};
  for (const s of seqs) {
    const flat = ['START', ...s.flat(), 'END'];
    flat.forEach((f, i) => { if (i > 0 && i < flat.length - 1) uni[f] = (uni[f] || 0) + 1; if (i > 0) { const k = flat[i - 1] + '>' + f; big[k] = (big[k] || 0) + 1; ctx[flat[i - 1]] = (ctx[flat[i - 1]] || 0) + 1; } });
  }
  const totB = Object.values(big).reduce((a, b) => a + b, 0);
  // conditional entropy H(next | current) = H(bigram) - H(current)
  const condH = H(Object.values(big)) - H(Object.values(ctx));
  return {
    tales: seqs.length, distinct: Object.keys(dist).length, distinctRatio: +(Object.keys(dist).length / seqs.length).toFixed(3),
    sequenceEntropyBits: +H(Object.values(dist)).toFixed(3), maxPossibleBits: +Math.log2(seqs.length).toFixed(3),
    functionEntropyBits: +H(Object.values(uni)).toFixed(3), transitionCondEntropyBits: +condH.toFixed(3),
    distinctTransitions: Object.keys(big).length, meanLength: +(seqs.reduce((a, s) => a + s.flat().length, 0) / seqs.length).toFixed(2), bigramsTotal: totB,
  };
}
const words = (t) => t.toLowerCase().replace(/[“”"’',;:.!?()—–-]/g, ' ').split(/\s+/).filter(Boolean);
const sentences = (t) => t.split(/(?<=[.!?”])\s+(?=[A-Z“])/).filter((s) => s.trim());
function ngrams(ws, n) { const out = []; for (let i = 0; i + n <= ws.length; i++) out.push(ws.slice(i, i + n).join(' ')); return out; }
function proseStats(texts, heroNames) {
  const all = texts.map(words);
  const dist = (n) => { const g = all.flatMap((w) => ngrams(w, n)); return +(new Set(g).size / g.length).toFixed(3); };
  const sents = texts.flatMap(sentences);
  const opens = sents.map((s) => words(s).slice(0, 2).join(' '));
  const openCounts = {}; opens.forEach((o) => (openCounts[o] = (openCounts[o] || 0) + 1));
  const topOpen = Object.entries(openCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const sets = all.map((w) => new Set(ngrams(w, 4)));
  let j = 0, pairs = 0;
  for (let a = 0; a < sets.length; a++) for (let b = a + 1; b < sets.length; b++) { let inter = 0; for (const g of sets[a]) if (sets[b].has(g)) inter++; j += inter / (sets[a].size + sets[b].size - inter); pairs++; }
  const sentCounts = {}; sents.forEach((s) => (sentCounts[s] = (sentCounts[s] || 0) + 1));
  const dupSent = sents.filter((s) => sentCounts[s] > 1).length / sents.length;
  const nameReps = texts.map((t, i) => t.split(heroNames[i]).length - 1);
  return {
    tales: texts.length, words: all.reduce((a, w) => a + w.length, 0), sentences: sents.length,
    distinct1: dist(1), distinct2: dist(2), distinct3: dist(3),
    repeatedOpeningRate: +(1 - Object.keys(openCounts).length / sents.length).toFixed(3),
    topOpenings: topOpen.map(([o, c]) => `${o} (${c})`),
    duplicateSentenceRate: +dupSent.toFixed(3),
    meanPairwise4gramJaccard: +(j / pairs).toFixed(4),
    heroFullNameMentionsPerTale: +(nameReps.reduce((a, b) => a + b, 0) / texts.length).toFixed(2),
  };
}

const corpus = JSON.parse(readFileSync(new URL('../corpus/tales.json', import.meta.url), 'utf8'));
const real = corpus.tales.map((t) => t.moves.map((mv) => mv.map((e) => e.f)));
const realMagic = corpus.tales.filter((t) => t.genre.startsWith('magic')).map((t) => t.moves.map((mv) => mv.map((e) => e.f)));
const gen = []; for (let s = 1; s <= N; s++) gen.push(generator.generate(s).moves);
const gen12 = gen.slice(0, 12);
const out = { generatedAt: new Date().toISOString(), structure: { generated: seqStats(gen), generatedFirst12: seqStats(gen12), real12: seqStats(real), realMagic: seqStats(realMagic) }, prose: {} };
for (const v of versions) {
  const tales = []; for (let s = 1; s <= NP; s++) tales.push(generator.generate(s, { templates: v }));
  out.prose[v] = proseStats(tales.map((t) => t.text), tales.map((t) => t.cast.hero));
}
const file = new URL('../docs/metrics.json', import.meta.url);
const prev = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
const label = arg('label', 'latest');
prev[label] = out;
writeFileSync(file, JSON.stringify(prev, null, 2));
console.log(JSON.stringify(out, null, 2));
