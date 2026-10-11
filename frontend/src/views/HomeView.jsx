import React, { useState, useEffect } from 'react';
import { Trophy, Sun, MessageCircle, Search, MapPin, Activity, Wind, Droplets } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import MatchWidget from '../components/MatchWidget';
import NotificationBanner from '../components/NotificationBanner';

/**
 * Vue d'accueil principale de l'application StadeVoice
 * Comprend le sélecteur de langue, le widget de match, la météo dynamique et les statistiques en direct
 */
const HomeView = ({ onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const [weather, setWeather] = useState({ temperature: 28, condition: 'sunny', humidity: 45, wind: 12 });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Récupérer la météo en direct
    fetch('/api/weather')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setWeather(data);
      })
      .catch((err) => console.error('Erreur météo', err));

    // Récupérer les statistiques du stade
    fetch('/api/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setStats(data);
      })
      .catch((err) => console.error('Erreur stats', err));
  }, []);

  // Liste des langues disponibles avec drapeaux
  const languageOptions = [
    { code: 'FR', flag: '🇫🇷', label: 'FR' },
    { code: 'EN', flag: '🇬🇧', label: 'EN' },
    { code: 'ES', flag: '🇪🇸', label: 'ES' },
    { code: 'AR', flag: '🇲🇦', label: 'AR' },
    { code: 'PT', flag: '🇵🇹', label: 'PT' },
  ];

  // Formatage de la date en fonction de la locale
  const getLocaleDate = () => {
    const localeMap = {
      FR: 'fr-FR',
      EN: 'en-US',
      ES: 'es-ES',
      AR: 'ar-MA',
      PT: 'pt-PT',
    };
    return new Date().toLocaleDateString(localeMap[language] || 'fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="animate-fade-in pb-8">
      {/* Bannière de notifications en tout premier plan */}
      <NotificationBanner />

      {/* En-tête avec sélecteur de langue */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-6 rounded-b-3xl shadow-lg mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Trophy size={32} className="text-emerald-100" />
            <h1 className="text-3xl font-bold tracking-tight">{t('app_title')}</h1>
          </div>
        </div>

        <p className="text-emerald-100 font-medium text-lg mb-4">{t('world_cup')}</p>

        {/* Sélecteur de langue avec 5 pilules drapeaux */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mb-4 bg-emerald-800/40 p-1.5 rounded-2xl border border-emerald-500/30">
          {languageOptions.map((opt) => (
            <button
              key={opt.code}
              onClick={() => setLanguage(opt.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-8 ${
                language === opt.code
                  ? 'bg-white text-emerald-800 shadow-md scale-105'
                  : 'text-emerald-100 hover:bg-white/15'
              }`}
            >
              <span>{opt.flag}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-2">
          <p className="text-emerald-50 text-sm capitalize">{getLocaleDate()}</p>
          <h2 className="text-2xl font-bold mt-1">{t('welcome')}</h2>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Widget du match en direct (Maroc vs Espagne) */}
        <MatchWidget />

        {/* Météo en direct connectée à l'API */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">{t('weather_title')}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-800">{weather.temperature}°C</span>
              <span className="text-emerald-600 font-semibold text-sm">{t('weather_sunny')}</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Droplets size={12} className="text-blue-400" /> {weather.humidity}%
              </span>
              <span className="flex items-center gap-1">
                <Wind size={12} className="text-teal-400" /> {weather.wind} km/h
              </span>
            </div>
          </div>
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center">
            <Sun size={28} className="text-amber-500 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
        </div>

        {/* Statistiques d'affluence en direct du stade */}
        {stats && (
          <div className="bg-gradient-to-r from-emerald-950 to-gray-900 rounded-2xl p-4 text-white shadow-md border border-emerald-900/60">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={16} className="text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Stade en temps réel
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                <p className="text-xl font-black text-emerald-400">{stats.totalPois}</p>
                <p className="text-[10px] text-gray-300 font-medium mt-0.5">{t('stats_pois_available')}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                <p className="text-xl font-black text-emerald-300">{stats.poisByStatus?.fluid || 0}</p>
                <p className="text-[10px] text-emerald-300/80 font-medium mt-0.5">{t('status_fluid')}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                <p className="text-xl font-black text-amber-400">{stats.totalLostItems}</p>
                <p className="text-[10px] text-gray-300 font-medium mt-0.5">{t('stats_items_reported')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Boutons d'action rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('assistant')}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all min-h-24 hover:border-emerald-200"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
              <MessageCircle size={32} className="text-emerald-600" />
            </div>
            <span className="font-semibold text-gray-800 text-lg">{t('action_assistant')}</span>
          </button>

          <button
            onClick={() => onNavigate('services')}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all min-h-24 hover:border-blue-200"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <MapPin size={32} className="text-blue-500" />
            </div>
            <span className="font-semibold text-gray-800 text-lg">{t('action_services')}</span>
          </button>

          <button
            onClick={() => onNavigate('lostfound')}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all min-h-24 hover:border-purple-200"
          >
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
              <Search size={32} className="text-purple-500" />
            </div>
            <span className="font-semibold text-gray-800 text-lg">{t('action_lostfound')}</span>
          </button>
        </div>

        {/* Carte info */}
        <div className="bg-gray-800 text-white rounded-2xl p-6 shadow-md mt-4">
          <h3 className="font-semibold text-lg mb-2">{t('info_title')}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {t('info_desc')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
