import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Bannière de notifications d'informations et d'alertes en direct
 * Récupère les notifications réelles depuis /api/notifications
 */
const NotificationBanner = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setNotifications(data);
          }
        }
      } catch (err) {
        console.error('Erreur chargement notifications', err);
      }
    };

    fetchNotifications();
  }, []);

  // Liste par défaut si le backend n'a pas encore répondu
  const activeNotifications = notifications.length > 0 ? notifications : [
    { id: 1, type: 'GOAL', message: t('notification_1'), priority: 'high' },
    { id: 2, type: 'INFO', message: t('notification_2'), priority: 'medium' },
    { id: 3, type: 'WEATHER', message: t('notification_3'), priority: 'low' },
  ];

  // Défilement automatique toutes les 8 secondes
  useEffect(() => {
    if (dismissed || activeNotifications.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeNotifications.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [dismissed, activeNotifications.length]);

  if (dismissed || activeNotifications.length === 0) {
    return null;
  }

  const currentNotif = activeNotifications[currentIndex % activeNotifications.length];

  const getTypeStyle = (type) => {
    switch (type) {
      case 'GOAL':
        return {
          border: 'border-l-emerald-500',
          bg: 'bg-emerald-50/90',
          text: 'text-emerald-950',
          badgeBg: 'bg-emerald-600 text-white',
          label: 'But',
        };
      case 'SECURITY':
        return {
          border: 'border-l-rose-500',
          bg: 'bg-rose-50/90',
          text: 'text-rose-950',
          badgeBg: 'bg-rose-600 text-white',
          label: 'Sécurité',
        };
      case 'WEATHER':
        return {
          border: 'border-l-amber-500',
          bg: 'bg-amber-50/90',
          text: 'text-amber-950',
          badgeBg: 'bg-amber-500 text-white',
          label: 'Météo',
        };
      default:
        return {
          border: 'border-l-blue-500',
          bg: 'bg-blue-50/90',
          text: 'text-blue-950',
          badgeBg: 'bg-blue-600 text-white',
          label: 'Info',
        };
    }
  };

  const style = getTypeStyle(currentNotif.type);

  return (
    <div className="w-full px-4 pt-3 pb-1">
      <div
        key={currentNotif.id}
        className={`w-full rounded-2xl border-l-4 ${style.border} ${style.bg} p-3.5 shadow-sm border border-gray-100 flex items-center justify-between gap-3 transition-all duration-500 ease-out animate-fade-in`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badgeBg}`}>
                {style.label}
              </span>
              <span className="text-[11px] text-gray-500 font-medium">
                {currentIndex + 1}/{activeNotifications.length}
              </span>
            </div>
            <p className={`text-xs sm:text-sm font-semibold ${style.text} leading-snug line-clamp-2`}>
              {currentNotif.message}
            </p>
          </div>
        </div>

        {/* Bouton de fermeture */}
        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-colors flex-shrink-0"
          aria-label="Fermer la notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;
