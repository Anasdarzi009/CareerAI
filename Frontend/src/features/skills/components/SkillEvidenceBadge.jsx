import React from 'react'

export const SkillEvidenceBadge = ({ status }) => {
    if (!status) return null

    const s = status.toUpperCase()

    switch (s) {
        case 'VERIFIED':
            return (
                <span className="evidence-badge evidence-badge--verified" title="Skill verified in candidate profile, project, or experience">
                    <span className="evidence-icon">✓</span>
                    <span>Verified Evidence</span>
                </span>
            )
        case 'PARTIAL_EVIDENCE':
            return (
                <span className="evidence-badge evidence-badge--partial" title="Mentioned in resume text without project or professional validation">
                    <span className="evidence-icon">◐</span>
                    <span>Partial Evidence</span>
                </span>
            )
        case 'NO_EVIDENCE':
        default:
            return (
                <span className="evidence-badge evidence-badge--none" title="No candidate evidence found in profile or resume">
                    <span className="evidence-icon">○</span>
                    <span>No Evidence Found</span>
                </span>
            )
    }
}

export default SkillEvidenceBadge
