import React from 'react';

const AptitudeRoundHeader = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'practice', label: 'Practice Questions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { id: 'assessments', label: 'Timed Assessments', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'performance', label: 'Aptitude Performance', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
    ];

    return (
        <header className="aptitude-header">
            <div className="aptitude-header__top">
                <div className="aptitude-header__title-group">
                    <div className="aptitude-header__badge">
                        <span className="aptitude-badge-dot"></span>
                        First Screening Stage • Corporate Placement Gateway
                    </div>
                    <h1 className="aptitude-header__title">APTITUDE ROUND</h1>
                    <p className="aptitude-header__subtitle">
                        Master quantitative aptitude, logical reasoning, and verbal ability with deterministic questions, server-verified scoring, and timed screening simulations.
                    </p>
                </div>
                <div className="aptitude-header__meta">
                    <span className="aptitude-mode-tag">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        Strict Server Scoring &amp; Anti-Cheat Engine
                    </span>
                </div>
            </div>

            <nav className="aptitude-header__tabs" aria-label="Aptitude navigation">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`aptitude-tab ${activeTab === tab.id ? 'aptitude-tab--active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                        </svg>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>
        </header>
    );
};

export default AptitudeRoundHeader;
