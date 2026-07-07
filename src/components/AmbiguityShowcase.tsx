import { AMBIGUITY_CASES, normalize } from '../tn';
import type { AmbiguityCase } from '../tn';
import Rich from './Rich';
import { useI18n } from '../i18n/context';

/**
 * The "Why neural TN?" section. For each curated ambiguous input it shows the
 * engine's *actual* fixed output beside an explanation of why context is
 * required — the case for neural seq2seq TN.
 */
export default function AmbiguityShowcase() {
  const { uiLang, t } = useI18n();

  // The engine data carries the English explanations; the Korean dictionary
  // overrides them per case via `ambiguityCase.<language>:<input>.*` keys.
  const localized = (c: AmbiguityCase) => {
    if (uiLang === 'ko') {
      return {
        whyAmbiguous: t(`ambiguityCase.${c.language}:${c.input}.why`),
        contextResolves: t(`ambiguityCase.${c.language}:${c.input}.context`),
      };
    }
    return { whyAmbiguous: c.whyAmbiguous, contextResolves: c.contextResolves };
  };

  return (
    <section
      id="why-neural"
      className="scroll-mt-20 border-y border-ink-800 bg-ink-900/30"
    >
      <div className="mx-auto max-w-6xl px-5 py-14">
        <p className="section-title">{t('ambiguity.sectionTitle')}</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-100">
          {t('ambiguity.heading')}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
          <Rich text={t('ambiguity.intro')} />
        </p>

        {/* Desktop table */}
        <div className="mt-6 hidden overflow-hidden rounded-xl border border-ink-700 md:block">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-ink-850 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3 font-medium">
                  {t('ambiguity.thInput')}
                </th>
                <th className="px-4 py-3 font-medium">
                  {t('ambiguity.thGuess')}
                </th>
                <th className="px-4 py-3 font-medium">
                  {t('ambiguity.thWhy')}
                </th>
                <th className="px-4 py-3 font-medium">
                  {t('ambiguity.thContext')}
                </th>
              </tr>
            </thead>
            <tbody>
              {AMBIGUITY_CASES.map((c, i) => {
                const out = normalize(c.input, c.language).output;
                const text = localized(c);
                return (
                  <tr
                    key={`${c.language}-${c.input}-${i}`}
                    className="border-t border-ink-800 align-top"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-slate-200">
                        {c.input}
                      </span>
                      <span className="ml-2 rounded bg-ink-700 px-1.5 py-0.5 font-mono text-[10px] uppercase text-slate-400">
                        {c.language}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-accent-rose">
                      {out}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {text.whyAmbiguous}
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {c.readings.map((r) => (
                          <span
                            key={r}
                            className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-[11px] text-slate-300"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {text.contextResolves}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="mt-6 space-y-3 md:hidden">
          {AMBIGUITY_CASES.map((c, i) => {
            const out = normalize(c.input, c.language).output;
            const text = localized(c);
            return (
              <div key={`${c.language}-${c.input}-${i}`} className="card p-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-200">{c.input}</span>
                  <span className="rounded bg-ink-700 px-1.5 py-0.5 font-mono text-[10px] uppercase text-slate-400">
                    {c.language}
                  </span>
                </div>
                <p className="mt-2 font-mono text-sm text-accent-rose">
                  → {out}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  {text.whyAmbiguous}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  <span className="text-slate-300">
                    {t('ambiguity.contextLabel')}
                  </span>{' '}
                  {text.contextResolves}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border border-accent-violet/30 bg-accent-violet/5 p-5">
          <p className="text-sm leading-relaxed text-slate-300">
            <span className="font-semibold text-accent-violet">
              {t('ambiguity.outroLead')}
            </span>{' '}
            <Rich text={t('ambiguity.outroBody')} />
          </p>
        </div>
      </div>
    </section>
  );
}
