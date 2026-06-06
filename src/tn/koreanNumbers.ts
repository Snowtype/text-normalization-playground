/**
 * Korean number-word conversion helpers.
 *
 * Korean has TWO numeral systems, and choosing between them is the crux of
 * Korean TN:
 *
 *  - Sino-Korean (한자어 수사: 일, 이, 삼 …) — used for dates, money, minutes,
 *    phone numbers, measurements, floors, most counting above ~100.
 *  - Native Korean (고유어 수사: 하나, 둘, 셋 …) — used for hours, ages, and
 *    many everyday counters (개, 명, 마리 …). Before a counter these take an
 *    *attributive* form (한, 두, 세, 네, 스무).
 *
 * Picking the wrong system is the single most common Korean TN error, which is
 * exactly why the "Why neural?" section leans on these cases.
 */

const SINO_DIGITS = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
const SINO_SMALL_UNITS = ['', '십', '백', '천']; // within a 4-digit chunk
const SINO_BIG_UNITS = ['', '만', '억', '조', '경']; // myriad (10^4) grouping

/** Read a 1–9999 chunk, dropping the leading 일 before 십/백/천. */
function readSinoChunk(n: number): string {
  let result = '';
  let pos = 0;
  let rest = n;
  while (rest > 0) {
    const d = rest % 10;
    if (d > 0) {
      // 일십 -> 십, 일백 -> 백, 일천 -> 천 (but 일 is kept in the ones place)
      const digit = d === 1 && pos > 0 ? '' : SINO_DIGITS[d];
      result = digit + SINO_SMALL_UNITS[pos] + result;
    }
    rest = Math.floor(rest / 10);
    pos++;
  }
  return result;
}

/**
 * Read a non-negative integer with Sino-Korean numerals.
 * Korean groups by myriads (만 = 10^4), not thousands.
 * Example: 1250 -> "천이백오십"; 12345 -> "만이천삼백사십오".
 */
export function sinoKorean(value: number): string {
  const n = Math.trunc(Math.abs(value));
  if (n === 0) return '영';

  const chunks: number[] = [];
  let rest = n;
  while (rest > 0) {
    chunks.push(rest % 10000);
    rest = Math.floor(rest / 10000);
  }
  if (chunks.length > SINO_BIG_UNITS.length) {
    return sinoDigits(String(n));
  }

  let out = '';
  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i];
    if (chunk === 0) continue;
    const unit = SINO_BIG_UNITS[i];
    // 10000 reads as "만", not "일만"; but 억/조 keep the 일 (일억, 일조).
    if (chunk === 1 && unit === '만') {
      out += unit;
    } else {
      out += readSinoChunk(chunk) + unit;
    }
  }
  return out;
}

/** Read each digit individually in Sino-Korean, with 0 -> 공 (phone style). */
export function sinoDigits(digits: string): string {
  const map = ['공', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  return digits
    .split('')
    .filter((c) => c >= '0' && c <= '9')
    .map((d) => map[Number(d)])
    .join('');
}

const NATIVE_ONES = [
  '',
  '하나',
  '둘',
  '셋',
  '넷',
  '다섯',
  '여섯',
  '일곱',
  '여덟',
  '아홉',
];
// Attributive forms used directly before a counter (한 시, 두 개 …).
const NATIVE_ONES_ATTR = [
  '',
  '한',
  '두',
  '세',
  '네',
  '다섯',
  '여섯',
  '일곱',
  '여덟',
  '아홉',
];
const NATIVE_TENS = [
  '',
  '열',
  '스물',
  '서른',
  '마흔',
  '쉰',
  '예순',
  '일흔',
  '여든',
  '아흔',
];

/**
 * Read 1–99 with native Korean numerals.
 * @param attributive use the pre-counter form (한/두/세/네; 스무 for a bare 20).
 * Example: nativeKorean(2, true) -> "두"; nativeKorean(21) -> "스물하나".
 */
export function nativeKorean(value: number, attributive = false): string {
  const n = Math.trunc(Math.abs(value));
  if (n <= 0 || n > 99) {
    // Native numerals are not used past ~99; fall back to Sino.
    return sinoKorean(n);
  }
  const t = Math.floor(n / 10);
  const o = n % 10;

  let tensWord = NATIVE_TENS[t];
  // 스물 -> 스무 only as a bare attributive 20 (스무 살); 21 stays 스물한.
  if (attributive && t === 2 && o === 0) tensWord = '스무';

  const onesWord = attributive ? NATIVE_ONES_ATTR[o] : NATIVE_ONES[o];
  return `${tensWord}${onesWord}`;
}
