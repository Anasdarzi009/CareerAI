import React from 'react';

export const AnalyticsHeader = ({ summary, onRefresh, loading }) => {
    const overallScore = summary?.overallScore || 0;
    const formattedCtc = summary?.formattedCtc || '₹0 - ₹0 LPA';
    const topTierFit = summary?.topTierFit ? summary.topTierFit.replace(/_/g, ' ') : 'Analyzing Profile';
    const clearedGates = summary?.clearedGatesCount || 0;
    const totalGates = summary?.totalGates || 5;

    return (
        <header className="analytics-header">
            <div className="header-breadcrumbs">
                <span className="breadcrumb-root">CareerAI</span>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-active">Placement Intelligence &amp; Offer Predictor</span>
            </div>

            <div className="header-main-row">
                <div className="header-title-group">
                    <div className="header-badge-row">
                        <span className="eyebrow-badge">PREDICTIVE PLACEMENT INTELLIGENCE</span>
                        <span className="live-status-pill">
                            <span className="status-dot pulse" />
                            Multi-Tier Gateway Active
                        </span>
                    </div>
                    <h1 className="header-title">Offer Probability &amp; Valuation Forecast</h1>
                    <p className="header-subtitle">
                        Empirical recruitment forecast synthesizing your real academic cutoffs, algorithmic test results,
                        interview ratings, and corporate placement drive credentials.
                    </p>
                </div>

                <div className="header-actions">
                    <button
                        className="btn-refresh"
                        onClick={onRefresh}
                        disabled={loading}
                        title="Recompute real-time forecast"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 4 23 10 17 10" />
                            <polyline points="1 20 1 14 7 14" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        <span>{loading ? 'Recomputing...' : 'Re-Evaluate Profile'}</span>
                    </button>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="analytics-metrics-strip">
                <div className="metric-strip-card">
                    <div className="metric-icon-wrap metric-icon--valuation">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <div className="metric-content">
                        <span className="metric-label">PREDICTED COMPENSATION BRACKET</span>
                        <span className="metric-val metric-val--highlight">{formattedCtc}</span>
                        <span className="metric-hint">Based on industry offer patterns</span>
                    </div>
                </div>

                <div className="metric-strip-card">
                    <div className="metric-icon-wrap metric-icon--readiness">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <div className="metric-content">
                        <span className="metric-label">MARKET READINESS INDEX</span>
                        <div className="metric-score-row">
                            <span className="metric-val">{overallScore}</span>
                            <span className="metric-denom">/100</span>
                        </div>
                        <span className="metric-hint">Aggregated across all 5 gates</span>
                    </div>
                </div>

                <div className="metric-strip-card">
                    <div className="metric-icon-wrap metric-icon--tier">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </div>
                    <div className="metric-content">
                        <span className="metric-label">PRIMARY HIRING FIT</span>
                        <span className="metric-val metric-val--tier">{topTierFit}</span>
                        <span className="metric-hint">Optimal placement category</span>
                    </div>
                </div>

                <div className="metric-strip-card">
                    <div className="metric-icon-wrap metric-icon--gates">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    <div className="metric-content">
                        <span className="metric-label">RECRUITMENT GATES CLEARED</span>
                        <div className="metric-score-row">
                            <span className="metric-val">{clearedGates}</span>
                            <span className="metric-denom">/{totalGates} Cleared</span>
                        </div>
                        <span className="metric-hint">Direct corporate screening criteria</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AnalyticsHeader;
