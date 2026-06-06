import type { TnResult } from '../tn';
import { SEMIOTIC_META } from './semioticMeta';

interface Props {
  result: TnResult;
  /** Index of the span the user is hovering in the trace (for cross-highlight). */
  activeIndex?: number | null;
  onHoverSpan?: (index: number | null) => void;
}

/**
 * Renders the spoken-form output, with every normalized span underlined in its
 * semiotic-class colour. Hovering a span cross-highlights its trace row.
 */
export default function HighlightedOutput({
  result,
  activeIndex,
  onHoverSpan,
}: Props) {
  if (!result.input) {
    return (
      <p className="font-mono text-sm text-slate-600">
        The spoken form will appear here…
      </p>
    );
  }

  let spanCursor = -1;
  return (
    <p className="font-mono text-[15px] leading-8 text-slate-200">
      {result.tokens.map((token, i) => {
        if (!token.span) {
          return <span key={i}>{token.text}</span>;
        }
        spanCursor += 1;
        const idx = spanCursor;
        const color = SEMIOTIC_META[token.span.semioticClass].color;
        const isActive = activeIndex === idx;
        return (
          <span
            key={i}
            className="tn-span cursor-help"
            style={{
              color,
              backgroundColor: isActive ? `${color}26` : `${color}14`,
              boxShadow: isActive ? `0 0 0 1px ${color}66` : undefined,
            }}
            title={`${token.span.semioticClass}: "${token.span.original}" → "${token.span.normalized}" (${token.span.rule})`}
            onMouseEnter={() => onHoverSpan?.(idx)}
            onMouseLeave={() => onHoverSpan?.(null)}
          >
            {token.text}
          </span>
        );
      })}
    </p>
  );
}
