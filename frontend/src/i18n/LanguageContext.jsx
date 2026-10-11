import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, t as translateHelper, isRTL as checkIsRTL } from './translations';

export const LanguageContext = createContext({
  language: 'FR',
  setLanguage: () => {},
  t: (key, params) => key,
  isRTL: false,
});

/**
 * Fournisseur de contexte pour la gestion multilingue dans l'application
 */
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('stadevoice_lang');
    return saved && translations[saved] ? saved : 'FR';
  });

  const isRTL = checkIsRTL(language);

  useEffect(() => {
    try {
      localStorage.setItem('stadevoice_lang', language);
    } catch (e) {
      // Ignorer si localStorage n'est pas disponible
    }
  }, [language]);

  const t = (key, params) => {
    return translateHelper(key, language, params);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser facilement les traductions
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage doit être utilisé à l\'intérieur de LanguageProvider');
  }
  return context;
};

export default LanguageContext;
