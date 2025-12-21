import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { VisitCounter } from './components/VisitCounter';
import { Home } from './pages/Home';
import { FranchiseHub } from './pages/FranchiseHub';
import { CharactersPage } from './pages/CharactersPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { PublicationsPage } from './pages/PublicationsPage';
import { CollectiblesPage } from './pages/CollectiblesPage';
import { UsefulLinksPage } from './pages/UsefulLinksPage';
import { UsefulLinksListPage } from './pages/UsefulLinksListPage';
import { AdminPage } from './pages/AdminPage';
import { OfflinePage } from './pages/OfflinePage';
import { StatsPage } from './pages/StatsPage';
import { useLanguage } from './hooks/useLanguage';
import { supabase } from './lib/supabase';
import { formatFranchise } from './lib/i18n';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [connectionStatus, setConnectionStatus] = useState('offline');
  const [subtitle, setSubtitle] = useState('');

  useEffect(() => {
    // Update subtitle based on route
    if (location.pathname === '/') {
      setSubtitle(t('home'));
    } else if (location.pathname.startsWith('/franchise/')) {
      // Decode the entire pathname first, then split
      const decodedPath = decodeURIComponent(location.pathname);
      const parts = decodedPath.split('/').filter(p => p);
      
      if (parts.length >= 2 && parts[0] === 'franchise') {
        const franchise = parts[1];
        if (parts.length === 2) {
          // Franchise hub page
          setSubtitle(formatFranchise(franchise));
        } else if (parts.length === 3) {
          // Category page
          const category = parts[2];
          setSubtitle(`${formatFranchise(franchise)} · ${t(category)}`);
        }
      }
    } else if (location.pathname === '/useful-links') {
      setSubtitle(t('usefulLinks'));
    } else if (location.pathname.startsWith('/useful-links/')) {
      const decodedPath = decodeURIComponent(location.pathname);
      const parts = decodedPath.split('/').filter(p => p);
      if (parts.length === 2 && parts[0] === 'useful-links') {
        const category = parts[1];
        const categoryLabel = category === 'community' ? t('usefulCommunity') :
                             category === 'actors' ? t('usefulActors') :
                             category === 'lives' ? t('usefulLives') :
                             category === 'collectibles' ? t('usefulCollectibles') :
                             category;
        setSubtitle(categoryLabel);
      } else {
        setSubtitle(t('usefulLinks'));
      }
    } else {
      setSubtitle('');
    }
  }, [location, t]);

  useEffect(() => {
    // Check connection status
    const checkConnection = async () => {
      if (!navigator.onLine) {
        setConnectionStatus('offline');
        return;
      }

      try {
        const { error } = await supabase.from('characters').select('id').limit(1);
        if (error) {
          setConnectionStatus('error');
        } else {
          setConnectionStatus('online');
        }
      } catch {
        setConnectionStatus('offline');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30s

    const handleOnline = () => checkConnection();
    const handleOffline = () => setConnectionStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <Header subtitle={subtitle} connectionStatus={connectionStatus} />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/franchise/:franchise" element={<FranchiseHub />} />
          <Route path="/franchise/:franchise/characters" element={<CharactersPage />} />
          <Route path="/franchise/:franchise/glossary" element={<GlossaryPage />} />
          <Route path="/franchise/:franchise/publications" element={<PublicationsPage />} />
          <Route path="/franchise/:franchise/collectibles" element={<CollectiblesPage />} />
          <Route path="/useful-links" element={<UsefulLinksPage />} />
          <Route path="/useful-links/:category" element={<UsefulLinksListPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/offline" element={<OfflinePage />} />
        </Routes>
      </main>
      <Footer />
      <VisitCounter />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

