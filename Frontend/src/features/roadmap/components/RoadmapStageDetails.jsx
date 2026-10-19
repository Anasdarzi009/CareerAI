import React from 'react';
import RecommendedProjects from './RecommendedProjects';

const RoadmapStageDetails = ({
    stage,
    onToggleAction,
    actionLoadingId = null
}) => {
    if (!stage) {
        return (
            <div className="stage-details stage-details--empty">
                <p>Select a stage from the roadmap timeline to view details.</p>
            </div>
        );
    }

    const {
        stageNumber,
        title,
        description,
        status = 'NOT_STARTED',
        priority = 'HIGH',
        estimatedDuration,
        completionPercentage = 0,
        objectives = [],
        keySkills = [],
        actions = [],
        projects = [],
        expectedOutcome
    } = stage;

    const completedActionsCount = actions.filter(a => a.isCompleted).length;

    return (
        <section className="stage-details">
            {/* Header */}
            <div className="stage-details__header">
                <div className="stage-details__title-group">
                    <div className="stage-details__badges">
                        <span className="stage-details__stage-tag">STAGE 0{stageNumber}</span>
                        <span className={`status-badge status-badge--${status.toLowerCase()}`}>
                            {status.replace('_', ' ')}
                        </span>
                        <span className={`priority-pill priority-pill--${priority.toLowerCase()}`}>
                            {priority} PRIORITY
                        </span>
                    </div>
                    <h3 className="stage-details__title">{title}</h3>
                </div>

                <div className="stage-details__progress-box">
                    <div className="stage-details__progress-text">
                        <span className="stage-details__progress-label">Stage Completion</span>
                        <strong className="stage-details__progress-pct">{completionPercentage}%</strong>
                    </div>
                    <div className="roadmap-progress-bar">
                        <div
                            className="roadmap-progress-bar__fill"
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                    <span className="stage-details__duration">
                        Est. Duration: <strong>{estimatedDuration}</strong>
                    </span>
                </div>
            </div>

            {/* Description & Why It Matters */}
            {description && (
                <div className="stage-details__section">
                    <h4 className="stage-details__section-title">WHY THIS STAGE MATTERS</h4>
                    <p className="stage-details__description">{description}</p>
                </div>
            )}

            {/* Stage Objectives */}
            {objectives.length > 0 && (
                <div className="stage-details__section">
                    <h4 className="stage-details__section-title">KEY OBJECTIVES</h4>
                    <ul className="stage-details__objectives-list">
                        {objectives.map((obj, idx) => (
                            <li key={idx} className="stage-details__objective-item">
                                <span className="stage-details__bullet">✓</span>
                                <span>{obj}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Key Skills */}
            {keySkills.length > 0 && (
                <div className="stage-details__section">
                    <h4 className="stage-details__section-title">ASSOCIATED SKILLS</h4>
                    <div className="stage-details__skills-chips">
                        {keySkills.map((skill, idx) => (
                            <span key={idx} className="roadmap-skill-chip roadmap-skill-chip--prominent">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Concrete Action Checklist */}
            <div className="stage-details__section">
                <div className="stage-details__action-header">
                    <h4 className="stage-details__section-title">
                        ACTIONABLE TASKS ({completedActionsCount}/{actions.length})
                    </h4>
                    <span className="stage-details__action-hint">
                        Check off completed actions to advance your stage and overall roadmap progress
                    </span>
                </div>

                <div className="stage-details__actions-list">
                    {actions.map((action) => {
                        const isLoading = actionLoadingId === action.id;

                        return (
                            <label
                                key={action.id}
                                className={`action-item ${action.isCompleted ? 'action-item--completed' : ''} ${isLoading ? 'action-item--loading' : ''}`}
                            >
                                <div className="action-item__checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        className="action-item__checkbox"
                                        checked={Boolean(action.isCompleted)}
                                        onChange={() => onToggleAction(stageNumber, action.id, action.isCompleted)}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="action-item__content">
                                    <div className="action-item__title-row">
                                        <span className="action-item__title">{action.title}</span>
                                        {action.actionType && (
                                            <span className={`action-item__type action-item__type--${action.actionType.toLowerCase()}`}>
                                                {action.actionType}
                                            </span>
                                        )}
                                        {action.linkedSkill && (
                                            <span className="action-item__linked-skill">
                                                Skill: {action.linkedSkill}
                                            </span>
                                        )}
                                    </div>
                                    {action.description && (
                                        <p className="action-item__desc">{action.description}</p>
                                    )}
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Recommended Projects (if applicable) */}
            {projects && projects.length > 0 && (
                <div className="stage-details__section">
                    <RecommendedProjects projects={projects} />
                </div>
            )}

            {/* Expected Outcome */}
            {expectedOutcome && (
                <div className="stage-details__outcome">
                    <div className="stage-details__outcome-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="8" r="7"/>
                            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                        </svg>
                    </div>
                    <div className="stage-details__outcome-text">
                        <span className="stage-details__outcome-label">EXPECTED MILESTONE OUTCOME</span>
                        <p className="stage-details__outcome-desc">{expectedOutcome}</p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default RoadmapStageDetails;
