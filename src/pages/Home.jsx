import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { CategoryButton } from '../components/Button';
import {
  KamenRiderIcon,
  SuperSentaiIcon,
  MetalHeroIcon,
  UltramanIcon,
  CybercopsIcon,
} from '../components/icons/FranchiseIcons';
import { Link } from 'react-router-dom';

const FRANCHISES = [
  { key: 'kamen rider', label: 'Kamen Rider', icon: <KamenRiderIcon className="w-8 h-8" />, color: 'rider' },
  { key: 'super sentai', label: 'Super Sentai', icon: <SuperSentaiIcon className="w-8 h-8" />, color: 'sentai' },
  { key: 'metal hero', label: 'Metal Hero', icon: <MetalHeroIcon className="w-8 h-8" />, color: 'hero' },
  { key: 'ultraman', label: 'Ultraman', icon: <UltramanIcon className="w-8 h-8" />, color: 'ultraman' },
  { key: 'cybercops', label: 'Cybercops', icon: <CybercopsIcon className="w-8 h-8" />, color: 'cyber' },
];

export function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-full">
      <div className="px-3.5 py-3.5 pb-[90px] overflow-auto flex-1 -webkit-overflow-scrolling-touch">
        <div className="font-bold text-base leading-tight mb-2.5 px-0.5">
          {t('themes')}
        </div>
        <div className="text-toku-muted text-[13px] leading-tight mb-3 px-0.5">
          {t('chooseTheme')}
        </div>

        <div className="grid gap-3 justify-items-center">
          {FRANCHISES.map((franchise) => (
            <Link
              key={franchise.key}
              to={`/franchise/${franchise.key}`}
              className="w-full max-w-[360px]"
            >
              <CategoryButton
                label={franchise.label}
                icon={franchise.icon}
                className="group hover:border-toku-rider-primary/50 transition-all"
              />
            </Link>
          ))}

          <Link
            to="/useful-links"
            className="w-full max-w-[360px]"
          >
            <CategoryButton
              label={t('usefulLinks')}
              hint={t('usefulHint')}
              className="group hover:border-toku-rider-primary/50 transition-all"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

