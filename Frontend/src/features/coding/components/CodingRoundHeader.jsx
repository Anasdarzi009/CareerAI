import React from 'react';

const CodingRoundHeader = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'practice', label: 'Practice Questions', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
        { id: 'assessments', label: 'Timed Assessments', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'history', label: 'Submissions History', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { id: 'performance', label: 'Coding Performance', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
    ];

    return (
        <header className="coding-header">
            <div className="coding-header__top">
                <div className="coding-header__title-group">
                    <div className="coding-header__badge">
                        <span className="coding-badge-dot"></span>
                        Placement Technical Preparation
                    </div>
                    <h1 className="coding-header__title">CODING ROUND</h1>
                    <p className="coding-header__subtitle">
                        Build algorithmic problem-solving skills, take timed assessments, and demonstrate verified placement readiness.
                    </p>
                </div>
                <div className="coding-header__meta">
                    <span className="coding-mode-tag">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                        Practice Evaluation Mode (Isolated Sandbox)
                    </span>
                </div>
            </div>

            <nav className="coding-header__tabs" aria-label="Coding navigation">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`coding-tab ${activeTab === tab.id ? 'coding-tab--active' : ''}`}
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

export default CodingRoundHeader;
