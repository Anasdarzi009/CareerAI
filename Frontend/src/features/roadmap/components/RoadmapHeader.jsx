import React from 'react';

const RoadmapHeader = ({
    targetRole,
    targetCompany,
    overallProgress = 0,
    updatedAt,
    onRecalculate,
    regenerating = false
}) => {
    const formattedDate = updatedAt
        ? new Date(updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : 'Just now';

    return (
        <header className="roadmap-header">
            <div className="roadmap-header__main">
                <div className="roadmap-header__titles">
                    <span className="roadmap-header__badge">CAREER READINESS ENGINE</span>
                    <h1 className="roadmap-header__title">CAREER ROADMAP</h1>
                    <p className="roadmap-header__subtitle">
                        Your personalized path toward your target career.
                    </p>
                </div>

                <div className="roadmap-header__actions">
                    <button
                        className="roadmap-btn roadmap-btn--secondary"
                        onClick={onRecalculate}
                        disabled={regenerating}
                    >
                        {regenerating ? (
                            <>
                                <span className="roadmap-spinner"></span>
                                Recalculating...
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                                </svg>
                                Recalculate Roadmap
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="roadmap-header__meta-grid">
                <div className="roadmap-meta-card">
                    <span className="roadmap-meta-card__label">TARGET ROLE</span>
                    <strong className="roadmap-meta-card__value">{targetRole || 'Not Set'}</strong>
                </div>

                <div className="roadmap-meta-card">
                    <span className="roadmap-meta-card__label">TARGET COMPANY / JOB</span>
                    <strong className="roadmap-meta-card__value">
                        {targetCompany ? (
                            <span className="roadmap-meta-card__badge-job">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                </svg>
                                {targetCompany}
                            </span>
                        ) : (
                            'General Role Benchmark'
                        )}
                    </strong>
                </div>

                <div className="roadmap-meta-card">
                    <div className="roadmap-meta-card__progress-header">
                        <span className="roadmap-meta-card__label">ROADMAP PROGRESS</span>
                        <span className="roadmap-meta-card__pct">{overallProgress}%</span>
                    </div>
                    <div className="roadmap-progress-bar">
                        <div
                            className="roadmap-progress-bar__fill"
                            style={{ width: `${Math.min(Math.max(overallProgress, 0), 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="roadmap-meta-card">
                    <span className="roadmap-meta-card__label">LAST UPDATED</span>
                    <span className="roadmap-meta-card__time">{formattedDate}</span>
                </div>
            </div>
        </header>
    );
};

export default RoadmapHeader;
