import React, { useEffect, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export function Modal({ isOpen, onClose, title, image, imageAlt, children, linkUrl }) {
  const { t } = useLanguage();
  const [hasImage, setHasImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (image) {
      setImageError(false);
      setHasImage(false);
      const img = new Image();
      img.onload = () => {
        setHasImage(true);
        setImageError(false);
      };
      img.onerror = () => {
        setHasImage(false);
        setImageError(true);
      };
      img.src = image;
    } else {
      setHasImage(false);
      setImageError(false);
    }
  }, [image]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[520px] max-h-[84vh] overflow-auto rounded-[18px] border border-toku-border bg-[rgba(15,18,26,0.92)] shadow-toku p-3.5 animate-slide-up">
        <div className="flex justify-between gap-2.5 items-center mb-2.5">
          <div className="font-extrabold text-[15px] leading-tight">{title || t('modalDetails')}</div>
          <button
            onClick={onClose}
            className="border border-toku-border bg-[rgba(255,255,255,0.06)] text-toku-text rounded-xl px-2.5 py-2 cursor-pointer text-[13px] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {hasImage && image && !imageError && (
          <div className="w-full aspect-[4/5] rounded-card border border-toku-border bg-[rgba(255,255,255,0.05)] overflow-hidden mb-2.5 flex items-center justify-center p-2.5">
            <img
              src={image}
              alt={imageAlt || ''}
              className="w-full h-full object-contain block"
              onError={() => {
                setImageError(true);
                setHasImage(false);
              }}
            />
          </div>
        )}

        <div className="mb-2.5">{children}</div>

        {linkUrl && (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full mt-2.5 px-3 py-3 rounded-button border border-toku-border bg-[rgba(255,255,255,0.06)] text-toku-text no-underline font-bold hover:bg-[rgba(255,255,255,0.1)] transition-colors gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            {t('modalOpenLink')}
          </a>
        )}
      </div>
    </div>
  );
}

export function SpecCard({ rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="text-toku-muted px-2 py-2">
        Sem detalhes.
      </div>
    );
  }

  return (
    <div className="spec-card">
      {rows.map((row, idx) => (
        <div key={idx} className="spec-row">
          <div className="spec-key">{row.key}</div>
          <div className="spec-val">{row.value}</div>
        </div>
      ))}
    </div>
  );
}

