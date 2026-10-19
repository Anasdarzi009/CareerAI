import React, { useState, useEffect } from 'react'
import { getSkillGap } from '../../skills/services/skills.api'
import { getPlacementReadiness } from '../../placement/services/placement.api'

const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
)

const SkillIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

const PlacementIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)

const PlanIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
)

export const MetricsGrid = ({ reports = [] }) => {
    const hasPlans = reports.length > 0
    const [skillCoverage, setSkillCoverage] = useState(null)
    const [placementReadinessData, setPlacementReadinessData] = useState(null)

    useEffect(() => {
        let mounted = true
        getSkillGap()
            .then(data => {
                if (mounted && data.analysis && data.analysis.overallCoverage !== undefined) {
                    setSkillCoverage(data.analysis.overallCoverage)
                }
            })
            .catch(() => {})

        getPlacementReadiness()
            .then(res => {
                if (mounted && res.data) {
                    setPlacementReadinessData(res.data)
                }
            })
            .catch(() => {})

        return () => { mounted = false }
    }, [])

    // Calculate Interview Readiness from existing match scores
    const avgMatchScore = hasPlans
        ? Math.round(reports.reduce((acc, r) => acc + (Number(r.matchScore) || 0), 0) / reports.length)
        : null

    const metrics = [
        {
            id: 'interview-readiness',
            label: 'INTERVIEW READINESS',
            value: hasPlans && avgMatchScore !== null ? `${avgMatchScore}%` : 'Not assessed yet',
            isPercentage: hasPlans && avgMatchScore !== null,
            subtext: 'Based on your preparation activity',
            icon: <TargetIcon />,
            colorClass: 'metric--interview'
        },
        {
            id: 'skill-coverage',
            label: 'SKILL COVERAGE',
            value: skillCoverage !== null ? `${skillCoverage}%` : 'Not assessed yet',
            isPercentage: skillCoverage !== null,
            subtext: skillCoverage !== null ? 'Technical skills assessed' : 'Pending profile audit',
            icon: <SkillIcon />,
            colorClass: 'metric--skills'
        },
        {
            id: 'placement-readiness',
            label: 'PLACEMENT READINESS',
            value: placementReadinessData && placementReadinessData.isAssessed
                ? `${placementReadinessData.overallReadiness}%`
                : 'Not assessed yet',
            isPercentage: Boolean(placementReadinessData && placementReadinessData.isAssessed),
            subtext: placementReadinessData && placementReadinessData.isAssessed
                ? placementReadinessData.readinessLevel
                : 'Overall placement preparation',
            icon: <PlacementIcon />,
            colorClass: 'metric--placement'
        },
        {
            id: 'preparation-plans',
            label: 'PREPARATION PLANS',
            value: reports.length.toString(),
            isPercentage: false,
            subtext: 'Interview plans generated',
            icon: <PlanIcon />,
            colorClass: 'metric--plans'
        }
    ]

    return (
        <div className="metrics-grid">
            {metrics.map((metric) => (
                <div key={metric.id} className={`metric-card ${metric.colorClass}`}>
                    <div className="metric-card-top">
                        <span className="metric-label">{metric.label}</span>
                        <div className="metric-icon-wrap">{metric.icon}</div>
                    </div>
                    <div className="metric-value-wrap">
                        <span className={`metric-value ${metric.value === 'Not assessed yet' ? 'metric-value--unassessed' : ''}`}>
                            {metric.value}
                        </span>
                    </div>
                    <span className="metric-subtext">{metric.subtext}</span>
                </div>
            ))}
        </div>
    )
}

export default MetricsGrid
