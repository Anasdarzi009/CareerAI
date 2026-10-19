import React from 'react'

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
)

const CircleDotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="1" />
    </svg>
)

export const ProgressPipeline = ({ user, reports = [] }) => {
    const hasPlans = reports.length > 0
    const hasResume = reports.some(r => !!r.resume)

    const stages = [
        {
            id: 'profile',
            name: 'PROFILE',
            status: 'Completed',
            hint: 'Candidate account verified'
        },
        {
            id: 'resume',
            name: 'RESUME',
            status: hasResume ? 'Completed' : hasPlans ? 'In progress' : 'Not started',
            hint: hasResume ? 'Parsed in interview plan' : hasPlans ? 'Profile summary provided' : 'Resume upload pending'
        },
        {
            id: 'skills',
            name: 'SKILLS',
            status: 'Not started',
            hint: 'Skill Matrix module in Phase 2'
        },
        {
            id: 'interview',
            name: 'INTERVIEW',
            status: hasPlans ? 'Completed' : 'Not started',
            hint: hasPlans ? `${reports.length} plans generated` : 'Generate first interview plan'
        },
        {
            id: 'coding',
            name: 'CODING',
            status: 'Not started',
            hint: 'Coding round in Final Phase'
        },
        {
            id: 'placement',
            name: 'PLACEMENT',
            status: 'Not started',
            hint: 'Comprehensive audit pending'
        }
    ]

    return (
        <section className="pipeline-section">
            <div className="section-header-row">
                <div className="section-title-group">
                    <span className="section-eyebrow">ROADMAP VERIFICATION</span>
                    <h2 className="section-heading">PREPARATION PROGRESS</h2>
                </div>
                <span className="section-meta-tag">Stage-by-Stage Flow</span>
            </div>

            <div className="pipeline-container">
                <div className="pipeline-track">
                    {stages.map((stage, idx) => {
                        const statusClass =
                            stage.status === 'Completed'
                                ? 'completed'
                                : stage.status === 'In progress'
                                ? 'in-progress'
                                : 'not-started'

                        return (
                            <div key={stage.id} className={`pipeline-step pipeline-step--${statusClass}`}>
                                <div className="pipeline-step-node">
                                    <span className="pipeline-node-icon">
                                        {stage.status === 'Completed' ? (
                                            <CheckCircleIcon />
                                        ) : stage.status === 'In progress' ? (
                                            <ClockIcon />
                                        ) : (
                                            <CircleDotIcon />
                                        )}
                                    </span>
                                </div>

                                <div className="pipeline-step-content">
                                    <div className="pipeline-step-top">
                                        <span className="pipeline-step-num">0{idx + 1}</span>
                                        <span className={`pipeline-status-badge pipeline-status-badge--${statusClass}`}>
                                            {stage.status}
                                        </span>
                                    </div>
                                    <h4 className="pipeline-step-name">{stage.name}</h4>
                                    <p className="pipeline-step-hint">{stage.hint}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default ProgressPipeline
