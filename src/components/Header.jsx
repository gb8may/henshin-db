import React, { useState, useEffect } from 'react';
import { Globe, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../lib/i18n';

const LANG_ICONS = {
  pt: '/icons/flag-br.svg',
  en: '/icons/flag-ca.svg',
  ja: '/icons/flag-jp.svg',
};

export function Header({ subtitle, connectionStatus }) {
  const { lang, setLang, t: translate } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.lang-menu')) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'online':
        return <Wifi className="w-4 h-4" />;
      case 'offline':
        return <WifiOff className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <WifiOff className="w-4 h-4" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'online':
        return translate('online');
      case 'offline':
        return translate('offlineChip');
      case 'error':
        return translate('connError');
      default:
        return translate('offlineChip');
    }
  };

  return (
    <header className="px-4 py-3.5 pb-2.5 border-b border-toku-border bg-[rgba(0,0,0,0.35)] backdrop-blur-lg sticky top-0 z-40">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex flex-col gap-0.5">
          <div className="font-bold tracking-wide text-base leading-tight">
            Henshin DB
          </div>
          <div className="text-xs text-toku-muted leading-tight">
            {subtitle || translate('home')}
          </div>
        </div>
        
        <div className="inline-flex items-center gap-2.5">
          {/* Language Menu */}
          <div className="relative lang-menu">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="border border-toku-border bg-[rgba(255,255,255,0.06)] rounded-full p-1.5 cursor-pointer inline-flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              aria-label={translate('language')}
            >
              <img
                src={LANG_ICONS[lang] || LANG_ICONS.en}
                alt=""
                className="w-[22px] h-[14px] block rounded-sm"
              />
            </button>
            
            {showLangMenu && (
              <div className="absolute right-0 top-[42px] bg-[rgba(15,18,26,0.95)] border border-toku-border rounded-xl flex flex-col gap-2 p-3 z-50 shadow-toku min-w-[120px]">
                {(['pt', 'en', 'ja']).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setShowLangMenu(false);
                    }}
                    className="bg-transparent border-none py-2 px-3 cursor-pointer inline-flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors w-full"
                  >
                    <img
                      src={LANG_ICONS[l]}
                      alt={l.toUpperCase()}
                      className="w-8 h-5 block rounded-sm"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Connection Status */}
          <div className="inline-flex items-center gap-2 px-2.5 py-2 rounded-full border border-toku-border bg-[rgba(255,255,255,0.06)] text-xs text-toku-muted select-none">
            {getConnectionIcon()}
            <span>{getConnectionText()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

