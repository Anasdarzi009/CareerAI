import React, { useState } from 'react';
import ProblemDescription from '../../coding/components/ProblemDescription';
import CodeEditor from '../../coding/components/CodeEditor';
import SubmissionResult from '../../coding/components/SubmissionResult';
import { runSampleTests } from '../../coding/services/coding.api';

const CodingRoundRunner = ({ round, onSubmit, isSubmitting }) => {
    const question = round.data?.codingQuestion;
    const isEvaluated = round.status === 'EVALUATED';

    const [language, setLanguage] = useState(round.data?.language || 'javascript');
    const [code, setCode] = useState(() => {
        return round.data?.submittedCode || question?.starterCode?.javascript || '';
    });
    const [runningSample, setRunningSample] = useState(false);
    const [sampleResult, setSampleResult] = useState(null);
    const [error, setError] = useState(null);

    const handleRunSample = async () => {
        if (!question?._id) return;
        setRunningSample(true);
        setError(null);
        try {
            const res = await runSampleTests({
                questionId: question._id,
                language,
                code
            });
            setSampleResult(res.result);
        } catch (err) {
            setError(err.response?.data?.message || 'Error running sample test cases.');
        } finally {
            setRunningSample(false);
        }
    };

    const handleSubmitRoundCode = () => {
        onSubmit({
            code,
            language
        });
    };

    if (!question) {
        return (
            <div className="drives-round-box drives-round-box--empty">
                <p>Coding question details are unavailable for this round.</p>
            </div>
        );
    }

    return (
        <div className="drives-coding-runner">
            <div className="drives-runner-topbar">
                <div>
                    <h4>{round.title}</h4>
                    <span className="drives-runner-meta">
                        {isEvaluated ? `Status: ${round.passed ? 'Cleared' : 'Not Cleared'} (${round.score}%)` : 'Solve problem within test bounds'}
                    </span>
                </div>

                {!isEvaluated && (
                    <button
                        type="button"
                        className="drives-btn drives-btn--primary drives-btn--sm"
                        onClick={handleSubmitRoundCode}
                        disabled={isSubmitting || runningSample}
                    >
                        {isSubmitting ? 'Evaluating Test Suite...' : 'Submit Round 2 Solution →'}
                    </button>
                )}
            </div>

            {error && (
                <div className="drives-alert drives-alert--error">{error}</div>
            )}

            {/* Split Workspace */}
            <div className="drives-coding-split">
                <div className="drives-coding-pane drives-coding-pane--left">
                    <ProblemDescription question={question} />
                </div>

                <div className="drives-coding-pane drives-coding-pane--right">
                    <CodeEditor
                        languages={question.supportedLanguages || ['javascript', 'python', 'java', 'cpp']}
                        selectedLanguage={language}
                        onLanguageChange={setLanguage}
                        code={code}
                        onCodeChange={setCode}
                        onReset={() => setCode(question.starterCode?.[language] || '')}
                        onRunSample={handleRunSample}
                        onSubmit={handleSubmitRoundCode}
                        runningSample={runningSample}
                        submittingCode={isSubmitting}
                        isAssessment={true}
                    />

                    <div className="drives-results-tray">
                        {sampleResult && (
                            <SubmissionResult
                                result={sampleResult}
                                isSample={true}
                            />
                        )}

                        {isEvaluated && (
                            <div className="drives-round-eval-summary">
                                <strong>Round 2 Evaluation Verdict:</strong> {round.feedback}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingRoundRunner;
