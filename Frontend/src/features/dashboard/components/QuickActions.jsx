import React from 'react'
import { useNavigate } from 'react-router'

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

const ResumeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
)

const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
)

const MatrixIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

const RoadmapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
)

const ReadinessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)

const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
)

const DriveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <line x1="9" y1="9" x2="9" y2="9.01" />
        <line x1="9" y1="13" x2="9" y2="13.01" />
        <line x1="9" y1="17" x2="9" y2="17.01" />
    </svg>
)

const AnalyticsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)

const AptitudeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 14 14"/>
        <path d="M16 8h2a2 2 0 0 1 2 2v2"/>
    </svg>
)

export const QuickActions = () => {
    const navigate = useNavigate()

    return (
        <div className="quick-actions-card">
            <div className="quick-actions-header">
                <span className="quick-actions-title">QUICK ACTIONS</span>
            </div>

            <div className="quick-actions-list">
                {/* Active Action 1: Start Aptitude Practice */}
                <button
                    className="action-btn action-btn--primary"
                    onClick={() => navigate('/aptitude')}
                >
                    <AptitudeIcon />
                    <span>Start Aptitude Practice</span>
                </button>

                {/* Active Action 2: Create Interview Plan */}
                <button
                    className="action-btn action-btn--secondary"
                    onClick={() => navigate('/interview-prep')}
                >
                    <PlusIcon />
                    <span>Create Interview Plan</span>
                </button>

                {/* Active Action 2: Manage Account */}
                <button
                    className="action-btn action-btn--secondary"
                    onClick={() => navigate('/account')}
                >
                    <UserIcon />
                    <span>Manage Account &amp; Profile</span>
                </button>

                {/* Active Action 3: View Resume & Profile */}
                <button
                    className="action-btn action-btn--secondary"
                    onClick={() => navigate('/resume-profile')}
                >
                    <ResumeIcon />
                    <span>View Resume &amp; Profile</span>
                </button>

                {/* Active Action 4: Explore Opportunities */}
                <button
                    className="action-btn action-btn--secondary"
                    onClick={() => navigate('/jobs')}
                >
                    <BriefcaseIcon />
                    <span>Explore Opportunities</span>
                </button>

                {/* Active Action 5: Review Skill Gaps */}
                <button
                    className="action-btn action-btn--secondary"
                    onClick={() => navigate('/skill-gap')}
                >
                    <MatrixIcon />
                    <span>Review Skill Gaps</span>
                </button>

                {/* Active Action 6: View Career Roadmap */}
                <button
                    className="action-btn action-btn--secondary"
                    onClick={() => navigate('/career-roadmap')}
                >
                    <RoadmapIcon />
                    <span>View Career Roadmap</span>
                </button>

                {/* Active Action 7: Audit Placement Readiness */}
                <button
                    className="action-btn action-btn--secondary"
                    onClick={() => navigate('/placement-readiness')}
                >
                    <ReadinessIcon />
                    <span>Audit Placement Readiness</span>
                </button>

                {/* Active Action 8: Start Coding Practice */}
                <button
                    className="action-btn action-btn--secondary"
                    onClick={() => navigate('/coding')}
                >
                    <CodeIcon />
                    <span>Start Coding Practice</span>
                </button>

                {/* Active Action 9: Simulate Placement Drive */}
                <button
                    className="action-btn action-btn--secondary"
                    onClick={() => navigate('/placement-drives')}
                >
                    <DriveIcon />
                    <span>Simulate Placement Drive</span>
                </button>

                {/* Active Action 10: Predict Offer Probability */}
                <button
                    className="action-btn action-btn--secondary"
                    onClick={() => navigate('/placement-analytics')}
                >
                    <AnalyticsIcon />
                    <span>Predict Offer Probability</span>
                </button>
            </div>
        </div>
    )
}

export default QuickActions
