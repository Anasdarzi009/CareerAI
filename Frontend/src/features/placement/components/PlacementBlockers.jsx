import React from 'react';
import { Link } from 'react-router';

const SEVERITY_CONFIG = {
    CRITICAL: { label: 'CRITICAL BLOCKER', cls: 'blocker-pill--critical' },
    HIGH: { label: 'HIGH PRIORITY', cls: 'blocker-pill--high' },
    MEDIUM: { label: 'MEDIUM PRIORITY', cls: 'blocker-pill--medium' },
    LOW: { label: 'LOW PRIORITY', cls: 'blocker-pill--low' }
};

const PlacementBlockers = ({ blockers = [] }) => {
    if (!blockers || blockers.length === 0) {
        return (
            <div className="placement-blockers placement-blockers--empty">
                <div className="empty-notice-card">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <div className="empty-notice-card__text">
                        <strong className="empty-notice-card__title">No Critical Blockers Found</strong>
                        <p className="empty-notice-card__desc">
                            Your verified candidate records currently meet all mandatory recruitment benchmarks without critical gating obstacles.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="placement-blockers">
            <div className="section-header-block">
                <div className="section-header-row">
                    <div>
                        <span className="section-eyebrow section-eyebrow--danger">ACTION REQUIRED</span>
                        <h3 className="section-heading">PLACEMENT BLOCKERS ({blockers.length})</h3>
                    </div>
                    <span className="section-meta-tag">Highest-impact items preventing placement readiness</span>
                </div>
            </div>

            <div className="placement-blockers__list">
                {blockers.map((blocker) => {
                    const sev = SEVERITY_CONFIG[blocker.severity] || SEVERITY_CONFIG.HIGH;

                    return (
                        <div key={blocker.id} className={`blocker-card blocker-card--${blocker.severity.toLowerCase()}`}>
                            <div className="blocker-card__top">
                                <span className={`blocker-pill ${sev.cls}`}>{sev.label}</span>
                                <h4 className="blocker-card__title">{blocker.title}</h4>
                            </div>

                            <p className="blocker-card__explanation">{blocker.explanation}</p>

                            <div className="blocker-card__action-row">
                                <div className="blocker-card__recommendation">
                                    <span className="blocker-card__rec-label">Recommended Fix:</span>
                                    <span className="blocker-card__rec-text">{blocker.recommendedAction}</span>
                                </div>

                                <Link to={blocker.ctaPath} className="placement-btn placement-btn--primary">
                                    {blocker.ctaText || 'Resolve'} →
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default PlacementBlockers;
