import React from 'react';

const LEVEL_CONFIG = {
    'Highly Ready': {
        badgeClass: 'level-badge--highly-ready',
        tagline: 'Outstanding profile with solid academic cutoffs, verified skills, and interview practice.'
    },
    'Placement Ready': {
        badgeClass: 'level-badge--ready',
        tagline: 'Your profile satisfies essential placement benchmarks. Resolve secondary gaps to maximize offers.'
    },
    'Getting Ready': {
        badgeClass: 'level-badge--getting-ready',
        tagline: 'Baseline credentials started. Focus on high-priority skill evidence, projects, and academics.'
    },
    'Not Ready': {
        badgeClass: 'level-badge--not-ready',
        tagline: 'Foundational items missing. Complete your resume, degree CGPA, and core technical skills.'
    }
};

const OverallReadinessCard = ({
    overallReadiness = 0,
    readinessLevel = 'Not Ready',
    isAssessed = true,
    eligibleJobsCount = 0,
    ineligibleJobsCount = 0,
    unverifiedJobsCount = 0
}) => {
    const config = LEVEL_CONFIG[readinessLevel] || LEVEL_CONFIG['Not Ready'];

    return (
        <section className="overall-readiness-card">
            <div className="overall-readiness-card__left">
                <span className="overall-readiness-card__eyebrow">COMPREHENSIVE READINESS SCORE</span>

                <div className="overall-readiness-card__score-row">
                    <div className="overall-readiness-card__score-dial">
                        <span className="overall-readiness-card__number">{overallReadiness}</span>
                        <span className="overall-readiness-card__percent-sign">%</span>
                    </div>

                    <div className="overall-readiness-card__level-box">
                        <span className={`level-badge ${config.badgeClass}`}>
                            {readinessLevel}
                        </span>
                        <p className="overall-readiness-card__tagline">
                            {isAssessed ? config.tagline : 'Your placement readiness has not been fully assessed yet. Complete baseline profile prerequisites.'}
                        </p>
                    </div>
                </div>

                <div className="overall-readiness-card__progress-wrap">
                    <div className="placement-progress-bar">
                        <div
                            className="placement-progress-bar__fill"
                            style={{ width: `${Math.min(100, Math.max(0, overallReadiness))}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="overall-readiness-card__right">
                <span className="overall-readiness-card__stats-title">OPPORTUNITY ELIGIBILITY SNAPSHOT</span>
                <div className="overall-readiness-card__stats-grid">
                    <div className="eligibility-stat-box eligibility-stat-box--eligible">
                        <span className="eligibility-stat-box__count">{eligibleJobsCount}</span>
                        <span className="eligibility-stat-box__label">Eligible Openings</span>
                    </div>
                    <div className="eligibility-stat-box eligibility-stat-box--unverified">
                        <span className="eligibility-stat-box__count">{unverifiedJobsCount}</span>
                        <span className="eligibility-stat-box__label">Needs Verification</span>
                    </div>
                    <div className="eligibility-stat-box eligibility-stat-box--ineligible">
                        <span className="eligibility-stat-box__count">{ineligibleJobsCount}</span>
                        <span className="eligibility-stat-box__label">Cutoff Ineligible</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OverallReadinessCard;
