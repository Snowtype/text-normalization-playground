import { AMBIGUITY_CASES, normalize } from '../tn';

/**
 * The "Why neural TN?" section. For each curated ambiguous input it shows the
 * engine's *actual* fixed output beside an explanation of why context is
 * required — the case for neural seq2seq TN.
 */
export default function AmbiguityShowcase() {
  return (
    <section
      id="why-neural"
      className="scroll-mt-20 border-y border-ink-800 bg-ink-900/30"
    >
      <div className="mx-auto max-w-6xl px-5 py-14">
        <p className="section-title">03 · Why neural TN?</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-100">
          Where rules break and context is required
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
          A rule set must commit to one reading per pattern. But the correct
          spoken form of many tokens depends on surrounding context the rule
          cannot see. Below, the{' '}
          <span className="text-slate-200">rule-based guess</span> is this
          engine&apos;s real output — and it is sometimes confidently wrong.
        </p>

        {/* Desktop table */}
        <div className="mt-6 hidden overflow-hidden rounded-xl border border-ink-700 md:block">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-ink-850 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3 font-medium">Input</th>
                <th className="px-4 py-3 font-medium">Rule-based guess</th>
                <th className="px-4 py-3 font-medium">
                  Why it&apos;s ambiguous
                </th>
                <th className="px-4 py-3 font-medium">
                  What context resolves it
                </th>
              </tr>
            </thead>
            <tbody>
              {AMBIGUITY_CASES.map((c, i) => {
                const out = normalize(c.input, c.language).output;
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
                      {c.whyAmbiguous}
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
                      {c.contextResolves}
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
                <p className="mt-2 text-xs text-slate-400">{c.whyAmbiguous}</p>
                <p className="mt-2 text-xs text-slate-400">
                  <span className="text-slate-300">Context:</span>{' '}
                  {c.contextResolves}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border border-accent-violet/30 bg-accent-violet/5 p-5">
          <p className="text-sm leading-relaxed text-slate-300">
            <span className="font-semibold text-accent-violet">
              This is why production TN uses neural seq2seq models.
            </span>{' '}
            Byte/character-level encoder-decoders such as{' '}
            <span className="font-mono text-slate-200">ByT5</span> and{' '}
            <span className="font-mono text-slate-200">mT5</span>, trained on
            large (written, spoken) corpora, learn to read the surrounding
            context and disambiguate. The rule-based system here makes a fixed,
            context-free choice and{' '}
            <span className="text-slate-200">cannot disambiguate</span> — it is
            a strong, transparent baseline and a map of exactly which cases the
            neural model must handle.
          </p>
        </div>
      </div>
    </section>
  );
}
