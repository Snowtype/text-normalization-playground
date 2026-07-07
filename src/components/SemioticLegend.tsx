import { NORMALIZED_CLASSES, SEMIOTIC_META } from './semioticMeta';
import Rich from './Rich';
import { useI18n } from '../i18n/context';

/**
 * A reference grid of every semiotic class the engine covers, with a canonical
 * example. Doubles as the colour legend for the highlighted output.
 */
export default function SemioticLegend() {
  const { uiLang, t } = useI18n();

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <p className="section-title">{t('legend.sectionTitle')}</p>
      <h2 className="mt-1 text-2xl font-semibold text-slate-100">
        {t('legend.heading')}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
        <Rich text={t('legend.description')} />
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
                  {t(`class.${cls}`)}
                </span>
                {/* The Korean label already carries the class code, so the
                    code badge is only shown in English mode. */}
                {uiLang === 'en' && (
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-slate-600">
                    {cls}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{t(`classBlurb.${cls}`)}</p>
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
