import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { CategoryButton } from '../components/Button';

const SECTIONS = [
  { key: 'actors', labelKey: 'usefulActors', hintKey: 'verifiedHint' },
  { key: 'community', labelKey: 'usefulCommunity', hintKey: 'usefulSearch' },
  { key: 'lives', labelKey: 'usefulLives', hintKey: 'usefulSearch' },
  { key: 'collectibles', labelKey: 'usefulCollectibles', hintKey: 'usefulSearch' },
];

export function UsefulLinksPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-full">
      <div className="px-3.5 py-3.5 pb-[90px] overflow-auto flex-1 -webkit-overflow-scrolling-touch">
        <div className="flex gap-2.5 items-center mb-3">
          <button
            onClick={() => navigate('/')}
            className="btn-ghost"
          >
            {t('back')}
          </button>
        </div>

        <div className="font-bold text-base leading-tight mb-2.5 px-0.5">
          {t('usefulLinks')}
        </div>
        <div className="text-toku-muted text-[13px] leading-tight mb-3 px-0.5">
          {t('usefulHint')}
        </div>

        <div className="grid gap-3 justify-items-center">
          {SECTIONS.map((section) => (
            <CategoryButton
              key={section.key}
              label={t(section.labelKey)}
              hint={t(section.hintKey)}
              onClick={() => navigate(`/useful-links/${section.key}`)}
              className="group hover:border-toku-rider-primary/50 transition-all"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

