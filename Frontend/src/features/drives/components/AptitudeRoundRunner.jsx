import React, { useState } from 'react';

const AptitudeRoundRunner = ({ round, onSubmit, isSubmitting }) => {
    const questions = round.data?.questions || [];
    const isEvaluated = round.status === 'EVALUATED';

    const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState(() => {
        const init = {};
        questions.forEach(q => {
            init[q.id] = q.selectedOptionIndex !== undefined ? q.selectedOptionIndex : -1;
        });
        return init;
    });

    const activeQ = questions[activeQuestionIdx];

    const handleSelectOption = (qId, optionIdx) => {
        if (isEvaluated) return;
        setAnswers(prev => ({
            ...prev,
            [qId]: optionIdx
        }));
    };

    const handleFinalSubmit = () => {
        onSubmit({ answers });
    };

    const answeredCount = Object.values(answers).filter(v => v !== -1).length;

    if (questions.length === 0) {
        return (
            <div className="drives-round-box drives-round-box--empty">
                <p>No questions configured for this assessment round.</p>
            </div>
        );
    }

    return (
        <div className="drives-aptitude-runner">
            {/* Top Toolbar */}
            <div className="drives-runner-topbar">
                <div className="drives-runner-topbar__title">
                    <h4>{round.title}</h4>
                    <span className="drives-runner-meta">
                        {isEvaluated ? 'Evaluation Review' : `${answeredCount} of ${questions.length} answered`}
                    </span>
                </div>

                {!isEvaluated && (
                    <button
                        type="button"
                        className="drives-btn drives-btn--primary drives-btn--sm"
                        onClick={handleFinalSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Evaluating Assessment...' : 'Submit Round 1 Assessment →'}
                    </button>
                )}
            </div>

            {/* Questions Number Navigator */}
            <div className="drives-q-pills">
                {questions.map((q, idx) => {
                    const isAnswered = answers[q.id] !== -1;
                    const isActive = idx === activeQuestionIdx;
                    return (
                        <button
                            key={q.id || idx}
                            type="button"
                            className={`drives-q-pill ${isActive ? 'drives-q-pill--active' : ''} ${isAnswered ? 'drives-q-pill--answered' : ''}`}
                            onClick={() => setActiveQuestionIdx(idx)}
                        >
                            Q{idx + 1}
                        </button>
                    );
                })}
            </div>

            {/* Active Question Box */}
            {activeQ && (
                <div className="drives-q-box">
                    <div className="drives-q-box__header">
                        <span className="drives-q-category-tag">{activeQ.category || 'CS Core'}</span>
                        <span className="drives-q-num">Question {activeQuestionIdx + 1} of {questions.length}</span>
                    </div>

                    <h3 className="drives-q-text">{activeQ.questionText}</h3>

                    <div className="drives-options-list">
                        {activeQ.options.map((opt, oIdx) => {
                            const isSelected = answers[activeQ.id] === oIdx;
                            return (
                                <div
                                    key={oIdx}
                                    className={`drives-option-item ${isSelected ? 'drives-option-item--selected' : ''}`}
                                    onClick={() => handleSelectOption(activeQ.id, oIdx)}
                                >
                                    <div className="drives-option-radio">
                                        {isSelected && <span className="drives-radio-dot"></span>}
                                    </div>
                                    <span className="drives-option-letter">{String.fromCharCode(65 + oIdx)}.</span>
                                    <span className="drives-option-text">{opt}</span>
                                </div>
                            );
                        })}
                    </div>

                    {isEvaluated && activeQ.explanation && (
                        <div className="drives-explanation-box">
                            <strong>Explanation:</strong> {activeQ.explanation}
                        </div>
                    )}
                </div>
            )}

            {/* Navigation Controls */}
            <div className="drives-runner-bottombar">
                <button
                    type="button"
                    className="drives-btn drives-btn--ghost"
                    disabled={activeQuestionIdx === 0}
                    onClick={() => setActiveQuestionIdx(prev => prev - 1)}
                >
                    ← Previous Question
                </button>

                {activeQuestionIdx < questions.length - 1 ? (
                    <button
                        type="button"
                        className="drives-btn drives-btn--secondary"
                        onClick={() => setActiveQuestionIdx(prev => prev + 1)}
                    >
                        Next Question →
                    </button>
                ) : !isEvaluated ? (
                    <button
                        type="button"
                        className="drives-btn drives-btn--primary"
                        onClick={handleFinalSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Evaluating Assessment...' : 'Submit Round 1 Assessment →'}
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default AptitudeRoundRunner;
