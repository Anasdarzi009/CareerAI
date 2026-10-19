import React from 'react';

const AptitudeNavigator = ({
    questions = [],
    answers = {},
    currentIndex,
    onSelectQuestion
}) => {
    let answeredCount = 0;
    let reviewCount = 0;
    let unattemptedCount = 0;

    questions.forEach((q) => {
        const a = answers[q._id];
        if (a && a.isMarkedForReview) {
            reviewCount += 1;
        } else if (a && a.selectedOptionIndex !== -1 && a.selectedOptionIndex !== undefined) {
            answeredCount += 1;
        } else {
            unattemptedCount += 1;
        }
    });

    return (
        <div className="aptitude-navigator-panel">
            <h4 className="aptitude-nav-title">QUESTION NAVIGATOR</h4>

            <div className="aptitude-nav-legend">
                <div className="legend-item">
                    <span className="legend-dot legend-dot--answered" />
                    <span>Answered ({answeredCount})</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot legend-dot--review" />
                    <span>Review ({reviewCount})</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot legend-dot--unattempted" />
                    <span>Unanswered ({unattemptedCount})</span>
                </div>
            </div>

            <div className="aptitude-nav-grid">
                {questions.map((q, idx) => {
                    const ans = answers[q._id];
                    const isSelected = idx === currentIndex;
                    const isReview = ans && ans.isMarkedForReview;
                    const isAnswered = ans && ans.selectedOptionIndex !== -1 && ans.selectedOptionIndex !== undefined;

                    let stateClass = 'nav-q-btn--unattempted';
                    if (isReview) {
                        stateClass = 'nav-q-btn--review';
                    } else if (isAnswered) {
                        stateClass = 'nav-q-btn--answered';
                    }

                    if (isSelected) {
                        stateClass += ' nav-q-btn--current';
                    }

                    return (
                        <button
                            key={q._id || idx}
                            type="button"
                            className={`nav-q-btn ${stateClass}`}
                            onClick={() => onSelectQuestion(idx)}
                        >
                            {String(idx + 1).padStart(2, '0')}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AptitudeNavigator;
