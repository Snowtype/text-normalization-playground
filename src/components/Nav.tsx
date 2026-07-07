import { useI18n, type UiLang } from '../i18n/context';

const UI_LANGS: { code: UiLang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ko', label: '한국어' },
];

export default function Nav() {
  const { uiLang, setUiLang, t } = useI18n();

  const links = [
    { href: '#playground', label: t('nav.playground') },
    { href: '#why-neural', label: t('nav.whyNeural') },
    { href: '#batch', label: t('nav.batch') },
    { href: '#tests', label: t('nav.tests') },
  ];

  return (
    <nav className="sticky top-0 z-20 border-b border-ink-800 bg-ink-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded bg-accent-cyan/15 font-mono text-xs font-bold text-accent-cyan">
            TN
          </span>
          <span className="text-sm font-semibold text-slate-200">
            Text Normalization Playground
          </span>
        </a>
        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-5 sm:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="nav-link">
                {l.label}
              </a>
            ))}
          </div>
          {/* UI language toggle — independent of the TN input language. */}
          <div className="inline-flex rounded-lg border border-ink-700 bg-ink-900 p-0.5">
            {UI_LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setUiLang(code)}
                aria-pressed={uiLang === code}
                className={[
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  uiLang === code
                    ? 'bg-accent-cyan/15 text-accent-cyan'
                    : 'text-slate-400 hover:text-slate-200',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
