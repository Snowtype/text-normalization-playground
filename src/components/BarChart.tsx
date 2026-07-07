import type { SemioticClass } from '../tn';
import { SEMIOTIC_META } from './semioticMeta';
import { useI18n } from '../i18n/context';

interface Props {
  /** Counts keyed by semiotic class. */
  counts: Partial<Record<SemioticClass, number>>;
}

/**
 * A minimal dependency-free horizontal bar chart for the per-class
 * distribution. Bars are widthed relative to the largest count.
 */
export default function BarChart({ counts }: Props) {
  const { t } = useI18n();

  const entries = (Object.entries(counts) as [SemioticClass, number][])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return (
      <p className="font-mono text-sm text-slate-600">
        {t('batch.chartEmpty')}
      </p>
    );
  }

  const max = Math.max(...entries.map(([, n]) => n));

  return (
    <div className="space-y-2">
      {entries.map(([cls, n]) => {
        const meta = SEMIOTIC_META[cls];
        const pct = Math.round((n / max) * 100);
        return (
          <div key={cls} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-right text-xs text-slate-400">
              {t(`class.${cls}`)}
            </span>
            <div className="h-5 flex-1 overflow-hidden rounded bg-ink-850">
              <div
                className="flex h-full items-center justify-end rounded pr-2 text-[11px] font-semibold text-ink-950"
                style={{
                  width: `${Math.max(pct, 8)}%`,
                  backgroundColor: meta.color,
                }}
              >
                {n}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
