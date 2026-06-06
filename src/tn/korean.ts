/**
 * Korean semiotic-class handlers.
 *
 * The defining difficulty of Korean TN is numeral-system selection: the same
 * digits are read with Sino-Korean numerals before some counters (분, 원, 일)
 * and native Korean numerals before others (시, 개, 살). The handlers below
 * encode the conventional choice per counter and flag the ones a fixed rule
 * cannot truly resolve.
 *
 * Note: `\b` is an ASCII word boundary and is unreliable next to Hangul, so
 * these patterns lean on the digit/counter shapes directly rather than `\b`.
 */

import type { SemioticHandler } from './types';
import { sinoKorean, nativeKorean, sinoDigits } from './koreanNumbers';

const stripCommas = (s: string) => s.replace(/,/g, '');

/** Months with their irregular spoken readings (6월 유월, 10월 시월). */
function monthReading(m: number): string {
  if (m === 6) return '유월';
  if (m === 10) return '시월';
  return `${sinoKorean(m)}월`;
}

// MEASURE: unit symbol -> Korean spoken form. Read with Sino numerals.
const KO_UNITS: Record<string, string> = {
  km: '킬로미터',
  cm: '센티미터',
  mm: '밀리미터',
  m: '미터',
  kg: '킬로그램',
  mg: '밀리그램',
  g: '그램',
  ml: '밀리리터',
  L: '리터',
  kHz: '킬로헤르츠',
  MHz: '메가헤르츠',
  GHz: '기가헤르츠',
  Hz: '헤르츠',
  GB: '기가바이트',
  MB: '메가바이트',
  kB: '킬로바이트',
  TB: '테라바이트',
};

// Native counters take native Korean numerals (한/두/세/스무 …). 번째 is
// handled by the ORDINAL rule, not here, so it is intentionally absent.
const NATIVE_COUNTERS = [
  '시간',
  '개',
  '명',
  '마리',
  '살',
  '권',
  '잔',
  '병',
  '대',
  '그루',
  '송이',
  '채',
];

// Sino counters take Sino-Korean numerals. 인분 precedes 분 in the regex so the
// longer counter wins.
const SINO_COUNTERS = ['인분', '층', '호', '초', '분', '학년', '교시'];

const spellEmail = (s: string) =>
  s
    .replace(/@/g, ' 골뱅이 ')
    .replace(/\./g, ' 점 ')
    .replace(/_/g, ' 언더바 ')
    .replace(/-/g, ' 대시 ')
    .replace(/\s+/g, ' ')
    .trim();

const spellUrl = (s: string) =>
  s
    .replace(/https/gi, 'h t t p s')
    .replace(/http/gi, 'h t t p')
    .replace(/:\/\//g, ' 콜론 슬래시 슬래시 ')
    .replace(/www/gi, 'w w w')
    .replace(/\./g, ' 점 ')
    .replace(/\//g, ' 슬래시 ')
    .replace(/-/g, ' 대시 ')
    .replace(/\s+/g, ' ')
    .trim();

export const koreanHandlers: SemioticHandler[] = [
  // ELECTRONIC — email / URL.
  {
    semioticClass: 'ELECTRONIC',
    rule: 'ko:electronic-email',
    priority: 100,
    pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
    normalize: (m) => ({ normalized: spellEmail(m[0]) }),
  },
  {
    semioticClass: 'ELECTRONIC',
    rule: 'ko:electronic-url',
    priority: 99,
    pattern: /(?:https?:\/\/|www\.)[^\s]*[A-Za-z0-9/]/g,
    normalize: (m) => ({ normalized: spellUrl(m[0]) }),
  },
  // TELEPHONE — 010-1234-5678 etc., digit by digit (0 -> 공).
  {
    semioticClass: 'TELEPHONE',
    rule: 'ko:telephone',
    priority: 95,
    pattern: /\d{2,3}-\d{3,4}-\d{4}/g,
    normalize: (m) => ({
      normalized: m[0]
        .split('-')
        .map((g) => sinoDigits(g))
        .join(' '),
    }),
  },
  // MONEY — "100원", "5만 원". Sino numerals.
  {
    semioticClass: 'MONEY',
    rule: 'ko:money',
    priority: 90,
    pattern: /(\d[\d,]*)\s?(억|만|천)?\s?원/g,
    normalize: (m) => {
      const mult =
        m[2] === '억' ? 1e8 : m[2] === '만' ? 1e4 : m[2] === '천' ? 1e3 : 1;
      const value = Number(stripCommas(m[1])) * mult;
      return { normalized: `${sinoKorean(value)} 원` };
    },
  },
  // PERCENT — "50%", "3.5퍼센트". Sino numerals + 퍼센트.
  {
    semioticClass: 'PERCENT',
    rule: 'ko:percent',
    priority: 75,
    pattern: /(\d[\d,]*)(?:\.(\d+))?\s?(%|퍼센트|프로)/g,
    normalize: (m) => {
      const intWords = sinoKorean(Number(stripCommas(m[1])));
      const num = m[2] ? `${intWords} 점 ${sinoDigits(m[2])}` : intWords;
      return { normalized: `${num} 퍼센트` };
    },
  },
  // TIME — "3시", "2시 30분". Hour = NATIVE (두 시), minute = SINO (삼십 분).
  {
    semioticClass: 'TIME',
    rule: 'ko:time',
    priority: 85,
    pattern: /(\d{1,2})\s?시(?!간)(?:\s?(\d{1,2})\s?분)?/g,
    normalize: (m) => {
      const hour = Number(m[1]);
      if (hour > 24) return null;
      let out = `${nativeKorean(hour, true)} 시`;
      if (m[2]) out += ` ${sinoKorean(Number(m[2]))} 분`;
      return {
        normalized: out,
        note: 'Hour uses NATIVE Korean (두 시); minutes use SINO (삼십 분). Picking the wrong system is a classic Korean TN error.',
      };
    },
  },
  // DATE — year/month/day, each read with Sino numerals (6월 유월, 10월 시월).
  {
    semioticClass: 'DATE',
    rule: 'ko:date-year',
    priority: 82,
    pattern: /(\d{1,4})\s?년/g,
    normalize: (m) => ({ normalized: `${sinoKorean(Number(m[1]))} 년` }),
  },
  {
    semioticClass: 'DATE',
    rule: 'ko:date-month',
    priority: 81,
    pattern: /(\d{1,2})\s?월/g,
    normalize: (m) => {
      const month = Number(m[1]);
      if (month < 1 || month > 12) return null;
      return {
        normalized: monthReading(month),
        note:
          month === 6 || month === 10
            ? 'Irregular reading (6월→유월, 10월→시월).'
            : undefined,
      };
    },
  },
  {
    semioticClass: 'DATE',
    rule: 'ko:date-day',
    priority: 80,
    pattern: /(\d{1,2})\s?일/g,
    normalize: (m) => {
      const day = Number(m[1]);
      if (day < 1 || day > 31) return null;
      return { normalized: `${sinoKorean(day)} 일` };
    },
  },
  // MEASURE — number + unit symbol, Sino numerals.
  {
    semioticClass: 'MEASURE',
    rule: 'ko:measure',
    priority: 70,
    pattern:
      /(\d+(?:\.\d+)?)\s?(km|cm|mm|kg|mg|ml|kHz|MHz|GHz|Hz|GB|MB|kB|TB|m|g|L)\b/g,
    normalize: (m) => {
      const unit = KO_UNITS[m[2]];
      if (!unit) return null;
      const [int, frac] = m[1].split('.');
      const num = frac
        ? `${sinoKorean(Number(int))} 점 ${sinoDigits(frac)}`
        : sinoKorean(Number(int));
      return { normalized: `${num} ${unit}` };
    },
  },
  // COUNTER (native) — "3개" -> "세 개", "20살" -> "스무 살".
  {
    semioticClass: 'MEASURE',
    rule: 'ko:counter-native',
    priority: 66,
    pattern: new RegExp(`(\\d{1,3})\\s?(${NATIVE_COUNTERS.join('|')})`, 'g'),
    normalize: (m) => ({
      normalized: `${nativeKorean(Number(m[1]), true)} ${m[2]}`,
      note: 'Native Korean numeral required before this counter (한/두/세/스무 …).',
    }),
  },
  // COUNTER (Sino) — "3층" -> "삼 층", "30초" -> "삼십 초".
  {
    semioticClass: 'MEASURE',
    rule: 'ko:counter-sino',
    priority: 65,
    pattern: new RegExp(`(\\d{1,4})\\s?(${SINO_COUNTERS.join('|')})`, 'g'),
    normalize: (m) => ({
      normalized: `${sinoKorean(Number(m[1]))} ${m[2]}`,
      note: 'This counter takes Sino-Korean numerals.',
    }),
  },
  // ORDINAL — "제3" -> "제삼" (Sino), "3번째" -> "세 번째" (native).
  {
    semioticClass: 'ORDINAL',
    rule: 'ko:ordinal-sino',
    priority: 56,
    pattern: /제\s?(\d+)/g,
    normalize: (m) => ({ normalized: `제${sinoKorean(Number(m[1]))}` }),
  },
  {
    semioticClass: 'ORDINAL',
    rule: 'ko:ordinal-native',
    priority: 55,
    pattern: /(\d{1,3})\s?번째/g,
    normalize: (m) => ({
      normalized: `${nativeKorean(Number(m[1]), true)} 번째`,
    }),
  },
  // DECIMAL — "3.14" -> "삼 점 일사".
  {
    semioticClass: 'DECIMAL',
    rule: 'ko:decimal',
    priority: 50,
    pattern: /(\d+)\.(\d+)/g,
    normalize: (m) => ({
      normalized: `${sinoKorean(Number(m[1]))} 점 ${sinoDigits(m[2])}`,
    }),
  },
  // CARDINAL — bare integer, Sino numerals. Lowest priority.
  {
    semioticClass: 'CARDINAL',
    rule: 'ko:cardinal',
    priority: 40,
    pattern: /\d{1,3}(?:,\d{3})+|\d+/g,
    normalize: (m) => ({ normalized: sinoKorean(Number(stripCommas(m[0]))) }),
  },
];
