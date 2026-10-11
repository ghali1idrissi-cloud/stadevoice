import React, { useState } from 'react';
import { ShieldAlert, Phone, PhoneCall, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Bouton d'urgence SOS flottant et modal de confirmation
 * Accessible sur toutes les vues de l'application
 */
const SOSButton = () => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useLanguage();

  const handleCall = () => {
    // Simule ou déclenche l'appel d'urgence (tel:112)
    window.location.href = `tel:${t('sos_number')}`;
  };

  return (
    <>
      {/* Bouton SOS flottant */}
      <button
        onClick={() => setShowModal(true)}
        aria-label={t('sos_button')}
        className="fixed bottom-20 right-5 z-40 w-12 h-12 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 transition-all border-2 border-white/80"
      >
        <ShieldAlert size={24} className="animate-pulse" />
      </button>

      {/* Modal de confirmation d'urgence */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
            {/* En-tête avec dégradé rouge */}
            <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-6 text-center relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label={t('sos_cancel')}
              >
                <X size={18} />
              </button>
              
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm shadow-inner">
                <ShieldAlert size={34} className="text-white" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">{t('sos_title')}</h3>
            </div>

            {/* Corps du modal */}
            <div className="p-6 text-center">
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                {t('sos_confirm')}
              </h4>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {t('sos_desc')}
              </p>

              {/* Numéro d'urgence affiché */}
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl py-3 px-4 mb-6 flex items-center justify-center gap-3">
                <PhoneCall size={20} className="text-red-600" />
                <span className="text-2xl font-black tracking-wider font-mono">
                  {t('sos_number')}
                </span>
              </div>

              {/* Boutons d'action */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full min-h-12 py-3 px-4 rounded-xl border border-gray-300 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all text-sm"
                >
                  {t('sos_cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleCall}
                  className="w-full min-h-12 py-3 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30"
                >
                  <Phone size={18} />
                  <span>{t('sos_call')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
