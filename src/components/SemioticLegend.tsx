import { NORMALIZED_CLASSES, SEMIOTIC_META } from './semioticMeta';

/**
 * A reference grid of every semiotic class the engine covers, with a canonical
 * example. Doubles as the colour legend for the highlighted output.
 */
export default function SemioticLegend() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <p className="section-title">02 · Semiotic class coverage</p>
      <h2 className="mt-1 text-2xl font-semibold text-slate-100">
        The standard TN taxonomy
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
        Every non-standard word belongs to a{' '}
        <span className="text-slate-200">semiotic class</span>. These are the
        same categories a production neural TN model is trained to label — the
        engine implements a handler for each.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {NORMALIZED_CLASSES.map((cls) => {
          const meta = SEMIOTIC_META[cls];
          return (
            <div
              key={cls}
              className="card flex flex-col gap-1 p-3.5"
              style={{ borderColor: `${meta.color}30` }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: meta.color }}
                >
                  {meta.label}
                </span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-slate-600">
                  {cls}
                </span>
              </div>
              <p className="text-xs text-slate-500">{meta.blurb}</p>
              <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                {meta.example}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
