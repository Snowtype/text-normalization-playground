/**
 * Public API of the TN engine.
 *
 * Import from here (`import { normalize } from './tn'`) rather than reaching
 * into individual files — this barrel is the engine's contract with the UI.
 */

export type {
  Language,
  SemioticClass,
  NormalizedSpan,
  TnToken,
  TnResult,
  SemioticHandler,
} from './types';

export { normalize, getHandlers } from './registry';

export {
  cardinalToWords,
  ordinalToWords,
  decimalToWords,
  digitsToWords,
} from './englishNumbers';

export { sinoKorean, nativeKorean, sinoDigits } from './koreanNumbers';

export { AMBIGUITY_CASES } from './ambiguity';
export type { AmbiguityCase } from './ambiguity';

export { TEST_CASES } from './testCases';
export type { TestCase } from './testCases';
