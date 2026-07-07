/**
 * Pseudo-labeling CLI — run the rule-based TN engine over a text corpus.
 *
 * Reads a UTF-8 text file (one sentence per line) and writes a TSV of
 * (original TAB normalized) pairs, suitable as weak-supervision training data
 * for a neural TN model. A per-class span report is printed to stderr so you
 * can see what the rules actually touched in the corpus.
 *
 * Usage:
 *   npx tsx scripts/pseudo-label.ts <input.txt> [output.tsv] [options]
 *
 * Options:
 *   --lang <en|ko|ja>   language ruleset (default: ko)
 *   --with-spans        add a 3rd column: JSON span trace (class/rule/offsets)
 *   --changed-only      drop identity lines (no rule fired) from the output
 *
 * If output.tsv is omitted, pairs go to stdout (stats still go to stderr).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { normalize } from '../src/tn';
import type { Language } from '../src/tn';

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

const args = process.argv.slice(2);
const positional: string[] = [];
let language: Language = 'ko';
let withSpans = false;
let changedOnly = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--lang') {
    const value = args[++i];
    if (value !== 'en' && value !== 'ko' && value !== 'ja') {
      fail(`--lang must be en, ko, or ja (got "${value}")`);
    }
    language = value;
  } else if (arg === '--with-spans') {
    withSpans = true;
  } else if (arg === '--changed-only') {
    changedOnly = true;
  } else if (arg.startsWith('--')) {
    fail(`Unknown option: ${arg}`);
  } else {
    positional.push(arg);
  }
}

const [inputPath, outputPath] = positional;
if (!inputPath) {
  fail(
    'Usage: npx tsx scripts/pseudo-label.ts <input.txt> [output.tsv] [--lang ko] [--with-spans] [--changed-only]',
  );
}

const lines = readFileSync(inputPath, 'utf-8').split('\n');

const rows: string[] = [];
const classCounts = new Map<string, number>();
const ruleCounts = new Map<string, number>();
let total = 0;
let changed = 0;

for (const raw of lines) {
  const line = raw.trim();
  if (!line) continue;
  total++;

  const result = normalize(line, language);
  if (result.spans.length > 0) changed++;
  if (changedOnly && result.spans.length === 0) continue;

  for (const span of result.spans) {
    classCounts.set(
      span.semioticClass,
      (classCounts.get(span.semioticClass) ?? 0) + 1,
    );
    ruleCounts.set(span.rule, (ruleCounts.get(span.rule) ?? 0) + 1);
  }

  const columns = [line, result.output];
  if (withSpans) {
    columns.push(
      JSON.stringify(
        result.spans.map((s) => ({
          class: s.semioticClass,
          rule: s.rule,
          original: s.original,
          normalized: s.normalized,
          start: s.start,
          end: s.end,
        })),
      ),
    );
  }
  rows.push(columns.join('\t'));
}

const tsv = rows.join('\n') + (rows.length ? '\n' : '');
if (outputPath) {
  writeFileSync(outputPath, tsv, 'utf-8');
} else {
  process.stdout.write(tsv);
}

const sortedDesc = (m: Map<string, number>) =>
  [...m.entries()].sort((a, b) => b[1] - a[1]);

console.error(`\n[pseudo-label] lang=${language} input=${inputPath}`);
console.error(
  `[pseudo-label] ${total} lines read, ${changed} with >=1 span (${(
    (changed / Math.max(total, 1)) * 100
  ).toFixed(1)}%), ${rows.length} rows written`,
);
console.error('[pseudo-label] spans by class:');
for (const [cls, count] of sortedDesc(classCounts)) {
  console.error(`  ${cls.padEnd(12)} ${count}`);
}
console.error('[pseudo-label] spans by rule:');
for (const [rule, count] of sortedDesc(ruleCounts)) {
  console.error(`  ${rule.padEnd(24)} ${count}`);
}
