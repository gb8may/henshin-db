import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { MapPin, ExternalLink } from 'lucide-react';

// Link do mapa público do Google Maps
const TOKUMAP_URL = 'https://www.google.com/maps/d/u/2/edit?mid=1gy8DvVgiHzYwxHVFMWTCaonYP3lfHls&usp=sharing';
// noprof=1 remove informações do autor/perfil do mapa
const TOKUMAP_EMBED_URL = 'https://www.google.com/maps/d/u/2/embed?mid=1gy8DvVgiHzYwxHVFMWTCaonYP3lfHls&ehbc=2E312F&noprof=1';

export function TokumapPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleOpenMap = () => {
    window.open(TOKUMAP_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3.5 py-3.5 pb-[180px] overflow-auto flex-1 -webkit-overflow-scrolling-touch">
        <div className="flex gap-2.5 items-center mb-3">
          <button
            onClick={() => navigate('/useful-links')}
            className="btn-ghost"
          >
            {t('back')}
          </button>
        </div>

        <div className="font-bold text-base leading-tight mb-2.5 px-0.5">
          {t('usefulTokumap')}
        </div>
        <div className="text-toku-muted text-[13px] leading-tight mb-4 px-0.5">
          {t('usefulTokumapHint')}
          <div className="text-[11px] italic mt-1.5 opacity-80">
            {t('usefulTokumapCredit')}
          </div>
        </div>

        {/* Preview do mapa */}
        <div className="card mb-3 p-0 overflow-hidden">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={TOKUMAP_EMBED_URL}
              className="absolute top-0 left-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('usefulTokumap')}
            />
          </div>
        </div>

        {/* Botão para abrir no Google Maps */}
        <button
          onClick={handleOpenMap}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-button border border-toku-border bg-[rgba(255,255,255,0.06)] text-toku-text font-bold hover:bg-[rgba(255,255,255,0.1)] transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          {t('modalOpenLink')}
        </button>
      </div>
    </div>
  );
}

