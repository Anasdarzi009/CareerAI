import React from 'react';
import RoadmapStage from './RoadmapStage';

const RoadmapTimeline = ({
    stages = [],
    activeStageNumber = 1,
    onSelectStage
}) => {
    return (
        <div className="roadmap-timeline">
            <div className="roadmap-timeline__header">
                <h3 className="roadmap-timeline__title">ROADMAP MILESTONES</h3>
                <span className="roadmap-timeline__subtitle">
                    Select any milestone to inspect actionable tasks, skills, and portfolio deliverables.
                </span>
            </div>

            <div className="roadmap-timeline__flow">
                {stages.map((stage, index) => {
                    const isLast = index === stages.length - 1;
                    const isActive = stage.stageNumber === activeStageNumber;

                    return (
                        <div key={stage.stageNumber} className="roadmap-timeline__step">
                            <RoadmapStage
                                stage={stage}
                                isActive={isActive}
                                onSelect={onSelectStage}
                            />
                            {!isLast && (
                                <div className="roadmap-timeline__connector">
                                    <div className="roadmap-timeline__line"></div>
                                    <div className="roadmap-timeline__arrow">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="6 9 12 15 18 9"/>
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RoadmapTimeline;
