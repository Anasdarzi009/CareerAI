import React from 'react';

const DriveHeader = ({ stats, activeTab, onTabChange }) => {
    const {
        totalAttempted = 0,
        cleared = 0,
        clearanceRate = 0,
        averageScore = 0
    } = stats || {};

    const tabs = [
        { id: 'templates', label: 'Company Drive Tracks', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { id: 'history', label: 'Candidate Drive History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
    ];

    return (
        <header className="drives-header">
            <div className="drives-header__top">
                <div className="drives-header__title-group">
                    <div className="drives-header__badge">
                        <span className="drives-badge-dot"></span>
                        Full-Lifecycle Placement Simulator
                    </div>
                    <h1 className="drives-header__title">MOCK PLACEMENT DRIVE</h1>
                    <p className="drives-header__subtitle">
                        Experience multi-round corporate recruitment drives simulating actual product, IT enterprise, and startup hiring pipelines.
                    </p>
                </div>

                <div className="drives-header__meta">
                    <span className="drives-mode-tag">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        Multi-Stage Hiring Simulation (OA + Coding + Interview)
                    </span>
                </div>
            </div>

            {/* Performance Metric Cards */}
            {totalAttempted > 0 ? (
                <div className="drives-stats-grid">
                    <div className="drives-stat-card">
                        <div className="drives-stat-card__top">
                            <span className="drives-stat-card__label">Drives Cleared</span>
                            <span className="drives-stat-card__icon drives-stat-card__icon--cleared">✓</span>
                        </div>
                        <div className="drives-stat-card__value">
                            {cleared}
                            <span className="drives-stat-card__sub">/ {totalAttempted} attempted</span>
                        </div>
                    </div>

                    <div className="drives-stat-card">
                        <div className="drives-stat-card__top">
                            <span className="drives-stat-card__label">Clearance Rate</span>
                            <span className="drives-stat-card__icon drives-stat-card__icon--rate">%</span>
                        </div>
                        <div className="drives-stat-card__value">
                            {clearanceRate}%
                        </div>
                    </div>

                    <div className="drives-stat-card">
                        <div className="drives-stat-card__top">
                            <span className="drives-stat-card__label">Average Placement Score</span>
                            <span className="drives-stat-card__icon drives-stat-card__icon--score">★</span>
                        </div>
                        <div className="drives-stat-card__value">
                            {averageScore}
                            <span className="drives-stat-card__unit">/100</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="drives-unassessed-banner">
                    <div className="drives-unassessed-banner__icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="drives-unassessed-banner__title">No simulated drives attempted yet.</h4>
                        <p className="drives-unassessed-banner__desc">
                            Select a company drive track below to test your skills across all elimination rounds and establish verified readiness.
                        </p>
                    </div>
                </div>
            )}

            {/* Navigation Tabs */}
            <nav className="drives-header__tabs" aria-label="Placement drive navigation">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`drives-tab ${activeTab === tab.id ? 'drives-tab--active' : ''}`}
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

export default DriveHeader;
