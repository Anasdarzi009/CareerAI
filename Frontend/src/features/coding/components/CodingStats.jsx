import React from 'react';

const CodingStats = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="coding-stats-grid coding-stats-grid--loading">
                <div className="coding-stat-card coding-stat-card--skeleton"></div>
                <div className="coding-stat-card coding-stat-card--skeleton"></div>
                <div className="coding-stat-card coding-stat-card--skeleton"></div>
                <div className="coding-stat-card coding-stat-card--skeleton"></div>
            </div>
        );
    }

    if (!stats || stats.attempted === 0) {
        return (
            <div className="coding-stats-banner coding-stats-banner--unassessed">
                <div className="coding-stats-banner__icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                </div>
                <div className="coding-stats-banner__content">
                    <h4 className="coding-stats-banner__title">Coding performance hasn't been assessed yet.</h4>
                    <p className="coding-stats-banner__desc">
                        Solve practice algorithmic problems or complete timed assessments to establish verified coding readiness.
                    </p>
                </div>
            </div>
        );
    }

    const {
        attempted = 0,
        solved = 0,
        accuracy = 0,
        streak = 0,
        codingReadiness = 0,
        easySolved = 0,
        mediumSolved = 0,
        hardSolved = 0
    } = stats;

    return (
        <div className="coding-stats-grid">
            <div className="coding-stat-card">
                <div className="coding-stat-card__top">
                    <span className="coding-stat-card__label">Coding Readiness</span>
                    <span className="coding-stat-card__icon coding-stat-card__icon--readiness">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </span>
                </div>
                <div className="coding-stat-card__value">
                    {codingReadiness}
                    <span className="coding-stat-card__unit">/100</span>
                </div>
                <div className="coding-stat-card__footer">
                    <div className="coding-readiness-bar">
                        <div
                            className="coding-readiness-bar__fill"
                            style={{ width: `${Math.min(100, codingReadiness)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="coding-stat-card">
                <div className="coding-stat-card__top">
                    <span className="coding-stat-card__label">Problems Solved</span>
                    <span className="coding-stat-card__icon coding-stat-card__icon--solved">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </span>
                </div>
                <div className="coding-stat-card__value">
                    {solved}
                    <span className="coding-stat-card__subvalue">/ {attempted} attempted</span>
                </div>
                <div className="coding-stat-card__breakdown">
                    <span className="coding-tag coding-tag--easy">Easy: {easySolved}</span>
                    <span className="coding-tag coding-tag--medium">Med: {mediumSolved}</span>
                    <span className="coding-tag coding-tag--hard">Hard: {hardSolved}</span>
                </div>
            </div>

            <div className="coding-stat-card">
                <div className="coding-stat-card__top">
                    <span className="coding-stat-card__label">Accuracy</span>
                    <span className="coding-stat-card__icon coding-stat-card__icon--accuracy">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                        </svg>
                    </span>
                </div>
                <div className="coding-stat-card__value">
                    {accuracy}%
                </div>
                <p className="coding-stat-card__hint">
                    Based on {attempted} total code submission{attempted === 1 ? '' : 's'}
                </p>
            </div>

            <div className="coding-stat-card">
                <div className="coding-stat-card__top">
                    <span className="coding-stat-card__label">Current Streak</span>
                    <span className="coding-stat-card__icon coding-stat-card__icon--streak">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    </span>
                </div>
                <div className="coding-stat-card__value">
                    {streak} <span className="coding-stat-card__unit">{streak === 1 ? 'day' : 'days'}</span>
                </div>
                <p className="coding-stat-card__hint">
                    {streak > 0 ? 'Consecutive daily activity' : 'Solve a problem today to build streak'}
                </p>
            </div>
        </div>
    );
};

export default CodingStats;
