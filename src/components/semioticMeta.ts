/**
 * UI-layer presentation metadata for each semiotic class.
 *
 * This deliberately lives outside `src/tn/` — the engine has no notion of
 * colours. Display labels and blurbs live in the i18n dictionaries
 * (`class.*` / `classBlurb.*` keys); this file keeps the non-translatable
 * per-class accents and canonical examples.
 */

import type { Language, SemioticClass } from '../tn';

/** Display order + labels for the TN input-language toggles. */
export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' },
  { code: 'ja', label: '日本語' },
];

export interface SemioticMeta {
  /** Accent hex used for the highlight underline, pill, and chart bar. */
  color: string;
  example: string;
}

export const SEMIOTIC_META: Record<SemioticClass, SemioticMeta> = {
  CARDINAL: {
    color: '#38bdf8',
    example: '1,250 → one thousand two hundred fifty',
  },
  ORDINAL: {
    color: '#a78bfa',
    example: '3rd → third',
  },
  DECIMAL: {
    color: '#2dd4bf',
    example: '3.14 → three point one four',
  },
  DATE: {
    color: '#34d399',
    example: '3/14 → March fourteenth',
  },
  TIME: {
    color: '#fbbf24',
    example: '2:30 PM → two thirty PM',
  },
  MONEY: {
    color: '#a3e635',
    example: '$5 → five dollars',
  },
  PERCENT: {
    color: '#fb923c',
    example: '50% → fifty percent',
  },
  MEASURE: {
    color: '#60a5fa',
    example: '12km → twelve kilometers',
  },
  TELEPHONE: {
    color: '#fb7185',
    example: '555-123-4567 → five five five …',
  },
  DIGIT: {
    color: '#f472b6',
    example: 'room 502 → five zero two',
  },
  ELECTRONIC: {
    color: '#c084fc',
    example: 'a@b.com → a at b dot com',
  },
  ABBREVIATION: {
    color: '#facc15',
    example: 'Dr. → Doctor',
  },
  PLAIN: {
    color: '#94a3b8',
    example: 'hello → hello',
  },
};

/** All classes that the engine actively normalizes (excludes PLAIN). */
export const NORMALIZED_CLASSES = (
  Object.keys(SEMIOTIC_META) as SemioticClass[]
).filter((c) => c !== 'PLAIN');
