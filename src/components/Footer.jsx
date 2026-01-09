import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Info, X } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <>
      <footer className="fixed left-0 right-0 border-t border-toku-border bg-[rgba(0,0,0,0.5)] backdrop-blur-lg px-3.5 py-2.5 text-xs text-toku-muted z-50" style={{ 
        bottom: `env(safe-area-inset-bottom)`,
        paddingBottom: `calc(0.625rem + env(safe-area-inset-bottom))`
      }}>
        <div className="flex items-center justify-center gap-2">
          <span>
            {t('footerVersion')} · Pocket Henshin · {t('footerAuthor')}: Mayara Gouveia
          </span>
          <button 
            onClick={() => setShowDisclaimer(true)}
            className="text-toku-muted hover:text-white transition-colors"
            aria-label="About"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-center mt-1 text-[10px] opacity-70">
          {t('disclaimerShort')}
        </div>
      </footer>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-toku-panel border border-toku-border rounded-lg max-w-md w-full max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-toku-panel border-b border-toku-border p-4 flex items-center justify-between">
              <h2 className="font-bold text-base">{t('aboutTitle')}</h2>
              <button 
                onClick={() => setShowDisclaimer(false)}
                className="text-toku-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 text-sm space-y-4">
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <p className="text-orange-400 font-semibold text-xs uppercase mb-1">
                  ⚠️ {t('disclaimerTitle')}
                </p>
                <p className="text-toku-muted text-xs">
                  {t('disclaimerFull')}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">{t('aboutWhatIs')}</h3>
                <p className="text-toku-muted text-xs leading-relaxed">
                  {t('aboutDescription')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('aboutFeatures')}</h3>
                <ul className="text-toku-muted text-xs space-y-1.5">
                  <li>• {t('aboutFeature1')}</li>
                  <li>• {t('aboutFeature2')}</li>
                  <li>• {t('aboutFeature3')}</li>
                  <li>• {t('aboutFeature4')}</li>
                  <li>• {t('aboutFeature5')}</li>
                </ul>
              </div>

              <div className="pt-2 border-t border-toku-border">
                <p className="text-toku-muted text-[10px]">
                  {t('copyrightNotice')}
                </p>
              </div>

              <a 
                href="privacy-policy.html" 
                target="_blank"
                className="block text-center text-xs text-blue-400 hover:underline"
              >
                {t('privacyPolicyLink')}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
