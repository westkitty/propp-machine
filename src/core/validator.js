// Propp grammar validator. Classic script (no import/export) so it runs from file:// in a browser
// and as a side-effect import in Node. Exposes globalThis.Propp.validator.
(function (root) {
  'use strict';

  // Normalise input: a tale is {moves:[[entry]]}; an entry is "A" or {f:"A", implicit:true, ...}.
  function normalise(tale) {
    let moves;
    if (Array.isArray(tale)) moves = Array.isArray(tale[0]) ? tale : [tale];
    else moves = tale.moves;
    return moves.map((mv) => mv.map((e) => (typeof e === 'string' ? { f: e } : e)));
  }

  function index(data) {
    const byId = {};
    for (const fn of data.functions) byId[fn.id] = fn;
    const ref = {};
    for (const r of data.refinements) ref[r.id] = r;
    return { byId, ref };
  }

  function label(byId, f) {
    const fn = byId[f];
    return fn ? `${fn.sym} (${fn.name})` : `"${f}"`;
  }

  function validate(tale, opts) {
    const data = (opts && opts.data) || root.PROPP_DATA;
    const mode = (opts && opts.mode) || 'strict';
    const refined = mode === 'refined';
    const { byId, ref } = index(data);
    const C = data.constraints;
    const repeatable = new Set(ref['R-TREBLE'].repeatable);
    const violations = [];
    const notes = [];
    const raw = normalise(tale);
    // Strict mode drops implicit entries entirely; refined counts them (R-IMPLICIT).
    const moves = raw.map((mv) => mv.filter((e) => refined || !e.implicit));
    if (refined && raw.some((mv) => mv.some((e) => e.implicit))) notes.push('R-IMPLICIT');
    const add = (code, move, pos, f, message) => violations.push({ code, move, pos, f, message });

    let total = 0, unmapped = 0;
    const taleSeen = [];
    moves.forEach((mv, m) => {
      const seen = [];
      let maxIdx = -1;
      let hasComplication = false;
      mv.forEach((e, p) => {
        const f = e.f;
        total++;
        if (!byId[f]) { add('UNKNOWN_CODE', m, p, f, `"${f}" is not a function in the grammar.`); return; }
        if (f === 'X') {
          unmapped++;
          if (!refined) add('UNMAPPED', m, p, f, 'An episode here fits none of the 31 functions (strict mode allows none).');
          seen.push(f); return;
        }
        const idx = byId[f].idx;
        const isComp = C.complication.includes(f);
        if (idx < maxIdx) {
          let excused = null;
          if (refined) {
            if (f === 'M' || f === 'N') excused = 'R-FLOAT-MN';
            else if (repeatable.has(f) && seen.includes(f)) excused = 'R-TREBLE';
            else if (isComp && seen.filter((s) => byId[s].idx > 8).every((s) => ['D', 'E', 'F', 'X'].includes(s))) excused = 'R-DEF-EARLY';
            else if (['epsilon', 'zeta', 'eta', 'theta'].includes(f) && hasComplication) excused = 'R-HERO-RECON';
          }
          if (excused) {
            if (!notes.includes(excused)) notes.push(excused);
            if (excused === 'R-TREBLE' || excused === 'R-DEF-EARLY') maxIdx = idx;
          } else {
            const prev = [...seen].reverse().find((s) => byId[s].idx === maxIdx);
            add('ORDER', m, p, f, `${label(byId, f)} is function #${idx}, but it comes after ${label(byId, prev)} (#${maxIdx}). Within a move Propp's functions keep a fixed order.`);
          }
        } else if (!(refined && (f === 'M' || f === 'N'))) {
          maxIdx = idx;
        }
        if (isComp) hasComplication = true;
        seen.push(f);
      });
      if (!hasComplication) add('NO_COMPLICATION', m, null, null, `Move ${m + 1} has no villainy (A) or lack (a); for Propp a move is a development from A or a.`);

      // Paired openers -> closers later in the same move.
      mv.forEach((e, p) => {
        const rule = C.openers.find((o) => o.open === e.f);
        if (!rule) return;
        const later = mv.slice(p + 1).some((x) => rule.close.includes(x.f));
        if (later) return;
        if (refined && ['gamma', 'epsilon', 'eta'].includes(e.f)) { if (!notes.includes('R-VIRTUAL')) notes.push('R-VIRTUAL'); return; }
        add('UNPAIRED', m, p, e.f, `${label(byId, e.f)} is never followed by ${rule.close.map((c) => label(byId, c)).join(' or ')}. ${rule.why}`);
      });
      // Closers / dependants need a prerequisite earlier.
      mv.forEach((e, p) => {
        const rule = C.requires.find((r) => r.f === e.f);
        if (!rule) return;
        const pool = rule.scope === 'tale' ? taleSeen.concat(mv.slice(0, p).map((x) => x.f)) : mv.slice(0, p).map((x) => x.f);
        if (rule.after.some((a) => pool.includes(a))) return;
        if (refined && (e.f === 'F' || e.f === 'Q')) { if (!notes.includes('R-AGENT-FREE')) notes.push('R-AGENT-FREE'); return; }
        add('MISSING_PREREQ', m, p, e.f, `${label(byId, e.f)} appears without an earlier ${rule.after.map((a) => label(byId, a)).join(' or ')}. ${rule.why}`);
      });
      taleSeen.push(...mv.map((x) => x.f));
    });
    if (refined && unmapped > 0) {
      if (unmapped / Math.max(1, total) > 0.2) add('UNMAPPED_EXCESS', null, null, 'X', `${unmapped} of ${total} entries are unidentified (over the 20% allowance).`);
      else notes.push('R-UNMAPPED');
    }
    return { ok: violations.length === 0, mode, violations, refinementsUsed: notes };
  }

  // For an in-progress move: which functions could come next without breaking order (strict),
  // and which pairings are still owed. Used by the reader's grammar panel.
  function frontier(moves, data) {
    data = data || root.PROPP_DATA;
    const { byId } = index(data);
    const mv = normalise(moves).slice(-1)[0] || [];
    const C = data.constraints;
    const maxIdx = mv.reduce((m, e) => Math.max(m, byId[e.f] ? byId[e.f].idx : -1), -1);
    const allowed = data.functions.filter((fn) => fn.idx >= maxIdx && fn.id !== 'X').map((fn) => fn.sym);
    const owed = [];
    mv.forEach((e, p) => {
      const rule = C.openers.find((o) => o.open === e.f);
      if (rule && !mv.slice(p + 1).some((x) => rule.close.includes(x.f))) owed.push(`${byId[e.f].sym}→${rule.close.map((c) => byId[c].sym).join('/')}`);
    });
    return { allowed, owed };
  }

  function explain(result) {
    if (result.ok) return `Valid (${result.mode})` + (result.refinementsUsed.length ? `; refinements used: ${result.refinementsUsed.join(', ')}` : '');
    return result.violations.map((v) => `[${v.code}]${v.move != null ? ` move ${v.move + 1}` : ''}${v.pos != null ? ` pos ${v.pos + 1}` : ''}: ${v.message}`).join('\n');
  }

  root.Propp = Object.assign(root.Propp || {}, { validator: { validate, frontier, explain, normalise } });
})(typeof globalThis !== 'undefined' ? globalThis : this);
