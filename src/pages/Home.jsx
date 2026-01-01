import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { CategoryButton } from '../components/Button';
import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const FRANCHISES = [
  { key: 'kamen rider', label: 'Kamen Rider', color: 'rider' },
  { key: 'super sentai', label: 'Super Sentai', color: 'sentai' },
  { key: 'metal hero', label: 'Metal Hero', color: 'hero' },
  { key: 'ultraman', label: 'Ultraman', color: 'ultraman' },
  { key: 'cybercops', label: 'Cybercops', color: 'cyber' },
];

export function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-full">
      <div className="px-3.5 py-3.5 pb-[180px] overflow-auto flex-1 -webkit-overflow-scrolling-touch">
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
              icon={<Globe className="w-6 h-6" />}
              className="group hover:border-toku-rider-primary/50 transition-all"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

