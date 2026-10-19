import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '../../features/auth/hooks/useAuth'
import Avatar from '../common/Avatar'
import './app-shell.scss'

// ── Icons ──────────────────────────────────────────────────────────────────────
const BrandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
)

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
)

const InterviewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
)

const ResumeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
)

const JobsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
)

const SkillIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

const RoadmapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
)

const ReadinessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)

const CodingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
)

const DriveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <line x1="9" y1="9" x2="9" y2="9.01" />
        <line x1="9" y1="13" x2="9" y2="13.01" />
        <line x1="9" y1="17" x2="9" y2="17.01" />
    </svg>
)

const AnalyticsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
)

const HelpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
)

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
)

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
)

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
)

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const AptitudeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 14 14"/>
        <path d="M16 8h2a2 2 0 0 1 2 2v2"/>
    </svg>
)

const InterviewRoundIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
)

const NAV_ITEMS = [
    { id: 'resume', label: 'Resume & Profile', path: '/resume-profile', icon: <ResumeIcon /> },
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { id: 'aptitude', label: 'Aptitude Round', path: '/aptitude', icon: <AptitudeIcon />, badge: 'Round 1' },
    { id: 'coding', label: 'Coding Round', path: '/coding', icon: <CodingIcon />, badge: 'Round 2' },
    { id: 'interview_round', label: 'Interview Round', path: '/interview-round', icon: <InterviewRoundIcon />, badge: 'Round 3' },
    { id: 'interview_prep', label: 'Interview Preparation', path: '/interview-prep', icon: <InterviewIcon /> },
    { id: 'jobs', label: 'Jobs & Opportunities', path: '/jobs', icon: <JobsIcon /> },
    { id: 'skills', label: 'Skill Gap Matrix', path: '/skill-gap', icon: <SkillIcon /> },
    { id: 'roadmap', label: 'Career Roadmap', path: '/career-roadmap', icon: <RoadmapIcon /> },
    { id: 'placement', label: 'Placement Readiness', path: '/placement-readiness', icon: <ReadinessIcon /> },
    { id: 'drives', label: 'Mock Placement Drive', path: '/placement-drives', icon: <DriveIcon />, badge: 'Drive' },
    { id: 'analytics', label: 'Placement Analytics', path: '/placement-analytics', icon: <AnalyticsIcon />, badge: 'AI' },
]

export const AppShell = ({ children }) => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const userMenuRef = React.useRef(null)

    // Close user menu on outside click
    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false)
            }
        }
        if (userMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('touchstart', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [userMenuOpen])

    // Lock background scroll when mobile sidebar drawer is open
    React.useEffect(() => {
        if (sidebarOpen) {
            const originalOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'
            return () => {
                document.body.style.overflow = originalOverflow
            }
        }
    }, [sidebarOpen])

    // Close overlays on Escape key
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSidebarOpen(false)
                setUserMenuOpen(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const onLogout = async () => {
        try {
            await handleLogout()
            navigate('/login')
        } catch (err) {
            navigate('/login')
        }
    }

    const username = user?.username || user?.email?.split('@')[0] || 'Candidate'
    const initials = username.slice(0, 2).toUpperCase()

    const isResumeActive = location.pathname === '/resume-profile' || location.pathname === '/profile'
    const isDashboardActive = location.pathname === '/dashboard' || location.pathname === '/'
    const isAptitudeActive = location.pathname.startsWith('/aptitude')
    const isCodingActive = location.pathname.startsWith('/coding')
    const isInterviewRoundActive = location.pathname.startsWith('/interview-round') || location.pathname.startsWith('/mock-interview')
    const isInterviewPrepActive = location.pathname === '/interview-prep' || location.pathname === '/interview' || (location.pathname.startsWith('/interview/') && !isInterviewRoundActive)
    const isJobsActive = location.pathname.startsWith('/jobs')
    const isSkillsActive = location.pathname.startsWith('/skill-gap') || location.pathname.startsWith('/skills')
    const isRoadmapActive = location.pathname.startsWith('/career-roadmap') || location.pathname.startsWith('/roadmap')
    const isPlacementActive = location.pathname.startsWith('/placement-readiness') || location.pathname.startsWith('/placement')
    const isDrivesActive = location.pathname.startsWith('/placement-drives') || location.pathname.startsWith('/mock-drive')
    const isAnalyticsActive = location.pathname.startsWith('/placement-analytics') || location.pathname.startsWith('/offer-predictor')

    return (
        <div className="app-layout">
            {/* Mobile Drawer Overlay */}
            {sidebarOpen && (
                <div
                    className="app-backdrop"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Fixed Left Sidebar ────────────────────────────────────────────── */}
            <aside className={`app-sidebar ${sidebarOpen ? 'app-sidebar--open' : ''}`}>
                <div className="sidebar-top">
                    {/* Brand Identifier */}
                    <div className="sidebar-brand" onClick={() => navigate('/dashboard')}>
                        <div className="brand-badge-icon">
                            <BrandIcon />
                        </div>
                        <div className="brand-meta">
                            <span className="brand-title">Career<span className="brand-accent">AI</span></span>
                            <span className="brand-subtitle">Placement Readiness Platform</span>
                        </div>
                        <button
                            className="mobile-sidebar-close"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close Navigation"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="sidebar-nav">
                        <span className="nav-group-label">Placement Journey</span>
                        {NAV_ITEMS.map((item) => {
                            const isActive =
                                (item.id === 'resume' && isResumeActive) ||
                                (item.id === 'dashboard' && isDashboardActive) ||
                                (item.id === 'aptitude' && isAptitudeActive) ||
                                (item.id === 'coding' && isCodingActive) ||
                                (item.id === 'interview_round' && isInterviewRoundActive) ||
                                (item.id === 'interview_prep' && isInterviewPrepActive) ||
                                (item.id === 'jobs' && isJobsActive) ||
                                (item.id === 'skills' && isSkillsActive) ||
                                (item.id === 'roadmap' && isRoadmapActive) ||
                                (item.id === 'placement' && isPlacementActive) ||
                                (item.id === 'drives' && isDrivesActive) ||
                                (item.id === 'analytics' && isAnalyticsActive)

                            return (
                                <button
                                    key={item.id}
                                    className={`nav-link ${isActive ? 'nav-link--active' : ''} ${item.disabled ? 'nav-link--disabled' : ''}`}
                                    onClick={() => {
                                        if (item.disabled) return
                                        navigate(item.path)
                                        setSidebarOpen(false)
                                    }}
                                    disabled={item.disabled}
                                    title={item.disabled ? `${item.label} (Coming soon in next phase)` : item.label}
                                >
                                    <span className="nav-link__icon">{item.icon}</span>
                                    <span className="nav-link__text">{item.label}</span>
                                    {item.badge && (
                                        <span className={`nav-link__badge nav-link__badge--${item.badge.toLowerCase()}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                {/* Sidebar Bottom Footer Actions */}
                <div className="sidebar-bottom">
                    <div className="sidebar-bottom-links">
                        <button className="bottom-link" onClick={() => navigate('/account')}>
                            <SettingsIcon />
                            <span>Account</span>
                        </button>
                        <button className="bottom-link" onClick={() => navigate('/')}>
                            <HelpIcon />
                            <span>Help &amp; Docs</span>
                        </button>
                        <button className="bottom-link bottom-link--danger" onClick={onLogout}>
                            <LogoutIcon />
                            <span>Sign Out</span>
                        </button>
                    </div>

                    {/* Project & Build Info */}
                    <div className="sidebar-system-info">
                        <span className="system-dot" />
                        <span className="system-text">GenAI Platform v2.4</span>
                    </div>
                </div>
            </aside>

            {/* ── Main App Container ────────────────────────────────────────────── */}
            <div className="app-main-wrapper">
                {/* ── Top Header Bar ─────────────────────────────────────────────── */}
                <header className="app-topbar">
                    <div className="topbar-left">
                        <button
                            className="mobile-hamburger"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open Navigation"
                        >
                            <MenuIcon />
                        </button>
                        <div className="platform-tagline">
                            <span className="platform-tagline__title">
                                GenAI-Based Intelligent Career Preparation &amp; Placement Readiness
                            </span>
                        </div>
                    </div>

                    <div className="topbar-right">
                        {/* User Profile Trigger */}
                        <div className="user-profile-menu" ref={userMenuRef}>
                            <button
                                className="user-profile-btn"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                aria-label="Candidate profile menu"
                            >
                                <Avatar avatarId={user?.avatar || 'avatar-1'} size={24} />
                                <span className="user-name">{username}</span>
                                <span className="user-chevron"><ChevronDownIcon /></span>
                            </button>

                            {/* Dropdown Menu */}
                            {userMenuOpen && (
                                <div className="user-dropdown">
                                    <div className="user-dropdown-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                            <Avatar avatarId={user?.avatar || 'avatar-1'} size={32} />
                                            <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                                                <p className="user-dropdown-name">{username}</p>
                                                <p className="user-dropdown-email">{user?.email || 'Logged in candidate'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="user-dropdown-divider" />
                                    <button
                                        className="user-dropdown-item"
                                        onClick={() => {
                                            navigate('/resume-profile')
                                            setUserMenuOpen(false)
                                        }}
                                    >
                                        <ResumeIcon />
                                        <span>Resume &amp; Profile</span>
                                    </button>
                                    <button
                                        className="user-dropdown-item"
                                        onClick={() => {
                                            navigate('/account')
                                            setUserMenuOpen(false)
                                        }}
                                    >
                                        <UserIcon />
                                        <span>Account</span>
                                    </button>
                                    <div className="user-dropdown-divider" />
                                    <button
                                        className="user-dropdown-item user-dropdown-item--danger"
                                        onClick={() => {
                                            setUserMenuOpen(false)
                                            onLogout()
                                        }}
                                    >
                                        <LogoutIcon />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* ── Scrollable Workspace Content ───────────────────────────────── */}
                <main className="app-content-body">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AppShell
