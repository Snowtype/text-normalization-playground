/**
 * Japanese number-word conversion helpers (output is hiragana — the spoken
 * reading a TTS front-end produces before G2P).
 *
 * Japanese TN is dominated by *euphonic sound changes* (連濁 rendaku / 促音便
 * gemination): the reading of a Sino-Japanese numeral changes depending on the
 * sound that follows it. 100 is ひゃく but 300 is さんびゃく, 600 ろっぴゃく,
 * 800 はっぴゃく; 3 本 is さんぼん, 1 本 いっぽん, 10 本 じゅっぽん. Date and
 * counter readings add a thick layer of lexical irregularity on top. These
 * helpers encode the regular sound-change rules; the irregular date/counter
 * readings live in `japanese.ts`.
 */

const JA_ONES = [
  '',
  'いち',
  'に',
  'さん',
  'よん',
  'ご',
  'ろく',
  'なな',
  'はち',
  'きゅう',
];

/** Hundreds place (百) with rendaku/gemination on 3, 6, 8. */
function hundredsReading(d: number): string {
  switch (d) {
    case 0:
      return '';
    case 1:
      return 'ひゃく';
    case 3:
      return 'さんびゃく';
    case 6:
      return 'ろっぴゃく';
    case 8:
      return 'はっぴゃく';
    default:
      return JA_ONES[d] + 'ひゃく';
  }
}

/** Thousands place (千): 1 is せん (not いっせん); 3 さんぜん, 8 はっせん. */
function thousandsReading(d: number): string {
  switch (d) {
    case 0:
      return '';
    case 1:
      return 'せん';
    case 3:
      return 'さんぜん';
    case 8:
      return 'はっせん';
    default:
      return JA_ONES[d] + 'せん';
  }
}

/** Tens place (十): 10 is じゅう (not いちじゅう). */
function tensReading(d: number): string {
  if (d === 0) return '';
  if (d === 1) return 'じゅう';
  return JA_ONES[d] + 'じゅう';
}

/** Read a 1–9999 chunk. */
function readChunkJa(value: number): string {
  let n = value;
  const th = Math.floor(n / 1000);
  n %= 1000;
  const h = Math.floor(n / 100);
  n %= 100;
  const t = Math.floor(n / 10);
  const o = n % 10;
  return (
    thousandsReading(th) +
    hundredsReading(h) +
    tensReading(t) +
    (o ? JA_ONES[o] : '')
  );
}

// Myriad (10^4) units. Unlike Korean, Japanese keeps the いち before 万/億
// (10000 = いちまん).
const JA_BIG = ['', 'まん', 'おく', 'ちょう', 'けい'];

/**
 * Read a non-negative integer with Sino-Japanese numerals (hiragana).
 * Example: 1250 -> "せんにひゃくごじゅう"; 10000 -> "いちまん".
 */
export function sinoJapanese(value: number): string {
  let n = Math.trunc(Math.abs(value));
  if (n === 0) return 'ゼロ';

  const chunks: number[] = [];
  while (n > 0) {
    chunks.push(n % 10000);
    n = Math.floor(n / 10000);
  }
  if (chunks.length > JA_BIG.length) {
    return japaneseDigits(String(Math.trunc(Math.abs(value))));
  }

  let out = '';
  for (let i = chunks.length - 1; i >= 0; i--) {
    if (chunks[i] === 0) continue;
    out += readChunkJa(chunks[i]) + JA_BIG[i];
  }
  return out;
}

/** Read digits individually (phone style); 0 -> ゼロ. */
export function japaneseDigits(digits: string): string {
  const map = [
    'ゼロ',
    'いち',
    'に',
    'さん',
    'よん',
    'ご',
    'ろく',
    'なな',
    'はち',
    'きゅう',
  ];
  return digits
    .split('')
    .filter((c) => c >= '0' && c <= '9')
    .map((d) => map[Number(d)])
    .join('');
}

/**
 * Read a number before a *euphonic counter* — one whose initial consonant
 * geminates/voices after 1, 6, 8, 10. `units` gives the full reading for 1–9,
 * `gemSuffix` is the counter form after じゅっ (for 10 and multiples of ten),
 * and `plain` is the bare counter used as a fallback for 100+.
 *
 * Example (本): euphonicCounter(3, …) -> "さんぼん"; (1) -> "いっぽん";
 * (30) -> "さんじゅっぽん".
 */
export function euphonicCounter(
  n: number,
  units: string[],
  gemSuffix: string,
  plain: string,
): string {
  if (n <= 0) return sinoJapanese(n) + plain;
  if (n < 10) return units[n];
  if (n === 10) return 'じゅっ' + gemSuffix;
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    if (o === 0)
      return (t === 1 ? 'じゅっ' : JA_ONES[t] + 'じゅっ') + gemSuffix;
    const tens = t === 1 ? 'じゅう' : JA_ONES[t] + 'じゅう';
    return tens + units[o];
  }
  // Above 99 the leading euphony is dropped for simplicity (rare in practice).
  return sinoJapanese(n) + plain;
}
