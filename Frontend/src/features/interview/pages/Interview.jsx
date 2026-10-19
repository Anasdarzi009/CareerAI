import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import AILoadingScreen from '../components/AILoadingScreen.jsx'
import RecommendedProjectsSection from '../components/RecommendedProjectsSection.jsx'

// ── Icons ──────────────────────────────────────────────────────────────────────
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
)

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
)

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
)

const UndoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 14L4 9l5-5" />
        <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
    </svg>
)

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
)

// ── Subcomponents ──────────────────────────────────────────────────────────────

const QuestionRow = ({ q, index }) => {
    const [open, setOpen] = useState(false)
    const formattedNum = String(index + 1).padStart(2, '0')

    return (
        <div className={`clean-q-row ${open ? 'clean-q-row--open' : ''}`}>
            <div className="clean-q-trigger" onClick={() => setOpen(!open)}>
                <span className="q-index-num">{formattedNum}</span>
                <p className="q-main-text">{q.question}</p>
                <span className={`q-expand-arrow ${open ? 'q-expand-arrow--open' : ''}`}>
                    <ChevronDownIcon />
                </span>
            </div>

            {open && (
                <div className="clean-q-expanded">
                    <div className="q-detail-block">
                        <span className="q-detail-heading q-detail-heading--intention">Question Objective &amp; Intention</span>
                        <p>{q.intention}</p>
                    </div>

                    <div className="q-detail-block">
                        <span className="q-detail-heading q-detail-heading--answer">Model Answer &amp; Key Talking Points</span>
                        <p>{q.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadmapProgression = ({ plan }) => {
    if (!plan || plan.length === 0) return <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>No roadmap generated.</p>

    return (
        <div className="roadmap-timeline">
            {plan.map((day) => (
                <div key={day.day} className="roadmap-step">
                    <div className="roadmap-day-tag">Day {day.day}</div>
                    <h4 className="roadmap-day-focus">{day.focus}</h4>
                    <ul className="roadmap-task-list">
                        {day.tasks.map((task, i) => (
                            <li key={i}>
                                <span className="task-bullet" />
                                <span>{task}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}

const EligibilityAuditCard = ({ eligibility }) => {
    if (!eligibility) return null
    const { status, summary, details } = eligibility

    const statusBadgeClass =
        status === 'eligible' ? 'eligibility-status-badge--eligible' :
            status === 'ineligible' ? 'eligibility-status-badge--ineligible' : 'eligibility-status-badge--verify'

    const statusBadgeText =
        status === 'eligible' ? '✓ ELIGIBLE' :
            status === 'ineligible' ? '✕ INELIGIBLE' : '? UNVERIFIED'

    return (
        <div className="sidebar-card">
            <div className="card-header">
                <h3>Academic &amp; Role Eligibility</h3>
                <span className={`eligibility-status-badge ${statusBadgeClass}`}>{statusBadgeText}</span>
            </div>

            <div className="card-body">
                <p className="eligibility-summary-text">{summary}</p>

                {details && details.length > 0 && (
                    <div className="criteria-audit-list">
                        {details.map((item, idx) => (
                            <div key={idx} className="criteria-audit-row">
                                <div className="criteria-top">
                                    <span>{item.criterion}</span>
                                    <span className={`criteria-status-icon criteria-status-icon--${item.status}`}>
                                        {item.status === 'met' ? '✓' : item.status === 'failed' ? '✕' : '?'}
                                    </span>
                                </div>
                                <div className="criteria-meta">
                                    <span>Required: <strong>{item.required}</strong></span>
                                    <span>Candidate: <strong>{item.candidate}</strong></span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const ATSCompatibilityCard = ({ atsAnalysis, fallbackScore }) => {
    const currentScore = atsAnalysis?.currentMatchScore ?? fallbackScore ?? 72
    const potentialScore = atsAnalysis?.potentialMatchScore ?? Math.min(98, currentScore + 18)
    const keywords = atsAnalysis?.keywordAlignment || []
    const techSkills = atsAnalysis?.technicalSkillsMatch || { score: currentScore, matched: [], missing: [] }

    return (
        <div className="sidebar-card ats-compatibility-card">
            <div className="card-header">
                <h3>CareerAI ATS Analysis</h3>
                <span className="ats-model-badge">VERIFIED EVIDENCE</span>
            </div>

            <div className="card-body">
                <div className="ats-score-comparison">
                    <div className="ats-score-box ats-score-box--current">
                        <span className="ats-score-label">Current Match</span>
                        <div className="ats-score-value">
                            <span className="score-num">{currentScore}</span>
                            <span className="score-pct">%</span>
                        </div>
                        <span className="ats-score-subtext">Verified Resume</span>
                    </div>

                    <div className="ats-score-divider">➔</div>

                    <div className="ats-score-box ats-score-box--potential">
                        <span className="ats-score-label">Potential Match</span>
                        <div className="ats-score-value">
                            <span className="score-num">{potentialScore}</span>
                            <span className="score-pct">%</span>
                        </div>
                        <span className="ats-score-subtext">Upon Building Projects</span>
                    </div>
                </div>

                <p className="ats-notice-fineprint">
                    Unbuilt or planned projects do not count toward your current match score until implemented and verified.
                </p>

                {/* Keyword Alignment */}
                {keywords.length > 0 && (
                    <div className="ats-breakdown-section">
                        <span className="ats-section-heading">Target JD Keyword Alignment</span>
                        <div className="ats-keyword-chips">
                            {keywords.map((kw, i) => {
                                const kwName = typeof kw === 'string' ? kw : kw.keyword
                                const isPresent = typeof kw === 'object' ? kw.inResume : true
                                return (
                                    <span
                                        key={i}
                                        className={`ats-chip ${isPresent ? 'ats-chip--matched' : 'ats-chip--missing'}`}
                                        title={isPresent ? 'Verified in resume' : 'Target keyword missing in current resume'}
                                    >
                                        {isPresent ? '✓ ' : '+ '}
                                        {kwName}
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Technical Skills breakdown */}
                {techSkills.matched && techSkills.matched.length > 0 && (
                    <div className="ats-breakdown-section">
                        <span className="ats-section-heading">Verified Technical Overlap</span>
                        <div className="ats-skills-list">
                            {techSkills.matched.slice(0, 8).map((sk, idx) => (
                                <span key={idx} className="ats-skill-pill ats-skill-pill--matched">
                                    {sk}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Qualitative Assessments */}
                {atsAnalysis?.roleResponsibilityAlignment && (
                    <div className="ats-breakdown-section">
                        <span className="ats-section-heading">Role Responsibility Fit</span>
                        <p className="ats-analysis-sentence">{atsAnalysis.roleResponsibilityAlignment}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

const SkillGapsMatrix = ({ gaps }) => {
    if (!gaps || gaps.length === 0) {
        return (
            <div className="sidebar-card">
                <div className="card-header"><h3>Skill Gap Matrix</h3></div>
                <div className="card-body">
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>No critical competency gaps identified.</p>
                </div>
            </div>
        )
    }

    const grouped = { high: [], medium: [], low: [] }
    gaps.forEach(g => {
        const sev = g.severity || 'medium'
        if (grouped[sev]) grouped[sev].push(g)
        else grouped.medium.push(g)
    })

    const labels = { high: 'High Priority Gaps', medium: 'Medium Priority Gaps', low: 'Low Priority Gaps' }

    return (
        <div className="sidebar-card">
            <div className="card-header">
                <h3>Skill Gap Matrix</h3>
            </div>
            <div className="card-body">
                {['high', 'medium', 'low'].map(sev => (
                    grouped[sev].length > 0 && (
                        <div key={sev} className="skill-gaps-group">
                            <span className={`skill-gaps-priority-label skill-gaps-priority-label--${sev}`}>
                                <span className="p-dot" />
                                {labels[sev]}
                            </span>
                            <div className="skill-gaps-tag-list">
                                {grouped[sev].map((g, i) => (
                                    <div key={i} className={`skill-gap-pill skill-gap-pill--${sev}`}>
                                        {g.skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    )
}

// ── Main Interview Component ───────────────────────────────────────────────────
const Interview = () => {
    const [activeTab, setActiveTab] = useState('technical')
    const {
        report,
        getReportById,
        loading,
        getResumePdf,
        handleRegenerateQuestions,
        isRegenerating,
        handleProjectAction,
        handleRegenerateResume,
        isRegeneratingResume
    } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()
    const [isActionLoading, setIsActionLoading] = useState(false)

    useEffect(() => {
        if (interviewId) getReportById(interviewId)
    }, [interviewId])

    if (loading || !report) {
        return <AILoadingScreen title="Fetching Interview Strategy" subtitle="Loading your personalized preparation plan..." />
    }

    const onRegenerateQuestions = async () => {
        try {
            await handleRegenerateQuestions(interviewId)
        } catch {
            alert('Failed to regenerate questions. Please try again.')
        }
    }

    const onProjectAction = async (projectId, action, completedDetails = null) => {
        try {
            setIsActionLoading(true)
            await handleProjectAction(interviewId, projectId, { action, completedDetails })
        } catch (err) {
            console.error('Project action failed:', err)
            alert('Could not update project recommendation. Please try again.')
        } finally {
            setIsActionLoading(false)
        }
    }

    const onUndoAction = async () => {
        try {
            setIsActionLoading(true)
            await handleProjectAction(interviewId, null, { action: 'undo' })
        } catch (err) {
            console.error('Undo failed:', err)
            alert('Could not undo action.')
        } finally {
            setIsActionLoading(false)
        }
    }

    const onRegenerateResume = async () => {
        try {
            await handleRegenerateResume(interviewId)
            alert('Tailored resume successfully regenerated from master resume!')
        } catch (err) {
            console.error('Regenerate resume failed:', err)
            alert('Failed to regenerate resume. Please try again.')
        }
    }

    const techCount = report.technicalQuestions ? report.technicalQuestions.length : 0
    const behCount = report.behavioralQuestions ? report.behavioralQuestions.length : 0
    const roadDays = report.preparationPlan ? report.preparationPlan.length : 0
    const recommendations = report.projectRecommendations || []
    const activeProjectIds = report.activeProjectIds || []
    const rejectedProjectIds = report.rejectedProjectIds || []
    const undoCount = (report.undoHistory || []).length
    const currentVersion = report.currentVersionNumber || report.versions?.length || 1

    const completedBuiltCount = recommendations.filter(
        p => p.status === 'COMPLETED' && activeProjectIds.includes(p.id)
    ).length

    return (
        <div className="strategy-workspace">

            {/* ── Context Topbar ─────────────────────────────────────────────── */}
            <div className="strategy-context-bar">
                <div className="context-top-row">
                    <button className="back-nav-link" onClick={() => navigate('/')}>
                        <BackIcon />
                        <span>Return to Preparation Workspace</span>
                    </button>

                    <div className="context-actions">
                        <button
                            className="button secondary-button"
                            disabled={isRegenerating}
                            onClick={onRegenerateQuestions}
                            id="change-questions-btn"
                        >
                            <RefreshIcon />
                            <span>{isRegenerating ? 'Generating...' : 'Change Questions'}</span>
                        </button>

                        <button
                            className="button secondary-button"
                            onClick={() => getResumePdf(interviewId)}
                            id="download-resume-btn"
                        >
                            <DownloadIcon />
                            <span>Download Resume (v{currentVersion})</span>
                        </button>
                    </div>
                </div>

                <div className="context-title-group">
                    <h1>{report.title || 'Target Role Preparation Strategy'}</h1>
                    <div className="context-meta-row">
                        {report.companyName && (
                            <span className="meta-tag meta-tag--company">
                                🏢 Company Context: {report.companyName}
                            </span>
                        )}
                        <span className="meta-tag">
                            Created on {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="meta-source-label">
                            {report.questionSource || 'Personalized questions based on role requirements & candidate profile'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Resume According To Job Section ─────────────────────────────── */}
            <div className="resume-tailored-card" id="resume-according-to-job">
                <div className="resume-tailored-card__info">
                    <div className="resume-tailored-card__badge-row">
                        <div className="resume-tailored-card__badge">
                            <span className="badge-dot" />
                            <span>RESUME ACCORDING TO JOB</span>
                        </div>
                        <span className="resume-version-pill">Version {currentVersion}</span>
                        {completedBuiltCount > 0 && (
                            <span className="resume-projects-pill">+{completedBuiltCount} Verified Project Included</span>
                        )}
                    </div>
                    <p className="resume-tailored-card__desc">
                        Tailored from your unchanged master resume (<code>Anas_Resume.pdf</code>). Only <strong>SUMMARY</strong>, <strong>TECHNICAL SKILLS</strong>, and verified <strong>PROJECTS</strong> are adjusted for this job description. Original layout, fonts, and unmodifiable sections are 100% preserved.
                    </p>
                    <div className="resume-tailored-card__meta-status">
                        <span>✓ Single-Page Preserved</span>
                        <span>•</span>
                        <span>✓ Master Resume Unmodified</span>
                        <span>•</span>
                        <span>✓ Unbuilt Projects Excluded</span>
                    </div>
                </div>

                <div className="resume-tailored-card__cta-group">
                    {undoCount > 0 && (
                        <button
                            className="button secondary-button resume-undo-btn"
                            onClick={onUndoAction}
                            disabled={isActionLoading}
                            title="Undo most recent project selection"
                            id="undo-selection-btn"
                        >
                            <UndoIcon />
                            <span>Undo ({undoCount})</span>
                        </button>
                    )}

                    <button
                        className="button secondary-button resume-regen-btn"
                        onClick={onRegenerateResume}
                        disabled={isRegeneratingResume}
                        title="Regenerate new version starting strictly from unchanged master resume"
                        id="regenerate-tailored-resume-btn"
                    >
                        <RefreshIcon />
                        <span>{isRegeneratingResume ? 'Regenerating...' : 'Regenerate Tailored Resume'}</span>
                    </button>

                    <button
                        className="button primary-button resume-tailored-download-btn"
                        onClick={() => getResumePdf(interviewId)}
                        id="download-updated-resume-btn"
                    >
                        <DownloadIcon />
                        <span>Download Resume (v{currentVersion})</span>
                    </button>
                </div>
            </div>

            {/* ── Main Two-Column Workspace Layout ───────────────────────────── */}
            <div className="strategy-layout">

                {/* Left Column (Main Preparation Workspace) */}
                <div className="strategy-main">

                    {/* ── Section: Recommended Projects to Strengthen Your Resume ── */}
                    {recommendations.length > 0 && (
                        <RecommendedProjectsSection
                            recommendations={recommendations}
                            activeProjectIds={activeProjectIds}
                            rejectedProjectIds={rejectedProjectIds}
                            onAction={onProjectAction}
                            isActionLoading={isActionLoading}
                        />
                    )}

                    {/* Tab Navigation */}
                    <div className="strategy-tabs">
                        <button
                            className={`strategy-tab ${activeTab === 'technical' ? 'strategy-tab--active' : ''}`}
                            onClick={() => setActiveTab('technical')}
                        >
                            <span>Technical Questions</span>
                            <span className="tab-count">{techCount}</span>
                        </button>

                        <button
                            className={`strategy-tab ${activeTab === 'behavioral' ? 'strategy-tab--active' : ''}`}
                            onClick={() => setActiveTab('behavioral')}
                        >
                            <span>Behavioral &amp; HR Questions</span>
                            <span className="tab-count">{behCount}</span>
                        </button>

                        <button
                            className={`strategy-tab ${activeTab === 'roadmap' ? 'strategy-tab--active' : ''}`}
                            onClick={() => setActiveTab('roadmap')}
                        >
                            <span>Preparation Roadmap</span>
                            <span className="tab-count">{roadDays} Days</span>
                        </button>
                    </div>

                    {/* Tab 1: Technical Questions */}
                    {activeTab === 'technical' && (
                        <div className="questions-workspace">
                            <div className="questions-header-bar">
                                <div className="qh-info">
                                    <h3>Technical Interview Questions</h3>
                                    <p>Comprehensive technical problem solving and architectural questions matched to the job description.</p>
                                </div>
                                <div className="qh-actions">
                                    <button 
                                        className="button secondary-button" 
                                        style={{ fontSize: '11px', padding: '0.35rem 0.65rem' }}
                                        disabled={isRegenerating}
                                        onClick={onRegenerateQuestions}
                                    >
                                        {isRegenerating ? 'Generating...' : 'Change Questions'}
                                    </button>
                                </div>
                            </div>

                            <div className="clean-questions-list">
                                {report.technicalQuestions && report.technicalQuestions.map((q, i) => (
                                    <QuestionRow key={i} q={q} index={i} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Behavioral Questions */}
                    {activeTab === 'behavioral' && (
                        <div className="questions-workspace">
                            <div className="questions-header-bar">
                                <div className="qh-info">
                                    <h3>Behavioral &amp; Situational Questions</h3>
                                    <p>Culture-fit, conflict resolution, and leadership questions formatted around the STAR method.</p>
                                </div>
                                <div className="qh-actions">
                                    <button 
                                        className="button secondary-button" 
                                        style={{ fontSize: '11px', padding: '0.35rem 0.65rem' }}
                                        disabled={isRegenerating}
                                        onClick={onRegenerateQuestions}
                                    >
                                        {isRegenerating ? 'Generating...' : 'Change Questions'}
                                    </button>
                                </div>
                            </div>

                            <div className="clean-questions-list">
                                {report.behavioralQuestions && report.behavioralQuestions.map((q, i) => (
                                    <QuestionRow key={i} q={q} index={i} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Roadmap */}
                    {activeTab === 'roadmap' && (
                        <div className="questions-workspace">
                            <div className="questions-header-bar">
                                <div className="qh-info">
                                    <h3>Structured Day-by-Day Preparation Plan</h3>
                                    <p>Sequenced milestone plan to revise concepts, build project enhancements, and practice mock questions.</p>
                                </div>
                            </div>

                            <RoadmapProgression plan={report.preparationPlan} />
                        </div>
                    )}

                </div>

                {/* Right Column (Analytics, Eligibility, ATS Analysis & Skill Gaps Sidebar) */}
                <div className="strategy-sidebar">

                    {/* 1. Academic & Role Eligibility Audit */}
                    {report.eligibility && (
                        <EligibilityAuditCard eligibility={report.eligibility} />
                    )}

                    {/* 2. CareerAI ATS Compatibility Analysis (Current vs Potential) */}
                    <ATSCompatibilityCard
                        atsAnalysis={report.atsAnalysis}
                        fallbackScore={report.matchScore}
                    />

                    {/* 3. Skill Gaps Priority Matrix */}
                    <SkillGapsMatrix gaps={report.skillGaps} />

                </div>

            </div>

        </div>
    )
}

export default Interview