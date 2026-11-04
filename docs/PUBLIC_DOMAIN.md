# Public-domain check of the analysis text

| Item | Fact | Source |
|---|---|---|
| Work | *Russian Folk-Tales*, A. N. Afanas'ev, tr. Leonard A. Magnus | Gutenberg #62509 record |
| First published | October 1915, London (Kegan Paul) and New York (Dutton); 2nd impression September 1916 | Title page of the Gutenberg text |
| Collector | Afanas'ev, 1826–1871 | Gutenberg record |
| Translator | Magnus, 1879–1924 | Gutenberg record |
| Gutenberg status | "Public domain in the USA." | <https://www.gutenberg.org/ebooks/62509> |

Why it is safe to analyse: it was published in 1915, before the US cut-off of works published in 1930 or earlier (as of 2026). The translator died in 1924, so it is also out of copyright in countries using life+70 or even life+100.

What this repo stores: only Gutenberg ID, tale titles, line numbers, and short cues of 15 words or fewer per function. These are for checking the annotations. The full text is downloaded by `npm run fetch-texts` into `.cache/`, which is gitignored and never committed.
