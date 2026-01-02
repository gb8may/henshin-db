import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { showBanner, removeBanner, initializeAdMob } from '../lib/admob';

export function AdBanner() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      console.log('AdBanner: Not native platform, skipping');
      return;
    }

    console.log('AdBanner: Starting initialization...');
    console.log('AdBanner: Platform:', Capacitor.getPlatform());

    // Inicializa AdMob e depois mostra o banner
    const initAndShow = async () => {
      try {
        console.log('AdBanner: Waiting 2s for Activity/WebView to be ready...');
        // Aguarda mais tempo para garantir que a Activity e WebView estão completamente prontas
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('AdBanner: Initializing AdMob...');
        // Garante que o AdMob está inicializado
        await initializeAdMob();
        console.log('AdBanner: AdMob initialized');
        
        console.log('AdBanner: Waiting 1.5s after initialization...');
        // Aguarda mais um pouco após inicialização
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('AdBanner: Showing banner...');
        await showBanner();
        console.log('AdBanner: Banner shown successfully');
        setIsReady(true);
      } catch (error) {
        console.error('AdBanner: Error initializing and showing banner:', error);
        console.error('AdBanner: Error details:', JSON.stringify(error, null, 2));
        // Não propaga o erro para não quebrar o app
      }
    };

    initAndShow();

    // Remove banner quando componente desmonta
    return () => {
      console.log('AdBanner: Component unmounting');
      removeBanner().catch(err => {
        console.log('AdBanner: Error removing banner on unmount:', err);
      });
    };
  }, []);

  // Componente não renderiza nada visualmente
  // O banner é renderizado nativamente pelo AdMob
  return null;
}




