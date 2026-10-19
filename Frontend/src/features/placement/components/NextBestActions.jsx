import React from 'react';
import { Link } from 'react-router';

const IMPACT_CONFIG = {
    CRITICAL: { label: 'CRITICAL IMPACT', cls: 'impact-badge--critical' },
    HIGH: { label: 'HIGH IMPACT', cls: 'impact-badge--high' },
    MEDIUM: { label: 'MEDIUM IMPACT', cls: 'impact-badge--medium' }
};

const NextBestActions = ({ nextActions = [] }) => {
    if (!nextActions || nextActions.length === 0) return null;

    return (
        <section className="next-actions-section">
            <div className="section-header-block">
                <span className="section-eyebrow">STRATEGIC ACCELERATION</span>
                <h3 className="section-heading">NEXT BEST ACTIONS</h3>
                <p className="section-description">
                    Follow these prioritized actions to systematically increase your overall placement readiness score.
                </p>
            </div>

            <div className="next-actions-grid">
                {nextActions.map((action, idx) => {
                    const impact = IMPACT_CONFIG[action.impact] || IMPACT_CONFIG.HIGH;

                    return (
                        <div key={idx} className="next-action-card">
                            <div className="next-action-card__top">
                                <span className="next-action-card__step-num">0{idx + 1}</span>
                                <span className={`impact-badge ${impact.cls}`}>{impact.label}</span>
                            </div>

                            <h4 className="next-action-card__title">{action.title}</h4>
                            <p className="next-action-card__desc">{action.description}</p>

                            <div className="next-action-card__footer">
                                <Link to={action.path} className="placement-btn placement-btn--primary">
                                    {action.ctaText || 'Execute Action'} →
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default NextBestActions;
