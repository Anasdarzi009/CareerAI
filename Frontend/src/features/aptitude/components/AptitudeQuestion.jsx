import React, { useState, useEffect } from 'react';

const AptitudeQuestion = ({
    question,
    existingAttempt,
    onSubmitAnswer,
    isSubmitting,
    onNext,
    onPrevious,
    hasNext,
    hasPrevious
}) => {
    const [selectedIdx, setSelectedIdx] = useState(-1);
    const [timeSpent, setTimeSpent] = useState(0);

    useEffect(() => {
        if (existingAttempt) {
            setSelectedIdx(existingAttempt.selectedOptionIndex);
        } else {
            setSelectedIdx(-1);
        }
        setTimeSpent(0);
    }, [question?._id, existingAttempt]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSpent(t => t + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [question?._id]);

    if (!question) return null;

    const hasRevealedSolution = question.correctOptionIndex !== undefined;
    const isAnswered = Boolean(existingAttempt) || hasRevealedSolution;
    const isCorrect = isAnswered && selectedIdx === question.correctOptionIndex;

    const handleSubmit = () => {
        if (selectedIdx === -1 || isAnswered || isSubmitting) return;
        onSubmitAnswer(selectedIdx, timeSpent);
    };

    const optionLabels = ['A', 'B', 'C', 'D'];

    return (
        <div className="aptitude-question-workspace">
            {/* Top info row */}
            <div className="aptitude-q-workspace-top">
                <div className="q-info-badges">
                    <span className="q-category-pill">{question.category}</span>
                    <span className="q-topic-pill">{question.topic}</span>
                    <span className={`q-diff-pill q-diff-pill--${question.difficulty?.toLowerCase()}`}>
                        {question.difficulty}
                    </span>
                </div>

                <div className="q-meta-counters">
                    <span className="q-mark-tag">+{question.marks || 1} mark</span>
                    {question.negativeMarks > 0 && (
                        <span className="q-negative-tag">-{question.negativeMarks} neg</span>
                    )}
                    <span className="q-timer-tag">
                        ⏱ {timeSpent}s spent
                    </span>
                </div>
            </div>

            {/* Question Text */}
            <div className="aptitude-q-statement-card">
                <h2 className="aptitude-q-statement">{question.questionText}</h2>
            </div>

            {/* Options List */}
            <div className="aptitude-options-grid">
                {(question.options || []).map((optText, idx) => {
                    const isSelected = selectedIdx === idx;
                    let stateClass = '';

                    if (hasRevealedSolution) {
                        if (idx === question.correctOptionIndex) {
                            stateClass = 'option-choice--correct';
                        } else if (isSelected && !isCorrect) {
                            stateClass = 'option-choice--wrong';
                        }
                    } else if (isSelected) {
                        stateClass = 'option-choice--selected';
                    }

                    return (
                        <button
                            key={idx}
                            type="button"
                            className={`option-choice ${stateClass}`}
                            onClick={() => {
                                if (!isAnswered) setSelectedIdx(idx);
                            }}
                            disabled={isAnswered || isSubmitting}
                        >
                            <span className="option-choice__label">{optionLabels[idx]}</span>
                            <span className="option-choice__text">{optText}</span>
                            {hasRevealedSolution && idx === question.correctOptionIndex && (
                                <span className="option-choice__verdict-icon">✓</span>
                            )}
                            {hasRevealedSolution && isSelected && !isCorrect && (
                                <span className="option-choice__verdict-icon option-choice__verdict-icon--cross">✕</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Action Bar */}
            <div className="aptitude-q-action-bar">
                <div className="q-navigation-buttons">
                    {hasPrevious && (
                        <button
                            type="button"
                            className="aptitude-btn aptitude-btn--secondary"
                            onClick={onPrevious}
                        >
                            ← Previous
                        </button>
                    )}
                    {hasNext && (
                        <button
                            type="button"
                            className="aptitude-btn aptitude-btn--secondary"
                            onClick={onNext}
                        >
                            Next Question →
                        </button>
                    )}
                </div>

                {!isAnswered && (
                    <button
                        type="button"
                        className="aptitude-btn aptitude-btn--primary"
                        onClick={handleSubmit}
                        disabled={selectedIdx === -1 || isSubmitting}
                    >
                        {isSubmitting ? 'Evaluating with Server...' : 'Submit Answer'}
                    </button>
                )}
            </div>

            {/* Feedback & Explanation Box */}
            {hasRevealedSolution && (
                <div className={`aptitude-feedback-box ${isCorrect ? 'aptitude-feedback-box--correct' : 'aptitude-feedback-box--incorrect'}`}>
                    <div className="aptitude-feedback-header">
                        <span className="feedback-status-badge">
                            {isCorrect ? '✓ Correct Answer!' : '✕ Incorrect Answer'}
                        </span>
                        <span className="feedback-score-delta">
                            {isCorrect ? `+${question.marks || 1} points` : `-${question.negativeMarks || 0.25} negative deduction`}
                        </span>
                    </div>

                    <div className="aptitude-explanation-body">
                        <h4>DETAILED EXPLANATION &amp; RATIONALE:</h4>
                        <p>{question.explanation}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AptitudeQuestion;
