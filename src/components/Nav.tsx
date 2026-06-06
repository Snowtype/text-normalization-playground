const LINKS = [
  { href: '#playground', label: 'Playground' },
  { href: '#why-neural', label: 'Why neural?' },
  { href: '#batch', label: 'Batch' },
  { href: '#tests', label: 'Tests' },
];

export default function Nav() {
  return (
    <nav className="sticky top-0 z-20 border-b border-ink-800 bg-ink-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded bg-accent-cyan/15 font-mono text-xs font-bold text-accent-cyan">
            TN
          </span>
          <span className="text-sm font-semibold text-slate-200">
            Text Normalization Playground
          </span>
        </a>
        <div className="hidden items-center gap-5 sm:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
