import { useState, useEffect } from 'react';
import { getSavedLang, pickLangFromDevice, saveLang, t } from '../lib/i18n';

export function useLanguage() {
  const [lang, setLangState] = useState(() => {
    const saved = getSavedLang();
    return saved || pickLangFromDevice();
  });

  useEffect(() => {
    saveLang(lang);
    document.documentElement.lang = lang === "pt" ? "pt-BR" : (lang === "ja" ? "ja-JP" : "en");
  }, [lang]);

  const setLang = (newLang) => {
    if (newLang === "pt" || newLang === "en" || newLang === "ja") {
      setLangState(newLang);
    }
  };

  const translate = (key) => t(key, lang);

  return { lang, setLang, t: translate };
}










