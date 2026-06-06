/**
 * The canonical TN test corpus — a single source of truth shared by the
 * Vitest suite (`*.test.ts`) and the in-app "Test cases" tab.
 *
 * Because the same `input -> expected` pairs drive both, the UI can never show
 * a "passing" case the test suite does not actually assert: the tab renders
 * these exact entries and re-runs them through the engine in the browser.
 *
 * Every entry is grouped by its primary semiotic class so coverage is visible
 * at a glance.
 */

import type { Language, SemioticClass } from './types';

export interface TestCase {
  language: Language;
  semioticClass: SemioticClass;
  input: string;
  expected: string;
  /** Short note on what the case exercises. */
  description: string;
}

export const TEST_CASES: TestCase[] = [
  // ===================== ENGLISH =====================

  // CARDINAL
  {
    language: 'en',
    semioticClass: 'CARDINAL',
    input: '1,250',
    expected: 'one thousand two hundred fifty',
    description: 'Grouped thousands',
  },
  {
    language: 'en',
    semioticClass: 'CARDINAL',
    input: 'I have 7 apples',
    expected: 'I have seven apples',
    description: 'Single digit in a sentence',
  },
  {
    language: 'en',
    semioticClass: 'CARDINAL',
    input: '0',
    expected: 'zero',
    description: 'Zero edge case',
  },
  {
    language: 'en',
    semioticClass: 'CARDINAL',
    input: '1000000',
    expected: 'one million',
    description: 'Millions scale',
  },

  // ORDINAL
  {
    language: 'en',
    semioticClass: 'ORDINAL',
    input: '3rd',
    expected: 'third',
    description: 'Basic ordinal',
  },
  {
    language: 'en',
    semioticClass: 'ORDINAL',
    input: '1st',
    expected: 'first',
    description: 'Irregular -st',
  },
  {
    language: 'en',
    semioticClass: 'ORDINAL',
    input: '22nd',
    expected: 'twenty second',
    description: 'Compound ordinal',
  },
  {
    language: 'en',
    semioticClass: 'ORDINAL',
    input: '100th',
    expected: 'one hundredth',
    description: 'Hundredth',
  },

  // DECIMAL
  {
    language: 'en',
    semioticClass: 'DECIMAL',
    input: '3.14',
    expected: 'three point one four',
    description: 'Decimal read digit-by-digit after the point',
  },

  // DATE
  {
    language: 'en',
    semioticClass: 'DATE',
    input: '3/14',
    expected: 'March fourteenth',
    description: 'Month/day',
  },
  {
    language: 'en',
    semioticClass: 'DATE',
    input: '12/25/2020',
    expected: 'December twenty fifth twenty twenty',
    description: 'Month/day/year',
  },
  {
    language: 'en',
    semioticClass: 'DATE',
    input: '7/4/1776',
    expected: 'July fourth seventeen seventy six',
    description: 'Historical year reading',
  },

  // TIME
  {
    language: 'en',
    semioticClass: 'TIME',
    input: '2:30 PM',
    expected: 'two thirty PM',
    description: 'Time with meridiem',
  },
  {
    language: 'en',
    semioticClass: 'TIME',
    input: '9:00 AM',
    expected: "nine o'clock AM",
    description: "Top of the hour -> o'clock",
  },
  {
    language: 'en',
    semioticClass: 'TIME',
    input: '2:05',
    expected: 'two oh five',
    description: 'Minutes < 10 -> "oh"',
  },
  {
    language: 'en',
    semioticClass: 'TIME',
    input: '11:45 p.m.',
    expected: 'eleven forty five PM',
    description: 'Dotted meridiem normalized',
  },

  // MONEY
  {
    language: 'en',
    semioticClass: 'MONEY',
    input: '$5',
    expected: 'five dollars',
    description: 'Whole dollars',
  },
  {
    language: 'en',
    semioticClass: 'MONEY',
    input: '$1',
    expected: 'one dollar',
    description: 'Singular dollar',
  },
  {
    language: 'en',
    semioticClass: 'MONEY',
    input: '$1,250.50',
    expected: 'one thousand two hundred fifty dollars and fifty cents',
    description: 'Dollars and cents',
  },
  {
    language: 'en',
    semioticClass: 'MONEY',
    input: '$0.99',
    expected: 'ninety nine cents',
    description: 'Cents only',
  },
  {
    language: 'en',
    semioticClass: 'MONEY',
    input: '$3.05',
    expected: 'three dollars and five cents',
    description: 'Cents with leading zero',
  },

  // PERCENT
  {
    language: 'en',
    semioticClass: 'PERCENT',
    input: '50%',
    expected: 'fifty percent',
    description: 'Whole percent',
  },
  {
    language: 'en',
    semioticClass: 'PERCENT',
    input: '3.5%',
    expected: 'three point five percent',
    description: 'Decimal percent',
  },
  {
    language: 'en',
    semioticClass: 'PERCENT',
    input: '100%',
    expected: 'one hundred percent',
    description: 'Hundred percent',
  },

  // MEASURE
  {
    language: 'en',
    semioticClass: 'MEASURE',
    input: '12km',
    expected: 'twelve kilometers',
    description: 'Metric distance (plural)',
  },
  {
    language: 'en',
    semioticClass: 'MEASURE',
    input: '1km',
    expected: 'one kilometer',
    description: 'Singular unit',
  },
  {
    language: 'en',
    semioticClass: 'MEASURE',
    input: '5kg',
    expected: 'five kilograms',
    description: 'Mass',
  },
  {
    language: 'en',
    semioticClass: 'MEASURE',
    input: '100m',
    expected: 'one hundred meters',
    description: 'Bare meter symbol',
  },
  {
    language: 'en',
    semioticClass: 'MEASURE',
    input: '5.5kg',
    expected: 'five point five kilograms',
    description: 'Decimal measure',
  },

  // TELEPHONE
  {
    language: 'en',
    semioticClass: 'TELEPHONE',
    input: '555-123-4567',
    expected: 'five five five, one two three, four five six seven',
    description: 'US phone, grouped',
  },
  {
    language: 'en',
    semioticClass: 'TELEPHONE',
    input: '1-800-555-0199',
    expected: 'one, eight zero zero, five five five, zero one nine nine',
    description: 'Toll-free with country code',
  },

  // DIGIT
  {
    language: 'en',
    semioticClass: 'DIGIT',
    input: 'room 502',
    expected: 'room five zero two',
    description: 'Keyword-triggered digit string',
  },
  {
    language: 'en',
    semioticClass: 'DIGIT',
    input: 'Flight 815',
    expected: 'flight eight one five',
    description: 'Flight number read digit-by-digit',
  },

  // ABBREVIATION
  {
    language: 'en',
    semioticClass: 'ABBREVIATION',
    input: 'Dr. Smith',
    expected: 'Doctor Smith',
    description: 'Title abbreviation',
  },
  {
    language: 'en',
    semioticClass: 'ABBREVIATION',
    input: 'St. Patrick',
    expected: 'Saint Patrick',
    description: 'St. -> Saint (fixed choice)',
  },
  {
    language: 'en',
    semioticClass: 'ABBREVIATION',
    input: 'etc.',
    expected: 'et cetera',
    description: 'Latin abbreviation',
  },
  {
    language: 'en',
    semioticClass: 'ABBREVIATION',
    input: 'Prof. Lee',
    expected: 'Professor Lee',
    description: 'Academic title',
  },
  {
    language: 'en',
    semioticClass: 'ABBREVIATION',
    input: 'vs.',
    expected: 'versus',
    description: 'Versus',
  },

  // ELECTRONIC
  {
    language: 'en',
    semioticClass: 'ELECTRONIC',
    input: 'jane.doe@example.com',
    expected: 'jane dot doe at example dot com',
    description: 'Email address',
  },
  {
    language: 'en',
    semioticClass: 'ELECTRONIC',
    input: 'https://www.example.com',
    expected: 'h t t p s colon slash slash w w w dot example dot com',
    description: 'URL spelled aloud',
  },

  // ===================== KOREAN =====================

  // CARDINAL (Sino)
  {
    language: 'ko',
    semioticClass: 'CARDINAL',
    input: '1250',
    expected: '천이백오십',
    description: 'Sino-Korean cardinal',
  },
  {
    language: 'ko',
    semioticClass: 'CARDINAL',
    input: '100',
    expected: '백',
    description: 'Leading 일 dropped before 백',
  },
  {
    language: 'ko',
    semioticClass: 'CARDINAL',
    input: '10000',
    expected: '만',
    description: '10,000 reads as 만, not 일만',
  },
  {
    language: 'ko',
    semioticClass: 'CARDINAL',
    input: '12345',
    expected: '만이천삼백사십오',
    description: 'Myriad grouping (만)',
  },

  // ORDINAL
  {
    language: 'ko',
    semioticClass: 'ORDINAL',
    input: '제3',
    expected: '제삼',
    description: 'Sino ordinal prefix 제',
  },
  {
    language: 'ko',
    semioticClass: 'ORDINAL',
    input: '3번째',
    expected: '세 번째',
    description: 'Native ordinal counter 번째',
  },
  {
    language: 'ko',
    semioticClass: 'ORDINAL',
    input: '20번째',
    expected: '스무 번째',
    description: '20 -> 스무 before counter',
  },

  // DECIMAL
  {
    language: 'ko',
    semioticClass: 'DECIMAL',
    input: '3.14',
    expected: '삼 점 일사',
    description: 'Decimal with 점',
  },

  // DATE
  {
    language: 'ko',
    semioticClass: 'DATE',
    input: '3월 14일',
    expected: '삼월 십사 일',
    description: 'Month + day (Sino)',
  },
  {
    language: 'ko',
    semioticClass: 'DATE',
    input: '6월',
    expected: '유월',
    description: 'Irregular June reading',
  },
  {
    language: 'ko',
    semioticClass: 'DATE',
    input: '10월',
    expected: '시월',
    description: 'Irregular October reading',
  },
  {
    language: 'ko',
    semioticClass: 'DATE',
    input: '2020년',
    expected: '이천이십 년',
    description: 'Year (Sino)',
  },
  {
    language: 'ko',
    semioticClass: 'DATE',
    input: '12월 25일',
    expected: '십이월 이십오 일',
    description: 'Full month + day',
  },

  // TIME
  {
    language: 'ko',
    semioticClass: 'TIME',
    input: '3시',
    expected: '세 시',
    description: 'Hour uses NATIVE numerals',
  },
  {
    language: 'ko',
    semioticClass: 'TIME',
    input: '2시 30분',
    expected: '두 시 삼십 분',
    description: 'Native hour + Sino minute',
  },
  {
    language: 'ko',
    semioticClass: 'TIME',
    input: '12시',
    expected: '열두 시',
    description: 'Twelve o’clock (native)',
  },
  {
    language: 'ko',
    semioticClass: 'MEASURE',
    input: '5시간',
    expected: '다섯 시간',
    description: 'Duration counter 시간 (native)',
  },

  // MONEY
  {
    language: 'ko',
    semioticClass: 'MONEY',
    input: '100원',
    expected: '백 원',
    description: 'Money is Sino',
  },
  {
    language: 'ko',
    semioticClass: 'MONEY',
    input: '5000원',
    expected: '오천 원',
    description: 'Thousands of won',
  },
  {
    language: 'ko',
    semioticClass: 'MONEY',
    input: '5만 원',
    expected: '오만 원',
    description: 'Myriad multiplier',
  },

  // PERCENT
  {
    language: 'ko',
    semioticClass: 'PERCENT',
    input: '50%',
    expected: '오십 퍼센트',
    description: 'Percent (Sino)',
  },
  {
    language: 'ko',
    semioticClass: 'PERCENT',
    input: '3.5%',
    expected: '삼 점 오 퍼센트',
    description: 'Decimal percent',
  },
  {
    language: 'ko',
    semioticClass: 'PERCENT',
    input: '100퍼센트',
    expected: '백 퍼센트',
    description: 'Spelled-out percent unit',
  },

  // MEASURE
  {
    language: 'ko',
    semioticClass: 'MEASURE',
    input: '12km',
    expected: '십이 킬로미터',
    description: 'Metric distance (Sino)',
  },
  {
    language: 'ko',
    semioticClass: 'MEASURE',
    input: '5kg',
    expected: '오 킬로그램',
    description: 'Mass',
  },
  {
    language: 'ko',
    semioticClass: 'MEASURE',
    input: '100m',
    expected: '백 미터',
    description: 'Meter symbol',
  },

  // COUNTER (native) — surfaced as MEASURE
  {
    language: 'ko',
    semioticClass: 'MEASURE',
    input: '3개',
    expected: '세 개',
    description: 'Native counter 개',
  },
  {
    language: 'ko',
    semioticClass: 'MEASURE',
    input: '20살',
    expected: '스무 살',
    description: 'Age counter 살 (20 -> 스무)',
  },
  {
    language: 'ko',
    semioticClass: 'MEASURE',
    input: '5마리',
    expected: '다섯 마리',
    description: 'Animal counter',
  },
  {
    language: 'ko',
    semioticClass: 'MEASURE',
    input: '10명',
    expected: '열 명',
    description: 'People counter',
  },
  {
    language: 'ko',
    semioticClass: 'MEASURE',
    input: '100개',
    expected: '백 개',
    description: '100+ falls back to Sino',
  },

  // COUNTER (Sino) — surfaced as MEASURE
  {
    language: 'ko',
    semioticClass: 'MEASURE',
    input: '3층',
    expected: '삼 층',
    description: 'Floor counter (Sino)',
  },
  {
    language: 'ko',
    semioticClass: 'MEASURE',
    input: '30초',
    expected: '삼십 초',
    description: 'Seconds (Sino)',
  },
  {
    language: 'ko',
    semioticClass: 'MEASURE',
    input: '3분',
    expected: '삼 분',
    description: 'Standalone minutes (Sino)',
  },

  // TELEPHONE
  {
    language: 'ko',
    semioticClass: 'TELEPHONE',
    input: '010-1234-5678',
    expected: '공일공 일이삼사 오육칠팔',
    description: 'Mobile number, 0 -> 공',
  },
  {
    language: 'ko',
    semioticClass: 'TELEPHONE',
    input: '02-123-4567',
    expected: '공이 일이삼 사오육칠',
    description: 'Landline',
  },

  // ELECTRONIC
  {
    language: 'ko',
    semioticClass: 'ELECTRONIC',
    input: 'test@gmail.com',
    expected: 'test 골뱅이 gmail 점 com',
    description: 'Email (@ -> 골뱅이, . -> 점)',
  },
];
