import React from 'react';

const PlacementStrengths = ({ strengths = [] }) => {
    if (!strengths || strengths.length === 0) return null;

    return (
        <section className="placement-strengths">
            <div className="section-header-block">
                <span className="section-eyebrow section-eyebrow--success">VERIFIED QUALIFICATIONS</span>
                <h3 className="section-heading">PLACEMENT STRENGTHS ({strengths.length})</h3>
                <p className="section-description">
                    Evidence-backed assets and verified milestones currently registered in your candidate profile.
                </p>
            </div>

            <div className="placement-strengths__grid">
                {strengths.map((strength) => (
                    <div key={strength.id} className="strength-card">
                        <div className="strength-card__header">
                            <div className="strength-card__icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            </div>
                            <div className="strength-card__meta">
                                <span className="strength-card__category">{strength.category}</span>
                                <h4 className="strength-card__title">{strength.title}</h4>
                            </div>
                        </div>

                        <p className="strength-card__evidence">{strength.evidence}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PlacementStrengths;
