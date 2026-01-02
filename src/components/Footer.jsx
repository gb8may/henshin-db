import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="fixed left-0 right-0 border-t border-toku-border bg-[rgba(0,0,0,0.5)] backdrop-blur-lg px-3.5 py-2.5 text-xs text-toku-muted flex items-center justify-center z-50" style={{ 
      bottom: `env(safe-area-inset-bottom)`, // Rodapé no bottom
      paddingBottom: `calc(0.625rem + env(safe-area-inset-bottom))`
    }}>
      <span>
        {t('footerVersion')} · Henshin DB · {t('footerAuthor')}: Mayara Gouveia
      </span>
    </footer>
  );
}













