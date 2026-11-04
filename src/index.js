// Node entry point (ES module). Loads the classic-script core and the grammar data.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import './core/prng.js';
import './core/validator.js';
import './core/tables.js';
import './core/generator.js';
import './core/art.js';

const here = dirname(fileURLToPath(import.meta.url));
export const data = JSON.parse(readFileSync(join(here, '..', 'data', 'grammar.json'), 'utf8'));
globalThis.PROPP_DATA = data;
export const { validate, frontier, explain } = globalThis.Propp.validator;
export const prng = globalThis.Propp.prng;
export const generator = globalThis.Propp.generator;
export const art = globalThis.Propp.art;
