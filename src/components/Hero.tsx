import PipelineDiagram from './PipelineDiagram';
import Rich from './Rich';
import { useI18n } from '../i18n/context';

export default function Hero() {
  const { t } = useI18n();

  return (
    <header className="relative overflow-hidden border-b border-ink-800">
      <div className="mx-auto max-w-6xl px-5 pb-12 pt-16 sm:pt-20">
        <div className="pill border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
          {t('hero.pill')}
        </div>

        <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
          Text Normalization{' '}
          <span className="text-accent-cyan">Playground</span>
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
          <Rich text={t('hero.description')} />
        </p>

        <div className="mt-8">
          <PipelineDiagram />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
          <a href="#playground" className="nav-link text-accent-cyan">
            {t('hero.cta')}
          </a>
          <span className="hidden text-slate-700 sm:inline">·</span>
          <span>
            <Rich text={t('hero.builtFor')} />
          </span>
        </div>
      </div>
    </header>
  );
}
