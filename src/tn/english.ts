/**
 * English semiotic-class handlers.
 *
 * Each handler targets one semiotic class. `priority` resolves overlaps: more
 * specific patterns (ELECTRONIC, MONEY, TIME) outrank generic ones (CARDINAL)
 * so the digits inside "$5" are read as money, not as a bare cardinal.
 */

import type { SemioticHandler } from './types';
import {
  cardinalToWords,
  ordinalToWords,
  digitsToWords,
  decimalToWords,
} from './englishNumbers';

const MONTHS = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Read a year the way it is spoken: 2020 -> "twenty twenty", 1905 -> "nineteen oh five". */
function readYear(y: number): string {
  if (y < 1000) return cardinalToWords(y);
  // 2000–2009 are read "two thousand (and) X".
  if (y >= 2000 && y <= 2009) return cardinalToWords(y);
  const hi = Math.floor(y / 100);
  const lo = y % 100;
  if (lo === 0) {
    if (y % 1000 === 0) return cardinalToWords(y); // 2000 -> two thousand
    return `${cardinalToWords(hi)} hundred`; // 1900 -> nineteen hundred
  }
  if (lo < 10) return `${cardinalToWords(hi)} oh ${cardinalToWords(lo)}`; // 1905
  return `${cardinalToWords(hi)} ${cardinalToWords(lo)}`; // 2020 -> twenty twenty
}

/** Spell a URL the way a TTS engine would read it aloud. */
function spellUrl(url: string): string {
  return url
    .replace(/https/gi, 'h t t p s')
    .replace(/http/gi, 'h t t p')
    .replace(/:\/\//g, ' colon slash slash ')
    .replace(/www/gi, 'w w w')
    .replace(/\./g, ' dot ')
    .replace(/\//g, ' slash ')
    .replace(/-/g, ' dash ')
    .replace(/_/g, ' underscore ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Spell an email address aloud. */
function spellEmail(email: string): string {
  return email
    .replace(/@/g, ' at ')
    .replace(/\./g, ' dot ')
    .replace(/_/g, ' underscore ')
    .replace(/-/g, ' dash ')
    .replace(/\+/g, ' plus ')
    .replace(/\s+/g, ' ')
    .trim();
}

// MEASURE: unit symbol -> { singular, plural }. Longer symbols are listed
// first in the regex so "km/h" wins over "km".
const UNITS: Record<string, { sg: string; pl: string }> = {
  'km/h': { sg: 'kilometer per hour', pl: 'kilometers per hour' },
  mph: { sg: 'mile per hour', pl: 'miles per hour' },
  km: { sg: 'kilometer', pl: 'kilometers' },
  cm: { sg: 'centimeter', pl: 'centimeters' },
  mm: { sg: 'millimeter', pl: 'millimeters' },
  kg: { sg: 'kilogram', pl: 'kilograms' },
  mg: { sg: 'milligram', pl: 'milligrams' },
  ml: { sg: 'milliliter', pl: 'milliliters' },
  kHz: { sg: 'kilohertz', pl: 'kilohertz' },
  MHz: { sg: 'megahertz', pl: 'megahertz' },
  GHz: { sg: 'gigahertz', pl: 'gigahertz' },
  Hz: { sg: 'hertz', pl: 'hertz' },
  GB: { sg: 'gigabyte', pl: 'gigabytes' },
  MB: { sg: 'megabyte', pl: 'megabytes' },
  kB: { sg: 'kilobyte', pl: 'kilobytes' },
  TB: { sg: 'terabyte', pl: 'terabytes' },
  lb: { sg: 'pound', pl: 'pounds' },
  oz: { sg: 'ounce', pl: 'ounces' },
  ft: { sg: 'foot', pl: 'feet' },
  mi: { sg: 'mile', pl: 'miles' },
  m: { sg: 'meter', pl: 'meters' },
  g: { sg: 'gram', pl: 'grams' },
  L: { sg: 'liter', pl: 'liters' },
};

// ABBREVIATION dictionary. `note` flags abbreviations whose expansion is
// genuinely ambiguous; the engine commits to the listed reading and records
// the alternative in the trace.
const ABBREVIATIONS: Record<string, { full: string; note?: string }> = {
  Dr: {
    full: 'Doctor',
    note: 'Fixed choice: "Dr." → Doctor. Could also be "Drive" in an address.',
  },
  Mr: { full: 'Mister' },
  Mrs: { full: 'Missus' },
  Ms: { full: 'Miz' },
  Prof: { full: 'Professor' },
  St: {
    full: 'Saint',
    note: 'Fixed choice: "St." → Saint. Could also be "Street" (e.g. "Main St.").',
  },
  Ave: { full: 'Avenue' },
  Blvd: { full: 'Boulevard' },
  Rd: { full: 'Road' },
  Ln: { full: 'Lane' },
  Ct: { full: 'Court' },
  Mt: { full: 'Mount' },
  Jr: { full: 'Junior' },
  Sr: { full: 'Senior' },
  Inc: { full: 'Incorporated' },
  Corp: { full: 'Corporation' },
  Co: { full: 'Company' },
  No: { full: 'Number' },
  Dept: { full: 'Department' },
  approx: { full: 'approximately' },
  vs: { full: 'versus' },
  etc: { full: 'et cetera' },
};

// Keyword-triggered digit strings (DIGIT class). The keyword itself is kept
// (expanded if it is an abbreviation) and the trailing number is read digit by
// digit, because that is how room/flight/route numbers are spoken.
const DIGIT_KEYWORDS: Record<string, string> = {
  room: 'room',
  rooms: 'rooms',
  suite: 'suite',
  ste: 'suite',
  apt: 'apartment',
  apartment: 'apartment',
  unit: 'unit',
  flight: 'flight',
  gate: 'gate',
  route: 'route',
  building: 'building',
  bldg: 'building',
};

const stripCommas = (s: string) => s.replace(/,/g, '');

export const englishHandlers: SemioticHandler[] = [
  // ELECTRONIC — email. Highest priority so its dots/digits are not re-parsed.
  {
    semioticClass: 'ELECTRONIC',
    rule: 'en:electronic-email',
    priority: 100,
    pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
    normalize: (m) => ({ normalized: spellEmail(m[0]) }),
  },
  // ELECTRONIC — URL (requires a protocol or www. prefix to avoid eating
  // ordinary "word.word" text). The final char class trims trailing
  // punctuation out of the matched span.
  {
    semioticClass: 'ELECTRONIC',
    rule: 'en:electronic-url',
    priority: 99,
    pattern: /(?:https?:\/\/|www\.)[^\s]*[A-Za-z0-9/]/g,
    normalize: (m) => ({ normalized: spellUrl(m[0]) }),
  },
  // TELEPHONE — US-style 7–11 digit numbers, read digit by digit in groups.
  {
    semioticClass: 'TELEPHONE',
    rule: 'en:telephone',
    priority: 95,
    pattern: /(?:\+?\d{1,2}[\s.-])?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g,
    normalize: (m) => {
      const groups = m[0].split(/[\s.()+-]+/).filter(Boolean);
      const digitCount = groups.join('').length;
      if (digitCount < 7 || digitCount > 11) return null;
      return { normalized: groups.map((g) => digitsToWords(g)).join(', ') };
    },
  },
  // MONEY — "$5", "$1,250.50". Reads dollars and cents.
  {
    semioticClass: 'MONEY',
    rule: 'en:money',
    priority: 90,
    pattern: /\$\s?(\d{1,3}(?:,\d{3})*|\d+)(?:\.(\d{1,2}))?/g,
    normalize: (m) => {
      const dollars = Number(stripCommas(m[1]));
      const cents = m[2] ? Number(m[2].padEnd(2, '0')) : 0;
      const parts: string[] = [];
      if (dollars > 0 || cents === 0) {
        parts.push(
          `${cardinalToWords(dollars)} ${dollars === 1 ? 'dollar' : 'dollars'}`,
        );
      }
      if (cents > 0) {
        parts.push(
          `${cardinalToWords(cents)} ${cents === 1 ? 'cent' : 'cents'}`,
        );
      }
      return { normalized: parts.join(' and ') };
    },
  },
  // TIME — "2:30 PM", "2:00", "14:05".
  {
    semioticClass: 'TIME',
    rule: 'en:time',
    priority: 85,
    pattern: /\b(\d{1,2}):(\d{2})(?:\s?([AaPp]\.?[Mm]\.?))?/g,
    normalize: (m) => {
      const hour = Number(m[1]);
      const minute = Number(m[2]);
      if (hour > 23 || minute > 59) return null;
      const hourWords = cardinalToWords(hour);
      let body: string;
      if (minute === 0) body = `${hourWords} o'clock`;
      else if (minute < 10) body = `${hourWords} oh ${cardinalToWords(minute)}`;
      else body = `${hourWords} ${cardinalToWords(minute)}`;
      const meridiem = m[3] ? ` ${m[3].replace(/\./g, '').toUpperCase()}` : '';
      return { normalized: body + meridiem };
    },
  },
  // DATE — "3/14", "3/14/2020" (US M/D[/Y]). Ambiguous: see the note.
  {
    semioticClass: 'DATE',
    rule: 'en:date',
    priority: 80,
    pattern: /\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/g,
    normalize: (m) => {
      const month = Number(m[1]);
      const day = Number(m[2]);
      if (month < 1 || month > 12 || day < 1 || day > 31) return null;
      let out = `${MONTHS[month]} ${ordinalToWords(day)}`;
      if (m[3])
        out += ` ${readYear(Number(m[3].length === 2 ? `20${m[3]}` : m[3]))}`;
      return {
        normalized: out,
        note: 'Fixed choice: read as a date (M/D). Could also be a fraction (one half) or ratio (one to two).',
      };
    },
  },
  // PERCENT — "50%", "3.5%".
  {
    semioticClass: 'PERCENT',
    rule: 'en:percent',
    priority: 75,
    pattern: /(\d{1,3}(?:,\d{3})*|\d+)(?:\.(\d+))?\s?%/g,
    normalize: (m) => {
      const num = m[2]
        ? decimalToWords(stripCommas(m[1]), m[2])
        : cardinalToWords(Number(stripCommas(m[1])));
      return { normalized: `${num} percent` };
    },
  },
  // MEASURE — number + unit symbol, e.g. "12km", "5.5 kg".
  {
    semioticClass: 'MEASURE',
    rule: 'en:measure',
    priority: 70,
    pattern:
      /\b(\d+(?:\.\d+)?)\s?(km\/h|mph|kHz|MHz|GHz|km|cm|mm|kg|mg|ml|Hz|GB|MB|kB|TB|lb|oz|ft|mi|m|g|L)\b/g,
    normalize: (m) => {
      const unit = UNITS[m[2]];
      if (!unit) return null;
      const value = Number(m[1]);
      const numWords = m[1].includes('.')
        ? decimalToWords(m[1].split('.')[0], m[1].split('.')[1])
        : cardinalToWords(value);
      return { normalized: `${numWords} ${value === 1 ? unit.sg : unit.pl}` };
    },
  },
  // DIGIT — keyword-triggered digit string, e.g. "room 502" -> "room five zero two".
  {
    semioticClass: 'DIGIT',
    rule: 'en:digit-string',
    priority: 65,
    pattern:
      /\b(room|rooms|suite|ste|apt|apartment|unit|flight|gate|route|building|bldg)\.?\s+(\d+)/gi,
    normalize: (m) => {
      const keyword = DIGIT_KEYWORDS[m[1].toLowerCase()] ?? m[1].toLowerCase();
      return {
        normalized: `${keyword} ${digitsToWords(m[2])}`,
        note: 'Digit-string reading triggered by the preceding keyword.',
      };
    },
  },
  // ABBREVIATION — "Dr.", "St.", "etc.".
  {
    semioticClass: 'ABBREVIATION',
    rule: 'en:abbreviation',
    priority: 60,
    pattern:
      /(?<![A-Za-z])(Dr|Mrs|Mr|Ms|Prof|St|Ave|Blvd|Rd|Ln|Ct|Mt|Jr|Sr|Inc|Corp|Co|No|Dept|approx|vs|etc)\.(?![A-Za-z])/g,
    normalize: (m) => {
      const entry = ABBREVIATIONS[m[1]];
      if (!entry) return null;
      return { normalized: entry.full, note: entry.note };
    },
  },
  // ORDINAL — "3rd", "22nd", "1,000th".
  {
    semioticClass: 'ORDINAL',
    rule: 'en:ordinal',
    priority: 55,
    pattern: /\b(\d{1,3}(?:,\d{3})*|\d+)(st|nd|rd|th)\b/gi,
    normalize: (m) => ({
      normalized: ordinalToWords(Number(stripCommas(m[1]))),
    }),
  },
  // DECIMAL — "3.14".
  {
    semioticClass: 'DECIMAL',
    rule: 'en:decimal',
    priority: 50,
    pattern: /\b(\d+)\.(\d+)\b/g,
    normalize: (m) => ({ normalized: decimalToWords(m[1], m[2]) }),
  },
  // CARDINAL — bare integers, including grouped "1,250". Lowest priority.
  {
    semioticClass: 'CARDINAL',
    rule: 'en:cardinal',
    priority: 40,
    pattern: /\b\d{1,3}(?:,\d{3})+\b|\b\d+\b/g,
    normalize: (m) => ({
      normalized: cardinalToWords(Number(stripCommas(m[0]))),
    }),
  },
];
