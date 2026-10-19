import React from 'react'
import { useNavigate } from 'react-router'

// ── Module Icons ───────────────────────────────────────────────────────────────
const InterviewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
)

const ResumeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
)

const JobsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
)

const SkillIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

const RoadmapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
)

const ReadinessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)

const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
)

const DriveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <line x1="9" y1="9" x2="9" y2="9.01" />
        <line x1="9" y1="13" x2="9" y2="13.01" />
        <line x1="9" y1="17" x2="9" y2="17.01" />
    </svg>
)

const AnalyticsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)

const AptitudeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 14 14"/>
        <path d="M16 8h2a2 2 0 0 1 2 2v2"/>
    </svg>
)

const InterviewRoundIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
)

const ArrowUpRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
    </svg>
)

const MODULES = [
    {
        num: '01',
        title: 'Resume & Profile',
        desc: 'Build and maintain candidate profile, academic records, and technical resume.',
        icon: <ResumeIcon />,
        path: '/resume-profile',
        status: 'active',
        badge: 'FOUNDATION'
    },
    {
        num: '02',
        title: 'Aptitude Round',
        desc: 'First screening stage: Quant, Logical Reasoning, and Verbal Ability tests.',
        icon: <AptitudeIcon />,
        path: '/aptitude',
        status: 'active',
        badge: 'ROUND 1'
    },
    {
        num: '03',
        title: 'Coding Round',
        desc: 'Technical screening: Algorithmic problem solving and timed coding tests.',
        icon: <CodeIcon />,
        path: '/coding',
        status: 'active',
        badge: 'ROUND 2'
    },
    {
        num: '04',
        title: 'Interview Round',
        desc: 'Execute interactive mock interviews and receive AI-evaluated performance reports.',
        icon: <InterviewRoundIcon />,
        path: '/interview-round',
        status: 'active',
        badge: 'ROUND 3'
    },
    {
        num: '05',
        title: 'Interview Preparation',
        desc: 'Generate role-aligned question banks, model answers, and STAR frameworks.',
        icon: <InterviewIcon />,
        path: '/interview-prep',
        status: 'active',
        badge: 'STRATEGY'
    },
    {
        num: '06',
        title: 'Jobs & Opportunities',
        desc: 'Discover live career opportunities and evaluate corporate cutoff eligibility.',
        icon: <JobsIcon />,
        path: '/jobs',
        status: 'active',
        badge: 'DISCOVERY'
    },
    {
        num: '07',
        title: 'Skill Gap Matrix',
        desc: 'Detect missing market competencies and prioritize high-leverage technical gaps.',
        icon: <SkillIcon />,
        path: '/skill-gap',
        status: 'active',
        badge: 'DIAGNOSTIC'
    },
    {
        num: '08',
        title: 'Career Roadmap',
        desc: 'Dynamic personalized milestone progression targeting your dream engineering role.',
        icon: <RoadmapIcon />,
        path: '/career-roadmap',
        status: 'active',
        badge: 'EXECUTION'
    },
    {
        num: '09',
        title: 'Placement Readiness',
        desc: 'Comprehensive 7-dimension placement readiness audit with verified evidence.',
        icon: <ReadinessIcon />,
        path: '/placement-readiness',
        status: 'active',
        badge: 'BENCHMARK'
    },
    {
        num: '10',
        title: 'Mock Placement Drive',
        desc: 'Simulate full multi-round recruitment: OA, Live Coding & Technical/HR Interview.',
        icon: <DriveIcon />,
        path: '/placement-drives',
        status: 'active',
        badge: 'SIMULATION'
    },
    {
        num: '11',
        title: 'Placement Analytics',
        desc: 'Predict corporate hiring tier probabilities, gate bottlenecks & compensation valuation.',
        icon: <AnalyticsIcon />,
        path: '/placement-analytics',
        status: 'active',
        badge: 'AI PREDICTOR'
    }
]

export const ModuleJourneyGrid = () => {
    const navigate = useNavigate()

    return (
        <section className="journey-section">
            <div className="section-header-row">
                <div className="section-title-group">
                    <span className="section-eyebrow">INTELLIGENCE PLATFORM</span>
                    <h2 className="section-heading">YOUR CAREER JOURNEY</h2>
                </div>
                <span className="section-meta-tag">11 Placement Modules</span>
            </div>

            <div className="journey-grid">
                {MODULES.map((mod) => {
                    const isActive = mod.status === 'active'

                    return (
                        <div
                            key={mod.num}
                            className={`journey-card ${isActive ? 'journey-card--active' : 'journey-card--soon'}`}
                            onClick={() => {
                                if (isActive && mod.path) navigate(mod.path)
                            }}
                            role={isActive ? 'button' : 'region'}
                            tabIndex={isActive ? 0 : -1}
                            onKeyDown={(e) => {
                                if (isActive && e.key === 'Enter' && mod.path) navigate(mod.path)
                            }}
                        >
                            <div className="journey-card-top">
                                <span className="journey-mod-num">{mod.num}</span>
                                <div className="journey-badge-row">
                                    <span className={`journey-status-badge journey-status-badge--${mod.status}`}>
                                        {mod.badge}
                                    </span>
                                    {mod.footnote && (
                                        <span className="journey-footnote-badge">{mod.footnote}</span>
                                    )}
                                </div>
                            </div>

                            <div className="journey-card-body">
                                <div className="journey-icon-wrap">{mod.icon}</div>
                                <h3 className="journey-card-title">{mod.title}</h3>
                                <p className="journey-card-desc">{mod.desc}</p>
                            </div>

                            <div className="journey-card-bottom">
                                {isActive ? (
                                    <span className="journey-action-text">
                                        <span>Open Module</span>
                                        <ArrowUpRightIcon />
                                    </span>
                                ) : (
                                    <span className="journey-disabled-text">In Platform Roadmap</span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default ModuleJourneyGrid
