import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';
import { WifiOff, Home, RefreshCw } from 'lucide-react';

export function OfflinePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [testing, setTesting] = useState(false);

  async function handleRetry() {
    setTesting(true);
    try {
      const { error } = await supabase.from('characters').select('id').limit(1);
      if (!error) {
        navigate('/');
      }
    } catch {
      // Still offline
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3.5 py-3.5 pb-[90px] overflow-auto flex-1 -webkit-overflow-scrolling-touch">
        <div className="font-bold text-base leading-tight mb-2.5 px-0.5">
          {t('offlineTitle')}
        </div>
        <div className="text-toku-muted text-[13px] leading-tight mb-3 px-0.5">
          {t('offlineHint')}
        </div>

        <div className="grid gap-3 justify-items-center mt-3">
          <Button
            onClick={handleRetry}
            disabled={testing}
            className="w-full max-w-[360px]"
            icon={testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <WifiOff className="w-4 h-4" />}
          >
            <div className="flex flex-col items-start">
              <span>{t('offlineRetryLabel')}</span>
              <small className="text-xs text-toku-muted">{t('offlineRetryHint')}</small>
            </div>
          </Button>

          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="w-full max-w-[360px]"
            icon={<Home className="w-4 h-4" />}
          >
            <div className="flex flex-col items-start">
              <span>{t('offlineHomeLabel')}</span>
              <small className="text-xs text-toku-muted">{t('offlineHomeHint')}</small>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}

