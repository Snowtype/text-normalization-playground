import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { I18nContext, type Translate, type UiLang } from './context';
import { en } from './en';
import { ko } from './ko';

const DICTS: Record<UiLang, Record<string, string>> = { en, ko };

const STORAGE_KEY = 'tn-ui-lang';

function detectLang(): UiLang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ko') return stored;
  } catch {
    // localStorage unavailable (private mode etc.) — fall through.
  }
  return navigator.language?.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [uiLang, setUiLangState] = useState<UiLang>(detectLang);

  const setUiLang = useCallback((lang: UiLang) => {
    setUiLangState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Persisting is best-effort.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = uiLang;
  }, [uiLang]);

  const t = useCallback<Translate>(
    (key, params) => {
      let text = DICTS[uiLang][key] ?? en[key] ?? key;
      if (params) {
        for (const [name, value] of Object.entries(params)) {
          text = text.replaceAll(`{${name}}`, String(value));
        }
      }
      return text;
    },
    [uiLang],
  );

  const value = useMemo(
    () => ({ uiLang, setUiLang, t }),
    [uiLang, setUiLang, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
