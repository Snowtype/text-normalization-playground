import { useMemo } from 'react';
import type { NormalizedSpan, SemioticClass } from '../tn';
import { SEMIOTIC_META } from './semioticMeta';

interface Props {
  spans: NormalizedSpan[];
  activeIndex?: number | null;
  onHoverSpan?: (index: number | null) => void;
}

/**
 * The rule-trace panel: every transformation grouped by semiotic class, showing
 * {original → normalized, rule id, optional disambiguation note}. Grouping makes
 * the engine's class coverage visible at a glance.
 */
export default function RuleTrace({ spans, activeIndex, onHoverSpan }: Props) {
  // Keep each span's original order index (matches HighlightedOutput) while
  // grouping by class for display.
  const grouped = useMemo(() => {
    const map = new Map<
      SemioticClass,
      { span: NormalizedSpan; index: number }[]
    >();
    spans.forEach((span, index) => {
      const list = map.get(span.semioticClass) ?? [];
      list.push({ span, index });
      map.set(span.semioticClass, list);
    });
    return [...map.entries()];
  }, [spans]);

  if (spans.length === 0) {
    return (
      <p className="font-mono text-sm text-slate-600">
        No non-standard tokens detected. The trace lists every transformation
        the engine applies.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {grouped.map(([cls, entries]) => {
        const meta = SEMIOTIC_META[cls];
        return (
          <div key={cls}>
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className="pill"
                style={{
                  color: meta.color,
                  borderColor: `${meta.color}55`,
                  backgroundColor: `${meta.color}12`,
                }}
              >
                {meta.label}
              </span>
              <span className="text-xs text-slate-600">
                {entries.length} {entries.length === 1 ? 'span' : 'spans'}
              </span>
            </div>
            <ul className="space-y-1">
              {entries.map(({ span, index }) => {
                const isActive = activeIndex === index;
                return (
                  <li
                    key={index}
                    className={[
                      'rounded-md border px-3 py-2 font-mono text-[13px] transition-colors',
                      isActive
                        ? 'border-ink-600 bg-ink-800'
                        : 'border-ink-800 bg-ink-900/40',
                    ].join(' ')}
                    onMouseEnter={() => onHoverSpan?.(index)}
                    onMouseLeave={() => onHoverSpan?.(null)}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-slate-400">{span.original}</span>
                      <span className="text-slate-600">→</span>
                      <span style={{ color: meta.color }}>
                        {span.normalized}
                      </span>
                      <span className="ml-auto text-[11px] text-slate-600">
                        {span.rule}
                      </span>
                    </div>
                    {span.note && (
                      <p className="mt-1 text-[11px] leading-snug text-amber-300/80">
                        ⚠ {span.note}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
