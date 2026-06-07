import { describe, it, expect } from 'vitest';
import {
  sinoJapanese,
  japaneseDigits,
  euphonicCounter,
} from '../japaneseNumbers';

describe('sinoJapanese', () => {
  it.each([
    [0, 'ゼロ'],
    [1, 'いち'],
    [7, 'なな'],
    [10, 'じゅう'],
    [100, 'ひゃく'],
    [300, 'さんびゃく'], // rendaku
    [600, 'ろっぴゃく'], // gemination
    [800, 'はっぴゃく'],
    [1000, 'せん'], // not いっせん
    [3000, 'さんぜん'],
    [8000, 'はっせん'],
    [1250, 'せんにひゃくごじゅう'],
    [10000, 'いちまん'], // keeps いち (unlike Korean 만)
    [100000000, 'いちおく'],
  ])('%i -> %s', (n, words) => {
    expect(sinoJapanese(n)).toBe(words);
  });
});

describe('japaneseDigits', () => {
  it('reads digits individually, 0 -> ゼロ', () => {
    expect(japaneseDigits('090')).toBe('ゼロきゅうゼロ');
    expect(japaneseDigits('1234')).toBe('いちにさんよん');
  });
});

describe('euphonicCounter (本 as example)', () => {
  const HON = [
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
  ];
  it.each([
    [1, 'いっぽん'],
    [3, 'さんぼん'],
    [6, 'ろっぽん'],
    [10, 'じゅっぽん'],
    [15, 'じゅうごほん'],
    [30, 'さんじゅっぽん'],
  ])('%i 本 -> %s', (n, words) => {
    expect(euphonicCounter(n, HON, 'ぽん', 'ほん')).toBe(words);
  });
});
