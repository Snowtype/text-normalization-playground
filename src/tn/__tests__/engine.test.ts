import { describe, it, expect } from 'vitest';
import { normalize, getHandlers } from '../registry';
import { AMBIGUITY_CASES } from '../ambiguity';

describe('engine — edge cases', () => {
  it('returns an empty result for empty input', () => {
    const r = normalize('', 'en');
    expect(r.output).toBe('');
    expect(r.spans).toHaveLength(0);
    expect(r.tokens).toHaveLength(0);
  });

  it('leaves whitespace-only / plain input untouched', () => {
    expect(normalize('   ', 'en').output).toBe('   ');
    expect(normalize('hello world', 'en').spans).toHaveLength(0);
    expect(normalize('hello world', 'en').output).toBe('hello world');
  });

  it('does not throw on punctuation-only input', () => {
    expect(() => normalize('!@#$%^&*()', 'en')).not.toThrow();
  });
});

describe('engine — overlap resolution', () => {
  it('reads digits inside $5 as money, not a bare cardinal', () => {
    const r = normalize('$5', 'en');
    expect(r.spans).toHaveLength(1);
    expect(r.spans[0].semioticClass).toBe('MONEY');
    expect(r.output).toBe('five dollars');
  });

  it('prefers the specific MEASURE rule over DECIMAL for 5.5kg', () => {
    const r = normalize('5.5kg', 'en');
    expect(r.spans).toHaveLength(1);
    expect(r.spans[0].semioticClass).toBe('MEASURE');
  });
});

describe('engine — trace integrity', () => {
  it('produces ordered, non-overlapping spans for a mixed sentence', () => {
    const r = normalize('I paid $5 on 3/14', 'en');
    expect(r.output).toBe('I paid five dollars on March fourteenth');
    expect(r.spans.map((s) => s.semioticClass)).toEqual(['MONEY', 'DATE']);
    // spans are sorted by start and never overlap
    for (let i = 1; i < r.spans.length; i++) {
      expect(r.spans[i].start).toBeGreaterThanOrEqual(r.spans[i - 1].end);
    }
  });

  it('reconstructs the output by concatenating tokens', () => {
    const r = normalize('Call 555-123-4567 at 2:30 PM', 'en');
    expect(r.tokens.map((t) => t.text).join('')).toBe(r.output);
  });

  it('attaches a disambiguation note to ambiguous dates', () => {
    const r = normalize('1/2', 'en');
    expect(r.spans[0].note).toMatch(/fraction|ratio/i);
  });

  it('flags the native-vs-Sino choice on Korean times', () => {
    const r = normalize('3시', 'ko');
    expect(r.spans[0].note).toMatch(/NATIVE|SINO/);
  });
});

describe('registry', () => {
  it('exposes handler lists for both languages', () => {
    expect(getHandlers('en').length).toBeGreaterThan(5);
    expect(getHandlers('ko').length).toBeGreaterThan(5);
  });

  it('gives every handler a unique rule id', () => {
    for (const lang of ['en', 'ko'] as const) {
      const ids = getHandlers(lang).map((h) => h.rule);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe('ambiguity showcase cases', () => {
  it('every curated case normalizes without throwing and yields output', () => {
    for (const c of AMBIGUITY_CASES) {
      const r = normalize(c.input, c.language);
      expect(typeof r.output).toBe('string');
      expect(r.output.length).toBeGreaterThan(0);
    }
  });
});
