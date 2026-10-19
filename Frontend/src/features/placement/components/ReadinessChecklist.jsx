import React from 'react';
import { Link } from 'react-router';

const ReadinessChecklist = ({ checklist = [] }) => {
    if (!checklist || checklist.length === 0) return null;

    const completedCount = checklist.filter(c => c.isComplete).length;

    return (
        <section className="readiness-checklist">
            <div className="section-header-block">
                <div className="section-header-row">
                    <div>
                        <span className="section-eyebrow">VERIFICATION AUDIT</span>
                        <h3 className="section-heading">
                            READINESS CHECKLIST ({completedCount}/{checklist.length})
                        </h3>
                    </div>
                    <span className="section-meta-tag">
                        {Math.round((completedCount / checklist.length) * 100)}% Verified
                    </span>
                </div>
                <p className="section-description">
                    Key institutional and technical milestones required for end-to-end placement readiness.
                </p>
            </div>

            <div className="readiness-checklist__list">
                {checklist.map((item) => (
                    <div
                        key={item.id}
                        className={`checklist-item ${item.isComplete ? 'checklist-item--complete' : 'checklist-item--incomplete'}`}
                    >
                        <div className="checklist-item__status-icon">
                            {item.isComplete ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            ) : (
                                <div className="checklist-item__circle-empty"></div>
                            )}
                        </div>

                        <div className="checklist-item__content">
                            <div className="checklist-item__top">
                                <span className="checklist-item__label">{item.label}</span>
                                <span className="checklist-item__category">{item.category}</span>
                            </div>
                            {item.detail && (
                                <span className="checklist-item__detail">{item.detail}</span>
                            )}
                        </div>

                        {!item.isComplete && item.ctaPath && (
                            <Link to={item.ctaPath} className="checklist-item__cta">
                                Complete →
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ReadinessChecklist;
