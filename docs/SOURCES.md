# Sources

## Primary text (analysis corpus)

- **A. N. Afanas'ev, *Russian Folk-Tales*, translated by Leonard A. Magnus.** London: Kegan Paul, Trench, Trubner; New York: E. P. Dutton, 1915 (second impression 1916). Project Gutenberg eBook #62509. <https://www.gutenberg.org/ebooks/62509>. Public-domain status: see `docs/PUBLIC_DOMAIN.md`.

## Scholarship

1. **Propp, Vladimir.** *Morphology of the Folktale.* 2nd ed. Trans. Laurence Scott; rev. and ed. Louis A. Wagner; intro. Alan Dundes. Austin: University of Texas Press, 1968 (Russian original 1928). <https://utpress.utexas.edu/9780292783768/>. The 31 functions, the seven spheres of action, moves, trebling. Our function glosses are paraphrases.
2. **Lévi-Strauss, Claude.** "La structure et la forme: Réflexions sur un ouvrage de Vladimir Propp." *Cahiers de l'Institut de science économique appliquée* 9 (1960): 3–36. English: "Structure and Form: Reflections on a Work by Vladimir Propp," in Propp, *Theory and History of Folklore* (Minneapolis: University of Minnesota Press, 1984), 167–188. <https://monoskop.org/images/4/42/Levi-Strauss_Claude_1960_1984_Structure_and_Form_Reflections_on_a_Work_by_Vladimir_Propp.pdf>. Critique: a purely syntagmatic (sequence) analysis drops the content that gives a tale its meaning.
3. **Dundes, Alan.** *The Morphology of North American Indian Folktales.* FF Communications 195. Helsinki: Suomalainen Tiedeakatemia, 1964. <https://www.folklorefellows.fi/ffc-catalogue/>. Motifeme and allomotif; minimal sequences such as Lack → Lack Liquidated; applying Propp outside the Russian corpus.
4. **Bremond, Claude.** "La logique des possibles narratifs." *Communications* 8 (1966): 60–76. doi:10.3406/comm.1966.1115. <https://www.persee.fr/doc/comm_0588-8018_1966_num_8_1_1115>. Each opening function creates a possibility that may stay unrealised or fail; sequences combine end to end, by embedding, or interleaved.
5. **Gervás, Pablo.** "Propp's Morphology of the Folk Tale as a Grammar for Generation." *2013 Workshop on Computational Models of Narrative*, OASIcs 32 (2013): 106–122. doi:10.4230/OASIcs.CMN.2013.106. <https://drops.dagstuhl.de/entities/document/10.4230/OASIcs.CMN.2013.106>. Propp as a plot driver for generation; warns that generalising Propp beyond his corpus loses his intuitions.
6. **Finlayson, Mark A.** "ProppLearner: Deeply Annotating a Corpus of Russian Folktales to Enable the Machine Learning of a Russian Formalist Theory." *Digital Scholarship in the Humanities* 32, no. 2 (2017): 284–300. doi:10.1093/llc/fqv067. <https://doi.org/10.1093/llc/fqv067>. 15 tales, double annotation, agreement measures; shows how costly and contestable Proppian annotation is.
7. **Uther, Hans-Jörg.** *The Types of International Folktales: A Classification and Bibliography* (ATU). FF Communications 284–286. Helsinki, 2004. Listed in the FFC catalogue: <https://www.folklorefellows.fi/ffc-catalogue/>. Tale-type numbers in `corpus/tales.json` are our tentative assignments, not checked against the printed index.
8. **Greimas, Algirdas Julien.** *Sémantique structurale.* Paris: Larousse, 1966. Overview: <https://en.wikipedia.org/wiki/Actantial_model>. Reduces Propp's seven spheres to six actants in three pairs (subject/object, sender/receiver, helper/opponent).

## What was verified

Bibliographic details for items 1–6 were checked against publisher, DOI, or library pages on 2026-11-04. We did not read the full text of items 2, 3, 7 and 8 this session. Claims attributed to them are standard summaries, kept general. The bases given for refinements R-FLOAT-MN and R-DEF-EARLY in `data/grammar.json` are our reading of Propp; the page references were not verified.

## Software

- `playwright-core` 1.64 (Apache-2.0), dev-only, for the headless reader test. No runtime dependencies.
