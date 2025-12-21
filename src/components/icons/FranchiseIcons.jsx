import React from 'react';

export function KamenRiderIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cinto/Driver do Kamen Rider */}
      <rect x="4" y="10" width="16" height="4" rx="2" fill="url(#riderGrad)" stroke="currentColor" strokeWidth="1.5"/>
      {/* Centro do cinto */}
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.9"/>
      <circle cx="12" cy="12" r="1.5" fill="url(#riderGrad)"/>
      {/* Linhas laterais do cinto */}
      <rect x="4" y="9" width="2" height="6" rx="1" fill="currentColor" opacity="0.6"/>
      <rect x="18" y="9" width="2" height="6" rx="1" fill="currentColor" opacity="0.6"/>
      <defs>
        <linearGradient id="riderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7b5cff" />
          <stop offset="100%" stopColor="#00c0ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SuperSentaiIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Estrela de 5 pontas representando o time */}
      <path d="M12 2L14.5 8.5L21.5 9.5L16.5 14L18 21L12 17.5L6 21L7.5 14L2.5 9.5L9.5 8.5L12 2Z" fill="url(#sentaiGrad)" stroke="currentColor" strokeWidth="1.5"/>
      {/* Símbolo de equipe no centro */}
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2"/>
      <path d="M12 9L10 13H14L12 9Z" fill="currentColor" opacity="0.8"/>
      <defs>
        <linearGradient id="sentaiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4757" />
          <stop offset="100%" stopColor="#ffa502" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MetalHeroIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Capacete/armadura robótica */}
      <path d="M12 4C8 4 5 6 5 9V11C5 13 7 15 9 15H15C17 15 19 13 19 11V9C19 6 16 4 12 4Z" fill="url(#heroGrad)" stroke="currentColor" strokeWidth="1.5"/>
      {/* Visor */}
      <rect x="9" y="8" width="6" height="4" rx="1" fill="currentColor" opacity="0.3"/>
      <path d="M10 10H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Linhas de armadura */}
      <path d="M8 12H16M8 14H16M10 16H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <defs>
        <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5f27cd" />
          <stop offset="100%" stopColor="#00d2d3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function UltramanIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Estrela de 5 pontas (símbolo do Ultraman) */}
      <path d="M12 2L14.5 8.5L21.5 9.5L16.5 14L18 21L12 17.5L6 21L7.5 14L2.5 9.5L9.5 8.5L12 2Z" fill="url(#ultraGrad)" stroke="currentColor" strokeWidth="1.5"/>
      {/* Símbolo do Color Timer no centro */}
      <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.3"/>
      <circle cx="12" cy="12" r="1.5" fill="url(#ultraGrad)"/>
      {/* Linhas características do Ultraman */}
      <path d="M12 6L10 10L12 8L14 10L12 6Z" fill="currentColor" opacity="0.6"/>
      <defs>
        <linearGradient id="ultraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00c0ff" />
          <stop offset="100%" stopColor="#ffd700" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CybercopsIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Escudo/emblema tecnológico */}
      <path d="M12 2L4 6V10L12 14L20 10V6L12 2Z" fill="url(#cyberGrad)" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 14L4 18V22L12 18L20 22V18L12 14Z" fill="url(#cyberGrad)" stroke="currentColor" strokeWidth="1.5"/>
      {/* Circuito/linhas tecnológicas */}
      <circle cx="12" cy="8" r="1.5" fill="currentColor" opacity="0.8"/>
      <circle cx="12" cy="16" r="1.5" fill="currentColor" opacity="0.8"/>
      <path d="M8 8L12 10L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M8 16L12 18L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <defs>
        <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d2d3" />
          <stop offset="100%" stopColor="#5f27cd" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CharactersIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M3 21V19C3 16.7909 4.79086 15 7 15H11C13.2091 15 15 16.7909 15 19V21" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="17" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M14 21V19C14 17.3431 15.3431 16 17 16" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  );
}

export function GlossaryIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 19.5C4 18.6716 4.67157 18 5.5 18H20.5C21.3284 18 22 18.6716 22 19.5C22 20.3284 21.3284 21 20.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z" fill="currentColor"/>
      <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H20.5C21.3284 3 22 3.67157 22 4.5C22 5.32843 21.3284 6 20.5 6H5.5C4.67157 6 4 5.32843 4 4.5Z" fill="currentColor"/>
      <path d="M4 12C4 11.1716 4.67157 10.5 5.5 10.5H20.5C21.3284 10.5 22 11.1716 22 12C22 12.8284 21.3284 13.5 20.5 13.5H5.5C4.67157 13.5 4 12.8284 4 12Z" fill="currentColor"/>
    </svg>
  );
}

export function PublicationsIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 19.5C4 18.6716 4.67157 18 5.5 18H19.5C20.3284 18 21 18.6716 21 19.5C21 20.3284 20.3284 21 19.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z" fill="currentColor"/>
      <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H19.5C20.3284 3 21 3.67157 21 4.5C21 5.32843 20.3284 6 19.5 6H5.5C4.67157 6 4 5.32843 4 4.5Z" fill="currentColor"/>
      <path d="M4 9.5C4 8.67157 4.67157 8 5.5 8H19.5C20.3284 8 21 8.67157 21 9.5C21 10.3284 20.3284 11 19.5 11H5.5C4.67157 11 4 10.3284 4 9.5Z" fill="currentColor"/>
      <path d="M4 14.5C4 13.6716 4.67157 13 5.5 13H12.5C13.3284 13 14 13.6716 14 14.5C14 15.3284 13.3284 16 12.5 16H5.5C4.67157 16 4 15.3284 4 14.5Z" fill="currentColor"/>
    </svg>
  );
}

export function CollectiblesIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  );
}

export function getFranchiseIcon(franchise, className) {
  switch (franchise?.toLowerCase()) {
    case "kamen rider":
      return <KamenRiderIcon className={className} />;
    case "super sentai":
      return <SuperSentaiIcon className={className} />;
    case "metal hero":
      return <MetalHeroIcon className={className} />;
    case "ultraman":
      return <UltramanIcon className={className} />;
    case "cybercops":
      return <CybercopsIcon className={className} />;
    default:
      return null;
  }
}

