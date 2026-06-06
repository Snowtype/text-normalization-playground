/**
 * The TTS pipeline, with the Text-Normalization stage highlighted as the focus
 * of this playground. Purely presentational.
 */

interface Stage {
  label: string;
  sub: string;
  active?: boolean;
}

const STAGES: Stage[] = [
  { label: 'Text', sub: 'raw input' },
  { label: 'Text Normalization', sub: 'written → spoken', active: true },
  { label: 'G2P', sub: 'grapheme → phoneme' },
  { label: 'Acoustic Model', sub: 'phoneme → mel' },
  { label: 'Vocoder', sub: 'mel → waveform' },
];

export default function PipelineDiagram() {
  return (
    <div className="flex flex-wrap items-stretch gap-2">
      {STAGES.map((stage, i) => (
        <div key={stage.label} className="flex items-center gap-2">
          <div
            className={[
              'flex min-w-[7.5rem] flex-col rounded-lg border px-3 py-2 transition-colors',
              stage.active
                ? 'border-accent-cyan/70 bg-accent-cyan/10 shadow-glow'
                : 'border-ink-700 bg-ink-850/70',
            ].join(' ')}
          >
            <span
              className={[
                'text-sm font-semibold',
                stage.active ? 'text-accent-cyan' : 'text-slate-300',
              ].join(' ')}
            >
              {stage.label}
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              {stage.sub}
            </span>
          </div>
          {i < STAGES.length - 1 && (
            <span aria-hidden className="select-none text-slate-600">
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
