import React from 'react'

export const EligibilityBadge = ({ status, size = 'normal' }) => {
    if (!status) return null

    const normalized = status.toUpperCase()

    switch (normalized) {
        case 'ELIGIBLE':
            return (
                <span className={`eligibility-badge eligibility-badge--eligible eligibility-badge--${size}`}>
                    <span className="badge-icon">✓</span>
                    <span>Eligible</span>
                </span>
            )
        case 'INELIGIBLE':
            return (
                <span className={`eligibility-badge eligibility-badge--ineligible eligibility-badge--${size}`}>
                    <span className="badge-icon">✕</span>
                    <span>Ineligible</span>
                </span>
            )
        case 'UNVERIFIED':
            return (
                <span className={`eligibility-badge eligibility-badge--unverified eligibility-badge--${size}`}>
                    <span className="badge-icon">?</span>
                    <span>Needs Profile Info</span>
                </span>
            )
        default:
            return (
                <span className={`eligibility-badge eligibility-badge--neutral eligibility-badge--${size}`}>
                    <span>{status}</span>
                </span>
            )
    }
}

export default EligibilityBadge
