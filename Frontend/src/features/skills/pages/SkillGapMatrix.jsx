import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import useSkillGap from '../hooks/useSkillGap'
import TargetRoleSelector from '../components/TargetRoleSelector'
import SkillCoverageCard from '../components/SkillCoverageCard'
import SkillCategorySection from '../components/SkillCategorySection'
import SkillGapCard from '../components/SkillGapCard'
import MatchedSkillsList from '../components/MatchedSkillsList'
import LearningRoadmap from '../components/LearningRoadmap'
import '../style/skill-gap.scss'

const AlertTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
)

export const SkillGapMatrix = () => {
    const navigate = useNavigate()
    const {
        analysis,
        availableJobs,
        selectedJobId,
        setSelectedJobId,
        loading,
        reanalyzing,
        error,
        successMessage,
        fetchAnalysis,
        handleReanalyze,
        handleProgressChange
    } = useSkillGap()

    const [activeTab, setActiveTab] = useState('categories') // 'categories' | 'gaps' | 'matched' | 'roadmap'

    // Incomplete profile state handling
    if (!loading && analysis?.status === 'PROFILE_INCOMPLETE') {
        return (
            <div className="skill-gap-page">
                <div className="skill-gap-header">
                    <div className="header-left">
                        <span className="page-eyebrow">SKILL GAP MATRIX</span>
                        <h1 className="page-title">Skill Gap Matrix</h1>
                        <p className="page-subtitle">
                            Understand what your target roles require, what you already know, and what to learn next.
                        </p>
                    </div>
                </div>

                <div className="jobs-empty-state" style={{ padding: '3.5rem 2rem' }}>
                    <div className="empty-icon-wrapper" style={{ color: '#f59e0b' }}>
                        <AlertTriangleIcon />
                    </div>
                    <h3 className="empty-title">Profile Information Incomplete</h3>
                    <p className="empty-desc">
                        To generate an accurate Skill Gap Matrix, CareerAI needs your technical skills, target role, or an uploaded resume.
                    </p>

                    {analysis.missingElements && analysis.missingElements.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.5rem 0' }}>
                            {analysis.missingElements.map((item, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        backgroundColor: 'var(--bg-elevated)',
                                        border: '1px solid var(--border-default)',
                                        borderRadius: 'var(--radius-xs)',
                                        padding: '0.2rem 0.6rem',
                                        color: 'var(--text-secondary)'
                                    }}
                                >
                                    Missing: {item}
                                </span>
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        className="empty-action-btn"
                        onClick={() => navigate('/resume-profile')}
                        style={{ backgroundColor: 'var(--accent)', color: 'white', border: 'none', fontWeight: 700 }}
                    >
                        Complete Candidate Profile →
                    </button>
                </div>
            </div>
        )
    }

    const skills = analysis?.skills || []
    const matchedSkills = skills.filter(s => s.status === 'MATCHED')
    const weakSkills = skills.filter(s => s.status === 'WEAK_EVIDENCE')
    const missingSkills = skills.filter(s => s.status === 'MISSING')
    const gapSkills = [...weakSkills, ...missingSkills]

    // Group skills by category
    const categoriesMap = new Map()
    skills.forEach(s => {
        const cat = s.category || 'General'
        if (!categoriesMap.has(cat)) categoriesMap.set(cat, [])
        categoriesMap.get(cat).push(s)
    })
    const categoryEntries = Array.from(categoriesMap.entries())

    return (
        <div className="skill-gap-page">
            {/* Alerts */}
            {error && (
                <div
                    style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        padding: '0.75rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={() => fetchAnalysis(selectedJobId || null)}
                        style={{ background: 'none', border: 'none', color: '#f87171', fontWeight: 700, cursor: 'pointer' }}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {successMessage && (
                <div
                    style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#4ade80',
                        padding: '0.75rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)'
                    }}
                >
                    ✓ {successMessage}
                </div>
            )}

            {/* Page Header */}
            <div className="skill-gap-header">
                <div className="header-left">
                    <span className="page-eyebrow">COMPETENCY INTELLIGENCE</span>
                    <h1 className="page-title">Skill Gap Matrix</h1>
                    <p className="page-subtitle">
                        Understand what your target roles require, what you already know, and what to learn next. CareerAI audits your profile and resume against actual career standards.
                    </p>
                </div>
            </div>

            {/* Target Role & Benchmark Selector */}
            <TargetRoleSelector
                currentRole={analysis?.targetRole}
                availableJobs={availableJobs}
                selectedJobId={selectedJobId}
                onRoleChange={(role) => handleReanalyze(role, null)}
                onJobSelect={(jobId) => {
                    setSelectedJobId(jobId)
                    if (jobId) handleReanalyze(null, jobId)
                }}
                onReanalyze={(role, jobId) => handleReanalyze(role, jobId)}
                reanalyzing={reanalyzing}
            />

            {/* Loading Skeleton */}
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ height: '140px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', opacity: 0.6 }} />
                    <div style={{ height: '220px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', opacity: 0.6 }} />
                </div>
            ) : analysis ? (
                <>
                    {/* Overall Coverage Score Card */}
                    <SkillCoverageCard
                        analysis={analysis}
                        onReanalyze={handleReanalyze}
                        reanalyzing={reanalyzing}
                    />

                    {/* View Filter Tabs */}
                    <div className="jobs-tabs-nav" role="tablist">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'categories'}
                            className={`tab-btn ${activeTab === 'categories' ? 'tab-btn--active' : ''}`}
                            onClick={() => setActiveTab('categories')}
                        >
                            <span>Domain Categories</span>
                            <span className="tab-badge">{categoryEntries.length}</span>
                        </button>

                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'gaps'}
                            className={`tab-btn ${activeTab === 'gaps' ? 'tab-btn--active' : ''}`}
                            onClick={() => setActiveTab('gaps')}
                        >
                            <span>Identified Gaps</span>
                            {gapSkills.length > 0 && <span className="tab-badge">{gapSkills.length}</span>}
                        </button>

                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'matched'}
                            className={`tab-btn ${activeTab === 'matched' ? 'tab-btn--active' : ''}`}
                            onClick={() => setActiveTab('matched')}
                        >
                            <span>Verified Strengths</span>
                            {matchedSkills.length > 0 && <span className="tab-badge">{matchedSkills.length}</span>}
                        </button>

                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'roadmap'}
                            className={`tab-btn ${activeTab === 'roadmap' ? 'tab-btn--active' : ''}`}
                            onClick={() => setActiveTab('roadmap')}
                        >
                            <span>What To Learn Next</span>
                            {analysis.learningRoadmap?.length > 0 && (
                                <span className="tab-badge">{analysis.learningRoadmap.length}</span>
                            )}
                        </button>
                    </div>

                    {/* Tab Views */}
                    {activeTab === 'categories' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {categoryEntries.map(([catName, catSkills]) => (
                                <SkillCategorySection
                                    key={catName}
                                    categoryName={catName}
                                    skills={catSkills}
                                    onProgressChange={handleProgressChange}
                                />
                            ))}
                        </div>
                    )}

                    {activeTab === 'gaps' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {gapSkills.length > 0 ? (
                                gapSkills.map((s, idx) => (
                                    <SkillGapCard
                                        key={idx}
                                        skill={s}
                                        onProgressChange={handleProgressChange}
                                    />
                                ))
                            ) : (
                                <div className="jobs-empty-state">
                                    <h3 className="empty-title">Zero Skill Gaps Detected!</h3>
                                    <p className="empty-desc">
                                        Your Candidate Profile demonstrates strong verified evidence across all required competencies for {analysis.targetRole}.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'matched' && (
                        <MatchedSkillsList matchedSkills={matchedSkills} />
                    )}

                    {activeTab === 'roadmap' && (
                        <LearningRoadmap milestones={analysis.learningRoadmap || []} />
                    )}
                </>
            ) : null}
        </div>
    )
}

export default SkillGapMatrix
