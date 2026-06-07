/**
 * The TN orchestrator.
 *
 * Given an input string and a language, it runs every registered semiotic-class
 * handler, collects candidate spans, resolves overlapping candidates by
 * priority, and emits an ordered token stream plus a flat list of normalized
 * spans (the rule trace). This is the single public entry point the UI calls.
 */

import type {
  Language,
  NormalizedSpan,
  SemioticHandler,
  TnResult,
  TnToken,
} from './types';
import { englishHandlers } from './english';
import { koreanHandlers } from './korean';
import { japaneseHandlers } from './japanese';

const REGISTRY: Record<Language, SemioticHandler[]> = {
  en: englishHandlers,
  ko: koreanHandlers,
  ja: japaneseHandlers,
};

/** The handler list for a language (exposed for coverage/inspection). */
export function getHandlers(language: Language): SemioticHandler[] {
  return REGISTRY[language];
}

interface Candidate extends NormalizedSpan {
  priority: number;
}

/** Two half-open intervals [aStart,aEnd) and [bStart,bEnd) overlap? */
function overlaps(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/** Gather every handler's matches as scored candidate spans. */
function collectCandidates(
  text: string,
  handlers: SemioticHandler[],
): Candidate[] {
  const candidates: Candidate[] = [];
  for (const handler of handlers) {
    // Fresh regex per handler run so global-flag lastIndex never leaks.
    const re = new RegExp(handler.pattern.source, handler.pattern.flags);
    for (const match of text.matchAll(re)) {
      const original = match[0];
      if (original.length === 0) continue;
      const result = handler.normalize(match);
      if (!result) continue; // handler vetoed this match
      const start = match.index ?? 0;
      candidates.push({
        original,
        normalized: result.normalized,
        semioticClass: handler.semioticClass,
        rule: handler.rule,
        start,
        end: start + original.length,
        note: result.note,
        priority: handler.priority,
      });
    }
  }
  return candidates;
}

/**
 * Greedily keep the highest-priority non-overlapping candidates.
 * Sort key: priority desc, then longer match, then earlier start — so a
 * specific high-priority rule claims its region before a generic one.
 */
function resolveOverlaps(candidates: Candidate[]): NormalizedSpan[] {
  const sorted = [...candidates].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    const lenA = a.end - a.start;
    const lenB = b.end - b.start;
    if (lenB !== lenA) return lenB - lenA;
    return a.start - b.start;
  });

  const chosen: NormalizedSpan[] = [];
  for (const cand of sorted) {
    const collides = chosen.some((s) =>
      overlaps(cand.start, cand.end, s.start, s.end),
    );
    if (collides) continue;
    // Drop the internal priority field from the emitted span.
    const { priority: _priority, ...span } = cand;
    void _priority;
    chosen.push(span);
  }
  chosen.sort((a, b) => a.start - b.start);
  return chosen;
}

/** Stitch the chosen spans and the untouched gaps into a token stream. */
function buildTokens(text: string, spans: NormalizedSpan[]): TnToken[] {
  const tokens: TnToken[] = [];
  let cursor = 0;
  for (const span of spans) {
    if (span.start > cursor) {
      tokens.push({ text: text.slice(cursor, span.start) });
    }
    tokens.push({ text: span.normalized, span });
    cursor = span.end;
  }
  if (cursor < text.length) {
    tokens.push({ text: text.slice(cursor) });
  }
  return tokens;
}

/**
 * Normalize `text` for the given `language`, returning the spoken form plus a
 * full trace. Empty/whitespace input is handled gracefully (no spans).
 */
export function normalize(text: string, language: Language): TnResult {
  if (!text) {
    return { language, input: text, output: '', tokens: [], spans: [] };
  }
  const handlers = REGISTRY[language];
  const candidates = collectCandidates(text, handlers);
  const spans = resolveOverlaps(candidates);
  const tokens = buildTokens(text, spans);
  const output = tokens.map((t) => t.text).join('');
  return { language, input: text, output, tokens, spans };
}
