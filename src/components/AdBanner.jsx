import React, { useEffect } from 'react';
import { showBanner, removeBanner } from '../lib/admob';

export function AdBanner() {
  useEffect(() => {
    // Mostra banner quando componente monta
    showBanner();

    // Remove banner quando componente desmonta
    return () => {
      removeBanner();
    };
  }, []);

  // Componente não renderiza nada visualmente
  // O banner é renderizado nativamente pelo AdMob
  return null;
}


