import Rich from './Rich';
import { useI18n } from '../i18n/context';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-ink-800">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t('footer.scopeTitle')}
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
            <Rich text={t('footer.scopeText')} />
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>{t('footer.tagline')}</span>
          <span>
            <Rich text={t('footer.builtFor')} />
          </span>
        </div>
      </div>
    </footer>
  );
}
