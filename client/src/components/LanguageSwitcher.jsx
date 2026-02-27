import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    
    const languages = [
        { code: 'en', name: 'English', native: 'English' },
        { code: 'mr', name: 'Marathi', native: 'मराठी' },
        { code: 'hi', name: 'Hindi', native: 'हिन्दी' }
    ];

    useEffect(() => {
        const savedLang = localStorage.getItem('language') || 'en';
        i18n.changeLanguage(savedLang);
        setCurrentLanguage(savedLang);
    }, [i18n]);

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('language', langCode);
        setCurrentLanguage(langCode);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const getCurrentLanguage = () => {
        return languages.find(lang => lang.code === currentLanguage) || languages[0];
    };

    return (
        <div className="language-switcher-container">
            <button 
                className="language-switcher-trigger"
                onClick={toggleDropdown}
                aria-expanded={isOpen}
                aria-label="Select language"
            >
                <Globe size={18} className="language-icon" />
                <span className="language-code">{getCurrentLanguage().code.toUpperCase()}</span>
                <span className="language-name">{getCurrentLanguage().native}</span>
                <svg 
                    className={`dropdown-arrow ${isOpen ? 'rotate-180' : ''}`} 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {isOpen && (
                <div className="language-dropdown">
                    <div className="dropdown-header">
                        <Globe size={16} />
                        <span>Select Language</span>
                    </div>
                    <div className="dropdown-list">
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                className={`language-option ${currentLanguage === language.code ? 'selected' : ''}`}
                                onClick={() => changeLanguage(language.code)}
                                aria-label={`Switch to ${language.name}`}
                            >
                                <div className="language-option-content">
                                    <div className="language-info">
                                        <span className="language-native">{language.native}</span>
                                        <span className="language-english">{language.name}</span>
                                    </div>
                                    {currentLanguage === language.code && (
                                        <Check size={16} className="selected-icon" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="dropdown-footer">
                        <small>Changes apply to this website only</small>
                    </div>
                </div>
            )}

            {/* Overlay for closing dropdown on outside click */}
            {isOpen && (
                <div className="language-dropdown-overlay" onClick={() => setIsOpen(false)} />
            )}
        </div>
    );
}

export default LanguageSwitcher;