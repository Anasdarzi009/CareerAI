import React from 'react'
import SkillPriorityBadge from './SkillPriorityBadge'

export const LearningRoadmap = ({ milestones = [] }) => {
    if (milestones.length === 0) return null

    return (
        <div className="learning-roadmap-panel">
            <div className="roadmap-header">
                <span className="roadmap-eyebrow">ACTIONABLE CURRICULUM</span>
                <h3 className="roadmap-title">What To Learn Next</h3>
                <p className="roadmap-subtitle">
                    Prioritized step-by-step roadmap to systematically close critical gaps for your target opportunities.
                </p>
            </div>

            <div className="roadmap-timeline">
                {milestones.map((item, idx) => (
                    <div key={idx} className="roadmap-step-card">
                        <div className="step-indicator-col">
                            <span className="step-number">
                                {item.step < 10 ? `0${item.step}` : item.step}
                            </span>
                            {idx < milestones.length - 1 && <span className="step-connector-line" />}
                        </div>

                        <div className="step-content-col">
                            <div className="step-header-row">
                                <h4 className="step-skill-title">{item.skill}</h4>
                                <SkillPriorityBadge priority={item.priority} />
                            </div>

                            {item.curriculum && (
                                <p className="step-curriculum-path">
                                    <span className="path-label">Learning Path: </span>
                                    <span>{item.curriculum}</span>
                                </p>
                            )}

                            {item.action && (
                                <p className="step-action-text">
                                    <span className="action-label">Practical Milestone: </span>
                                    <span>{item.action}</span>
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LearningRoadmap
