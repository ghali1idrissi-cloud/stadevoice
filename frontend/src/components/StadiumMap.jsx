import React, { useState } from 'react';
import { 
  Droplets, 
  Coffee, 
  Navigation, 
  Stethoscope, 
  X, 
  MapPin, 
  ArrowUpRight,
  Compass,
  Footprints
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Coordonnées normalisées relatives (x: 0..100, y: 0..100) pour positionner les POIs
 * sur le plan 2D du stade selon leur nom ou type
 */
const POI_COORDINATES = {
  'Toilettes Tribune Nord': { x: 50, y: 16 },
  'Toilettes Tribune Sud': { x: 50, y: 84 },
  'Buvette Porte C': { x: 86, y: 50 },
  'Point Eau Secteur A': { x: 22, y: 24 },
  'Sortie Porte D': { x: 80, y: 78 },
  'Sortie Porte E': { x: 20, y: 78 },
  'Infirmerie Principale': { x: 14, y: 50 },
  'Poste de Secours Secteur B': { x: 78, y: 24 },
};

/**
 * Plan interactif 2D du stade ("Grand Stade de Casablanca - Coupe du Monde 2030")
 * Permet aux spectateurs de visualiser et localiser les services avec statut d'affluence
 */
const StadiumMap = ({ pois = [], filter = 'ALL' }) => {
  const { t } = useLanguage();
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [showDirections, setShowDirections] = useState(false);

  // Filtrer les POIs selon la catégorie sélectionnée
  const filteredPois = filter === 'ALL' ? pois : pois.filter((p) => p.category === filter);

  const getIconForCategory = (category, size = 18) => {
    switch (category) {
      case 'WATER': return <Droplets size={size} className="text-blue-500" />;
      case 'TOILET': return <Droplets size={size} className="text-emerald-500" />;
      case 'FIRST_AID': return <Stethoscope size={size} className="text-red-500" />;
      case 'EXIT': return <Navigation size={size} className="text-orange-500" />;
      default: return <Coffee size={size} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'FLUID': return { bg: 'bg-emerald-500', ping: 'bg-emerald-400', ring: 'ring-emerald-400/50' };
      case 'BUSY': return { bg: 'bg-orange-500', ping: 'bg-orange-400', ring: 'ring-orange-400/50' };
      case 'FULL': return { bg: 'bg-red-500', ping: 'bg-red-400', ring: 'ring-red-400/50' };
      default: return { bg: 'bg-gray-400', ping: 'bg-gray-300', ring: 'ring-gray-300/50' };
    }
  };

  return (
    <div className="flex flex-col h-full relative select-none">
      {/* Légende rapide en haut */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900 text-white text-[11px] rounded-xl mx-2 mb-3 shadow-sm border border-gray-800">
        <div className="flex items-center gap-1.5">
          <Compass size={14} className="text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span className="font-semibold text-gray-200">Grand Stade de Casablanca</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            {t('status_fluid')}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
            {t('status_busy')}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
            {t('status_full')}
          </span>
        </div>
      </div>

      {/* Carte SVG Interactive */}
      <div className="relative w-full aspect-[4/3] max-h-[380px] bg-slate-950 rounded-2xl p-2 border border-gray-800 shadow-inner overflow-hidden flex items-center justify-center">
        {/* Grille de fond subtile */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />

        <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md">
          {/* Anneau extérieur du Stade (Tribunes hautes) */}
          <rect
            x="20"
            y="20"
            width="360"
            height="260"
            rx="70"
            ry="70"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="3"
          />

          {/* Anneau intermédiaire (Concourse / coursive de circulation) */}
          <rect
            x="45"
            y="40"
            width="310"
            height="220"
            rx="50"
            ry="50"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          {/* Anneau intérieur (Tribunes basses) */}
          <rect
            x="75"
            y="65"
            width="250"
            height="170"
            rx="35"
            ry="35"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="2"
          />

          {/* Piste athlétique rouge sombre */}
          <rect
            x="95"
            y="80"
            width="210"
            height="140"
            rx="20"
            ry="20"
            fill="#7f1d1d"
            opacity="0.3"
          />

          {/* Pelouse de Football en gazon vert émeraude */}
          <rect
            x="110"
            y="90"
            width="180"
            height="120"
            rx="8"
            ry="8"
            fill="#065f46"
            stroke="#10b981"
            strokeWidth="2"
          />

          {/* Lignes du terrain de football */}
          {/* Ligne médiane */}
          <line x1="200" y1="90" x2="200" y2="210" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.8" />
          {/* Cercle central */}
          <circle cx="200" cy="150" r="24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.8" />
          <circle cx="200" cy="150" r="2.5" fill="#34d399" />
          {/* Surfaces de réparation */}
          <rect x="110" y="115" width="28" height="70" fill="none" stroke="#34d399" strokeWidth="1.2" strokeOpacity="0.7" />
          <rect x="262" y="115" width="28" height="70" fill="none" stroke="#34d399" strokeWidth="1.2" strokeOpacity="0.7" />
          {/* Cages de but */}
          <rect x="105" y="135" width="5" height="30" fill="#ffffff" opacity="0.9" />
          <rect x="290" y="135" width="5" height="30" fill="#ffffff" opacity="0.9" />

          {/* Libellés des Tribunes */}
          <text x="200" y="36" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="2">
            ▲ {t('stadium_north').toUpperCase()} (A-B)
          </text>
          <text x="200" y="274" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="2">
            ▼ {t('stadium_south').toUpperCase()} (D-E)
          </text>
          <text x="32" y="155" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 32 155)" letterSpacing="2">
            ◄ {t('stadium_west').toUpperCase()}
          </text>
          <text x="368" y="155" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(90 368 155)" letterSpacing="2">
            ► {t('stadium_east').toUpperCase()}
          </text>

          {/* Marqueurs des Portes d'accès principales */}
          <circle cx="90" cy="22" r="5" fill="#38bdf8" />
          <text x="90" y="14" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">Porte A</text>

          <circle cx="310" cy="22" r="5" fill="#38bdf8" />
          <text x="310" y="14" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">Porte B</text>

          <circle cx="378" cy="150" r="5" fill="#38bdf8" />
          <text x="378" y="138" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">Porte C</text>

          <circle cx="310" cy="278" r="5" fill="#38bdf8" />
          <text x="310" y="292" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">Porte D</text>

          <circle cx="90" cy="278" r="5" fill="#38bdf8" />
          <text x="90" y="292" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">Porte E</text>
        </svg>

        {/* Pins / Marqueurs interactifs pour chaque POI */}
        {filteredPois.map((poi) => {
          const coords = POI_COORDINATES[poi.name] || { x: 50, y: 50 };
          const statusStyle = getStatusColor(poi.status);
          const isSelected = selectedPoi?.id === poi.id;

          return (
            <button
              key={poi.id}
              onClick={() => {
                setSelectedPoi(poi);
                setShowDirections(false);
              }}
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute group z-20 transition-all duration-300 focus:outline-none ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-115'
              }`}
              title={poi.name}
            >
              <div className="relative flex items-center justify-center">
                {/* Halo d'affluence pulsant */}
                <span className={`animate-ping absolute h-8 w-8 rounded-full ${statusStyle.ping} opacity-70`}></span>
                
                {/* Bulle du Pin */}
                <div 
                  className={`w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-white ring-2 ${statusStyle.ring} ${
                    isSelected ? 'ring-4 ring-emerald-400' : ''
                  }`}
                >
                  {getIconForCategory(poi.category, 18)}
                </div>

                {/* Petite pastille de statut sous forme de badge */}
                <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full ${statusStyle.bg} border-2 border-white shadow-sm`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Fiche d'information détaillée du POI sélectionné (Bottom Card) */}
      {selectedPoi && (
        <div className="mt-3 p-4 bg-white rounded-2xl shadow-md border border-emerald-100 animate-fade-in relative">
          <button
            onClick={() => setSelectedPoi(null)}
            className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
              {getIconForCategory(selectedPoi.category, 24)}
            </div>

            <div className="flex-1 min-w-0 pr-6">
              <h4 className="font-bold text-gray-900 text-base leading-tight">
                {selectedPoi.name}
              </h4>

              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  selectedPoi.status === 'FLUID' ? 'bg-emerald-100 text-emerald-800' :
                  selectedPoi.status === 'BUSY' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    selectedPoi.status === 'FLUID' ? 'bg-emerald-500' :
                    selectedPoi.status === 'BUSY' ? 'bg-orange-500' : 'bg-red-500'
                  }`} />
                  {t(`status_${selectedPoi.status.toLowerCase()}`)}
                </span>

                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  ~{selectedPoi.waitTimeMinutes} {t('minutes_short')} {t('wait_time').toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Guidage / Itinéraire indicatif */}
          <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => setShowDirections(!showDirections)}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 py-2 px-3.5 rounded-xl transition-all"
            >
              <Footprints size={15} />
              <span>{showDirections ? 'Masquer l\'itinéraire' : 'Comment m\'y rendre ?'}</span>
            </button>

            <span className="text-[11px] text-gray-400 font-medium">
              Secteur direct
            </span>
          </div>

          {showDirections && (
            <div className="mt-2.5 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-950 animate-fade-in flex items-center gap-2">
              <ArrowUpRight size={16} className="text-emerald-600 flex-shrink-0" />
              <span>
                Suivez la signalétique verte vers la <strong>{selectedPoi.name}</strong>. Accès sans escalier disponible par la rampe principale.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Guide utilisateur si aucun POI n'est sélectionné */}
      {!selectedPoi && (
        <div className="mt-3 p-3 bg-emerald-50/60 border border-emerald-100/80 rounded-xl text-center text-xs text-emerald-800 flex items-center justify-center gap-2">
          <MapPin size={16} className="text-emerald-600" />
          <span>Touchez un point sur le plan pour voir son affluence et son itinéraire</span>
        </div>
      )}
    </div>
  );
};

export default StadiumMap;
