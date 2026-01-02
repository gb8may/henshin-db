import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// IDs dos seus anúncios AdMob
export const AD_UNITS = {
  banner: 'ca-app-pub-1315629990486612/7754850364',
  native: 'ca-app-pub-1315629990486612/3815605351',
};

// Verificar se está rodando em plataforma nativa
export function isNativePlatform() {
  return Capacitor.isNativePlatform();
}

// Inicializar AdMob
export async function initializeAdMob() {
  // Só inicializa se estiver em plataforma nativa (Android/iOS)
  if (!isNativePlatform()) {
    console.log('AdMob: Running on web, skipping initialization');
    return;
  }

  try {
    // No Android, não precisamos verificar trackingAuthorizationStatus
    // Isso pode causar problemas, então vamos sempre usar false
    let requestTrackingAuth = false;
    
    // Só tenta verificar trackingAuthorizationStatus se estiver no iOS
    if (Capacitor.getPlatform() === 'ios') {
      try {
        const { status } = await AdMob.trackingAuthorizationStatus();
        requestTrackingAuth = status.status === 'notDetermined';
      } catch (e) {
        // Ignora erros no iOS também
        console.log('AdMob: trackingAuthorizationStatus not available');
      }
    }
    
    await AdMob.initialize({
      requestTrackingAuthorization: requestTrackingAuth,
      testingDevices: [],
      initializeForTesting: false,
    });
    
    console.log('AdMob initialized successfully');
  } catch (error) {
    console.error('Error initializing AdMob:', error);
    // Não lança o erro para não quebrar o app
  }
}

// Banner Ad
export async function showBanner() {
  if (!isNativePlatform()) {
    return; // Não mostra anúncios na web
  }

  try {
    // Remove qualquer banner existente antes de criar um novo
    try {
      await AdMob.removeBanner();
      // Aguarda um tempo maior para garantir que o banner foi completamente removido
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (e) {
      // Ignora erro se não houver banner para remover
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Aguarda um pouco para garantir que a Activity esteja pronta
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await AdMob.showBanner({
      adId: AD_UNITS.banner,
      adSize: 'BANNER',
      position: 'BOTTOM_CENTER',
      margin: 60, // Margem para posicionar acima do rodapé (altura do rodapé ~50px + pequeno espaçamento)
      isTesting: false,
    });
    console.log('Banner ad shown with margin 150px');
  } catch (error) {
    console.error('Error showing banner:', error);
    // Não lança o erro para não quebrar o app
  }
}

export async function hideBanner() {
  if (!isNativePlatform()) {
    return;
  }

  try {
    await AdMob.hideBanner();
  } catch (error) {
    console.error('Error hiding banner:', error);
  }
}

export async function removeBanner() {
  if (!isNativePlatform()) {
    return;
  }

  try {
    await AdMob.removeBanner();
  } catch (error) {
    console.error('Error removing banner:', error);
  }
}

// Native Ad
// Nota: Native ads requerem implementação customizada no componente React
// Esta função prepara o anúncio nativo, mas você precisará renderizá-lo manualmente
export async function loadNativeAd() {
  if (!isNativePlatform()) {
    return null;
  }

  try {
    const result = await AdMob.prepareNativeAd({
      adId: AD_UNITS.native,
      isTesting: false,
    });
    console.log('Native ad loaded:', result);
    return result;
  } catch (error) {
    console.error('Error loading native ad:', error);
    return null;
  }
}

