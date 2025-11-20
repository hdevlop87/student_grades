import translations from '@/locales';
import { useState } from 'react';

const LANGUAGE_STORAGE_KEY = 'app_language';

// Helper functions for localStorage
const getStoredLanguage = () => {
   try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
   } catch (error) {
      console.error('Failed to get language from localStorage:', error);
      return 'en';
   }
};

const setStoredLanguage = (language) => {
   try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
   } catch (error) {
      console.error('Failed to save language to localStorage:', error);
   }
};

const getNestedValue = (obj, path) => {
   return path.split('.').reduce((current, key) => current?.[key], obj);
};

export const useTranslation = () => {
   const [language, setLanguageState] = useState(getStoredLanguage);

   const setLanguage = (newLang) => {
      setStoredLanguage(newLang);
      setLanguageState(newLang);
   };

   const t = (key, params = null) => {
      const langTranslations = translations[language] || translations['en'];
      let translation = getNestedValue(langTranslations, key) || key;

      if (params && typeof translation === 'string') {
         Object.entries(params).forEach(([param, value]) => {
            translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
         });
      }

      return translation;
   };

   return { t, language, setLanguage };
};