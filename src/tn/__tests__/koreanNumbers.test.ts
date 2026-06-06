import { describe, it, expect } from 'vitest';
import { sinoKorean, nativeKorean, sinoDigits } from '../koreanNumbers';

describe('sinoKorean', () => {
  it.each([
    [0, '영'],
    [1, '일'],
    [10, '십'],
    [11, '십일'],
    [100, '백'],
    [250, '이백오십'],
    [1250, '천이백오십'],
    [10000, '만'],
    [12345, '만이천삼백사십오'],
    [100000000, '일억'],
  ])('%i -> %s', (n, words) => {
    expect(sinoKorean(n)).toBe(words);
  });
});

describe('nativeKorean', () => {
  it.each([
    [1, '하나'],
    [2, '둘'],
    [3, '셋'],
    [10, '열'],
    [20, '스물'],
    [21, '스물하나'],
    [99, '아흔아홉'],
  ])('non-attributive %i -> %s', (n, words) => {
    expect(nativeKorean(n)).toBe(words);
  });

  it.each([
    [1, '한'],
    [2, '두'],
    [3, '세'],
    [4, '네'],
    [20, '스무'],
    [21, '스물한'],
  ])('attributive %i -> %s', (n, words) => {
    expect(nativeKorean(n, true)).toBe(words);
  });

  it('falls back to Sino past 99', () => {
    expect(nativeKorean(100, true)).toBe('백');
  });
});

describe('sinoDigits', () => {
  it('maps 0 to 공 (phone style)', () => {
    expect(sinoDigits('010')).toBe('공일공');
    expect(sinoDigits('5678')).toBe('오육칠팔');
  });
});
