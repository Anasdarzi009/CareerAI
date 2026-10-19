import React from 'react'

export const MatchedSkillsList = ({ matchedSkills = [] }) => {
    if (matchedSkills.length === 0) return null

    return (
        <div className="matched-skills-panel">
            <div className="panel-header-row">
                <div>
                    <span className="panel-eyebrow">VERIFIED COMPETENCIES</span>
                    <h3 className="panel-title">Matched Skills &amp; Evidences</h3>
                </div>
                <span className="matched-count-tag">{matchedSkills.length} Verified</span>
            </div>

            <p className="panel-description">
                These skills match role requirements and have verified proof in your Candidate Profile, demonstrated projects, or work history.
            </p>

            <div className="matched-skills-grid">
                {matchedSkills.map((skill, idx) => (
                    <div key={idx} className="matched-skill-card">
                        <div className="skill-title-row">
                            <span className="skill-check-icon">✓</span>
                            <h4 className="skill-name">{skill.name}</h4>
                            <span className="skill-category-badge">{skill.category}</span>
                        </div>

                        {/* Evidence Sources */}
                        <div className="evidence-sources-list">
                            <span className="evidence-label">Documented Evidence:</span>
                            {skill.candidateEvidence && skill.candidateEvidence.length > 0 ? (
                                skill.candidateEvidence.map((ev, evIdx) => (
                                    <div key={evIdx} className="evidence-item">
                                        <span className="source-dot" />
                                        <span>{ev.detail}</span>
                                    </div>
                                ))
                            ) : (
                                <span className="evidence-item evidence-item--generic">
                                    • Profile skill declaration
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MatchedSkillsList
