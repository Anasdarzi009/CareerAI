import React from 'react'
import { useNavigate } from 'react-router'

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
)

const SparkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
)

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="9" y1="22" x2="9" y2="22.01" />
        <line x1="15" y1="22" x2="15" y2="22.01" />
        <line x1="9" y1="6" x2="9" y2="6.01" />
        <line x1="15" y1="6" x2="15" y2="6.01" />
        <line x1="9" y1="10" x2="9" y2="10.01" />
        <line x1="15" y1="10" x2="15" y2="10.01" />
        <line x1="9" y1="14" x2="9" y2="14.01" />
        <line x1="15" y1="14" x2="15" y2="14.01" />
    </svg>
)

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)

export const ContinuePrepCard = ({ recentPlan = null }) => {
    const navigate = useNavigate()

    if (!recentPlan) {
        return (
            <div className="continue-prep-card continue-prep-card--empty">
                <div className="empty-prep-content">
                    <div className="empty-icon-badge">
                        <SparkIcon />
                    </div>
                    <div className="empty-text-wrap">
                        <h3>Your preparation journey starts here.</h3>
                        <p>
                            Create your first personalized interview strategy based on a job description and your profile.
                        </p>
                    </div>
                    <button
                        className="button primary-button empty-prep-cta"
                        onClick={() => navigate('/interview-prep')}
                    >
                        <span>Start Interview Preparation</span>
                        <ArrowRightIcon />
                    </button>
                </div>
            </div>
        )
    }

    // Format date
    const formattedDate = recentPlan.createdAt
        ? new Date(recentPlan.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
          })
        : 'Recently generated'

    // Format match score
    const matchScore = recentPlan.matchScore ?? 0
    const matchClass = matchScore >= 80 ? 'high' : matchScore >= 60 ? 'mid' : 'low'

    // Format eligibility
    const eligibilityStatus = recentPlan.eligibility?.status || 'unverified'
    const eligibilityLabel =
        eligibilityStatus === 'eligible'
            ? 'Eligible'
            : eligibilityStatus === 'ineligible'
            ? 'Not Eligible'
            : 'Unverified'

    // Question counts
    const technicalCount = recentPlan.technicalQuestions?.length ?? 10
    const behavioralCount = recentPlan.behavioralQuestions?.length ?? 10

    return (
        <div className="continue-prep-card">
            <div className="prep-card-header">
                <div className="prep-tag-row">
                    <span className="prep-section-badge">CONTINUE PREPARATION</span>
                    <span className="prep-latest-tag">Latest Plan</span>
                </div>
                <div className="prep-date">
                    <CalendarIcon />
                    <span>{formattedDate}</span>
                </div>
            </div>

            <div className="prep-card-main">
                <div className="prep-target-info">
                    <h3 className="prep-role-title">{recentPlan.title || 'Software Engineering Role'}</h3>
                    <div className="prep-company-row">
                        <BuildingIcon />
                        <span>{recentPlan.companyName || 'Target Organization'}</span>
                    </div>
                </div>

                <div className="prep-stats-grid">
                    {/* Match Score */}
                    <div className="prep-stat-item">
                        <span className="prep-stat-label">Match Score</span>
                        <span className={`prep-match-pill prep-match-pill--${matchClass}`}>
                            {matchScore}%
                        </span>
                    </div>

                    {/* Eligibility */}
                    <div className="prep-stat-item">
                        <span className="prep-stat-label">Eligibility</span>
                        <span className={`prep-eligibility-pill prep-eligibility-pill--${eligibilityStatus}`}>
                            {eligibilityLabel}
                        </span>
                    </div>

                    {/* Technical Questions */}
                    <div className="prep-stat-item">
                        <span className="prep-stat-label">Technical Qs</span>
                        <span className="prep-stat-num">{technicalCount}</span>
                    </div>

                    {/* Behavioral Questions */}
                    <div className="prep-stat-item">
                        <span className="prep-stat-label">Behavioral Qs</span>
                        <span className="prep-stat-num">{behavioralCount}</span>
                    </div>
                </div>
            </div>

            <div className="prep-card-footer">
                <span className="prep-hint">
                    Resume tailored questions, eligibility criteria, and preparation roadmap ready.
                </span>
                <button
                    className="button primary-button continue-btn"
                    onClick={() => navigate(`/interview/${recentPlan._id}`)}
                >
                    <span>Continue Preparation</span>
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
    )
}

export default ContinuePrepCard
