/**
 * Curated ambiguous inputs — the "Why neural TN?" dataset.
 *
 * Each case is an input the rule-based engine *can* process, but only by
 * committing to one fixed reading. The right reading depends on surrounding
 * context (sentence, domain, neighbouring tokens) that a context-free rule set
 * cannot see. These are exactly the cases a neural seq2seq TN model (ByT5/mT5),
 * trained on (written, spoken) pairs in context, is designed to resolve.
 *
 * The `input` strings are run live through the engine in the UI, so the
 * "rule-based guess" column always reflects the engine's actual output.
 */

import type { Language } from './types';

export interface AmbiguityCase {
  language: Language;
  input: string;
  /** The readings a human might intend, the engine's fixed pick listed first. */
  readings: string[];
  /** Why a context-free rule cannot decide. */
  whyAmbiguous: string;
  /** The contextual signal a neural model uses to disambiguate. */
  contextResolves: string;
}

export const AMBIGUITY_CASES: AmbiguityCase[] = [
  {
    language: 'en',
    input: '1/2',
    readings: [
      'January second (date)',
      'one half (fraction)',
      'one to two (ratio)',
    ],
    whyAmbiguous:
      'The slash form is used for dates (M/D), fractions, and ratios. Nothing in the three characters distinguishes them.',
    contextResolves:
      '"Meeting on 1/2" → date; "add 1/2 cup" → fraction; "won 1/2 of games" → ratio. A model reads the surrounding words.',
  },
  {
    language: 'en',
    input: 'Main St.',
    readings: ['Main Street', 'Main Saint'],
    whyAmbiguous:
      '"St." abbreviates both "Street" and "Saint". The engine here always expands to "Saint".',
    contextResolves:
      'Position decides it: "St." after a road name → Street; "St. Louis" before a proper noun → Saint.',
  },
  {
    language: 'en',
    input: 'Dr. Smith lives on Sunset Dr.',
    readings: ['Doctor … Drive', 'Drive … Doctor'],
    whyAmbiguous:
      'The same token "Dr." is Doctor before a name and Drive after a street name — in one sentence.',
    contextResolves:
      'A model sees "Dr." precedes a person ("Smith") vs. follows a place ("Sunset"), and reads each correctly.',
  },
  {
    language: 'en',
    input: '2-3',
    readings: [
      'two to three (range)',
      'two minus three (subtraction)',
      'February third (date)',
    ],
    whyAmbiguous:
      'A hyphenated number pair is a range, a subtraction, or a month-day depending entirely on context.',
    contextResolves:
      '"2-3 days" → range; "2-3 = -1" → subtraction; "born 2-3" → date. The neighbouring tokens decide.',
  },
  {
    language: 'en',
    input: 'Read pages 50-100, gates 50-100.',
    readings: ['fifty to one hundred', 'fifty, one hundred (digit strings)'],
    whyAmbiguous:
      '"50-100" is a range for pages but is often read digit-by-digit for gate or seat identifiers.',
    contextResolves:
      'The head noun ("pages" vs "gates") flips the reading. A rule can hard-code one; a model learns both.',
  },
  {
    language: 'ko',
    input: '3시',
    readings: ['세 시 (three o’clock — native)', '삼 시 (Sino — wrong here)'],
    whyAmbiguous:
      'Hours take native numerals (세 시), but the very same digit before most other counters takes Sino (삼). The digit alone does not say which counter sense is meant.',
    contextResolves:
      'The counter 시 means the native system is required; a model learns the counter→system mapping incl. exceptions.',
  },
  {
    language: 'ko',
    input: '1/2',
    readings: [
      '1월 2일 (January 2nd)',
      '2분의 1 (one half)',
      '1 대 2 (one to two)',
    ],
    whyAmbiguous:
      'Just like English, the slash is shared by dates, fractions (read 분의, denominator first!), and ratios.',
    contextResolves:
      'Korean fractions even reorder the operands (2분의 1), so the model must both classify and restructure.',
  },
  {
    language: 'ko',
    input: '100원',
    readings: ['백 원 (Sino)', '일백 원'],
    whyAmbiguous:
      'Money is Sino (백 원), but learners and rule sets often misfire by analogy with counters that are native, or by inserting an unnatural 일.',
    contextResolves:
      'A model learns 원 → Sino and the natural dropping of the leading 일 from spoken corpora.',
  },
  {
    language: 'ko',
    input: '2배',
    readings: ['두 배 (native — twofold)', '이 배 (Sino — wrong)'],
    whyAmbiguous:
      '배 ("times/fold") takes native numerals, but 배 is also a homograph (boat, pear, stomach); the counter sense itself must first be identified.',
    contextResolves:
      'Sense disambiguation of 배 plus the numeral-system choice — two coupled decisions a flat rule cannot make.',
  },
];
