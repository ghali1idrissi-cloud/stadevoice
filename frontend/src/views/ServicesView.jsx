import React, { useState, useEffect } from 'react';
import { Droplets, Coffee, Navigation, Stethoscope, List, Map } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import StadiumMap from '../components/StadiumMap';

const API_BASE = 'https://stadevoice-api.onrender.com';

/**
 * Vue des services et points d'intérêt (POIs) du stade
 * Affichage en temps réel des temps d'attente et du niveau d'affluence
 */
const ServicesView = () => {
  const { t } = useLanguage();
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('map'); // 'map' par défaut pour une immersion immédiate, ou 'list'

  // Définition des filtres avec libellés traduits dynamiquement
  const filters = [
    { id: 'ALL', label: t('filter_all') },
    { id: 'TOILET', label: t('filter_toilet') },
    { id: 'WATER', label: t('filter_water') },
    { id: 'FIRST_AID', label: t('filter_first_aid') },
    { id: 'EXIT', label: t('filter_exit') },
  ];

  useEffect(() => {
    const fetchPois = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/pois`);
        const data = await res.json();
        setPois(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des POIs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPois();
  }, []);

  const filteredPois = filter === 'ALL' ? pois : pois.filter((p) => p.category === filter);

  const getIconForCategory = (category) => {
    switch (category) {
      case 'WATER': return <Droplets size={24} className="text-blue-500" />;
      case 'TOILET': return <Droplets size={24} className="text-emerald-500" />;
      case 'FIRST_AID': return <Stethoscope size={24} className="text-red-500" />;
      case 'EXIT': return <Navigation size={24} className="text-orange-500" />;
      default: return <Coffee size={24} className="text-gray-500" />;
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'FLUID':
        return {
          color: 'bg-emerald-500',
          text: t('status_fluid'),
          textCol: 'text-emerald-700',
          bgCol: 'bg-emerald-50',
        };
      case 'BUSY':
        return {
          color: 'bg-orange-500',
          text: t('status_busy'),
          textCol: 'text-orange-700',
          bgCol: 'bg-orange-50',
        };
      case 'FULL':
        return {
          color: 'bg-red-500',
          text: t('status_full'),
          textCol: 'text-red-700',
          bgCol: 'bg-red-50',
        };
      default:
        return {
          color: 'bg-gray-400',
          text: t('status_unknown'),
          textCol: 'text-gray-700',
          bgCol: 'bg-gray-100',
        };
    }
  };

  return (
    <div className="animate-fade-in flex flex-col h-full bg-gray-50">
      <div className="bg-white pt-6 pb-4 px-4 shadow-sm z-10 sticky top-0 rounded-b-2xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{t('services_title')}</h1>
          
          {/* Bascule Vue Plan 2D vs Vue Liste */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Map size={15} />
              <span>{t('view_map')}</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <List size={15} />
              <span>{t('view_list')}</span>
            </button>
          </div>
        </div>
        
        {/* Filtres de catégories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`min-h-12 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shadow-sm active:scale-95 ${
                filter === f.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : viewMode === 'map' ? (
          /* Vue Plan 2D interactif */
          <StadiumMap pois={pois} filter={filter} />
        ) : filteredPois.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            {t('no_services_found')}
          </div>
        ) : (
          /* Vue Liste détaillée */
          <div className="space-y-4">
            {filteredPois.map((poi) => {
              const status = getStatusConfig(poi.status);
              return (
                <div
                  key={poi.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:border-emerald-200"
                >
                  <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                    {getIconForCategory(poi.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg leading-tight truncate">
                      {poi.name}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bgCol}`}>
                        <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                        <span className={`text-xs font-semibold ${status.textCol}`}>
                          {status.text}
                        </span>
                      </div>
                      {poi.waitTimeMinutes !== undefined && (
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                          {t('wait_time')}: ~{poi.waitTimeMinutes} {t('minutes_short')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesView;
