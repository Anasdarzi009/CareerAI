import React from 'react'
import { useNavigate } from 'react-router'
import EligibilityBadge from './EligibilityBadge'

export const EligibilityBreakdownCard = ({ eligibility, matchScore, matchFactors = [] }) => {
    const navigate = useNavigate()

    if (!eligibility) return null

    const {
        status,
        statusMessage,
        requirements = [],
        matchedSkills = [],
        missingSkills = [],
        profileMissingFields = []
    } = eligibility

    const isEligible = status === 'ELIGIBLE'
    const isIneligible = status === 'INELIGIBLE'
    const isUnverified = status === 'UNVERIFIED'

    return (
        <div className={`eligibility-card eligibility-card--${status.toLowerCase()}`}>
            {/* Top Header */}
            <div className="eligibility-card-header">
                <div className="header-left">
                    <span className="eligibility-eyebrow">CAREERAI ELIGIBILITY AUDIT</span>
                    <h3 className="eligibility-title">Placement Qualification Analysis</h3>
                </div>
                <EligibilityBadge status={status} size="large" />
            </div>

            {/* Verdict Explanation Banner */}
            <div className={`eligibility-banner eligibility-banner--${status.toLowerCase()}`}>
                <div className="banner-icon-col">
                    {isEligible && <span className="banner-icon">✓</span>}
                    {isIneligible && <span className="banner-icon">✕</span>}
                    {isUnverified && <span className="banner-icon">?</span>}
                </div>
                <div className="banner-text-col">
                    <p className="banner-verdict-title">
                        {isEligible && 'Eligible for Opportunity'}
                        {isIneligible && 'Mandatory Academic Cutoff Not Met'}
                        {isUnverified && 'Candidate Profile Verification Required'}
                    </p>
                    <p className="banner-verdict-desc">{statusMessage}</p>

                    {isIneligible && (
                        <p className="banner-rule-note">
                            * CareerAI rule: Mandatory academic cutoffs are strictly enforced and cannot be overridden by technical skills.
                        </p>
                    )}

                    {isUnverified && profileMissingFields.length > 0 && (
                        <div className="unverified-cta-row">
                            <span className="missing-pill">Missing: {profileMissingFields.join(', ')}</span>
                            <button
                                type="button"
                                className="complete-profile-btn"
                                onClick={() => navigate('/resume-profile')}
                            >
                                Complete Profile →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 1. Academic Criteria Breakdown */}
            {requirements.length > 0 && (
                <div className="eligibility-section">
                    <span className="section-label">Academic Cutoff Audits</span>
                    <div className="requirements-list">
                        {requirements.map((req, idx) => {
                            const isPassed = req.passed
                            const isFailed = req.status === 'FAILED'
                            const isMissing = req.status === 'UNVERIFIED'

                            return (
                                <div
                                    key={idx}
                                    className={`requirement-row requirement-row--${req.status.toLowerCase()}`}
                                >
                                    <div className="req-type-col">
                                        <span className="req-type">{req.type}</span>
                                        {req.mandatory && (
                                            <span className="req-mandatory-tag">Mandatory</span>
                                        )}
                                    </div>

                                    <div className="req-score-col">
                                        {isMissing ? (
                                            <span className="req-missing-text">Not in profile</span>
                                        ) : (
                                            <span className="req-score-val">
                                                <strong>{req.actual}{req.type.includes('CGPA') ? '' : '%'}</strong>
                                                <span className="req-score-divider">/</span>
                                                <span>{req.required}{req.type.includes('CGPA') ? '' : '%'} min</span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="req-status-col">
                                        {isPassed && <span className="req-check req-check--pass">✓ Passed</span>}
                                        {isFailed && <span className="req-check req-check--fail">✕ Cutoff failed</span>}
                                        {isMissing && <span className="req-check req-check--unverified">? Unverified</span>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* 2. Technical Skills Match */}
            <div className="eligibility-section">
                <div className="section-header-row">
                    <span className="section-label">Technical Skill Alignment</span>
                    {matchScore !== undefined && (
                        <span className="skills-score-label">{matchScore}% Skills Match</span>
                    )}
                </div>

                <div className="skills-chips-wrapper">
                    {/* Matched skills */}
                    {matchedSkills.map((skill, idx) => (
                        <span key={`matched-${idx}`} className="skill-chip skill-chip--matched" title="Matches your profile">
                            <span className="chip-icon">✓</span>
                            <span>{skill}</span>
                        </span>
                    ))}

                    {/* Missing skills */}
                    {missingSkills.map((skill, idx) => (
                        <span key={`missing-${idx}`} className="skill-chip skill-chip--missing" title="Skill not found in your profile">
                            <span className="chip-icon">○</span>
                            <span>{skill} — Missing</span>
                        </span>
                    ))}

                    {matchedSkills.length === 0 && missingSkills.length === 0 && (
                        <span className="no-skills-note">No specific technical skills specified for this role.</span>
                    )}
                </div>
            </div>

            {/* 3. Match Factors if present */}
            {matchFactors.length > 0 && (
                <div className="eligibility-section">
                    <span className="section-label">Profile Compatibility Factors</span>
                    <ul className="factors-list">
                        {matchFactors.map((factor, idx) => (
                            <li key={idx} className="factor-item">
                                <span className="factor-dot" />
                                <span>{factor}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default EligibilityBreakdownCard
