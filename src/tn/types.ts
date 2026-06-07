/**
 * Shared types for the text-normalization (TN) engine.
 *
 * The engine is a pure, framework-agnostic TypeScript module: it has no React,
 * DOM, or I/O dependencies and can be imported from a browser, a Node script,
 * or a test runner. The UI consumes the {@link TnResult} it returns.
 */

/** Languages with a TN ruleset in this playground. */
export type Language = 'en' | 'ko' | 'ja';

/**
 * Standard TN *semiotic classes*. A semiotic class is the category of a
 * non-standard word (NSW) — a token that is written one way and spoken
 * another. These names follow the taxonomy used in the TN literature
 * (Sproat et al., 2001; the Google/Kaggle TN datasets), which is the same
 * vocabulary a production neural TN system is trained against.
 */
export type SemioticClass =
  | 'CARDINAL' // 1,250 -> one thousand two hundred fifty
  | 'ORDINAL' // 3rd -> third
  | 'DECIMAL' // 3.14 -> three point one four
  | 'DATE' // 3/14 -> March fourteenth
  | 'TIME' // 2:30 PM -> two thirty PM
  | 'MONEY' // $5 -> five dollars
  | 'PERCENT' // 50% -> fifty percent
  | 'MEASURE' // 12km -> twelve kilometers
  | 'TELEPHONE' // 555-123-4567 -> five five five ...
  | 'DIGIT' // room 502 -> five zero two
  | 'ELECTRONIC' // a@b.com -> a at b dot com
  | 'ABBREVIATION' // Dr. -> Doctor
  | 'PLAIN'; // verbatim text, left untouched

/** A single normalized region of the input. */
export interface NormalizedSpan {
  /** The original (written) substring. */
  original: string;
  /** The spoken-form replacement. */
  normalized: string;
  /** Which semiotic class this span was tagged as. */
  semioticClass: SemioticClass;
  /** Human-readable identifier of the rule that fired (e.g. "en:money"). */
  rule: string;
  /** Inclusive start offset into the original input string. */
  start: number;
  /** Exclusive end offset into the original input string. */
  end: number;
  /**
   * Optional commentary attached by a rule — typically a note that the rule
   * made a *fixed, context-free choice* for an ambiguous input. This is what
   * the "Why neural TN?" section surfaces.
   */
  note?: string;
}

/**
 * A piece of the rendered output: either verbatim plain text (`span`
 * undefined) or a normalized region (`span` set). Concatenating `text` over
 * the token list reproduces the full spoken form.
 */
export interface TnToken {
  text: string;
  span?: NormalizedSpan;
}

/** The complete result of normalizing one input string. */
export interface TnResult {
  language: Language;
  /** The original input, unchanged. */
  input: string;
  /** The full spoken form. */
  output: string;
  /** Interleaved plain + normalized tokens, in input order (for rendering). */
  tokens: TnToken[];
  /** Just the normalized spans, in input order (the rule trace). */
  spans: NormalizedSpan[];
}

/**
 * A semiotic-class handler. The registry holds an ordered list of these; the
 * orchestrator runs each over the input, collects candidate matches, resolves
 * overlaps by {@link priority}, and emits the surviving spans.
 */
export interface SemioticHandler {
  /** The semiotic class this handler produces. */
  semioticClass: SemioticClass;
  /** Stable rule id used in the trace, e.g. "en:ordinal". */
  rule: string;
  /**
   * Overlap priority. When two handlers match overlapping regions, the higher
   * priority wins; ties are broken by longer match, then earlier start. Order
   * handlers so that specific patterns (ELECTRONIC, MONEY, TIME) outrank
   * generic ones (CARDINAL).
   */
  priority: number;
  /** A *global* (`g` flagged) regex locating candidate spans. */
  pattern: RegExp;
  /**
   * Convert a regex match into a spoken form. Returning `null` vetoes the
   * match (the region is left for a lower-priority handler or kept plain) —
   * use this for guards a regex alone cannot express.
   */
  normalize: (
    match: RegExpMatchArray,
  ) => { normalized: string; note?: string } | null;
}
