import React from 'react';
import { Link } from 'react-router';

const AssessmentCard = ({ assessment, onStart }) => {
    const {
        _id,
        title,
        targetRole,
        durationMinutes = 60,
        status,
        score = 0,
        solvedQuestions = 0,
        totalQuestions = 0,
        questions = []
    } = assessment;

    const qCount = totalQuestions || questions.length || 0;

    return (
        <div className="coding-assessment-card">
            <div className="coding-assessment-card__top">
                <div className="coding-assessment-card__role-tag">
                    {targetRole || 'Software Engineering'}
                </div>
                <span className={`coding-status-pill coding-status-pill--${status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {status}
                </span>
            </div>

            <h3 className="coding-assessment-card__title">{title}</h3>

            <div className="coding-assessment-card__meta">
                <span className="coding-assessment-meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {durationMinutes} minutes
                </span>
                <span className="coding-assessment-meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                    {qCount} algorithmic problems
                </span>
            </div>

            {status === 'Completed' ? (
                <div className="coding-assessment-card__score-box">
                    <div className="coding-assessment-score-label">Final Evaluation Score</div>
                    <div className="coding-assessment-score-value">
                        {score} <span>/ 100</span>
                    </div>
                    <div className="coding-assessment-score-stat">
                        {solvedQuestions} of {qCount} problems accepted
                    </div>
                </div>
            ) : (
                <div className="coding-assessment-card__description">
                    Simulates actual corporate placement coding rounds. Timed evaluation with automated test verification.
                </div>
            )}

            <div className="coding-assessment-card__footer">
                {status === 'Completed' ? (
                    <Link to={`/coding/assessment/${_id}`} className="coding-btn coding-btn--secondary">
                        View Assessment Analysis →
                    </Link>
                ) : status === 'In Progress' ? (
                    <Link to={`/coding/assessment/${_id}`} className="coding-btn coding-btn--primary">
                        Resume Assessment ({durationMinutes}m) →
                    </Link>
                ) : (
                    <button
                        type="button"
                        className="coding-btn coding-btn--primary"
                        onClick={() => onStart(_id)}
                    >
                        Start Timed Assessment →
                    </button>
                )}
            </div>
        </div>
    );
};

export default AssessmentCard;
