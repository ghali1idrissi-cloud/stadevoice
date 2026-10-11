import React from 'react';
import { Home, MessageCircle, MapPin, Search } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Barre de navigation mobile inférieure avec labels traduits
 */
const BottomNavBar = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'home', icon: Home, label: t('nav_home') },
    { id: 'assistant', icon: MessageCircle, label: t('nav_assistant') },
    { id: 'services', icon: MapPin, label: t('nav_services') },
    { id: 'lostfound', icon: Search, label: t('nav_lostfound') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] rounded-t-2xl px-4 py-2 pb-safe z-30">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-14 min-h-12 px-2 transition-colors duration-200 active:scale-95 ${
                isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={24} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
              <span className="text-[10px] mt-1 font-medium truncate max-w-[70px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavBar;
