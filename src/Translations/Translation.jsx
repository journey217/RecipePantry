import React, { createContext, useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import enTranslations from "./en.json";
import cnTranslations from "./cn.json";

const TranslationContext = createContext();

const TranslationProvider = ({ children }) => {
  const [translations, setTranslations] = useState({});
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Load translations based on the current language
        const data =
          currentLanguage === "en" ? enTranslations :
          currentLanguage === "cn" ? cnTranslations :
          {};
        setTranslations(data);
        setIsLoading(false); // Set loading to false after translations are loaded
      } catch (error) {
        console.error(error);
        setIsLoading(false); // Set loading to false in case of error
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  if (isLoading) {
    return <div>Loading translations...</div>; // Display a loading indicator while translations are loading
  }

  return (
    <TranslationContext.Provider
      value={{ translations, currentLanguage, setCurrentLanguage }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export { TranslationContext, TranslationProvider };
