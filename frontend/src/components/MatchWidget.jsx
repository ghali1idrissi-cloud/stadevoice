import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Composant Widget de Match en direct
 * Récupère les données en temps réel depuis l'API /api/match
 * Permet de déplier la chronologie des temps forts et buteurs
 */
const MatchWidget = () => {
  const { t } = useLanguage();
  const [matchData, setMatchData] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await fetch('/api/match');
        if (res.ok) {
          const data = await res.json();
          setMatchData(data);
        }
      } catch (err) {
        console.error('Erreur chargement données match', err);
      }
    };

    fetchMatch();
    // Rafraîchir toutes les 15 secondes pour le direct
    const interval = setInterval(fetchMatch, 15000);
    return () => clearInterval(interval);
  }, []);

  const home = matchData?.homeTeam || { name: t('team_morocco'), flag: '🇲🇦', score: 2 };
  const away = matchData?.awayTeam || { name: t('team_spain'), flag: '🇪🇸', score: 1 };
  const minute = matchData?.minute || 67;
  const events = matchData?.events || [
    { minute: 12, type: 'GOAL', team: 'MAR', player: 'A. Hakimi' },
    { minute: 34, type: 'GOAL', team: 'ESP', player: 'L. Yamal' },
    { minute: 61, type: 'GOAL', team: 'MAR', player: 'Y. En-Nesyri' },
  ];

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl p-5 shadow-lg border border-gray-700/50 relative overflow-hidden transition-all">
      {/* Halo lumineux d'ambiance en arrière-plan */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* En-tête du widget : Groupe & Statut en direct */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2.5">
        <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
          {matchData?.stage || t('match_group_a')}
        </span>
        
        <div className="flex items-center gap-2 bg-gray-800/80 px-2.5 py-1 rounded-full border border-gray-700">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-xs font-semibold text-gray-200">{minute}'</span>
          <span className="text-[11px] text-gray-400 font-medium">• {t('match_live')}</span>
        </div>
      </div>

      {/* Confrontation & Score */}
      <div className="flex items-center justify-between px-2 py-1">
        {/* Équipe Maroc */}
        <div className="flex flex-col items-center flex-1">
          <div className="text-4xl mb-1 filter drop-shadow-sm transform hover:scale-110 transition-transform select-none">
            {home.flag}
          </div>
          <span className="font-bold text-sm tracking-wide text-gray-100 text-center">
            {t('team_morocco')}
          </span>
        </div>

        {/* Score central */}
        <div className="flex items-center gap-3 px-4">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            {home.score}
          </span>
          <span className="text-lg text-gray-500 font-bold">-</span>
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            {away.score}
          </span>
        </div>

        {/* Équipe Espagne */}
        <div className="flex flex-col items-center flex-1">
          <div className="text-4xl mb-1 filter drop-shadow-sm transform hover:scale-110 transition-transform select-none">
            {away.flag}
          </div>
          <span className="font-bold text-sm tracking-wide text-gray-100 text-center">
            {t('team_spain')}
          </span>
        </div>
      </div>

      {/* Bouton pour dérouler la chronologie des buteurs */}
      <div className="mt-3 pt-2.5 border-t border-gray-800/80 flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-400 font-semibold transition-colors py-1"
        >
          <span>{t('match_events')} ({events.length})</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <span className="text-[11px] text-gray-500 flex items-center gap-1">
          <Trophy size={12} className="text-amber-400" />
          <span>Casablanca</span>
        </span>
      </div>

      {/* Chronologie des temps forts déroulante */}
      {expanded && (
        <div className="mt-3 pt-2 border-t border-gray-800/60 space-y-2 animate-fade-in">
          {events.map((evt, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-gray-800/40 border border-gray-700/40">
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400 font-bold">{evt.minute}'</span>
                <span className="text-sm">⚽</span>
                <span className="font-semibold text-gray-200">{evt.player}</span>
              </div>
              <span className="text-[11px] font-bold text-gray-400 bg-gray-700/60 px-2 py-0.5 rounded">
                {evt.team}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchWidget;
