import PipelineDiagram from './PipelineDiagram';

export default function Hero() {
  return (
    <header className="relative overflow-hidden border-b border-ink-800">
      <div className="mx-auto max-w-6xl px-5 pb-12 pt-16 sm:pt-20">
        <div className="pill border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
          TTS pipeline · Text Normalization stage
        </div>

        <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
          Text Normalization{' '}
          <span className="text-accent-cyan">Playground</span>
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
          An interactive, well-tested{' '}
          <span className="text-slate-200">rule-based</span> text-normalization
          engine for <span className="text-slate-200">English</span>,{' '}
          <span className="text-slate-200">Korean</span>, and{' '}
          <span className="text-slate-200">Japanese</span> — the stage that
          turns written text (
          <span className="font-mono text-slate-300">$5</span>,{' '}
          <span className="font-mono text-slate-300">3시</span>,{' '}
          <span className="font-mono text-slate-300">3時</span>) into the spoken
          form a TTS voice actually reads — plus a clear-eyed analysis of where
          rules break and <span className="text-slate-200">neural seq2seq</span>{' '}
          models take over.
        </p>

        <div className="mt-8">
          <PipelineDiagram />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
          <a href="#playground" className="nav-link text-accent-cyan">
            ↓ Try the normalizer
          </a>
          <span className="hidden text-slate-700 sm:inline">·</span>
          <span>
            Built for{' '}
            <span className="text-slate-300">
              Advanced Spoken Language Processing
            </span>{' '}
            @ Columbia
          </span>
        </div>
      </div>
    </header>
  );
}
