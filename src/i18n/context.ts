/**
 * The i18n context and hook, kept free of component exports so React Fast
 * Refresh stays happy. The provider component lives in `I18nProvider.tsx`;
 * the dictionaries live in `en.ts` / `ko.ts`.
 *
 * `t(key)` resolves in the active dictionary, falls back to English, and
 * finally to the key itself (which makes a missing key visible in the UI
 * instead of crashing). `{name}` placeholders are filled from `params`.
 */

import { createContext, useContext } from 'react';

export type UiLang = 'en' | 'ko';

export type Translate = (
  key: string,
  params?: Record<string, string | number>,
) => string;

export interface I18nContextValue {
  uiLang: UiLang;
  setUiLang: (lang: UiLang) => void;
  t: Translate;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
