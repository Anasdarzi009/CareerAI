import React from 'react'
import { useNavigate } from 'react-router'
import EligibilityBadge from './EligibilityBadge'

const BookmarkIcon = ({ filled }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
)

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
)

const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
)

export const JobCard = ({ job, onToggleSave }) => {
    const navigate = useNavigate()

    if (!job) return null

    const {
        _id,
        title,
        company,
        location,
        workMode,
        employmentType,
        experienceRequired,
        salaryRange,
        requiredSkills = [],
        eligibility,
        matchScore = 0,
        isSaved,
        application,
        isSample,
        sampleLabel
    } = job

    const skillsPreview = requiredSkills.slice(0, 5)
    const remainingSkills = requiredSkills.length - skillsPreview.length

    return (
        <div className="job-card">
            <div className="job-card-top">
                <div className="job-company-row">
                    <div className="company-info-group">
                        <span className="job-company-name">{company}</span>
                        {isSample && (
                            <span className="sample-badge">{sampleLabel || 'Demo Opportunity'}</span>
                        )}
                    </div>

                    <div className="job-actions-right">
                        <button
                            type="button"
                            className={`save-btn ${isSaved ? 'save-btn--saved' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation()
                                onToggleSave(_id, isSaved)
                            }}
                            aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
                            title={isSaved ? 'Remove from saved bookmarks' : 'Save opportunity'}
                        >
                            <BookmarkIcon filled={isSaved} />
                        </button>
                    </div>
                </div>

                <h3
                    className="job-title"
                    onClick={() => navigate(`/jobs/${_id}`)}
                >
                    {title}
                </h3>

                {/* Key Meta Badges */}
                <div className="job-meta-row">
                    <span className="meta-pill">
                        <MapPinIcon />
                        <span>{location}</span>
                    </span>

                    <span className={`meta-pill meta-pill--workmode meta-pill--${(workMode || '').toLowerCase()}`}>
                        {workMode}
                    </span>

                    <span className="meta-pill">
                        <BriefcaseIcon />
                        <span>{employmentType}</span>
                    </span>

                    {experienceRequired && (
                        <span className="meta-pill meta-pill--exp">
                            {experienceRequired}
                        </span>
                    )}

                    {salaryRange && (
                        <span className="meta-pill meta-pill--salary">
                            {salaryRange}
                        </span>
                    )}
                </div>
            </div>

            {/* Middle: Skills Preview */}
            <div className="job-skills-preview">
                {skillsPreview.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                ))}
                {remainingSkills > 0 && (
                    <span className="skill-tag skill-tag--more">+{remainingSkills} more</span>
                )}
            </div>

            {/* Bottom Row: Eligibility Badge + Profile Match + CTA */}
            <div className="job-card-bottom">
                <div className="eligibility-status-group">
                    <EligibilityBadge status={eligibility?.status} size="normal" />

                    {/* Match percentage */}
                    <div className="match-score-pill" title="Profile match score based on skills and preferences">
                        <span className="match-score-val">{matchScore}%</span>
                        <span className="match-score-text">Match</span>
                    </div>

                    {/* Application state if tracked */}
                    {application && (
                        <span className={`application-state-pill application-state-pill--${application.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            ● {application.status}
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    className="view-details-btn"
                    onClick={() => navigate(`/jobs/${_id}`)}
                >
                    <span>View Details</span>
                    <span className="btn-arrow">→</span>
                </button>
            </div>
        </div>
    )
}

export default JobCard
