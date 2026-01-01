import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob } from '@capacitor-community/admob';
import { loadNativeAd, AD_UNITS, isNativePlatform } from '../lib/admob';

/**
 * EXEMPLO DE COMPONENTE NATIVE AD
 * 
 * DIFERENÇA ENTRE BANNER E NATIVE:
 * 
 * BANNER AD:
 * - Renderizado automaticamente pelo plugin nativo
 * - Você só chama showBanner() e o plugin cuida de tudo
 * - Aparece como uma view nativa sobreposta
 * - Não pode customizar muito o design
 * 
 * NATIVE AD:
 * - Você recebe os DADOS do anúncio (título, descrição, imagem, etc.)
 * - Você precisa RENDERIZAR manualmente no React
 * - Pode customizar completamente o design para combinar com seu app
 * - Aparece como parte do conteúdo do app (misturado com seus cards)
 * - Mais trabalho, mas melhor experiência do usuário
 */

export function AdNativeExample() {
  const [adData, setAdData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isNativePlatform()) {
      return; // Não carrega anúncios na web
    }

    loadAd();
  }, []);

  const loadAd = async () => {
    setLoading(true);
    setError(null);

    try {
      // Carrega os dados do anúncio nativo
      const result = await loadNativeAd();
      
      if (result) {
        setAdData(result);
        console.log('Native ad data:', result);
      }
    } catch (err) {
      console.error('Error loading native ad:', err);
      setError('Falha ao carregar anúncio');
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = async () => {
    if (!adData) return;

    try {
      // Quando o usuário clica no anúncio, você precisa registrar o clique
      await AdMob.showNativeAd({
        adId: AD_UNITS.native,
        adUnitId: adData.adUnitId,
      });
    } catch (err) {
      console.error('Error showing native ad:', err);
    }
  };

  // Se não estiver em plataforma nativa, não mostra nada
  if (!isNativePlatform()) {
    return null;
  }

  // Se estiver carregando
  if (loading) {
    return (
      <div className="border border-toku-border bg-toku-panel rounded-card p-4">
        <div className="text-toku-muted text-sm">Carregando anúncio...</div>
      </div>
    );
  }

  // Se houver erro
  if (error) {
    return (
      <div className="border border-toku-border bg-toku-panel rounded-card p-4">
        <div className="text-toku-muted text-sm">{error}</div>
      </div>
    );
  }

  // Se não houver dados do anúncio
  if (!adData) {
    return null;
  }

  // Renderiza o anúncio nativo com design customizado
  return (
    <div 
      className="border border-toku-border bg-toku-panel rounded-card p-4 cursor-pointer hover:bg-toku-panel2 transition-colors"
      onClick={handleAdClick}
    >
      {/* Badge "Anúncio" */}
      <div className="text-[10px] text-toku-muted mb-2">Anúncio</div>

      <div className="flex gap-3">
        {/* Imagem do anúncio */}
        {adData.images && adData.images.length > 0 && (
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={adData.images[0].url} 
              alt={adData.headline || 'Anúncio'}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Título */}
          {adData.headline && (
            <div className="font-semibold text-sm text-toku-text mb-1 line-clamp-2">
              {adData.headline}
            </div>
          )}

          {/* Descrição */}
          {adData.body && (
            <div className="text-xs text-toku-muted mb-2 line-clamp-2">
              {adData.body}
            </div>
          )}

          {/* Call to Action (botão) */}
          {adData.callToAction && (
            <div className="inline-block px-3 py-1.5 bg-toku-rider-primary/20 border border-toku-rider-primary/50 rounded-lg text-xs text-toku-rider-primary font-medium">
              {adData.callToAction}
            </div>
          )}
        </div>
      </div>

      {/* Logo/Ícone do anunciante (se disponível) */}
      {adData.icon && (
        <div className="mt-3 flex items-center gap-2">
          <img 
            src={adData.icon.url} 
            alt="Advertiser"
            className="w-4 h-4 rounded"
          />
          {adData.advertiser && (
            <span className="text-[10px] text-toku-muted">{adData.advertiser}</span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * ESTRUTURA DOS DADOS DO NATIVE AD:
 * 
 * {
 *   adUnitId: string,        // ID do anúncio
 *   headline: string,         // Título do anúncio
 *   body: string,            // Descrição do anúncio
 *   callToAction: string,    // Texto do botão (ex: "Instalar", "Saiba mais")
 *   advertiser: string,      // Nome do anunciante
 *   icon: {                  // Ícone/logo do anunciante
 *     url: string,
 *     width: number,
 *     height: number
 *   },
 *   images: [                 // Imagens do anúncio
 *     {
 *       url: string,
 *       width: number,
 *       height: number
 *     }
 *   ],
 *   price: string,           // Preço (se aplicável)
 *   store: string,           // Loja (se aplicável)
 *   starRating: number,      // Avaliação (se aplicável)
 *   ... outros campos
 * }
 */

