import { useMemo, useState } from 'react';
import { normalize, type Language } from '../tn';
import { LANGUAGES } from './semioticMeta';
import HighlightedOutput from './HighlightedOutput';
import RuleTrace from './RuleTrace';

const EXAMPLES: Record<Language, string[]> = {
  en: [
    'Call me at 555-123-4567 on 3/14 at 2:30 PM.',
    'The 3rd item costs $1,250.50 — about 12km away.',
    'Dr. Smith lives in room 502; email jane.doe@example.com.',
    'We saw a 25% drop over 7 days (≈ 3.5kg).',
  ],
  ko: [
    '지금 3시 30분이고 회의는 3월 14일입니다.',
    '커피 2잔에 5000원, 사과는 3개 주세요.',
    '제 번호는 010-1234-5678이고 나이는 20살입니다.',
    '이 건물은 12층이고 속도는 100km까지 나옵니다.',
  ],
  ja: [
    '今3時30分で、会議は12月25日です。',
    'コーヒー2杯で500円、りんごは3個ください。',
    '私の番号は090-1234-5678で、年齢は20歳です。',
    'この建物は3階で、速度は100kmまで出ます。',
  ],
};

// Flat set of all preset strings, so we can tell whether the user has typed
// their own text (and must not have it wiped on a language switch).
const ALL_PRESETS = new Set(Object.values(EXAMPLES).flat());

export default function Playground() {
  const [language, setLanguage] = useState<Language>('en');
  const [input, setInput] = useState(EXAMPLES.en[0]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const result = useMemo(() => normalize(input, language), [input, language]);

  const switchLanguage = (lang: Language) => {
    setLanguage(lang);
    setActiveIndex(null);
    // Only swap in a sample if the user hasn't typed their own text.
    if (input.trim() === '' || ALL_PRESETS.has(input)) {
      setInput(EXAMPLES[lang][0]);
    }
  };

  const hasInput = input.trim() !== '';
  const showEmptyHint = hasInput && result.spans.length === 0;

  return (
    <section
      id="playground"
      className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-title">01 · Interactive normalizer</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-100">
            Written form in, spoken form out
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Live as you type — no button. Only non-standard tokens (numbers,
            dates, money, units…) change; plain words pass through untouched.
          </p>
        </div>

        {/* Language toggle */}
        <div className="inline-flex rounded-lg border border-ink-700 bg-ink-900 p-0.5">
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => switchLanguage(code)}
              className={[
                'rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors',
                language === code
                  ? 'bg-accent-cyan/15 text-accent-cyan'
                  : 'text-slate-400 hover:text-slate-200',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Example chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        {EXAMPLES[language].map((ex) => (
          <button
            key={ex}
            onClick={() => {
              setInput(ex);
              setActiveIndex(null);
            }}
            className="rounded-full border border-ink-700 bg-ink-900/60 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-accent-cyan/40 hover:text-slate-200"
          >
            {ex.length > 42 ? `${ex.slice(0, 42)}…` : ex}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {/* Left column: input + output */}
        <div className="space-y-4">
          <div className="card p-4">
            <label
              htmlFor="tn-input"
              className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500"
            >
              Input — written text
            </label>
            <textarea
              id="tn-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              rows={4}
              placeholder={
                language === 'en'
                  ? 'Type text with numbers, dates, money…'
                  : language === 'ko'
                    ? '숫자, 날짜, 금액이 포함된 문장을 입력하세요…'
                    : '数字・日付・金額を含む文を入力してください…'
              }
              className="w-full resize-y rounded-lg border border-ink-700 bg-ink-950/70 p-3 font-mono text-[15px] text-slate-100 outline-none transition-colors focus:border-accent-cyan/50"
            />
          </div>

          <div className="card p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Output — spoken form
              </span>
              <span className="font-mono text-[11px] text-slate-600">
                {result.spans.length} normalized
              </span>
            </div>
            <HighlightedOutput
              result={result}
              activeIndex={activeIndex}
              onHoverSpan={setActiveIndex}
            />
            {showEmptyHint && (
              <p className="mt-3 border-t border-ink-800 pt-3 text-xs text-slate-500">
                Output equals input — no non-standard tokens found here. Try a
                number, date, time, $, %, a unit like{' '}
                <span className="font-mono text-slate-400">12km</span>, or check
                the language toggle matches your text.
              </p>
            )}
          </div>
        </div>

        {/* Right column: rule trace */}
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Rule trace — grouped by semiotic class
            </span>
          </div>
          <RuleTrace
            spans={result.spans}
            activeIndex={activeIndex}
            onHoverSpan={setActiveIndex}
          />
        </div>
      </div>
    </section>
  );
}
