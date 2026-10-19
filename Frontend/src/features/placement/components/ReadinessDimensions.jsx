import React from 'react';

const DIMENSION_CONFIG = {
    profile: {
        title: 'Profile Completeness',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        )
    },
    resume: {
        title: 'Resume & ATS Content',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
            </svg>
        )
    },
    skills: {
        title: 'Technical Skills & Coverage',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
        )
    },
    projects: {
        title: 'Project Portfolio & Evidence',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
        )
    },
    experience: {
        title: 'Experience & Practical Work',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
        )
    },
    interviews: {
        title: 'Interview Preparation',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
        )
    },
    eligibility: {
        title: 'Academic Criteria & Cutoffs',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
        )
    },
    roadmap: {
        title: 'Career Roadmap Progression',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
        )
    }
};

const STATUS_MAP = {
    EXCELLENT: { label: 'EXCELLENT', cls: 'status-pill--success' },
    GOOD: { label: 'GOOD', cls: 'status-pill--good' },
    NEEDS_ATTENTION: { label: 'ATTENTION', cls: 'status-pill--warning' },
    CRITICAL: { label: 'CRITICAL', cls: 'status-pill--critical' },
    NOT_STARTED: { label: 'NOT STARTED', cls: 'status-pill--muted' }
};

const ReadinessDimensions = ({ dimensions = {} }) => {
    const dimensionKeys = ['profile', 'resume', 'skills', 'projects', 'experience', 'interviews', 'eligibility', 'roadmap'];

    return (
        <section className="readiness-dimensions">
            <div className="section-header-block">
                <span className="section-eyebrow">8-POINT COMPREHENSIVE BREAKDOWN</span>
                <h3 className="section-heading">READINESS DIMENSIONS</h3>
                <p className="section-description">
                    Evaluated across verified documentation, technical proof, and recruitment criteria.
                </p>
            </div>

            <div className="readiness-dimensions__grid">
                {dimensionKeys.map((key) => {
                    const dim = dimensions[key] || { score: 0, weight: 10, status: 'NOT_STARTED', summary: 'Not assessed' };
                    const cfg = DIMENSION_CONFIG[key] || { title: key, icon: null };
                    const statusInfo = STATUS_MAP[dim.status] || STATUS_MAP.NOT_STARTED;

                    return (
                        <div key={key} className="dimension-card">
                            <div className="dimension-card__header">
                                <div className="dimension-card__icon-title">
                                    <div className="dimension-card__icon">{cfg.icon}</div>
                                    <div className="dimension-card__title-box">
                                        <h4 className="dimension-card__title">{cfg.title}</h4>
                                        <span className="dimension-card__weight">Weight: {dim.weight}%</span>
                                    </div>
                                </div>
                                <span className={`status-pill ${statusInfo.cls}`}>
                                    {statusInfo.label}
                                </span>
                            </div>

                            <div className="dimension-card__score-row">
                                <span className="dimension-card__score">{dim.score}%</span>
                                <div className="placement-progress-bar placement-progress-bar--mini">
                                    <div
                                        className="placement-progress-bar__fill"
                                        style={{ width: `${dim.score}%` }}
                                    ></div>
                                </div>
                            </div>

                            <p className="dimension-card__summary">{dim.summary}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ReadinessDimensions;
