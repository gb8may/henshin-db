import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { FranchiseHub } from './pages/FranchiseHub';
import { CharactersPage } from './pages/CharactersPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { PublicationsPage } from './pages/PublicationsPage';
import { CollectiblesPage } from './pages/CollectiblesPage';
import { UsefulLinksPage } from './pages/UsefulLinksPage';
import { OfflinePage } from './pages/OfflinePage';
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
      const parts = location.pathname.split('/');
      if (parts.length === 3) {
        const franchise = decodeURIComponent(parts[2]);
        setSubtitle(formatFranchise(franchise));
      } else if (parts.length === 4) {
        const franchise = decodeURIComponent(parts[2]);
        const category = decodeURIComponent(parts[3]);
        setSubtitle(`${formatFranchise(franchise)} · ${t(category)}`);
      }
    } else if (location.pathname === '/useful-links') {
      setSubtitle(t('usefulLinks'));
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
          <Route path="/offline" element={<OfflinePage />} />
        </Routes>
      </main>
      <Footer />
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

