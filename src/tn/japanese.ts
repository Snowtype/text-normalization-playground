/**
 * Japanese semiotic-class handlers.
 *
 * Japanese TN's hard cases are (1) euphonic counter readings (see
 * `euphonicCounter`) and (2) heavy lexical irregularity in dates and times:
 *  - 月 (month): 4→しがつ, 7→しちがつ, 9→くがつ.
 *  - 日 (day):   1→ついたち, 2→ふつか … 10→とおか, 14→じゅうよっか, 20→はつか.
 *  - 時 (hour):  4→よじ, 7→しちじ, 9→くじ.
 *  - 分 (minute): ふん/ぷん alternation (1→いっぷん, 3→さんぷん, 6→ろっぷん …).
 * Output is hiragana (the reading), matching how a Japanese TTS front-end feeds
 * the G2P stage.
 */

import type { SemioticHandler } from './types';
import {
  sinoJapanese,
  japaneseDigits,
  euphonicCounter,
} from './japaneseNumbers';

const stripCommas = (s: string) => s.replace(/,/g, '');

// ---- Date readings ----------------------------------------------------------

const MONTH_SPECIAL: Record<number, string> = { 4: 'し', 7: 'しち', 9: 'く' };
function monthReading(m: number): string {
  return (MONTH_SPECIAL[m] ?? sinoJapanese(m)) + 'がつ';
}

// The famous irregular day-of-month readings (1–10, 14, 20, 24).
const DAY_SPECIAL: Record<number, string> = {
  1: 'ついたち',
  2: 'ふつか',
  3: 'みっか',
  4: 'よっか',
  5: 'いつか',
  6: 'むいか',
  7: 'なのか',
  8: 'ようか',
  9: 'ここのか',
  10: 'とおか',
  14: 'じゅうよっか',
  20: 'はつか',
  24: 'にじゅうよっか',
};
function dayReading(d: number): string {
  return DAY_SPECIAL[d] ?? sinoJapanese(d) + 'にち';
}

// ---- Time readings ----------------------------------------------------------

const HOUR_SPECIAL: Record<number, string> = { 4: 'よ', 7: 'しち', 9: 'く' };
function hourReading(h: number): string {
  return (HOUR_SPECIAL[h] ?? sinoJapanese(h)) + 'じ';
}

const MIN_UNITS = [
  '',
  'いっぷん',
  'にふん',
  'さんぷん',
  'よんぷん',
  'ごふん',
  'ろっぷん',
  'ななふん',
  'はっぷん',
  'きゅうふん',
];
function minuteReading(m: number): string {
  return euphonicCounter(m, MIN_UNITS, 'ぷん', 'ふん');
}

// ---- Counters ---------------------------------------------------------------

interface CounterDef {
  units: string[];
  gem: string;
  plain: string;
}

const COUNTERS: Record<string, CounterDef> = {
  本: {
    units: [
      '',
      'いっぽん',
      'にほん',
      'さんぼん',
      'よんほん',
      'ごほん',
      'ろっぽん',
      'ななほん',
      'はっぽん',
      'きゅうほん',
    ],
    gem: 'ぽん',
    plain: 'ほん',
  },
  個: {
    units: [
      '',
      'いっこ',
      'にこ',
      'さんこ',
      'よんこ',
      'ごこ',
      'ろっこ',
      'ななこ',
      'はっこ',
      'きゅうこ',
    ],
    gem: 'こ',
    plain: 'こ',
  },
  杯: {
    units: [
      '',
      'いっぱい',
      'にはい',
      'さんばい',
      'よんはい',
      'ごはい',
      'ろっぱい',
      'ななはい',
      'はっぱい',
      'きゅうはい',
    ],
    gem: 'ぱい',
    plain: 'はい',
  },
  匹: {
    units: [
      '',
      'いっぴき',
      'にひき',
      'さんびき',
      'よんひき',
      'ごひき',
      'ろっぴき',
      'ななひき',
      'はっぴき',
      'きゅうひき',
    ],
    gem: 'ぴき',
    plain: 'ひき',
  },
  階: {
    units: [
      '',
      'いっかい',
      'にかい',
      'さんがい',
      'よんかい',
      'ごかい',
      'ろっかい',
      'ななかい',
      'はっかい',
      'きゅうかい',
    ],
    gem: 'かい',
    plain: 'かい',
  },
  歳: {
    units: [
      '',
      'いっさい',
      'にさい',
      'さんさい',
      'よんさい',
      'ごさい',
      'ろくさい',
      'ななさい',
      'はっさい',
      'きゅうさい',
    ],
    gem: 'さい',
    plain: 'さい',
  },
  才: {
    units: [
      '',
      'いっさい',
      'にさい',
      'さんさい',
      'よんさい',
      'ごさい',
      'ろくさい',
      'ななさい',
      'はっさい',
      'きゅうさい',
    ],
    gem: 'さい',
    plain: 'さい',
  },
  枚: {
    // 枚 has no euphony; units are just Sino + まい.
    units: [
      '',
      'いちまい',
      'にまい',
      'さんまい',
      'よんまい',
      'ごまい',
      'ろくまい',
      'ななまい',
      'はちまい',
      'きゅうまい',
    ],
    gem: 'まい',
    plain: 'まい',
  },
};

function counterReading(
  n: number,
  counter: string,
): { reading: string; note?: string } {
  // 歳/才: 20 is the irregular はたち.
  if ((counter === '歳' || counter === '才') && n === 20) {
    return {
      reading: 'はたち',
      note: 'Irregular: 20歳 → はたち (not にじゅっさい).',
    };
  }
  const def = COUNTERS[counter];
  return {
    reading: euphonicCounter(n, def.units, def.gem, def.plain),
    note: 'Counter reading involves euphonic sound change (連濁/促音便).',
  };
}

// People counter 人: 1 ひとり, 2 ふたり, 4 よにん are irregular.
function peopleReading(n: number): string {
  if (n === 1) return 'ひとり';
  if (n === 2) return 'ふたり';
  if (n === 4) return 'よにん';
  return sinoJapanese(n) + 'にん';
}

// ---- Measure units (katakana) ----------------------------------------------

const JA_UNITS: Record<string, string> = {
  km: 'キロメートル',
  cm: 'センチメートル',
  mm: 'ミリメートル',
  m: 'メートル',
  kg: 'キログラム',
  mg: 'ミリグラム',
  g: 'グラム',
  ml: 'ミリリットル',
  L: 'リットル',
  kHz: 'キロヘルツ',
  MHz: 'メガヘルツ',
  GHz: 'ギガヘルツ',
  Hz: 'ヘルツ',
  GB: 'ギガバイト',
  MB: 'メガバイト',
  kB: 'キロバイト',
  TB: 'テラバイト',
};

const spellEmail = (s: string) =>
  s
    .replace(/@/g, ' アット ')
    .replace(/\./g, ' ドット ')
    .replace(/_/g, ' アンダーバー ')
    .replace(/-/g, ' ハイフン ')
    .replace(/\s+/g, ' ')
    .trim();

const spellUrl = (s: string) =>
  s
    .replace(/https/gi, 'h t t p s')
    .replace(/http/gi, 'h t t p')
    .replace(/:\/\//g, ' コロン スラッシュ スラッシュ ')
    .replace(/www/gi, 'w w w')
    .replace(/\./g, ' ドット ')
    .replace(/\//g, ' スラッシュ ')
    .replace(/-/g, ' ハイフン ')
    .replace(/\s+/g, ' ')
    .trim();

export const japaneseHandlers: SemioticHandler[] = [
  // ELECTRONIC
  {
    semioticClass: 'ELECTRONIC',
    rule: 'ja:electronic-email',
    priority: 100,
    pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
    normalize: (m) => ({ normalized: spellEmail(m[0]) }),
  },
  {
    semioticClass: 'ELECTRONIC',
    rule: 'ja:electronic-url',
    priority: 99,
    pattern: /(?:https?:\/\/|www\.)[^\s]*[A-Za-z0-9/]/g,
    normalize: (m) => ({ normalized: spellUrl(m[0]) }),
  },
  // TELEPHONE — digit by digit (0 -> ゼロ).
  {
    semioticClass: 'TELEPHONE',
    rule: 'ja:telephone',
    priority: 95,
    pattern: /\d{2,4}-\d{2,4}-\d{4}/g,
    normalize: (m) => ({
      normalized: m[0]
        .split('-')
        .map((g) => japaneseDigits(g))
        .join(' '),
    }),
  },
  // MONEY — 円.
  {
    semioticClass: 'MONEY',
    rule: 'ja:money',
    priority: 90,
    pattern: /(\d[\d,]*)\s?円/g,
    normalize: (m) => ({
      normalized: `${sinoJapanese(Number(stripCommas(m[1])))}えん`,
    }),
  },
  // TIME — 時 / 分 (with euphonic minute reading). 時間 is excluded here.
  {
    semioticClass: 'TIME',
    rule: 'ja:time',
    priority: 85,
    pattern: /(\d{1,2})\s?時(?!間)(?:\s?(\d{1,2})\s?分)?/g,
    normalize: (m) => {
      const h = Number(m[1]);
      if (h > 24) return null;
      let out = hourReading(h);
      if (m[2]) out += minuteReading(Number(m[2]));
      return {
        normalized: out,
        note: 'Irregular hour readings (4→よじ, 7→しちじ, 9→くじ) and ふん/ぷん minute alternation.',
      };
    },
  },
  // DATE — 年 / 月 / 日 with irregular readings.
  {
    semioticClass: 'DATE',
    rule: 'ja:date-year',
    priority: 82,
    pattern: /(\d{1,4})\s?年/g,
    normalize: (m) => ({ normalized: `${sinoJapanese(Number(m[1]))}ねん` }),
  },
  {
    semioticClass: 'DATE',
    rule: 'ja:date-month',
    priority: 81,
    pattern: /(\d{1,2})\s?月/g,
    normalize: (m) => {
      const mo = Number(m[1]);
      if (mo < 1 || mo > 12) return null;
      return {
        normalized: monthReading(mo),
        note: MONTH_SPECIAL[mo]
          ? `Irregular month reading (${mo}月→${monthReading(mo)}).`
          : undefined,
      };
    },
  },
  {
    semioticClass: 'DATE',
    rule: 'ja:date-day',
    priority: 80,
    pattern: /(\d{1,2})\s?日/g,
    normalize: (m) => {
      const d = Number(m[1]);
      if (d < 1 || d > 31) return null;
      return {
        normalized: dayReading(d),
        note: DAY_SPECIAL[d]
          ? `Irregular day reading (${d}日→${dayReading(d)}).`
          : undefined,
      };
    },
  },
  // PERCENT
  {
    semioticClass: 'PERCENT',
    rule: 'ja:percent',
    priority: 75,
    pattern: /(\d[\d,]*)(?:\.(\d+))?\s?(%|パーセント)/g,
    normalize: (m) => {
      const intWords = sinoJapanese(Number(stripCommas(m[1])));
      const num = m[2] ? `${intWords}てん${japaneseDigits(m[2])}` : intWords;
      return { normalized: `${num}パーセント` };
    },
  },
  // MEASURE — number + unit symbol (katakana).
  {
    semioticClass: 'MEASURE',
    rule: 'ja:measure',
    priority: 70,
    pattern:
      /(\d+(?:\.\d+)?)\s?(km|cm|mm|kg|mg|ml|kHz|MHz|GHz|Hz|GB|MB|kB|TB|m|g|L)\b/g,
    normalize: (m) => {
      const unit = JA_UNITS[m[2]];
      if (!unit) return null;
      const [int, frac] = m[1].split('.');
      const num = frac
        ? `${sinoJapanese(Number(int))}てん${japaneseDigits(frac)}`
        : sinoJapanese(Number(int));
      return { normalized: `${num}${unit}` };
    },
  },
  // DURATION — 時間 (Sino, no euphony).
  {
    semioticClass: 'MEASURE',
    rule: 'ja:counter-jikan',
    priority: 67,
    pattern: /(\d{1,3})\s?時間/g,
    normalize: (m) => ({ normalized: `${sinoJapanese(Number(m[1]))}じかん` }),
  },
  // MINUTE (standalone) — e.g. "30分" outside a 時 context.
  {
    semioticClass: 'MEASURE',
    rule: 'ja:counter-minute',
    priority: 64,
    pattern: /(\d{1,2})\s?分/g,
    normalize: (m) => ({
      normalized: minuteReading(Number(m[1])),
      note: 'ふん/ぷん alternation depends on the preceding digit.',
    }),
  },
  // COUNTER (euphonic) — 本/個/杯/匹/階/歳/才/枚.
  {
    semioticClass: 'MEASURE',
    rule: 'ja:counter',
    priority: 66,
    pattern: /(\d{1,3})\s?(本|個|杯|匹|階|歳|才|枚)/g,
    normalize: (m) => {
      const { reading, note } = counterReading(Number(m[1]), m[2]);
      return { normalized: reading, note };
    },
  },
  // COUNTER — 人 (people; 1→ひとり, 2→ふたり, 4→よにん).
  {
    semioticClass: 'MEASURE',
    rule: 'ja:counter-people',
    priority: 65,
    pattern: /(\d{1,3})\s?人/g,
    normalize: (m) => ({
      normalized: peopleReading(Number(m[1])),
      note: [1, 2, 4].includes(Number(m[1]))
        ? 'Irregular people counter (1→ひとり, 2→ふたり, 4→よにん).'
        : undefined,
    }),
  },
  // ORDINAL — 第N (だい+Sino), N番目 (Sino+ばんめ).
  {
    semioticClass: 'ORDINAL',
    rule: 'ja:ordinal-dai',
    priority: 56,
    pattern: /第\s?(\d+)/g,
    normalize: (m) => ({ normalized: `だい${sinoJapanese(Number(m[1]))}` }),
  },
  {
    semioticClass: 'ORDINAL',
    rule: 'ja:ordinal-banme',
    priority: 55,
    pattern: /(\d{1,3})\s?番目/g,
    normalize: (m) => ({ normalized: `${sinoJapanese(Number(m[1]))}ばんめ` }),
  },
  // DECIMAL — 点.
  {
    semioticClass: 'DECIMAL',
    rule: 'ja:decimal',
    priority: 50,
    pattern: /(\d+)\.(\d+)/g,
    normalize: (m) => ({
      normalized: `${sinoJapanese(Number(m[1]))}てん${japaneseDigits(m[2])}`,
    }),
  },
  // CARDINAL — bare integer (Sino reading).
  {
    semioticClass: 'CARDINAL',
    rule: 'ja:cardinal',
    priority: 40,
    pattern: /\d{1,3}(?:,\d{3})+|\d+/g,
    normalize: (m) => ({ normalized: sinoJapanese(Number(stripCommas(m[0]))) }),
  },
];
