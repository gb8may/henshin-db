import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { showBanner, removeBanner, initializeAdMob } from '../lib/admob';

export function AdBanner() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    // Inicializa AdMob e depois mostra o banner
    const initAndShow = async () => {
      try {
        // Garante que o AdMob está inicializado
        await initializeAdMob();
        
        // Aguarda um pouco mais para garantir que a view está pronta
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await showBanner();
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing and showing banner:', error);
      }
    };

    initAndShow();

    // Remove banner quando componente desmonta
    return () => {
      if (isReady) {
        removeBanner();
      }
    };
  }, []);

  // Componente não renderiza nada visualmente
  // O banner é renderizado nativamente pelo AdMob
  return null;
}




