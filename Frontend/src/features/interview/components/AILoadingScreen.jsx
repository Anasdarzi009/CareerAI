import React, { useState, useEffect } from 'react';
import './ai-loading.scss';

const STAGES = [
    { label: 'Analyzing target job requirements', delay: 0 },
    { label: 'Reviewing your profile & resume', delay: 2500 },
    { label: 'Identifying key skill gaps', delay: 5500 },
    { label: 'Generating technical & behavioral questions', delay: 8500 },
    { label: 'Building strategic preparation roadmap', delay: 12000 }
];

const AILoadingScreen = ({ title = "Building Your Interview Strategy", subtitle = "Our AI is analyzing your input to build a personalized strategy." }) => {
    const [currentStage, setCurrentStage] = useState(0);

    useEffect(() => {
        const timers = STAGES.slice(1).map((stage, idx) => {
            return setTimeout(() => {
                setCurrentStage(idx + 1);
            }, stage.delay);
        });

        return () => timers.forEach(t => clearTimeout(t));
    }, []);

    return (
        <main className="ai-loading-screen">
            <div className="ai-loading-card">
                {/* Glowing AI Icon */}
                <div className="ai-loading-icon-wrapper">
                    <div className="ai-loading-ring" />
                    <div className="ai-loading-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                        </svg>
                    </div>
                </div>

                {/* Header */}
                <h1 className="ai-loading-title">{title}</h1>
                <p className="ai-loading-subtitle">{subtitle}</p>

                {/* Progress Stages */}
                <div className="ai-loading-stages">
                    {STAGES.map((stage, index) => {
                        const isDone = index < currentStage;
                        const isCurrent = index === currentStage;
                        return (
                            <div
                                key={index}
                                className={`stage-item ${isDone ? 'stage-item--done' : ''} ${isCurrent ? 'stage-item--current' : ''}`}
                            >
                                <span className="stage-status-icon">
                                    {isDone ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    ) : isCurrent ? (
                                        <span className="spinner-dot" />
                                    ) : (
                                        <span className="pending-dot" />
                                    )}
                                </span>
                                <span className="stage-label">{stage.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};

export default AILoadingScreen;
