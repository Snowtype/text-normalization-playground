# Text Normalization Playground

An interactive demonstration of the **text-normalization (TN)** stage of a
text-to-speech (TTS) pipeline — a tested, rule-based TN engine for **English and
Korean**, plus a clear-eyed analysis of where rules break and **neural seq2seq**
models (ByT5 / mT5) become necessary.

> **Live demo:** **https://snowtype.github.io/text-normalization-playground/**
> · **Source:** https://github.com/Snowtype/text-normalization-playground

```
Text  →  [ Text Normalization ]  →  G2P  →  Acoustic Model  →  Vocoder  →  🔊
              ▲ this project
```

---

## What is text normalization, and why does it matter?

Before a TTS voice can speak, written text has to be converted into its **spoken
form**: `$5` → "five dollars", `3/14` → "March fourteenth", `2시` → "두 시". This
conversion is **text normalization**, the first stage of the pipeline. It is
deceptively hard — the same characters are read differently depending on
category and context — and errors here are audible in every downstream stage, so
production TTS systems treat TN as a first-class problem.

TN operates over **semiotic classes**: the categories of "non-standard words"
(numbers, dates, money, measures, abbreviations…) that are written one way and
spoken another. This project implements a handler for each class, traces every
transformation, and then shows the cases a rule set fundamentally cannot solve.

## Features

- **Live interactive normalizer** — type text, see the spoken form with each
  normalized span highlighted by class, and a full **rule trace**
  (`category · original → normalized · rule fired`) grouped by semiotic class.
- **English ↔ Korean** toggle, including proper Korean numeral selection
  (native vs. Sino-Korean — e.g. `2시` → `두 시`, `100원` → `백 원`).
- **"Why neural TN?" showcase** — curated ambiguous inputs where the rule engine
  is forced into a fixed (sometimes wrong) choice, with the context a neural
  model would use to disambiguate.
- **Batch & metrics** — paste many lines, get per-class distribution and counts.
- **Live test tab** — the Vitest corpus, re-evaluated in the browser.
- **TTS pipeline diagram** with the TN stage highlighted.

## Semiotic classes covered

| Class            | Example (EN)                         | Example (KO)            |
| ---------------- | ------------------------------------ | ----------------------- |
| **CARDINAL**     | `1,250` → one thousand two hundred fifty | `1250` → 천이백오십  |
| **ORDINAL**      | `3rd` → third                        | `3번째` → 세 번째 / `제3` → 제삼 |
| **DECIMAL**      | `3.14` → three point one four        | `3.14` → 삼 점 일사     |
| **DATE**         | `3/14` → March fourteenth            | `6월` → 유월 (irregular) |
| **TIME**         | `2:30 PM` → two thirty PM            | `2시 30분` → 두 시 삼십 분 |
| **MONEY**        | `$5` → five dollars                  | `100원` → 백 원         |
| **PERCENT**      | `50%` → fifty percent                | `50%` → 오십 퍼센트     |
| **MEASURE**      | `12km` → twelve kilometers           | `12km` → 십이 킬로미터  |
| **TELEPHONE**    | `555-123-4567` → five five five …    | `010-1234-5678` → 공일공 … |
| **DIGIT**        | `room 502` → room five zero two      | —                       |
| **ELECTRONIC**   | `a@b.com` → a at b dot com           | `a@b.com` → a 골뱅이 b 점 com |
| **ABBREVIATION** | `Dr.` → Doctor                       | —                       |

Korean number reading distinguishes **native** numerals (하나, 둘, 셋 …; used for
hours, ages, and many counters) from **Sino-Korean** numerals (일, 이, 삼 …; used
for dates, money, minutes, measurements), including irregulars such as
`6월` → 유월 and `10월` → 시월. Choosing the wrong system is the single most
common Korean TN error.

## Why neural? The ambiguity that rules can't resolve

A rule set must commit to one reading per pattern, but the correct spoken form
often depends on context a context-free rule cannot see:

| Input              | Rule-based guess        | Why it's ambiguous                                | What context resolves it                          |
| ------------------ | ----------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `1/2`              | "January second"        | date vs. fraction (one half) vs. ratio (one to two) | "add 1/2 cup" → fraction; "meet 1/2" → date      |
| `Main St.`         | "Main Saint"            | "St." = Street **or** Saint                       | position: after a road name → Street               |
| `Dr.` (twice)      | "Doctor … Doctor"       | Doctor (title) vs. Drive (street) in one sentence | precedes a person vs. follows a place name         |
| `2-3`              | "two-three"             | range vs. subtraction vs. date                    | "2-3 days" → range; "2-3 = -1" → subtraction       |
| `3시` (KO)         | "세 시" (native)        | counter selects native, but the digit alone can't say which counter sense is meant | the counter 시 → native system |

> **This is why production TN uses neural seq2seq models.** Byte/character-level
> encoder-decoders (ByT5, mT5) trained on large (written, spoken) corpora learn
> to read context and disambiguate. The rule-based system here makes a fixed,
> context-free choice and **cannot disambiguate** — it is a strong, transparent
> baseline and a precise map of which cases the neural model must own.

## Architecture

The TN **engine** is a pure, framework-agnostic TypeScript module with **no
React/DOM/IO dependencies** — it can run in a browser, a Node script, or a test
runner. The UI only consumes the result it returns.

```
src/
├── tn/                      # the engine (pure TypeScript)
│   ├── types.ts             # shared types (SemioticClass, TnResult, SemioticHandler…)
│   ├── registry.ts          # orchestrator: collect candidates → resolve overlaps → emit tokens
│   ├── english.ts           # English handlers (one per semiotic class)
│   ├── korean.ts            # Korean handlers
│   ├── englishNumbers.ts    # cardinal / ordinal / decimal → words
│   ├── koreanNumbers.ts     # Sino & native Korean numerals (with attributive forms)
│   ├── ambiguity.ts         # curated "why neural?" dataset
│   ├── testCases.ts         # the shared input→expected corpus (single source of truth)
│   ├── index.ts             # public API barrel
│   └── __tests__/           # Vitest suites
└── components/              # React UI (consumes the engine only)
    ├── Playground.tsx       # the interactive normalizer
    ├── AmbiguityShowcase.tsx
    ├── BatchMetrics.tsx · BarChart.tsx
    ├── TestCasesPanel.tsx   # the corpus, evaluated live
    └── …
```

**How the engine works.** Each semiotic class is a `SemioticHandler` declaring a
`priority`, a regex `pattern`, and a `normalize()` function. The orchestrator
runs every handler, collects candidate spans with character offsets, resolves
overlaps by priority (so the digits in `$5` are read as money, not a bare
cardinal), and stitches the surviving spans into a token stream plus a flat rule
trace. Adding a new class is one handler object.

**One corpus, two consumers.** `src/tn/testCases.ts` holds the `input → expected`
pairs. The Vitest suite asserts them **and** the in-app "Test cases" tab renders
and re-runs them — so the UI can never show a green tick the test suite doesn't
actually have.

## Getting started

```bash
npm install
npm run dev        # start the dev server (Vite)
```

Open the printed local URL (default http://localhost:5173).

## Testing

```bash
npm test               # run the Vitest suite once
npm run test:watch     # watch mode
npm run test:coverage   # coverage report (engine ≈ 98% statements)
```

The suite has **140+ assertions**: a per-case corpus covering every semiotic
class in both languages, unit tests for the number converters, and
engine-mechanics tests (overlap resolution, trace integrity, empty/edge input,
and that every ambiguity case runs cleanly).

## Linting & formatting

```bash
npm run lint           # ESLint (TypeScript + React Hooks), zero warnings
npm run format         # Prettier write
npm run format:check   # Prettier check
```

## Deployment

The app is a static SPA — `npm run build` emits `dist/` with **no backend**.
`vite.config.ts` uses a relative `base` so the same build works from a domain
root or a Pages subpath.

- **GitHub Pages** — a workflow at `.github/workflows/deploy.yml` builds, tests,
  and publishes on every push to `main`. Enable it under
  **Settings → Pages → Source → GitHub Actions**.
- **Vercel** — `vercel.json` is included; import the repo and deploy (framework
  preset: Vite). No configuration needed.

## Scope & honesty note

This is a **rule-based TN baseline** plus an ambiguity analysis — there is **no
trained neural model** behind it. The value is a correct, transparent,
well-tested rule engine and a precise map of the cases where neural seq2seq TN
(ByT5/mT5) is required. It was built to understand the TN problem space end to
end.

---

Built for **Advanced Spoken Language Processing @ Columbia**.
