import { useMemo, useState } from 'react';
import { normalize, type Language, type SemioticClass } from '../tn';

import BarChart from './BarChart';
import { LANGUAGES } from './semioticMeta';
import { useI18n } from '../i18n/context';

const SAMPLE: Record<Language, string> = {
  en: `Invoice #4021 is due 4/15 for $2,499.00.
Ship 3 boxes (12kg) to suite 700 by 9:00 AM.
Call Dr. Alvarez at 555-867-5309 or email ops@acme.io.
The router hit 100% load at 2.4GHz for 45 minutes.`,
  ko: `회의는 3월 14일 2시 30분입니다.
사과 5개와 커피 2잔, 합계 12000원입니다.
제 번호는 010-1234-5678이고 사무실은 12층입니다.
속도는 100km, 무게는 5kg입니다.`,
  ja: `会議は12月25日3時30分です。
りんご5個とコーヒー2杯、合計1500円です。
私の番号は090-1234-5678で、オフィスは3階です。
速度は100km、重さは5kgです。`,
};

export default function BatchMetrics() {
  const { t } = useI18n();
  const [language, setLanguage] = useState<Language>('en');
  const [text, setText] = useState(SAMPLE.en);

  const { lines, totalSpans, counts } = useMemo(() => {
    const rawLines = text.split('\n').filter((l) => l.trim().length > 0);
    const counts: Partial<Record<SemioticClass, number>> = {};
    let totalSpans = 0;
    const lines = rawLines.map((line) => {
      const r = normalize(line, language);
      totalSpans += r.spans.length;
      for (const s of r.spans) {
        counts[s.semioticClass] = (counts[s.semioticClass] ?? 0) + 1;
      }
      return r;
    });
    return { lines, totalSpans, counts };
  }, [text, language]);

  const distinctClasses = Object.keys(counts).length;

  return (
    <section id="batch" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-title">{t('batch.sectionTitle')}</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-100">
            {t('batch.heading')}
          </h2>
        </div>
        <div className="inline-flex rounded-lg border border-ink-700 bg-ink-900 p-0.5">
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => {
                setLanguage(code);
                setText(SAMPLE[code]);
              }}
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

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <label
            htmlFor="batch-input"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500"
          >
            {t('batch.inputLabel')}
          </label>
          <textarea
            id="batch-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            rows={8}
            className="w-full resize-y rounded-lg border border-ink-700 bg-ink-950/70 p-3 font-mono text-[13px] leading-6 text-slate-100 outline-none transition-colors focus:border-accent-cyan/50"
          />

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label={t('batch.statLines')} value={lines.length} />
            <Stat label={t('batch.statTokens')} value={totalSpans} />
            <Stat label={t('batch.statClasses')} value={distinctClasses} />
          </div>
        </div>

        <div className="card p-4">
          <span className="mb-3 block text-xs font-medium uppercase tracking-wider text-slate-500">
            {t('batch.distLabel')}
          </span>
          <BarChart counts={counts} />
        </div>
      </div>

      {/* Per-line results */}
      <div className="card mt-4 divide-y divide-ink-800">
        {lines.map((r, i) => (
          <div
            key={i}
            className="grid gap-1 p-3 font-mono text-[13px] md:grid-cols-2"
          >
            <p className="text-slate-500">{r.input}</p>
            <p className="text-slate-200">
              {r.output}
              <span className="ml-2 text-[11px] text-slate-600">
                ({r.spans.length})
              </span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-ink-800 bg-ink-950/50 px-3 py-2">
      <div className="text-xl font-semibold text-accent-cyan">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-slate-500">
        {label}
      </div>
    </div>
  );
}
