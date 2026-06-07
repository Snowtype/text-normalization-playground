import { useMemo, useState } from 'react';
import { normalize, TEST_CASES, type Language } from '../tn';
import { LANGUAGES, SEMIOTIC_META } from './semioticMeta';

/**
 * The "Test cases" tab. It renders the exact `TEST_CASES` corpus that the
 * Vitest suite asserts, and re-evaluates each one live through the engine — so
 * the green ticks here are the same assertions `npm test` runs, not a
 * hand-maintained list.
 */
export default function TestCasesPanel() {
  const [language, setLanguage] = useState<Language>('en');

  const { rows, passing } = useMemo(() => {
    const rows = TEST_CASES.filter((t) => t.language === language).map((t) => {
      const actual = normalize(t.input, t.language).output;
      return { ...t, actual, pass: actual === t.expected };
    });
    return { rows, passing: rows.filter((r) => r.pass).length };
  }, [language]);

  return (
    <section id="tests" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-title">05 · Test suite</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-100">
            The Vitest corpus, evaluated live
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            One shared source of truth (
            <span className="font-mono text-slate-300">
              src/tn/testCases.ts
            </span>
            ) drives both{' '}
            <span className="font-mono text-slate-300">npm test</span> and this
            view.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-ink-700 bg-ink-900 p-0.5">
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
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

      <div className="mt-4 flex items-center gap-2">
        <span
          className={[
            'pill border',
            passing === rows.length
              ? 'border-accent-emerald/40 bg-accent-emerald/10 text-accent-emerald'
              : 'border-accent-rose/40 bg-accent-rose/10 text-accent-rose',
          ].join(' ')}
        >
          {passing === rows.length ? '✓ all passing' : '✗ failures'}
        </span>
        <span className="font-mono text-sm text-slate-400">
          {passing} / {rows.length}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-ink-700">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-ink-850 text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-3 py-2.5 font-medium">Class</th>
              <th className="px-3 py-2.5 font-medium">Input</th>
              <th className="px-3 py-2.5 font-medium">
                Expected (spoken form)
              </th>
              <th className="px-3 py-2.5 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const meta = SEMIOTIC_META[r.semioticClass];
              return (
                <tr key={i} className="border-t border-ink-800 align-top">
                  <td className="px-3 py-2.5">
                    <span
                      className="font-mono text-[11px] font-semibold"
                      style={{ color: meta.color }}
                    >
                      {r.semioticClass}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-slate-300">
                    {r.input}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-slate-200">
                    {r.expected}
                    {!r.pass && (
                      <span className="mt-1 block font-mono text-[11px] text-accent-rose">
                        got: {r.actual}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {r.pass ? (
                      <span className="text-accent-emerald">✓</span>
                    ) : (
                      <span className="text-accent-rose">✗</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
