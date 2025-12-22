import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="fixed left-0 right-0 bottom-0 border-t border-toku-border bg-[rgba(0,0,0,0.5)] backdrop-blur-lg px-3.5 py-2.5 text-xs text-toku-muted flex items-center justify-center">
      <span>
        {t('footerVersion')} · Henshin DB · {t('footerAuthor')}: Mayara Gouveia
      </span>
    </footer>
  );
}


