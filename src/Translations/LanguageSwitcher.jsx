import React, { useContext } from 'react';
import { TranslationContext } from './Translation';

function LanguageSwitcher() {
    const { currentLanguage, setCurrentLanguage } = useContext(TranslationContext);

    const handleChangeLanguage = (language) => {
        setCurrentLanguage(language);
    };

    if (currentLanguage == 'en'){
        return (
            <div className='language-switcher'>
                <button onClick={() => handleChangeLanguage('cn')}>English → 中文</button>
            </div>
        )
    } else {
        return (
            <div className='language-switcher'>
                <button onClick={() => handleChangeLanguage('en')}>中文 → English</button>
            </div>
        );
    }
}

export default LanguageSwitcher;
