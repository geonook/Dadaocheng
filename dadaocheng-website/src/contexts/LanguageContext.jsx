import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const getInitialLanguage = () => {
  // Check localStorage first
  const saved = localStorage.getItem('dadaocheng-language');
  if (saved && (saved === 'zh' || saved === 'en')) {
    return saved;
  }
  
  // Check browser language
  const browserLang = navigator.language || navigator.userLanguage;
  return browserLang.startsWith('zh') ? 'zh' : 'en';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => getInitialLanguage());

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'zh' ? 'en' : 'zh';
      localStorage.setItem('dadaocheng-language', newLang);
      return newLang;
    });
  };

  // Update document lang attribute for accessibility
  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-TW' : 'en';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

