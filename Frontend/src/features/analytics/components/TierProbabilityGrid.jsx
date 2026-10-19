import React from 'react';

export const TierProbabilityGrid = ({ tiers = [] }) => {
    if (!tiers || tiers.length === 0) {
        return (
            <div className="tier-grid-empty">
                <p>No tier probabilities computed yet. Complete your candidate profile to generate forecasts.</p>
            </div>
        );
    }

    const getStatusTheme = (status) => {
        switch (status) {
            case 'HIGH':
                return { badgeClass: 'badge--high', label: 'High Probability', barColor: 'var(--success-color, #10b981)' };
            case 'MODERATE':
                return { badgeClass: 'badge--mod', label: 'Moderate Fit', barColor: 'var(--accent-color, #f43f5e)' };
            case 'LOW':
                return { badgeClass: 'badge--low', label: 'Needs Improvement', barColor: 'var(--warning-color, #f59e0b)' };
            default:
                return { badgeClass: 'badge--unlikely', label: 'Critical Gap', barColor: 'var(--danger-color, #ef4444)' };
        }
    };

    return (
        <section className="tier-probability-section">
            <div className="section-title-row">
                <div className="title-block">
                    <span className="section-eyebrow">COMPANY CATEGORIES</span>
                    <h2 className="section-heading">Multi-Tier Offer Probability Forecast</h2>
                </div>
                <span className="section-note">Based on competitive benchmarks &amp; gate filters</span>
            </div>

            <div className="tier-cards-grid">
                {tiers.map((tier) => {
                    const theme = getStatusTheme(tier.status);
                    return (
                        <div key={tier.tierKey} className={`tier-card tier-card--${tier.status.toLowerCase()}`}>
                            <div className="tier-card-header">
                                <div className="tier-title-wrap">
                                    <span className={`tier-status-pill ${theme.badgeClass}`}>{theme.label}</span>
                                    <h3 className="tier-name">{tier.tierName}</h3>
                                </div>
                                <div className="tier-ctc-tag">{tier.ctcRange}</div>
                            </div>

                            {/* Probability Gauge */}
                            <div className="tier-probability-gauge">
                                <div className="gauge-meta">
                                    <span className="gauge-label">Offer Likelihood</span>
                                    <span className="gauge-pct">{tier.probabilityPercentage}%</span>
                                </div>
                                <div className="gauge-track">
                                    <div
                                        className="gauge-fill"
                                        style={{
                                            width: `${tier.probabilityPercentage}%`,
                                            backgroundColor: theme.barColor
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Target Companies */}
                            <div className="tier-companies-block">
                                <span className="companies-label">Target Companies:</span>
                                <div className="company-tags">
                                    {(tier.targetCompanies || []).map((company) => (
                                        <span key={company} className="company-tag">{company}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Blocker or Key Strength */}
                            <div className="tier-card-footer">
                                {tier.primaryBlocker ? (
                                    <div className="tier-blocker-row">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                        <span className="blocker-text">{tier.primaryBlocker}</span>
                                    </div>
                                ) : (
                                    <div className="tier-strength-row">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span className="strength-text">{tier.keyStrengths?.[0] || 'Profile meets current entry criteria'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default TierProbabilityGrid;
