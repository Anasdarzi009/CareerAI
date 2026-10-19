import React, { useState } from 'react';
import { Link } from 'react-router';

const JobReadinessSection = ({ jobReadiness = [] }) => {
    const [filter, setFilter] = useState('ALL');

    if (!jobReadiness || jobReadiness.length === 0) return null;

    const filteredJobs = jobReadiness.filter(job => {
        if (filter === 'ELIGIBLE') return job.eligibilityStatus === 'ELIGIBLE';
        if (filter === 'UNVERIFIED') return job.eligibilityStatus === 'UNVERIFIED';
        if (filter === 'INELIGIBLE') return job.eligibilityStatus === 'INELIGIBLE';
        return true;
    });

    const eligibleCount = jobReadiness.filter(j => j.eligibilityStatus === 'ELIGIBLE').length;
    const unverifiedCount = jobReadiness.filter(j => j.eligibilityStatus === 'UNVERIFIED').length;
    const ineligibleCount = jobReadiness.filter(j => j.eligibilityStatus === 'INELIGIBLE').length;

    return (
        <section className="job-readiness-section">
            <div className="section-header-block">
                <div className="section-header-row">
                    <div>
                        <span className="section-eyebrow">OPPORTUNITY ALIGNMENT</span>
                        <h3 className="section-heading">JOB READINESS &amp; ELIGIBILITY</h3>
                    </div>
                    <Link to="/jobs" className="placement-link-cta">
                        View All Jobs &amp; Opportunities →
                    </Link>
                </div>
                <p className="section-description">
                    Audited strictly against mandatory academic cutoffs and technical skill specifications.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="job-readiness-tabs">
                <button
                    className={`job-tab ${filter === 'ALL' ? 'job-tab--active' : ''}`}
                    onClick={() => setFilter('ALL')}
                >
                    All Evaluated ({jobReadiness.length})
                </button>
                <button
                    className={`job-tab ${filter === 'ELIGIBLE' ? 'job-tab--active' : ''}`}
                    onClick={() => setFilter('ELIGIBLE')}
                >
                    Eligible ({eligibleCount})
                </button>
                <button
                    className={`job-tab ${filter === 'UNVERIFIED' ? 'job-tab--active' : ''}`}
                    onClick={() => setFilter('UNVERIFIED')}
                >
                    Needs Verification ({unverifiedCount})
                </button>
                <button
                    className={`job-tab ${filter === 'INELIGIBLE' ? 'job-tab--active' : ''}`}
                    onClick={() => setFilter('INELIGIBLE')}
                >
                    Ineligible ({ineligibleCount})
                </button>
            </div>

            {/* Cards List */}
            <div className="job-readiness-cards">
                {filteredJobs.length === 0 ? (
                    <div className="empty-filter-notice">
                        <p>No opportunities matching "{filter.toLowerCase()}" criteria.</p>
                    </div>
                ) : (
                    filteredJobs.map((job) => {
                        const isEligible = job.eligibilityStatus === 'ELIGIBLE';
                        const isUnverified = job.eligibilityStatus === 'UNVERIFIED';

                        return (
                            <div
                                key={job.jobId}
                                className={`job-readiness-card job-readiness-card--${job.eligibilityStatus.toLowerCase()}`}
                            >
                                <div className="job-readiness-card__header">
                                    <div className="job-readiness-card__title-box">
                                        <h4 className="job-readiness-card__role">{job.title}</h4>
                                        <span className="job-readiness-card__company">
                                            {job.company} · <span className="job-readiness-card__loc">{job.location}</span>
                                        </span>
                                    </div>

                                    <div className="job-readiness-card__badges">
                                        <span className={`status-badge status-badge--${job.eligibilityStatus.toLowerCase()}`}>
                                            {isEligible ? '✓ ELIGIBLE' : isUnverified ? '⚠ NEEDS VERIFICATION' : '✕ INELIGIBLE'}
                                        </span>
                                        {job.matchScore > 0 && (
                                            <span className="job-readiness-card__match-pill">
                                                {job.matchScore}% Skill Match
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className="job-readiness-card__msg">{job.statusMessage}</p>

                                {job.missingCriteria && job.missingCriteria.length > 0 && (
                                    <div className="job-readiness-card__criteria-box">
                                        <span className="job-readiness-card__criteria-label">Missing Academic / Cutoff Criteria:</span>
                                        <ul className="job-readiness-card__criteria-list">
                                            {job.missingCriteria.map((crit, cIdx) => (
                                                <li key={cIdx} className="job-readiness-card__criteria-item">
                                                    {crit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {job.missingSkills && job.missingSkills.length > 0 && (
                                    <div className="job-readiness-card__skills-box">
                                        <span className="job-readiness-card__skills-label">Missing Job Skills:</span>
                                        <div className="job-readiness-card__skills-chips">
                                            {job.missingSkills.slice(0, 4).map((sk, sIdx) => (
                                                <span key={sIdx} className="job-skill-chip">{sk}</span>
                                            ))}
                                            {job.missingSkills.length > 4 && (
                                                <span className="job-skill-chip job-skill-chip--more">
                                                    +{job.missingSkills.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="job-readiness-card__footer">
                                    <Link to={`/jobs/${job.jobId}`} className="placement-btn placement-btn--secondary">
                                        View Opportunity Details →
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default JobReadinessSection;
