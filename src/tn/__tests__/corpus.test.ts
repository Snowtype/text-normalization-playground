/**
 * Corpus test: every shared TEST_CASES entry must normalize to its `expected`
 * spoken form. This is the suite the in-app "Test cases" tab mirrors.
 */

import { describe, it, expect } from 'vitest';
import { normalize } from '../registry';
import { TEST_CASES } from '../testCases';
import type { SemioticClass } from '../types';

describe('TN corpus (input -> spoken form)', () => {
  for (const tc of TEST_CASES) {
    it(`[${tc.language}/${tc.semioticClass}] "${tc.input}" -> "${tc.expected}"`, () => {
      expect(normalize(tc.input, tc.language).output).toBe(tc.expected);
    });
  }
});

describe('corpus coverage', () => {
  it('has at least 30 cases', () => {
    expect(TEST_CASES.length).toBeGreaterThanOrEqual(30);
  });

  it('covers both languages', () => {
    expect(TEST_CASES.some((t) => t.language === 'en')).toBe(true);
    expect(TEST_CASES.some((t) => t.language === 'ko')).toBe(true);
  });

  it('covers every core semiotic class in English', () => {
    const required: SemioticClass[] = [
      'CARDINAL',
      'ORDINAL',
      'DECIMAL',
      'DATE',
      'TIME',
      'MONEY',
      'PERCENT',
      'MEASURE',
      'TELEPHONE',
      'DIGIT',
      'ABBREVIATION',
      'ELECTRONIC',
    ];
    const present = new Set(
      TEST_CASES.filter((t) => t.language === 'en').map((t) => t.semioticClass),
    );
    for (const cls of required) {
      expect(present.has(cls), `missing English coverage for ${cls}`).toBe(
        true,
      );
    }
  });

  it('covers the core semiotic classes in Korean', () => {
    const required: SemioticClass[] = [
      'CARDINAL',
      'ORDINAL',
      'DECIMAL',
      'DATE',
      'TIME',
      'MONEY',
      'PERCENT',
      'MEASURE',
      'TELEPHONE',
      'ELECTRONIC',
    ];
    const present = new Set(
      TEST_CASES.filter((t) => t.language === 'ko').map((t) => t.semioticClass),
    );
    for (const cls of required) {
      expect(present.has(cls), `missing Korean coverage for ${cls}`).toBe(true);
    }
  });
});
