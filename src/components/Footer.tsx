export default function Footer() {
  return (
    <footer className="border-t border-ink-800">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Scope &amp; honesty note
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
            This is a{' '}
            <span className="text-slate-200">rule-based TN baseline</span> plus
            an ambiguity analysis — there is no trained neural model behind it.
            The value is a correct, transparent, well-tested rule engine and a
            precise map of the cases where neural seq2seq TN (ByT5/mT5) is
            required. Built to understand the TN problem space end to end.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Text Normalization Playground · rule-based TN for English &amp;
            Korean
          </span>
          <span>
            Built for{' '}
            <span className="text-slate-300">
              Advanced Spoken Language Processing
            </span>{' '}
            @ Columbia
          </span>
        </div>
      </div>
    </footer>
  );
}
