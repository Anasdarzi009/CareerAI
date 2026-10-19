import React from 'react'
import SkillPriorityBadge from './SkillPriorityBadge'
import SkillEvidenceBadge from './SkillEvidenceBadge'

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

export const SkillGapCard = ({ skill, onProgressChange }) => {
    if (!skill) return null

    const {
        name,
        category,
        status,
        priority,
        whyItMatters,
        evidenceStatus,
        candidateEvidence = [],
        learningAction,
        curriculum,
        progressState = 'Not Started',
        addedToLearningPlan = false
    } = skill

    const isWeak = status === 'WEAK_EVIDENCE'

    return (
        <div className={`skill-gap-card ${isWeak ? 'skill-gap-card--weak' : 'skill-gap-card--missing'}`}>
            <div className="gap-card-top">
                <div className="gap-title-group">
                    <div className="gap-name-row">
                        <h4 className="gap-skill-name">{name}</h4>
                        <span className="gap-category-tag">{category}</span>
                    </div>

                    <div className="gap-badges-row">
                        <SkillPriorityBadge priority={priority} />
                        <SkillEvidenceBadge status={evidenceStatus} />
                    </div>
                </div>

                <div className="gap-actions-group">
                    {/* Progress State Dropdown */}
                    <select
                        className="gap-progress-select"
                        value={progressState}
                        onChange={(e) => onProgressChange(name, e.target.value, addedToLearningPlan)}
                    >
                        <option value="Not Started">Not Started</option>
                        <option value="Learning">In Progress (Learning)</option>
                        <option value="Practicing">Practicing (Projects)</option>
                        <option value="Completed">Mastered (Completed)</option>
                    </select>

                    {/* Add to Learning Plan toggle */}
                    <button
                        type="button"
                        className={`btn-plan-toggle ${addedToLearningPlan ? 'btn-plan-toggle--added' : ''}`}
                        onClick={() => onProgressChange(name, progressState, !addedToLearningPlan)}
                        title={addedToLearningPlan ? 'In your learning roadmap' : 'Add to learning plan'}
                    >
                        {addedToLearningPlan ? <CheckIcon /> : <PlusIcon />}
                        <span>{addedToLearningPlan ? 'In Learning Plan' : 'Add to Plan'}</span>
                    </button>
                </div>
            </div>

            {/* Why It Matters */}
            {whyItMatters && (
                <div className="gap-info-row">
                    <span className="info-label">Why it matters:</span>
                    <span className="info-text">{whyItMatters}</span>
                </div>
            )}

            {/* Evidence Audit */}
            <div className="gap-evidence-row">
                <span className="info-label">Candidate evidence:</span>
                {candidateEvidence.length > 0 ? (
                    <div className="evidence-list">
                        {candidateEvidence.map((ev, idx) => (
                            <span key={idx} className="evidence-chip">
                                • {ev.detail}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="no-evidence-text">
                        No projects, work experience, or resume references found.
                    </span>
                )}
            </div>

            {/* Curriculum Roadmap Recommendation */}
            {(learningAction || curriculum) && (
                <div className="gap-learning-row">
                    <span className="info-label">Recommended action:</span>
                    <div className="learning-box">
                        {curriculum && <p className="curriculum-steps">{curriculum}</p>}
                        {learningAction && <p className="action-text">{learningAction}</p>}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SkillGapCard
