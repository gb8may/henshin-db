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
        // Aguarda mais tempo para garantir que a Activity e WebView estão completamente prontas
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Garante que o AdMob está inicializado
        await initializeAdMob();
        
        // Aguarda mais um pouco após inicialização
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        await showBanner();
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing and showing banner:', error);
        // Não propaga o erro para não quebrar o app
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




