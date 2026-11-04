# Where Propp's rules fail on real tales

Numbers come from `npm run validate-corpus`; the full per-tale report is in `docs/ACCEPTANCE.md`.

| | Strict | Refined |
|---|---|---|
| All 12 tales | **0/12 (0%)** | **2/12 (17%)** |
| 9 magic tales | 0/9 | 2/9 (22%) |
| 3 controls (animal tale, two novellas) | 0/3 | 0/3 |

- **Strict** is Propp read literally. Within a move, functions keep the canonical order. Every paired function is closed: γ→δ, ε→ζ, η→θ, A/a→K, H→I, M→N, Pr→Rs, L→Ex. Dependent functions have their prerequisite. No unidentified episodes are allowed, and implicit functions don't count.
- **Refined** adds eight documented relaxations, listed in `data/grammar.json` under `refinements`: implicit functions, trebling, a mobile M–N, an early donor block, the hero's side doing reconnaissance or trickery, Bremond-style virtual openers, agents without donors, and up to 20% unmapped episodes.

The rules were fixed before the corpus was run and were not changed afterwards. The two refined passes are *The Realms of Copper, Silver and Gold* (ATU 301), which passes thanks to trebling, and *Iváshko and the Wise Woman* (ATU 327F).

Strict violations: 70 ORDER, 11 UNPAIRED, 11 MISSING_PREREQ, 15 UNMAPPED. Refined: 27 ORDER, 4 UNPAIRED, 2 UNMAPPED_EXCESS. If ORDER alone were ignored, only one tale would pass strict mode. Order is by far the rule that real tales break most.

## Failures, classified

Three kinds of failure:
- **(R)** a real mismatch between the tale and Propp's rule
- **(A)** a choice in our annotation that a different annotator might make differently
- **(T)** a tale outside the type Propp described, the Russian magic tale (Afanas'ev Nos. 50–151 in Propp's corpus)

| Tale | Refined result | Why it fails | Kind |
|---|---|---|---|
| The Dun Cow (511+403) | ORDER | The helper cow is there from the start. Its gift (F) precedes the reconnaissance, and R-DEF-EARLY only excuses the villainy. In move 2 the false bride's claim (L) is in force from the moment of substitution, so it comes before K. | R, partly A (F could be folded into α) |
| The Bear, the Dog, and the Cat (101) | UNMAPPED_EXCESS | Three of nine episodes are unmappable: a staged abduction, a feast, a fatal imitation. The tale is a chain of animal episodes. | T |
| Bába Yagá and Zamorýshek (327B) | ORDER, UNPAIRED | The brides are never won: the lack a is not liquidated. The villain's death-plot (A) ends in escape with no K. The donor-like interrogation happens at the destination, after G. | R |
| Iván Tsarévich and the Grey Wolf (550) | ORDER | The helper gives interdictions mid-quest (γδ after G, twice). Three tasks chain into each other. In move 3 the brothers' false claim is arranged while the hero lies dead, so story order and narration order diverge. | R (embedded γδ), A (placement of L) |
| Vasilísa the Fair (480B*) | ORDER | The deathbed gift and prohibition come before a second absentation. The prohibition is never broken. | R |
| Shemyák the Judge (1534) | UNMAPPED_EXCESS | A novella of accidents and lawsuits with no villain, donor or magic. | T |
| The Witch and the Sister of the Sun (313H*) | ORDER, UNPAIRED | The villainy happens offstage after the departure. The hero serves his future helpers. Pursuit and rescue come before the struggle. The eaten family is never restored. | R, partly T (flight tale) |
| Nikíta the Tanner (300) | ORDER | The hero prepares his own agent before departing (F before ↑). The princess's rescue is never narrated. It ends in an etiological legend. | R, A (implicit K), partly T (legend) |
| The Enchanted Tsarévich (425C) | ORDER, UNPAIRED | The quest for the flower causes the trespass, so γδ follows a. The bride-demand (A, move 2) is resolved only inside move 3. Our validator treats moves as consecutive blocks, but Propp allows them to interleave. | R (move interleaving not modelled) |
| The Language of the Birds (517+671) | ORDER | It is framed by a prophecy and has a wedding before a new departure. Reunion and reconciliation replace punishment. | T |

## What this tells us

1. **The fixed order is the weakest of Propp's claims for single tales.** Pairings mostly hold; what breaks is position. Propp drew his order from a whole corpus, so it describes an aggregate. A single telling moves blocks around (donor before villainy, interdiction inside the quest). It repeats blocks and runs plot lines side by side. Propp himself admits trebling and transposition, which is why two tales pass in refined mode.
2. **Sequential blocks are the wrong data structure for moves.** In *The Enchanted Tsarévich* and *The Grey Wolf*, one villainy is still open while another runs, and our model fails exactly there. Bremond (1966) describes this: sequences combine end to end, by embedding, and by interleaving, and any opening function may stay unrealised. Zamorýshek's unwon brides and the Witch tale's devoured family are Bremond's "goal missed" outcomes, which Propp's A→K pairing has no slot for.
3. **Function-only analysis throws away what the tale is about.** The prophecy in *The Language of the Birds* and the stone in Shemyák's hand get no function, yet they are the plots. This is Lévi-Strauss's 1960 objection: the form is described, but the content that makes it meaningful is lost.
4. **Outside the Russian magic tale, the grammar stops fitting, as it should.** The animal tale and the two novellas fail through unmapped episodes, not near-misses. Dundes (1964) made Propp travel by shrinking him to a few motifemes, such as Lack → Lack Liquidated. Shemyák does reduce to a → K, with four unmapped episodes in between.
5. **Annotation is the hidden variable.** Several verdicts turn on a judgment call: where to put an offstage claim, and whether a helper already present counts as F. Finlayson's ProppLearner needed trained double annotators and agreement statistics for 15 tales. We had one annotator, a model, with scripted quote checks. The quotes are verified; the interpretations are not checked by a second person.

## Limits of this measurement

- 12 tales from one translated collection. A small, non-random sample: we chose 9 magic tales and 3 controls.
- One annotator, so there is no inter-annotator agreement figure. The cues are checked automatically: every cue is an exact quote within 4 lines of its cited line (`test/corpus.test.js`). The coding itself is not checked.
- Magnus abridges and translates. Propp worked from the Russian.
- ATU numbers are our tentative assignments.
