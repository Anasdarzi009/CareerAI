import React, { useState } from 'react';

const InterviewRoundRunner = ({ round, onSubmit, isSubmitting }) => {
    const interviewQuestions = round.data?.interviewQuestions || [];
    const isEvaluated = round.status === 'EVALUATED';

    const [answers, setAnswers] = useState(() => {
        const init = {};
        interviewQuestions.forEach((iq, idx) => {
            init[idx] = iq.candidateAnswer || '';
        });
        return init;
    });

    const handleAnswerChange = (idx, text) => {
        if (isEvaluated) return;
        setAnswers(prev => ({
            ...prev,
            [idx]: text
        }));
    };

    const handleFinalSubmit = () => {
        onSubmit({
            interviewAnswers: answers
        });
    };

    const answeredCount = Object.values(answers).filter(t => t.trim().length > 20).length;

    return (
        <div className="drives-interview-runner">
            <div className="drives-runner-topbar">
                <div>
                    <h4>{round.title}</h4>
                    <span className="drives-runner-meta">
                        {isEvaluated ? `Evaluation Verdict: ${round.passed ? 'Cleared' : 'Below Cutoff'} (${round.score}%)` : `${answeredCount} of ${interviewQuestions.length} answered`}
                    </span>
                </div>

                {!isEvaluated && (
                    <button
                        type="button"
                        className="drives-btn drives-btn--danger drives-btn--sm"
                        onClick={handleFinalSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Evaluating & Finalizing Drive...' : 'Complete Interview & Finalize Drive →'}
                    </button>
                )}
            </div>

            <div className="drives-interview-cards">
                {interviewQuestions.map((iq, idx) => {
                    const ans = answers[idx] || '';
                    return (
                        <div key={idx} className="drives-interview-card">
                            <div className="drives-interview-card__top">
                                <span className="drives-q-category-tag">{iq.category || 'Technical'}</span>
                                <span className="drives-q-num">Question 0{idx + 1}</span>
                            </div>

                            <h3 className="drives-interview-question-text">{iq.questionText}</h3>

                            <div className="drives-interview-input-area">
                                <textarea
                                    className="drives-interview-textarea"
                                    rows={5}
                                    placeholder="Structure your answer clearly (Situation, Task, Action, Result / Technical architecture)..."
                                    value={ans}
                                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                    disabled={isEvaluated}
                                />
                                <div className="drives-interview-wordcount">
                                    {ans.trim().length} characters (Recommended: 100+ for technical completeness)
                                </div>
                            </div>

                            {isEvaluated && iq.feedback && (
                                <div className="drives-interview-feedback-box">
                                    <div className="drives-feedback-rating">
                                        Score: <strong>{iq.score}/100</strong>
                                    </div>
                                    <p className="drives-feedback-text">{iq.feedback}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {!isEvaluated && (
                <div className="drives-runner-bottombar">
                    <button
                        type="button"
                        className="drives-btn drives-btn--primary"
                        onClick={handleFinalSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Evaluating & Finalizing Drive...' : 'Complete Interview & Finalize Placement Drive →'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default InterviewRoundRunner;
