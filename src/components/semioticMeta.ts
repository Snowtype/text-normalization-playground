/**
 * UI-layer presentation metadata for each semiotic class.
 *
 * This deliberately lives outside `src/tn/` — the engine has no notion of
 * colours or labels. Keeping it here preserves the engine/UI separation while
 * giving every component one place to look up how a class should render.
 */

import type { SemioticClass } from '../tn';

export interface SemioticMeta {
  label: string;
  /** Accent hex used for the highlight underline, pill, and chart bar. */
  color: string;
  blurb: string;
  example: string;
}

export const SEMIOTIC_META: Record<SemioticClass, SemioticMeta> = {
  CARDINAL: {
    label: 'Cardinal',
    color: '#38bdf8',
    blurb: 'Counting numbers.',
    example: '1,250 → one thousand two hundred fifty',
  },
  ORDINAL: {
    label: 'Ordinal',
    color: '#a78bfa',
    blurb: 'Rank / position numbers.',
    example: '3rd → third',
  },
  DECIMAL: {
    label: 'Decimal',
    color: '#2dd4bf',
    blurb: 'Numbers with a fractional part.',
    example: '3.14 → three point one four',
  },
  DATE: {
    label: 'Date',
    color: '#34d399',
    blurb: 'Calendar dates.',
    example: '3/14 → March fourteenth',
  },
  TIME: {
    label: 'Time',
    color: '#fbbf24',
    blurb: 'Clock times.',
    example: '2:30 PM → two thirty PM',
  },
  MONEY: {
    label: 'Money',
    color: '#a3e635',
    blurb: 'Currency amounts.',
    example: '$5 → five dollars',
  },
  PERCENT: {
    label: 'Percent',
    color: '#fb923c',
    blurb: 'Percentages.',
    example: '50% → fifty percent',
  },
  MEASURE: {
    label: 'Measure',
    color: '#60a5fa',
    blurb: 'Quantities with units / counters.',
    example: '12km → twelve kilometers',
  },
  TELEPHONE: {
    label: 'Telephone',
    color: '#fb7185',
    blurb: 'Phone numbers, read digit by digit.',
    example: '555-123-4567 → five five five …',
  },
  DIGIT: {
    label: 'Digit string',
    color: '#f472b6',
    blurb: 'Identifiers read digit by digit.',
    example: 'room 502 → five zero two',
  },
  ELECTRONIC: {
    label: 'Electronic',
    color: '#c084fc',
    blurb: 'URLs and email addresses.',
    example: 'a@b.com → a at b dot com',
  },
  ABBREVIATION: {
    label: 'Abbreviation',
    color: '#facc15',
    blurb: 'Shortened words expanded in full.',
    example: 'Dr. → Doctor',
  },
  PLAIN: {
    label: 'Plain',
    color: '#94a3b8',
    blurb: 'Ordinary words, left verbatim.',
    example: 'hello → hello',
  },
};

/** All classes that the engine actively normalizes (excludes PLAIN). */
export const NORMALIZED_CLASSES = (
  Object.keys(SEMIOTIC_META) as SemioticClass[]
).filter((c) => c !== 'PLAIN');
