import React, { useState } from 'react';
import BottomNavBar from './components/BottomNavBar';
import HomeView from './views/HomeView';
import AssistantView from './views/AssistantView';
import ServicesView from './views/ServicesView';
import LostFoundView from './views/LostFoundView';
import SOSButton from './components/SOSButton';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

/**
 * Composant principal de l'application enveloppé avec le contexte i18n
 */
function MainLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const { isRTL } = useLanguage();

  // Rendu de la vue active en fonction de l'onglet
  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView onNavigate={setActiveTab} />;
      case 'assistant':
        return <AssistantView />;
      case 'services':
        return <ServicesView />;
      case 'lostfound':
        return <LostFoundView />;
      default:
        return <HomeView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-gray-50 flex flex-col font-sans transition-all duration-200"
    >
      <main className="flex-1 overflow-y-auto pb-20 no-scrollbar relative">
        {renderView()}
      </main>

      {/* Bouton SOS visible sur l'ensemble des vues */}
      <SOSButton />

      {/* Barre de navigation inférieure */}
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <MainLayout />
    </LanguageProvider>
  );
}

export default App;
