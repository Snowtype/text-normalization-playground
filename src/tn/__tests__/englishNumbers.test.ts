import { describe, it, expect } from 'vitest';
import {
  cardinalToWords,
  ordinalToWords,
  decimalToWords,
  digitsToWords,
} from '../englishNumbers';

describe('cardinalToWords', () => {
  it.each([
    [0, 'zero'],
    [7, 'seven'],
    [13, 'thirteen'],
    [20, 'twenty'],
    [42, 'forty two'],
    [100, 'one hundred'],
    [250, 'two hundred fifty'],
    [1250, 'one thousand two hundred fifty'],
    [1000000, 'one million'],
    [2001, 'two thousand one'],
  ])('%i -> %s', (n, words) => {
    expect(cardinalToWords(n)).toBe(words);
  });

  it('handles negatives', () => {
    expect(cardinalToWords(-5)).toBe('minus five');
  });
});

describe('ordinalToWords', () => {
  it.each([
    [1, 'first'],
    [2, 'second'],
    [3, 'third'],
    [5, 'fifth'],
    [12, 'twelfth'],
    [20, 'twentieth'],
    [22, 'twenty second'],
    [100, 'one hundredth'],
  ])('%i -> %s', (n, words) => {
    expect(ordinalToWords(n)).toBe(words);
  });
});

describe('decimalToWords', () => {
  it('reads the fractional part digit by digit', () => {
    expect(decimalToWords('3', '14')).toBe('three point one four');
    expect(decimalToWords('0', '5')).toBe('zero point five');
  });
  it('drops the point when there is no fraction', () => {
    expect(decimalToWords('12', '')).toBe('twelve');
  });
});

describe('digitsToWords', () => {
  it('reads each digit', () => {
    expect(digitsToWords('502')).toBe('five zero two');
    expect(digitsToWords('007')).toBe('zero zero seven');
  });
});
