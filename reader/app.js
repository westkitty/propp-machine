// The Propp Machine reader. Classic script; works from file:// and from any subpath.
(function () {
  'use strict';
  const P = globalThis.Propp, DATA = globalThis.PROPP_DATA;
  const G = P.generator, V = P.validator;
  const byId = Object.fromEntries(DATA.functions.map((f) => [f.id, f]));
  const $ = (id) => document.getElementById(id);
  const state = { seed: '', choices: {}, i: 0, tale: null };

  function randomSeed() { const w = ['owl', 'birch', 'ember', 'salt', 'moth', 'crow', 'lantern', 'thimble', 'frost', 'turnip', 'bell', 'mist']; const a = new Uint32Array(2); crypto.getRandomValues(a); return w[a[0] % w.length] + '-' + (a[1] % 1000); }
  function readURL() {
    const q = new URLSearchParams(location.search);
    state.seed = q.get('seed') || randomSeed();
    state.choices = {};
    (q.get('c') || '').split(',').filter(Boolean).forEach((kv) => { const [k, v] = kv.split(':'); if (k && v) state.choices[k] = v; });
    state.i = Math.max(0, parseInt(q.get('p') || '0', 10) || 0);
  }
  function shareURL() {
    const q = new URLSearchParams({ seed: state.seed });
    const c = Object.entries(state.choices).map(([k, v]) => k + ':' + v).join(',');
    if (c) q.set('c', c);
    return location.href.split('?')[0].split('#')[0] + '?' + q.toString();
  }
  function build() { state.tale = G.generate(state.seed, { playable: true, choices: state.choices }); }
  function flatPages() { return state.tale.pages; }
  const pending = (pg) => pg.choice && !(pg.choice in state.choices);
  function maxReachable() { const pages = flatPages(); for (let k = 0; k < pages.length; k++) if (pending(pages[k])) return k; return pages.length; }

  function choiceOptions(key) {
    if (key === 'gift') return state.tale.cast.offered.map((g) => [g.id, cap(g.name)]);
    return G.CHOICES[key].options;
  }
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function prefixMoves(upto) {
    const moves = [];
    flatPages().slice(0, upto + 1).forEach((pg) => { (moves[pg.move] = moves[pg.move] || []).push(pg.f); });
    return moves.filter(Boolean);
  }

  function render(animate) {
    const pages = flatPages();
    const end = state.i >= pages.length;
    const book = $('page');
    if (animate) { book.classList.remove('turning'); void book.offsetWidth; book.classList.add('turning'); }
    const choicesEl = $('choices');
    choicesEl.innerHTML = '';
    if (end) {
      const strict = V.validate(state.tale.moves, { mode: 'strict' });
      const refined = V.validate(state.tale.moves, { mode: 'refined' });
      $('fnLabel').innerHTML = '<span class="sym">∎</span>The end';
      $('art').innerHTML = P.art.scene('W', artCtx(), state.seed + 'end');
      $('artCap').textContent = 'And that is the whole of it.';
      const full = pages.map((p) => esc((p.pre + (p.post ? ' ' + p.post : '')).trim())).join(' ');
      $('text').innerHTML = `<p class="end">The End</p><div class="verdict ${strict.ok ? 'ok' : ''}" id="verdict"><b>${strict.ok ? 'Valid tale.' : 'Invalid tale.'}</b> Strict grammar: ${strict.ok ? 'pass' : 'fail'}. Refined grammar: ${refined.ok ? 'pass' : 'fail'}. ${pages.length} functions in ${state.tale.moves.length} move${state.tale.moves.length > 1 ? 's' : ''}.</div><details><summary>Read the whole tale</summary><div class="fulltale">${full}</div></details>`;
    } else {
      const pg = pages[state.i];
      const fn = byId[pg.f];
      $('fnLabel').innerHTML = `<span class="sym">${fn.sym}</span>${esc(fn.name)}`;
      $('art').innerHTML = P.art.scene(pg.f, artCtx(), state.seed + ':' + state.i);
      const svg = $('art').querySelector('svg');
      if (svg) svg.setAttribute('aria-label', `Woodcut illustration: ${fn.name}`);
      $('artCap').textContent = fn.gloss;
      let html = `<p class="${state.i === 0 ? 'first' : ''}">${esc(pg.pre)}</p>`;
      if (pg.post && !pending(pg)) html += `<p class="post">${esc(pg.post)}</p>`;
      $('text').innerHTML = html;
      if (pending(pg)) {
        const c = G.CHOICES[pg.choice];
        const prompt = document.createElement('p');
        prompt.className = 'prompt'; prompt.id = 'choicePrompt'; prompt.textContent = c.prompt;
        choicesEl.appendChild(prompt);
        choiceOptions(pg.choice).forEach(([val, label], k) => {
          const b = document.createElement('button');
          b.type = 'button'; b.dataset.choice = pg.choice; b.dataset.value = val;
          b.innerHTML = `<span class="k">${k + 1}</span>${esc(label)}`;
          b.addEventListener('click', () => choose(pg.choice, val));
          choicesEl.appendChild(b);
        });
      }
    }
    $('prev').disabled = state.i === 0;
    $('next').disabled = end || (state.i < pages.length && pending(pages[state.i]));
    $('next').textContent = state.i === pages.length - 1 ? 'The end ›' : 'Turn the page ›';
    $('pageNo').textContent = end ? `${pages.length} / ${pages.length}` : `${state.i + 1} / ${pages.length}`;
    renderGrammar(end);
  }

  function artCtx() { const ch = state.tale.choices; return { path: ch.path, confront: ch.confront, giftId: ch.gift, villain: state.tale.cast.villain }; }

  function renderGrammar(end) {
    const pages = flatPages();
    const upto = Math.min(state.i, pages.length - 1);
    const seq = $('seq'); seq.innerHTML = '';
    let lastMove = 0;
    pages.slice(0, upto + 1).forEach((pg, k) => {
      if (pg.move !== lastMove) { const s = document.createElement('li'); s.className = 'sep'; s.textContent = '|'; s.setAttribute('aria-label', 'new move'); seq.appendChild(s); lastMove = pg.move; }
      const li = document.createElement('li');
      li.textContent = byId[pg.f].sym; li.title = byId[pg.f].name;
      if (pg.move) li.classList.add('m' + (pg.move + 1));
      if (k === state.i) li.classList.add('cur');
      seq.appendChild(li);
    });
    const moves = end ? state.tale.moves : prefixMoves(upto);
    const res = V.validate(moves, { mode: 'strict' });
    const orderOK = res.violations.every((v) => v.code !== 'ORDER' && v.code !== 'MISSING_PREREQ');
    const st = $('status');
    if (end) { st.className = 'status ' + (res.ok ? 'ok' : 'bad'); st.textContent = res.ok ? 'Complete tale validates (strict).' : V.explain(res); }
    else { st.className = 'status ' + (orderOK ? 'ok' : 'bad'); st.textContent = orderOK ? 'Order and prerequisites hold so far.' : V.explain(res); }
    const fr = V.frontier(moves);
    $('owed').textContent = end ? 'Nothing: every pairing is closed.' : (fr.owed.length ? fr.owed.join('  ') : 'Nothing owed yet.');
    $('allowed').textContent = end ? '—' : fr.allowed.join(' ');
  }

  function choose(key, val) {
    state.choices[key] = val;
    build();
    history.replaceState(null, '', shareURL());
    render(false);
    const next = $('next'); if (!next.disabled) next.focus();
  }
  function go(d) {
    const pages = flatPages();
    const n = state.i + d;
    if (n < 0 || n > pages.length) return;
    if (d > 0 && state.i < pages.length && pending(pages[state.i])) return;
    state.i = n; render(true);
  }
  function start(seed, keepChoices) {
    state.seed = String(seed).trim() || randomSeed();
    if (!keepChoices) state.choices = {};
    state.i = 0; build();
    $('seed').value = state.seed;
    history.replaceState(null, '', shareURL());
    render(true);
  }

  function legend() {
    $('legend').innerHTML = DATA.functions.filter((f) => f.id !== 'X').map((f) => `<dt>${f.sym}</dt><dd>${esc(f.name)}</dd>`).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    readURL(); build(); legend();
    state.i = Math.min(state.i, maxReachable());
    $('seed').value = state.seed;
    render(false);
    $('seedForm').addEventListener('submit', (e) => { e.preventDefault(); start($('seed').value); });
    $('newTale').addEventListener('click', () => start(randomSeed()));
    $('restart').addEventListener('click', () => start(state.seed));
    $('next').addEventListener('click', () => go(1));
    $('prev').addEventListener('click', () => go(-1));
    $('share').addEventListener('click', async () => {
      const url = shareURL();
      try { await navigator.clipboard.writeText(url); $('shareMsg').textContent = 'Link copied.'; }
      catch (_) { $('shareMsg').textContent = url; }
    });
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (/^[1-3]$/.test(e.key)) { const b = document.querySelectorAll('#choices button')[+e.key - 1]; if (b) b.click(); }
    });
    window.PROPP_READER = { state, choose, go, start };
  });
})();
