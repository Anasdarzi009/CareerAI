import React, { useState } from 'react'
import SkillGapCard from './SkillGapCard'

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
)

export const SkillCategorySection = ({
    categoryName,
    skills = [],
    onProgressChange
}) => {
    const [isExpanded, setIsExpanded] = useState(true)

    if (skills.length === 0) return null

    const matched = skills.filter(s => s.status === 'MATCHED')
    const weak = skills.filter(s => s.status === 'WEAK_EVIDENCE')
    const missing = skills.filter(s => s.status === 'MISSING')

    return (
        <div className="skill-category-section">
            <div
                className="category-header"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="category-title-group">
                    <h3 className="category-name">{categoryName}</h3>
                    <div className="category-counts-pills">
                        <span className="count-pill count-pill--matched" title="Verified skills">
                            ✓ {matched.length} Matched
                        </span>
                        {weak.length > 0 && (
                            <span className="count-pill count-pill--weak" title="Weak/partial evidence">
                                ◐ {weak.length} Partial
                            </span>
                        )}
                        {missing.length > 0 && (
                            <span className="count-pill count-pill--missing" title="Missing skills">
                                ○ {missing.length} Missing
                            </span>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    className={`category-toggle-btn ${isExpanded ? 'category-toggle-btn--open' : ''}`}
                    aria-label="Toggle section"
                >
                    <ChevronDownIcon />
                </button>
            </div>

            {isExpanded && (
                <div className="category-body">
                    {/* Matched Skills Chips in Category */}
                    {matched.length > 0 && (
                        <div className="category-matched-chips">
                            <span className="sub-label">Verified Competencies:</span>
                            <div className="chips-wrap">
                                {matched.map((s, idx) => (
                                    <span key={idx} className="category-skill-chip category-skill-chip--matched">
                                        ✓ {s.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Missing / Weak Skill Gap Cards */}
                    {(weak.length > 0 || missing.length > 0) && (
                        <div className="category-gaps-list">
                            {[...weak, ...missing].map((s, idx) => (
                                <SkillGapCard
                                    key={idx}
                                    skill={s}
                                    onProgressChange={onProgressChange}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SkillCategorySection
