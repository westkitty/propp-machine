// Seeded PRNG (xmur3 string hash + mulberry32). Classic script: works via <script> and Node import.
(function (root) {
  'use strict';
  function hash(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // A stream factory: rng(key) gives an independent stream for each decision key,
  // so changing one decision never shifts the random draws of another.
  function streams(seed) {
    const cache = new Map();
    function get(key) {
      if (!cache.has(key)) cache.set(key, mulberry32(hash(String(seed) + '::' + key)));
      return cache.get(key);
    }
    return {
      seed,
      float: (key) => get(key)(),
      chance: (key, p) => get(key)() < p,
      int: (key, n) => Math.floor(get(key)() * n),
      pick: (key, arr) => arr[Math.floor(get(key)() * arr.length)],
    };
  }
  const api = { hash, mulberry32, streams };
  root.Propp = Object.assign(root.Propp || {}, { prng: api });
})(typeof globalThis !== 'undefined' ? globalThis : this);
