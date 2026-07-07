/**
 * English UI dictionary.
 *
 * Values are plain strings so this file stays JSX-free. Two inline markers are
 * understood by the <Rich> renderer: **text** for emphasis and `text` for
 * code/mono. `{n}`-style placeholders are interpolated by t(key, params).
 *
 * Key naming: `section.item` (flat, dot-separated). The `class.*` and
 * `classBlurb.*` groups are keyed by the engine's SemioticClass names.
 */

export const en: Record<string, string> = {
  // Nav
  'nav.playground': 'Playground',
  'nav.whyNeural': 'Why neural?',
  'nav.batch': 'Batch',
  'nav.tests': 'Tests',

  // Hero
  'hero.pill': 'TTS pipeline · Text Normalization stage',
  'hero.description':
    'An interactive, well-tested **rule-based** text-normalization engine for **English**, **Korean**, and **Japanese** — the stage that turns written text (`$5`, `3시`, `3時`) into the spoken form a TTS voice actually reads — plus a clear-eyed analysis of where rules break and **neural seq2seq** models take over.',
  'hero.cta': '↓ Try the normalizer',
  'hero.builtFor':
    'Built for **Advanced Spoken Language Processing** @ Columbia',

  // TTS pipeline diagram
  'pipeline.text.label': 'Text',
  'pipeline.text.sub': 'raw input',
  'pipeline.tn.label': 'Text Normalization',
  'pipeline.tn.sub': 'written → spoken',
  'pipeline.g2p.label': 'G2P',
  'pipeline.g2p.sub': 'grapheme → phoneme',
  'pipeline.acoustic.label': 'Acoustic Model',
  'pipeline.acoustic.sub': 'phoneme → mel',
  'pipeline.vocoder.label': 'Vocoder',
  'pipeline.vocoder.sub': 'mel → waveform',

  // Playground
  'playground.sectionTitle': '01 · Interactive normalizer',
  'playground.heading': 'Written form in, spoken form out',
  'playground.subtitle':
    'Live as you type — no button. Only non-standard tokens (numbers, dates, money, units…) change; plain words pass through untouched.',
  'playground.inputLabel': 'Input — written text',
  'playground.outputLabel': 'Output — spoken form',
  'playground.normalizedCount': '{n} normalized',
  'playground.emptyHint':
    'Output equals input — no non-standard tokens found here. Try a number, date, time, $, %, a unit like `12km`, or check the language toggle matches your text.',
  'playground.traceLabel': 'Rule trace — grouped by semiotic class',
  'playground.placeholder.en': 'Type text with numbers, dates, money…',
  'playground.placeholder.ko': '숫자, 날짜, 금액이 포함된 문장을 입력하세요…',
  'playground.placeholder.ja': '数字・日付・金額を含む文を入力してください…',

  // Rule trace
  'trace.empty':
    'No non-standard tokens detected. The trace lists every transformation the engine applies.',
  'trace.spanCount.one': '{n} span',
  'trace.spanCount.other': '{n} spans',

  // Highlighted output
  'output.placeholder': 'The spoken form will appear here…',

  // Semiotic legend
  'legend.sectionTitle': '02 · Semiotic class coverage',
  'legend.heading': 'The standard TN taxonomy',
  'legend.description':
    'Every non-standard word belongs to a **semiotic class**. These are the same categories a production neural TN model is trained to label — the engine implements a handler for each.',

  // Ambiguity showcase
  'ambiguity.sectionTitle': '03 · Why neural TN?',
  'ambiguity.heading': 'Where rules break and context is required',
  'ambiguity.intro':
    'A rule set must commit to one reading per pattern. But the correct spoken form of many tokens depends on surrounding context the rule cannot see. Below, the **rule-based guess** is this engine’s real output — and it is sometimes confidently wrong.',
  'ambiguity.thInput': 'Input',
  'ambiguity.thGuess': 'Rule-based guess',
  'ambiguity.thWhy': "Why it's ambiguous",
  'ambiguity.thContext': 'What context resolves it',
  'ambiguity.contextLabel': 'Context:',
  'ambiguity.outroLead':
    'This is why production TN uses neural seq2seq models.',
  'ambiguity.outroBody':
    'Byte/character-level encoder-decoders such as `ByT5` and `mT5`, trained on large (written, spoken) corpora, learn to read the surrounding context and disambiguate. The rule-based system here makes a fixed, context-free choice and **cannot disambiguate** — it is a strong, transparent baseline and a map of exactly which cases the neural model must handle.',

  // Batch & metrics
  'batch.sectionTitle': '04 · Batch & metrics',
  'batch.heading': 'Normalize many lines, measure coverage',
  'batch.inputLabel': 'Paste lines — one utterance per line',
  'batch.statLines': 'Lines',
  'batch.statTokens': 'Tokens normalized',
  'batch.statClasses': 'Classes seen',
  'batch.distLabel': 'Distribution by semiotic class',
  'batch.chartEmpty': 'No tokens normalized yet.',

  // Test suite
  'tests.sectionTitle': '05 · Test suite',
  'tests.heading': 'The Vitest corpus, evaluated live',
  'tests.description':
    'One shared source of truth (`src/tn/testCases.ts`) drives both `npm test` and this view.',
  'tests.thClass': 'Class',
  'tests.thInput': 'Input',
  'tests.thExpected': 'Expected (spoken form)',
  'tests.thStatus': 'Status',
  'tests.allPassing': '✓ all passing',
  'tests.failures': '✗ failures',
  'tests.gotLabel': 'got:',

  // Footer
  'footer.scopeTitle': 'Scope & honesty note',
  'footer.scopeText':
    'This is a **rule-based TN baseline** plus an ambiguity analysis — there is no trained neural model behind it. The value is a correct, transparent, well-tested rule engine and a precise map of the cases where neural seq2seq TN (ByT5/mT5) is required. Built to understand the TN problem space end to end.',
  'footer.tagline':
    'Text Normalization Playground · rule-based TN for English, Korean & Japanese',
  'footer.builtFor':
    'Built for **Advanced Spoken Language Processing** @ Columbia',

  // Semiotic class labels
  'class.CARDINAL': 'Cardinal',
  'class.ORDINAL': 'Ordinal',
  'class.DECIMAL': 'Decimal',
  'class.DATE': 'Date',
  'class.TIME': 'Time',
  'class.MONEY': 'Money',
  'class.PERCENT': 'Percent',
  'class.MEASURE': 'Measure',
  'class.TELEPHONE': 'Telephone',
  'class.DIGIT': 'Digit string',
  'class.ELECTRONIC': 'Electronic',
  'class.ABBREVIATION': 'Abbreviation',
  'class.PLAIN': 'Plain',

  // Semiotic class blurbs
  'classBlurb.CARDINAL': 'Counting numbers.',
  'classBlurb.ORDINAL': 'Rank / position numbers.',
  'classBlurb.DECIMAL': 'Numbers with a fractional part.',
  'classBlurb.DATE': 'Calendar dates.',
  'classBlurb.TIME': 'Clock times.',
  'classBlurb.MONEY': 'Currency amounts.',
  'classBlurb.PERCENT': 'Percentages.',
  'classBlurb.MEASURE': 'Quantities with units / counters.',
  'classBlurb.TELEPHONE': 'Phone numbers, read digit by digit.',
  'classBlurb.DIGIT': 'Identifiers read digit by digit.',
  'classBlurb.ELECTRONIC': 'URLs and email addresses.',
  'classBlurb.ABBREVIATION': 'Shortened words expanded in full.',
  'classBlurb.PLAIN': 'Ordinary words, left verbatim.',
};
