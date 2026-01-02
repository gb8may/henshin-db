import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Encontra o elemento scrollável (geralmente o main ou um div com overflow-auto)
  const findScrollableElement = () => {
    // Tenta encontrar o elemento main primeiro
    const main = document.querySelector('main');
    if (main) {
      const scrollable = main.querySelector('[class*="overflow-auto"], [class*="overflow-y-auto"]');
      if (scrollable) {
        return scrollable;
      }
      // Se não encontrar, verifica se o próprio main é scrollável
      const mainStyle = window.getComputedStyle(main);
      if (mainStyle.overflow === 'auto' || mainStyle.overflowY === 'auto' || mainStyle.overflow === 'scroll' || mainStyle.overflowY === 'scroll') {
        return main;
      }
    }
    
    // Fallback: procura por qualquer elemento com overflow-auto
    const scrollables = document.querySelectorAll('[class*="overflow-auto"], [class*="overflow-y-auto"]');
    if (scrollables.length > 0) {
      return scrollables[0];
    }
    
    // Último fallback: window
    return window;
  };

  useEffect(() => {
    // Reseta a visibilidade quando a rota muda
    setIsVisible(false);

    const handleScroll = () => {
      const scrollable = findScrollableElement();
      
      if (!scrollable) {
        setIsVisible(false);
        return;
      }

      let scrollTop = 0;
      
      if (scrollable === window) {
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      } else {
        scrollTop = scrollable.scrollTop;
      }

      // Mostra o botão se o scroll estiver mais de 300px do topo
      setIsVisible(scrollTop > 300);
    };

    // Aguarda um pouco para garantir que o DOM está atualizado após mudança de rota
    const timeoutId = setTimeout(() => {
      const scrollable = findScrollableElement();
      
      if (scrollable) {
        scrollable.addEventListener('scroll', handleScroll, { passive: true });
        // Verifica a posição inicial
        handleScroll();
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const scrollable = findScrollableElement();
      if (scrollable) {
        scrollable.removeEventListener('scroll', handleScroll);
      }
    };
  }, [location.pathname]);

  const scrollToTop = () => {
    const scrollable = findScrollableElement();
    
    if (scrollable) {
      if (scrollable === window) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        scrollable.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed right-3 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(0,0,0,0.7)] backdrop-blur-md border border-toku-border text-toku-text hover:bg-[rgba(0,0,0,0.85)] active:scale-95 transition-all duration-200 shadow-lg"
      style={{
        bottom: 'calc(45px + 50px + 12px)', // Banner margin (45px) + banner height (~50px) + spacing (12px)
      }}
      aria-label="Voltar ao topo"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}

