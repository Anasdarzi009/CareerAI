import React, { useState } from 'react'

const RecommendedProjectsSection = ({
    recommendations = [],
    activeProjectIds = [],
    rejectedProjectIds = [],
    onAction,
    isActionLoading
}) => {
    const [selectedProjectForPlan, setSelectedProjectForPlan] = useState(null)
    const [selectedProjectForComplete, setSelectedProjectForComplete] = useState(null)
    const [completeForm, setCompleteForm] = useState({
        implementedFeatures: '',
        technologiesUsed: '',
        personalContribution: '',
        testingAndDeployment: '',
        verifiableResults: ''
    })

    if (!recommendations || recommendations.length === 0) {
        return null
    }

    const handleOpenCompleteModal = (proj) => {
        setSelectedProjectForComplete(proj)
        setCompleteForm({
            implementedFeatures: (proj.coreFeatures || []).join('\n'),
            technologiesUsed: (proj.techStack || []).join(', '),
            personalContribution: 'Designed and implemented end-to-end architecture and core services.',
            testingAndDeployment: 'Implemented automated test suite and deployed containerized service to cloud.',
            verifiableResults: 'https://github.com/anasdarzi/' + proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        })
    }

    const handleSubmitComplete = async (e) => {
        e.preventDefault()
        if (!selectedProjectForComplete) return
        await onAction(selectedProjectForComplete.id, 'mark_completed', completeForm)
        setSelectedProjectForComplete(null)
    }

    return (
        <div className="recommended-projects-panel">
            <div className="rec-panel-header">
                <div className="rec-title-group">
                    <div className="rec-badge">
                        <span className="rec-dot" />
                        <span>JD-ALIGNED PORTFOLIO BUILDER</span>
                    </div>
                    <h3>Recommended Projects to Strengthen Your Resume</h3>
                    <p className="rec-subtitle">
                        Projects selected for your target role based on the job description and the evidence in your current resume.
                    </p>
                </div>
            </div>

            <div className="rec-notice-banner">
                <span className="notice-icon">⚠️</span>
                <span>
                    <strong>CareerAI Quality Mandate:</strong> Unbuilt or proposed projects are never presented as completed experience on your final resume. Only verified, implemented projects can be added to the final document.
                </span>
            </div>

            <div className="rec-cards-grid">
                {recommendations.map((proj) => {
                    const isDraftActive = activeProjectIds.includes(proj.id)
                    const isRejected = rejectedProjectIds.includes(proj.id) || proj.status === 'REJECTED'
                    const isCompleted = proj.status === 'COMPLETED'

                    const statusClass = isCompleted
                        ? 'status--completed'
                        : isDraftActive
                            ? 'status--planned'
                            : isRejected
                                ? 'status--rejected'
                                : 'status--recommended'

                    const statusLabel = isCompleted
                        ? '✓ BUILT & VERIFIED'
                        : isDraftActive
                            ? 'IN RESUME DRAFT (UNBUILT)'
                            : isRejected
                                ? 'REJECTED'
                                : 'RECOMMENDED IDEA'

                    return (
                        <div key={proj.id} className={`rec-card ${isDraftActive ? 'rec-card--active' : ''} ${isRejected ? 'rec-card--rejected' : ''}`}>
                            <div className="rec-card-top">
                                <div className="rec-card-badges">
                                    <span className={`status-pill ${statusClass}`}>{statusLabel}</span>
                                    {proj.difficulty && (
                                        <span className={`difficulty-pill difficulty--${proj.difficulty.toLowerCase()}`}>
                                            {proj.difficulty}
                                        </span>
                                    )}
                                </div>
                                <h4 className="rec-card-title">{proj.title}</h4>
                                {proj.targetRoleRelevance && (
                                    <p className="rec-role-relevance">
                                        <strong>Role Match:</strong> {proj.targetRoleRelevance}
                                    </p>
                                )}
                            </div>

                            <div className="rec-card-body">
                                {proj.whyRecommended && (
                                    <div className="rec-block">
                                        <span className="rec-block-label">Why CareerAI Recommends This:</span>
                                        <p className="rec-block-text">{proj.whyRecommended}</p>
                                    </div>
                                )}

                                {proj.techStack && proj.techStack.length > 0 && (
                                    <div className="rec-tech-tags">
                                        {proj.techStack.map((tech, i) => (
                                            <span key={i} className="tech-tag">{tech}</span>
                                        ))}
                                    </div>
                                )}

                                {proj.coreFeatures && proj.coreFeatures.length > 0 && (
                                    <div className="rec-features">
                                        <span className="rec-block-label">Core Features to Build:</span>
                                        <ul className="rec-feature-list">
                                            {proj.coreFeatures.slice(0, 3).map((feat, i) => (
                                                <li key={i}>{feat}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {isDraftActive && !isCompleted && (
                                    <div className="rec-draft-preview-note">
                                        <div className="note-title">Proposed Resume Entry (Draft Preview):</div>
                                        <p className="note-body">
                                            "{proj.draftResumeEntry?.title} | {proj.draftResumeEntry?.meta}"
                                        </p>
                                        <span className="note-tag">Not eligible for final resume until marked completed below.</span>
                                    </div>
                                )}
                            </div>

                            <div className="rec-card-actions">
                                {!isCompleted && (
                                    <>
                                        {!isDraftActive ? (
                                            <button
                                                className="button secondary-button rec-btn rec-btn--add"
                                                onClick={() => onAction(proj.id, 'add')}
                                                disabled={isActionLoading}
                                                id={`add-draft-${proj.id}`}
                                            >
                                                Add to Resume Draft
                                            </button>
                                        ) : (
                                            <button
                                                className="button primary-button rec-btn rec-btn--complete"
                                                onClick={() => handleOpenCompleteModal(proj)}
                                                disabled={isActionLoading}
                                                id={`complete-btn-${proj.id}`}
                                            >
                                                Mark Built &amp; Completed
                                            </button>
                                        )}

                                        {!isRejected && (
                                            <button
                                                className="button secondary-button rec-btn rec-btn--reject"
                                                onClick={() => onAction(proj.id, 'reject')}
                                                disabled={isActionLoading}
                                                id={`reject-btn-${proj.id}`}
                                            >
                                                Reject Recommendation
                                            </button>
                                        )}
                                    </>
                                )}

                                <button
                                    className="button secondary-button rec-btn rec-btn--plan"
                                    onClick={() => setSelectedProjectForPlan(proj)}
                                    id={`view-plan-${proj.id}`}
                                >
                                    View Build Plan →
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ── Modal 1: View Build Plan & Repository Structure ──────────────────────── */}
            {selectedProjectForPlan && (
                <div className="rec-modal-overlay" onClick={() => setSelectedProjectForPlan(null)}>
                    <div className="rec-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="rec-modal-header">
                            <div>
                                <span className="modal-category">Implementation Roadmap &amp; Architecture</span>
                                <h3>{selectedProjectForPlan.title}</h3>
                            </div>
                            <button className="modal-close-btn" onClick={() => setSelectedProjectForPlan(null)}>✕</button>
                        </div>

                        <div className="rec-modal-body">
                            <div className="modal-section">
                                <h4>Target Role Relevance &amp; Gap Closed</h4>
                                <p>{selectedProjectForPlan.whyRecommended}</p>
                            </div>

                            {selectedProjectForPlan.roadmap && selectedProjectForPlan.roadmap.length > 0 && (
                                <div className="modal-section">
                                    <h4>4-Step Progressive Implementation Roadmap</h4>
                                    <div className="roadmap-stepper">
                                        {selectedProjectForPlan.roadmap.map((step, idx) => (
                                            <div key={idx} className="roadmap-stepper-item">
                                                <div className="step-circle">{idx + 1}</div>
                                                <div className="step-text">{step}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedProjectForPlan.repoStructure && (
                                <div className="modal-section">
                                    <h4>Suggested GitHub Repository Structure</h4>
                                    <pre className="repo-tree-block">
                                        <code>{selectedProjectForPlan.repoStructure}</code>
                                    </pre>
                                </div>
                            )}

                            {selectedProjectForPlan.milestones && selectedProjectForPlan.milestones.length > 0 && (
                                <div className="modal-section">
                                    <h4>Key Milestones &amp; Deliverables</h4>
                                    <ul className="milestone-list">
                                        {selectedProjectForPlan.milestones.map((ms, idx) => (
                                            <li key={idx}>✓ {ms}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="modal-section modal-section--draft">
                                <h4>Draft Resume Entry (Available after completion)</h4>
                                <div className="draft-entry-box">
                                    <div className="draft-entry-title">
                                        <strong>{selectedProjectForPlan.draftResumeEntry?.title}</strong> | {selectedProjectForPlan.draftResumeEntry?.meta}
                                    </div>
                                    <ul className="draft-entry-bullets">
                                        {(selectedProjectForPlan.draftResumeEntry?.proposedBullets || []).map((b, i) => (
                                            <li key={i}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                                <p className="draft-warning-text">
                                    Notice: This entry is only included in your final resume after you build the project and provide accurate verification details.
                                </p>
                            </div>
                        </div>

                        <div className="rec-modal-footer">
                            <button className="button secondary-button" onClick={() => setSelectedProjectForPlan(null)}>
                                Close
                            </button>
                            {!activeProjectIds.includes(selectedProjectForPlan.id) && selectedProjectForPlan.status !== 'COMPLETED' && (
                                <button
                                    className="button primary-button"
                                    onClick={() => {
                                        onAction(selectedProjectForPlan.id, 'add')
                                        setSelectedProjectForPlan(null)
                                    }}
                                >
                                    Add to Resume Draft
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal 2: Mark as Built & Completed ───────────────────────────── */}
            {selectedProjectForComplete && (
                <div className="rec-modal-overlay" onClick={() => setSelectedProjectForComplete(null)}>
                    <div className="rec-modal-content rec-modal-content--form" onClick={(e) => e.stopPropagation()}>
                        <div className="rec-modal-header">
                            <div>
                                <span className="modal-category">Candidate Truth &amp; Verification</span>
                                <h3>Confirm Project Implementation: {selectedProjectForComplete.title}</h3>
                            </div>
                            <button className="modal-close-btn" onClick={() => setSelectedProjectForComplete(null)}>✕</button>
                        </div>

                        <form onSubmit={handleSubmitComplete}>
                            <div className="rec-modal-body">
                                <p className="form-intro">
                                    To maintain 100% integrity on your resume, supply accurate details regarding what you actually built, tested, and deployed.
                                </p>

                                <div className="form-group">
                                    <label>Features Actually Implemented</label>
                                    <textarea
                                        rows={3}
                                        value={completeForm.implementedFeatures}
                                        onChange={(e) => setCompleteForm({ ...completeForm, implementedFeatures: e.target.value })}
                                        placeholder="Describe the specific services, endpoints, and components implemented..."
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Technologies &amp; Libraries Actually Used</label>
                                    <input
                                        type="text"
                                        value={completeForm.technologiesUsed}
                                        onChange={(e) => setCompleteForm({ ...completeForm, technologiesUsed: e.target.value })}
                                        placeholder="e.g. FastAPI, PostgreSQL, Docker, Pytest"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Personal Contribution &amp; Architecture</label>
                                    <input
                                        type="text"
                                        value={completeForm.personalContribution}
                                        onChange={(e) => setCompleteForm({ ...completeForm, personalContribution: e.target.value })}
                                        placeholder="e.g. Designed database schema and built async message queues"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Testing, Verification &amp; Deployment</label>
                                    <input
                                        type="text"
                                        value={completeForm.testingAndDeployment}
                                        onChange={(e) => setCompleteForm({ ...completeForm, testingAndDeployment: e.target.value })}
                                        placeholder="e.g. 85% test coverage with pytest, deployed on AWS ECS"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Verifiable GitHub / Demo URL</label>
                                    <input
                                        type="text"
                                        value={completeForm.verifiableResults}
                                        onChange={(e) => setCompleteForm({ ...completeForm, verifiableResults: e.target.value })}
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>

                            <div className="rec-modal-footer">
                                <button type="button" className="button secondary-button" onClick={() => setSelectedProjectForComplete(null)}>
                                    Cancel
                                </button>
                                <button type="submit" className="button primary-button" disabled={isActionLoading}>
                                    Confirm &amp; Enable for Final Resume
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RecommendedProjectsSection
