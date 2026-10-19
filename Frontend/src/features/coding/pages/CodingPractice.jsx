import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useCoding } from '../hooks/useCoding';
import ProblemDescription from '../components/ProblemDescription';
import CodeEditor from '../components/CodeEditor';
import SubmissionResult from '../components/SubmissionResult';
import '../style/coding.scss';

const CodingPractice = () => {
    const { id } = useParams();
    const {
        currentQuestion,
        selectedLanguage,
        code,
        setCode,
        changeLanguage,
        resetCode,
        loadQuestion,
        loadingQuestion,
        runningSample,
        submittingCode,
        sampleResult,
        submissionResult,
        handleRunSample,
        handleSubmitCode,
        error
    } = useCoding();

    useEffect(() => {
        if (id) {
            loadQuestion(id);
        }
    }, [id, loadQuestion]);

    if (loadingQuestion) {
        return (
            <div className="coding-workspace coding-workspace--loading">
                <div className="coding-spinner coding-spinner--large"></div>
                <h3>Preparing Coding Environment</h3>
                <p>Loading algorithmic specifications, starter stubs, and test harnesses...</p>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="coding-workspace coding-workspace--error">
                <h3>Problem Not Found</h3>
                <p>The practice problem could not be loaded or may be inactive.</p>
                <Link to="/coding" className="coding-btn coding-btn--primary">
                    ← Return to Coding Round
                </Link>
            </div>
        );
    }

    return (
        <div className="coding-workspace-container">
            {/* Top Workspace Bar */}
            <div className="coding-workspace-topbar">
                <div className="coding-workspace-topbar__left">
                    <Link to="/coding" className="coding-back-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        <span>Problem Bank</span>
                    </Link>
                    <span className="coding-workspace-topbar__divider">/</span>
                    <span className="coding-workspace-topbar__current">{currentQuestion.title}</span>
                </div>

                <div className="coding-workspace-topbar__right">
                    <span className="coding-sandbox-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                        Practice Mode (Isolated Evaluation)
                    </span>
                </div>
            </div>

            {error && (
                <div className="coding-workspace-alert">
                    <span>{error}</span>
                </div>
            )}

            {/* Split Pane: Left Description, Right Code Editor */}
            <div className="coding-split-pane">
                {/* Left: Problem Details */}
                <div className="coding-pane coding-pane--left">
                    <ProblemDescription question={currentQuestion} />
                </div>

                {/* Right: Code Editor & Results */}
                <div className="coding-pane coding-pane--right">
                    <CodeEditor
                        languages={currentQuestion.supportedLanguages}
                        selectedLanguage={selectedLanguage}
                        onLanguageChange={changeLanguage}
                        code={code}
                        onCodeChange={setCode}
                        onReset={resetCode}
                        onRunSample={handleRunSample}
                        onSubmit={() => handleSubmitCode(null)}
                        runningSample={runningSample}
                        submittingCode={submittingCode}
                    />

                    {/* Bottom Results Panel */}
                    <div className="coding-results-tray">
                        {sampleResult && (
                            <SubmissionResult
                                result={sampleResult}
                                isSample={true}
                            />
                        )}

                        {submissionResult && (
                            <SubmissionResult
                                result={submissionResult}
                                isSample={false}
                            />
                        )}

                        {!sampleResult && !submissionResult && (
                            <div className="coding-results-placeholder">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="4 17 10 11 4 5" />
                                    <line x1="12" y1="19" x2="20" y2="19" />
                                </svg>
                                <span>Click <strong>Run Sample</strong> to test on public examples, or <strong>Submit Code</strong> to run full evaluation.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingPractice;
