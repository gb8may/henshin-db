import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { formatFranchise } from '../lib/i18n';
import { CategoryButton } from '../components/Button';
import {
  CharactersIcon,
  GlossaryIcon,
  PublicationsIcon,
  CollectiblesIcon,
} from '../components/icons/FranchiseIcons';

export function FranchiseHub() {
  const { franchise } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const categories = [
    {
      key: 'characters',
      label: t('hubCharactersLabel'),
      hint: t('hubCharactersHint'),
      icon: <CharactersIcon className="w-6 h-6" />,
      path: `/franchise/${franchise}/characters`,
    },
    {
      key: 'glossary',
      label: t('hubGlossaryLabel'),
      hint: t('hubGlossaryHint'),
      icon: <GlossaryIcon className="w-6 h-6" />,
      path: `/franchise/${franchise}/glossary`,
    },
    {
      key: 'publications',
      label: t('hubPublicationsLabel'),
      hint: t('hubPublicationsHint'),
      icon: <PublicationsIcon className="w-6 h-6" />,
      path: `/franchise/${franchise}/publications`,
    },
    {
      key: 'collectibles',
      label: t('hubCollectiblesLabel'),
      hint: t('hubCollectiblesHint'),
      icon: <CollectiblesIcon className="w-6 h-6" />,
      path: `/franchise/${franchise}/collectibles`,
    },
  ];

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
          {formatFranchise(franchise)}
        </div>

        <div className="grid gap-3 justify-items-center">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => navigate(cat.path)}
              className="w-full max-w-[360px] btn-primary group hover:border-toku-rider-primary/50 transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="flex-shrink-0 text-toku-rider-primary group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <span className="font-semibold text-[15px] leading-tight truncate w-full">
                    {cat.label}
                  </span>
                  <small className="text-xs text-toku-muted leading-tight">
                    {cat.hint}
                  </small>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


