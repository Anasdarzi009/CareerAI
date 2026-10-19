import React from 'react';

const LANGUAGE_LABELS = {
    javascript: 'JavaScript (Node.js Sandbox)',
    python: 'Python 3 (Practice Mode)',
    java: 'Java 17 (Practice Mode)',
    cpp: 'C++ 20 (Practice Mode)'
};

const LanguageSelector = ({ languages = [], selectedLanguage, onChange, disabled }) => {
    return (
        <div className="coding-language-selector">
            <label htmlFor="coding-lang-select" className="coding-language-selector__label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                </svg>
                <span>Language:</span>
            </label>
            <select
                id="coding-lang-select"
                value={selectedLanguage}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="coding-language-selector__select"
            >
                {languages.map(lang => (
                    <option key={lang} value={lang}>
                        {LANGUAGE_LABELS[lang] || lang.toUpperCase()}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;
