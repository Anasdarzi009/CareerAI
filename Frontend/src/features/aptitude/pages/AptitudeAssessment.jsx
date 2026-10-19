import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAptitude } from '../hooks/useAptitude';
import AptitudeTimer from '../components/AptitudeTimer';
import AptitudeNavigator from '../components/AptitudeNavigator';
import AptitudeResult from '../components/AptitudeResult';
import '../style/aptitude.scss';

const AptitudeAssessment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        activeAssessment,
        loadAssessment,
        startAssessment,
        currentQIndex,
        setCurrentQIndex,
        assessmentAnswers,
        selectAssessmentOption,
        toggleMarkForReview,
        submitAssessment,
        isSubmittingAssessment,
        timeRemaining,
        loading,
        error
    } = useAptitude();

    const [showSubmitModal, setShowSubmitModal] = useState(false);

    useEffect(() => {
        if (id) {
            loadAssessment(id);
        }
    }, [id, loadAssessment]);

    if (loading || !activeAssessment) {
        return (
            <div className="assessment-loading-screen">
                <p>Loading assessment session from server...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="assessment-error-screen">
                <p>⚠ {error}</p>
                <button
                    type="button"
                    className="aptitude-btn aptitude-btn--secondary"
                    onClick={() => navigate('/aptitude')}
                >
                    Back to Aptitude Hub
                </button>
            </div>
        );
    }

    // ── 1. Completed State: Show Official Result Report ───────────────────────
    if (activeAssessment.status === 'Completed') {
        return (
            <div className="aptitude-assessment-completed-page">
                <AptitudeResult assessment={activeAssessment} />
            </div>
        );
    }

    // ── 2. Pre-flight Briefing: Not Started ───────────────────────────────────
    if (activeAssessment.status === 'Not Started') {
        return (
            <div className="assessment-briefing-page">
                <div className="briefing-card">
                    <div className="briefing-badge">Placement Assessment Pre-Flight</div>
                    <h2>{activeAssessment.title}</h2>
                    <p className="briefing-desc">
                        This is a timed corporate placement screening assessment. Answers are strictly validated server-side. Once started, the countdown timer runs continuously.
                    </p>

                    <div className="briefing-rules-grid">
                        <div className="rule-box">
                            <span className="rule-label">TOTAL QUESTIONS</span>
                            <span className="rule-val">{activeAssessment.totalQuestions || activeAssessment.questions?.length} Questions</span>
                        </div>
                        <div className="rule-box">
                            <span className="rule-label">ALLOCATED DURATION</span>
                            <span className="rule-val">{activeAssessment.durationMinutes} Minutes</span>
                        </div>
                        <div className="rule-box">
                            <span className="rule-label">SCORING STANDARD</span>
                            <span className="rule-val">+1.0 / -0.25 negative</span>
                        </div>
                        <div className="rule-box">
                            <span className="rule-label">NAVIGATION</span>
                            <span className="rule-val">Free Jumping &amp; Review</span>
                        </div>
                    </div>

                    <div className="briefing-instructions">
                        <h4>IMPORTANT SCREENING INSTRUCTIONS:</h4>
                        <ul>
                            <li>You can mark questions for review and return to them anytime before final submission.</li>
                            <li>When the timer expires, your answers will be automatically finalized and graded by the server.</li>
                            <li>Do not refresh or close the tab during an active assessment session.</li>
                        </ul>
                    </div>

                    <div className="briefing-actions">
                        <button
                            type="button"
                            className="aptitude-btn aptitude-btn--secondary"
                            onClick={() => navigate('/aptitude')}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="aptitude-btn aptitude-btn--primary"
                            onClick={() => startAssessment(id)}
                        >
                            Begin Timed Assessment Now →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── 3. Active In-Progress Assessment Workspace ─────────────────────────────
    const questions = activeAssessment.questions || [];
    const currentQ = questions[currentQIndex];
    const currentAns = (currentQ && assessmentAnswers[currentQ._id]) || { selectedOptionIndex: -1, isMarkedForReview: false };
    const optionLabels = ['A', 'B', 'C', 'D'];

    const answeredCount = Object.values(assessmentAnswers).filter(a => a.selectedOptionIndex !== -1 && a.selectedOptionIndex !== undefined).length;
    const reviewCount = Object.values(assessmentAnswers).filter(a => a.isMarkedForReview).length;
    const unattemptedCount = questions.length - answeredCount;

    const handleConfirmFinalSubmit = async () => {
        await submitAssessment(id);
        setShowSubmitModal(false);
    };

    return (
        <div className="assessment-in-progress-workspace">
            {/* Topbar */}
            <header className="assessment-runner-topbar">
                <div className="topbar-left">
                    <span className="assessment-mode-pill">TIMED ASSESSMENT</span>
                    <h3 className="assessment-runner-title">{activeAssessment.title}</h3>
                </div>

                <div className="topbar-center">
                    <AptitudeTimer secondsRemaining={timeRemaining} />
                </div>

                <div className="topbar-right">
                    <button
                        type="button"
                        className="aptitude-btn aptitude-btn--danger aptitude-btn--sm"
                        onClick={() => setShowSubmitModal(true)}
                        disabled={isSubmittingAssessment}
                    >
                        {isSubmittingAssessment ? 'Submitting...' : 'Submit Assessment →'}
                    </button>
                </div>
            </header>

            {/* Split Screen Workspace */}
            <div className="assessment-runner-body">
                {/* Main Question Solving Column */}
                <main className="assessment-question-stage">
                    {currentQ && (
                        <div className="runner-q-card">
                            {/* Question Header */}
                            <div className="runner-q-header">
                                <div className="runner-q-badges">
                                    <span className="runner-q-num">
                                        Question {String(currentQIndex + 1).padStart(2, '0')} of {String(questions.length).padStart(2, '0')}
                                    </span>
                                    <span className="runner-q-cat">{currentQ.category}</span>
                                    <span className="runner-q-topic">{currentQ.topic}</span>
                                </div>

                                <div className="runner-q-tools">
                                    <label className="runner-review-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(currentAns.isMarkedForReview)}
                                            onChange={() => toggleMarkForReview(currentQ._id)}
                                        />
                                        <span>Mark for Review</span>
                                    </label>
                                </div>
                            </div>

                            {/* Question Text */}
                            <div className="runner-q-statement-box">
                                <p className="runner-q-text">{currentQ.questionText}</p>
                            </div>

                            {/* Options Radio List */}
                            <div className="runner-options-list">
                                {(currentQ.options || []).map((optText, optIdx) => {
                                    const isSelected = currentAns.selectedOptionIndex === optIdx;
                                    return (
                                        <button
                                            key={optIdx}
                                            type="button"
                                            className={`runner-option-row ${isSelected ? 'runner-option-row--selected' : ''}`}
                                            onClick={() => selectAssessmentOption(currentQ._id, optIdx)}
                                        >
                                            <span className="runner-opt-label">{optionLabels[optIdx]}</span>
                                            <span className="runner-opt-text">{optText}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Question Bottom Action Bar */}
                            <div className="runner-bottom-actions">
                                <div className="runner-nav-btns">
                                    <button
                                        type="button"
                                        className="aptitude-btn aptitude-btn--secondary aptitude-btn--sm"
                                        onClick={() => setCurrentQIndex(i => Math.max(0, i - 1))}
                                        disabled={currentQIndex === 0}
                                    >
                                        ← Previous
                                    </button>
                                    <button
                                        type="button"
                                        className="aptitude-btn aptitude-btn--secondary aptitude-btn--sm"
                                        onClick={() => setCurrentQIndex(i => Math.min(questions.length - 1, i + 1))}
                                        disabled={currentQIndex === questions.length - 1}
                                    >
                                        Next →
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    className="runner-clear-btn"
                                    onClick={() => selectAssessmentOption(currentQ._id, -1)}
                                    disabled={currentAns.selectedOptionIndex === -1}
                                >
                                    Clear Response
                                </button>
                            </div>
                        </div>
                    )}
                </main>

                {/* Question Navigator Side Panel */}
                <aside className="assessment-runner-sidebar">
                    <AptitudeNavigator
                        questions={questions}
                        answers={assessmentAnswers}
                        currentIndex={currentQIndex}
                        onSelectQuestion={(idx) => setCurrentQIndex(idx)}
                    />
                </aside>
            </div>

            {/* Submission Confirmation Modal */}
            {showSubmitModal && (
                <div className="aptitude-modal-backdrop">
                    <div className="aptitude-modal">
                        <h3>Confirm Final Assessment Submission</h3>
                        <p>Are you sure you want to finalize your assessment? You cannot change your answers after submission.</p>

                        <div className="modal-summary-grid">
                            <div className="modal-stat-box">
                                <span className="modal-stat-label">Answered</span>
                                <span className="modal-stat-val modal-stat-val--green">{answeredCount}</span>
                            </div>
                            <div className="modal-stat-box">
                                <span className="modal-stat-label">Unanswered</span>
                                <span className="modal-stat-val modal-stat-val--orange">{unattemptedCount}</span>
                            </div>
                            <div className="modal-stat-box">
                                <span className="modal-stat-label">Review Marked</span>
                                <span className="modal-stat-val modal-stat-val--purple">{reviewCount}</span>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="aptitude-btn aptitude-btn--secondary"
                                onClick={() => setShowSubmitModal(false)}
                                disabled={isSubmittingAssessment}
                            >
                                Continue Test
                            </button>
                            <button
                                type="button"
                                className="aptitude-btn aptitude-btn--danger"
                                onClick={handleConfirmFinalSubmit}
                                disabled={isSubmittingAssessment}
                            >
                                {isSubmittingAssessment ? 'Grading Answers...' : 'Confirm & Finalize Submission'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AptitudeAssessment;
