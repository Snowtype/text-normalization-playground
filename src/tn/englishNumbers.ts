/**
 * English number-word conversion helpers used by the English semiotic-class
 * handlers. Kept separate so the cardinal/ordinal logic can be unit-tested in
 * isolation from the regex matchers.
 */

const ONES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];

const TENS = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];

// Short-scale group names, indexed by group position (groups of three digits).
const SCALES = ['', 'thousand', 'million', 'billion', 'trillion'];

/** Read an integer 0–999 as words ("two hundred fifty"). */
function readUnderThousand(n: number): string {
  const parts: string[] = [];
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds > 0) {
    parts.push(`${ONES[hundreds]} hundred`);
  }
  if (rest > 0) {
    if (rest < 20) {
      parts.push(ONES[rest]);
    } else {
      const t = Math.floor(rest / 10);
      const o = rest % 10;
      parts.push(o > 0 ? `${TENS[t]} ${ONES[o]}` : TENS[t]);
    }
  }
  return parts.join(' ');
}

/**
 * Read a non-negative integer as cardinal words.
 * Example: 1250 -> "one thousand two hundred fifty".
 */
export function cardinalToWords(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  let n = Math.trunc(Math.abs(value));
  if (n === 0) return 'zero';

  // Split into three-digit groups, least-significant first.
  const groups: number[] = [];
  while (n > 0) {
    groups.push(n % 1000);
    n = Math.floor(n / 1000);
  }
  if (groups.length > SCALES.length) {
    // Beyond trillions we fall back to digit-by-digit to stay honest rather
    // than invent scale names the rule set does not cover.
    return digitsToWords(String(Math.trunc(Math.abs(value))));
  }

  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g === 0) continue;
    const scale = SCALES[i];
    parts.push(
      scale ? `${readUnderThousand(g)} ${scale}` : readUnderThousand(g),
    );
  }
  const words = parts.join(' ');
  return value < 0 ? `minus ${words}` : words;
}

const ORDINAL_ONES: Record<string, string> = {
  one: 'first',
  two: 'second',
  three: 'third',
  five: 'fifth',
  eight: 'eighth',
  nine: 'ninth',
  twelve: 'twelfth',
};

/**
 * Read a non-negative integer as ordinal words.
 * Example: 22 -> "twenty second"; 3 -> "third"; 100 -> "one hundredth".
 */
export function ordinalToWords(value: number): string {
  const cardinal = cardinalToWords(value);
  const words = cardinal.split(' ');
  const last = words[words.length - 1];

  let ordinalLast: string;
  if (ORDINAL_ONES[last]) {
    ordinalLast = ORDINAL_ONES[last];
  } else if (last.endsWith('y')) {
    // twenty -> twentieth, thirty -> thirtieth
    ordinalLast = `${last.slice(0, -1)}ieth`;
  } else {
    ordinalLast = `${last}th`;
  }
  words[words.length - 1] = ordinalLast;
  return words.join(' ');
}

/**
 * Read each character of a digit string individually.
 * Example: "502" -> "five zero two".
 */
export function digitsToWords(digits: string): string {
  return digits
    .split('')
    .filter((c) => c >= '0' && c <= '9')
    .map((d) => ONES[Number(d)])
    .join(' ');
}

/**
 * Read a decimal number: integer part as cardinal, fractional part digit by
 * digit after "point". Example: "3.14" -> "three point one four".
 */
export function decimalToWords(intPart: string, fracPart: string): string {
  const intWords = cardinalToWords(Number(intPart || '0'));
  if (!fracPart) return intWords;
  return `${intWords} point ${digitsToWords(fracPart)}`;
}
