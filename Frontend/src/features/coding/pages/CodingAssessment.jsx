import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useCoding } from '../hooks/useCoding';
import AssessmentTimer from '../components/AssessmentTimer';
import AssessmentResult from '../components/AssessmentResult';
import ProblemDescription from '../components/ProblemDescription';
import CodeEditor from '../components/CodeEditor';
import SubmissionResult from '../components/SubmissionResult';
import '../style/coding.scss';

const CodingAssessment = () => {
    const { id } = useParams();
    const {
        currentAssessment,
        loadingAssessment,
        submittingAssessment,
        loadAssessment,
        handleSubmitAssessment,
        runSampleTests,
        error
    } = useCoding();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { [qId]: { code, language, isSolved, markedForReview } }
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [runningSample, setRunningSample] = useState(false);
    const [sampleResult, setSampleResult] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        if (id) {
            loadAssessment(id);
        }
    }, [id, loadAssessment]);

    // Initialize answers when assessment loads
    useEffect(() => {
        if (currentAssessment?.questions?.length > 0) {
            const initial = {};
            currentAssessment.questions.forEach((qItem) => {
                const q = qItem.question || qItem;
                const existing = currentAssessment.answers?.find(a => String(a.question) === String(q._id));
                initial[q._id] = {
                    code: existing?.submittedCode || q.starterCode?.javascript || '',
                    language: existing?.language || 'javascript',
                    isSolved: existing?.isSolved || false,
                    markedForReview: false
                };
            });
            setAnswers(initial);
        }
    }, [currentAssessment]);

    if (loadingAssessment) {
        return (
            <div className="coding-workspace coding-workspace--loading">
                <div className="coding-spinner coding-spinner--large"></div>
                <h3>Initializing Assessment Session</h3>
                <p>Configuring placement screening harness and timing engine...</p>
            </div>
        );
    }

    if (!currentAssessment) {
        return (
            <div className="coding-workspace coding-workspace--error">
                <h3>Assessment Session Unavailable</h3>
                <p>The assessment could not be retrieved.</p>
                <Link to="/coding" className="coding-btn coding-btn--primary">
                    ← Return to Coding Round
                </Link>
            </div>
        );
    }

    // If assessment is already completed, show AssessmentResult
    if (currentAssessment.status === 'Completed') {
        return (
            <div className="coding-assessment-view-container">
                <AssessmentResult assessment={currentAssessment} />
            </div>
        );
    }

    const questions = currentAssessment.questions || [];
    const activeQuestionItem = questions[currentIndex];
    const activeQuestion = activeQuestionItem?.question || activeQuestionItem;
    const activeAnswer = activeQuestion ? answers[activeQuestion._id] || {} : {};

    const handleCodeChange = (newCode) => {
        if (!activeQuestion) return;
        setAnswers(prev => ({
            ...prev,
            [activeQuestion._id]: {
                ...prev[activeQuestion._id],
                code: newCode
            }
        }));
    };

    const handleLanguageChange = (lang) => {
        if (!activeQuestion) return;
        setSelectedLanguage(lang);
        const starter = activeQuestion.starterCode?.[lang] || '';
        setAnswers(prev => ({
            ...prev,
            [activeQuestion._id]: {
                ...prev[activeQuestion._id],
                language: lang,
                code: starter
            }
        }));
    };

    const handleResetCode = () => {
        if (!activeQuestion) return;
        const starter = activeQuestion.starterCode?.[selectedLanguage] || '';
        setAnswers(prev => ({
            ...prev,
            [activeQuestion._id]: {
                ...prev[activeQuestion._id],
                code: starter
            }
        }));
    };

    const handleRunSampleAssessment = async () => {
        if (!activeQuestion) return;
        setRunningSample(true);
        setLocalError(null);
        try {
            const res = await runSampleTests({
                questionId: activeQuestion._id,
                language: activeAnswer.language || selectedLanguage,
                code: activeAnswer.code || ''
            });
            setSampleResult(res.result);
            if (res.result?.passed === res.result?.total && res.result?.total > 0) {
                setAnswers(prev => ({
                    ...prev,
                    [activeQuestion._id]: {
                        ...prev[activeQuestion._id],
                        isSolved: true
                    }
                }));
            }
        } catch (err) {
            setLocalError(err.response?.data?.message || 'Error executing sample tests');
        } finally {
            setRunningSample(false);
        }
    };

    const toggleMarkForReview = () => {
        if (!activeQuestion) return;
        setAnswers(prev => ({
            ...prev,
            [activeQuestion._id]: {
                ...prev[activeQuestion._id],
                markedForReview: !prev[activeQuestion._id]?.markedForReview
            }
        }));
    };

    const handleFinalSubmit = async () => {
        setShowConfirmModal(false);
        const formattedAnswers = Object.entries(answers).map(([qId, data]) => ({
            questionId: qId,
            language: data.language || 'javascript',
            code: data.code || ''
        }));
        await handleSubmitAssessment(currentAssessment._id, formattedAnswers);
    };

    // Calculate completed questions
    const answeredCount = Object.values(answers).filter(a => a.code && a.code.trim().length > 30).length;

    return (
        <div className="coding-assessment-runner">
            {/* Runner Top Bar */}
            <div className="coding-assessment-topbar">
                <div className="coding-assessment-topbar__info">
                    <span className="coding-assessment-tag">Timed Technical Assessment</span>
                    <h2 className="coding-assessment-title">{currentAssessment.title}</h2>
                    <span className="coding-assessment-role">Target Role: {currentAssessment.targetRole}</span>
                </div>

                <div className="coding-assessment-topbar__controls">
                    <AssessmentTimer
                        startedAt={currentAssessment.startedAt}
                        durationMinutes={currentAssessment.durationMinutes}
                        onTimeUp={handleFinalSubmit}
                    />

                    <div className="coding-assessment-progress-indicator">
                        <span>{answeredCount} / {questions.length} completed</span>
                    </div>

                    <button
                        type="button"
                        className="coding-btn coding-btn--danger"
                        onClick={() => setShowConfirmModal(true)}
                        disabled={submittingAssessment}
                    >
                        {submittingAssessment ? 'Submitting...' : 'Finish & Submit Assessment'}
                    </button>
                </div>
            </div>

            {/* Questions Navigator Bar */}
            <div className="coding-question-nav-bar">
                <div className="coding-question-nav-pills">
                    {questions.map((item, idx) => {
                        const q = item.question || item;
                        const ans = answers[q._id] || {};
                        const isActive = idx === currentIndex;
                        const isAnswered = ans.code && ans.code.trim().length > 30;
                        const isReview = ans.markedForReview;

                        let statusClass = '';
                        if (isReview) statusClass = 'coding-nav-btn--review';
                        else if (isAnswered) statusClass = 'coding-nav-btn--answered';

                        return (
                            <button
                                key={q._id || idx}
                                type="button"
                                className={`coding-nav-btn ${isActive ? 'coding-nav-btn--active' : ''} ${statusClass}`}
                                onClick={() => {
                                    setCurrentIndex(idx);
                                    setSampleResult(null);
                                }}
                            >
                                <span>Problem {idx + 1}</span>
                                {isReview && <span className="coding-review-flag" title="Marked for review">★</span>}
                            </button>
                        );
                    })}
                </div>

                <div className="coding-question-nav-actions">
                    <button
                        type="button"
                        className={`coding-btn coding-btn--ghost coding-btn--sm ${activeAnswer.markedForReview ? 'text-warning' : ''}`}
                        onClick={toggleMarkForReview}
                    >
                        {activeAnswer.markedForReview ? '★ Marked for Review' : '☆ Mark for Review'}
                    </button>
                </div>
            </div>

            {/* Split Workspace */}
            {activeQuestion ? (
                <div className="coding-split-pane">
                    <div className="coding-pane coding-pane--left">
                        <ProblemDescription question={activeQuestion} />
                    </div>

                    <div className="coding-pane coding-pane--right">
                        <CodeEditor
                            languages={activeQuestion.supportedLanguages || ['javascript', 'python', 'java', 'cpp']}
                            selectedLanguage={activeAnswer.language || selectedLanguage}
                            onLanguageChange={handleLanguageChange}
                            code={activeAnswer.code || ''}
                            onCodeChange={handleCodeChange}
                            onReset={handleResetCode}
                            onRunSample={handleRunSampleAssessment}
                            onSubmit={() => {
                                // In assessment mode, submitting on a question saves it and steps forward
                                if (currentIndex < questions.length - 1) {
                                    setCurrentIndex(prev => prev + 1);
                                    setSampleResult(null);
                                }
                            }}
                            runningSample={runningSample}
                            submittingCode={false}
                            isAssessment={true}
                        />

                        <div className="coding-results-tray">
                            {sampleResult && (
                                <SubmissionResult
                                    result={sampleResult}
                                    isSample={true}
                                />
                            )}
                            {!sampleResult && (
                                <div className="coding-results-placeholder">
                                    <span>Test cases will be evaluated fully upon final assessment submission. Use <strong>Run Sample</strong> for quick verification.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Final Submission Confirmation Modal */}
            {showConfirmModal && (
                <div className="coding-modal-overlay">
                    <div className="coding-modal">
                        <h3>Submit Timed Assessment?</h3>
                        <p>
                            You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> algorithmic questions.
                        </p>
                        <p className="coding-modal-sub">
                            Once submitted, your code solutions will be locked, all test suites will be evaluated, and your placement score will be calculated.
                        </p>
                        <div className="coding-modal-actions">
                            <button
                                type="button"
                                className="coding-btn coding-btn--ghost"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Continue Assessment
                            </button>
                            <button
                                type="button"
                                className="coding-btn coding-btn--primary"
                                onClick={handleFinalSubmit}
                            >
                                Confirm & Submit Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodingAssessment;
