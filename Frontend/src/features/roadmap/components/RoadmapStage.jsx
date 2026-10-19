import React from 'react';

const STATUS_CONFIG = {
    COMPLETED: {
        label: 'COMPLETED',
        badgeClass: 'status-badge--success',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        )
    },
    IN_PROGRESS: {
        label: 'IN PROGRESS',
        badgeClass: 'status-badge--progress',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
        )
    },
    NOT_STARTED: {
        label: 'READY',
        badgeClass: 'status-badge--info',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
            </svg>
        )
    },
    LOCKED: {
        label: 'LOCKED',
        badgeClass: 'status-badge--locked',
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
        )
    }
};

const RoadmapStage = ({
    stage,
    isActive = false,
    onSelect
}) => {
    const {
        stageNumber,
        title,
        tagline,
        status = 'NOT_STARTED',
        completionPercentage = 0,
        estimatedDuration,
        keySkills = [],
        actions = [],
        priority
    } = stage;

    const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.NOT_STARTED;
    const completedCount = actions.filter(a => a.isCompleted).length;

    return (
        <div
            className={`roadmap-stage-card roadmap-stage-card--${status.toLowerCase()} ${isActive ? 'roadmap-stage-card--active' : ''}`}
            onClick={() => onSelect(stageNumber)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onSelect(stageNumber);
                }
            }}
        >
            <div className="roadmap-stage-card__indicator">
                <div className="roadmap-stage-card__number">
                    {stageNumber < 10 ? `0${stageNumber}` : stageNumber}
                </div>
            </div>

            <div className="roadmap-stage-card__content">
                <div className="roadmap-stage-card__top">
                    <div className="roadmap-stage-card__title-box">
                        <h4 className="roadmap-stage-card__title">{title}</h4>
                        {tagline && <span className="roadmap-stage-card__tagline">{tagline}</span>}
                    </div>

                    <div className="roadmap-stage-card__meta">
                        <span className={`status-badge ${statusInfo.badgeClass}`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                        </span>
                        {priority === 'CRITICAL' && (
                            <span className="priority-pill priority-pill--critical">CRITICAL</span>
                        )}
                    </div>
                </div>

                {keySkills.length > 0 && (
                    <div className="roadmap-stage-card__skills">
                        {keySkills.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="roadmap-skill-chip">{skill}</span>
                        ))}
                        {keySkills.length > 4 && (
                            <span className="roadmap-skill-chip roadmap-skill-chip--more">
                                +{keySkills.length - 4} more
                            </span>
                        )}
                    </div>
                )}

                <div className="roadmap-stage-card__footer">
                    <div className="roadmap-stage-card__stats">
                        <span className="roadmap-stage-card__stat-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 11l3 3L22 4"/>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                            </svg>
                            {completedCount}/{actions.length} Actions Done
                        </span>
                        <span className="roadmap-stage-card__stat-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            {estimatedDuration}
                        </span>
                    </div>

                    <div className="roadmap-stage-card__progress">
                        <span className="roadmap-stage-card__pct">{completionPercentage}%</span>
                        <div className="roadmap-progress-bar roadmap-progress-bar--mini">
                            <div
                                className="roadmap-progress-bar__fill"
                                style={{ width: `${completionPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoadmapStage;
