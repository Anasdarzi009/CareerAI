import React from 'react'

export const DashboardHeader = ({ username = 'Candidate', overallReadiness = null, hasPlans = false }) => {
    // Dynamic greeting based on current local hour
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

    return (
        <div className="dashboard-header">
            <div className="dashboard-header-left">
                <span className="dashboard-eyebrow">CAREER COMMAND CENTER</span>
                <h1 className="dashboard-greeting">
                    {greeting}, {username} 👋
                </h1>
                <p className="dashboard-subheading">
                    Track your preparation, identify skill gaps, and build your path toward placement readiness.
                </p>
            </div>

            <div className="dashboard-readiness-card">
                <div className="readiness-card-header">
                    <span className="readiness-card-label">OVERALL READINESS</span>
                    <span className={`readiness-status-dot ${hasPlans ? 'readiness-status-dot--active' : ''}`} />
                </div>
                <div className="readiness-card-value-row">
                    {hasPlans && overallReadiness !== null ? (
                        <>
                            <span className="readiness-value">{overallReadiness}%</span>
                            <span className="readiness-tag readiness-tag--ontrack">On track</span>
                        </>
                    ) : (
                        <>
                            <span className="readiness-value readiness-value--empty">Not assessed yet</span>
                            <span className="readiness-tag readiness-tag--pending">Pending plans</span>
                        </>
                    )}
                </div>
                <span className="readiness-card-hint">
                    {hasPlans
                        ? 'Derived from your interview match score'
                        : 'Generate an interview plan to calculate'}
                </span>
            </div>
        </div>
    )
}

export default DashboardHeader
