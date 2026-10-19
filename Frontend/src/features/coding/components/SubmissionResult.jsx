import React from 'react';

const SubmissionResult = ({ result, isSample = false, onClose }) => {
    if (!result) return null;

    const {
        status = 'Completed',
        passed = 0,
        total = 0,
        testCasesPassed,
        testCasesTotal,
        executionTime,
        executionTimeMs,
        memoryUsed,
        memoryUsedMb,
        error,
        results = [],
        sampleTestResults = [],
        score
    } = result;

    const actualPassed = passed || testCasesPassed || 0;
    const actualTotal = total || testCasesTotal || 0;
    const time = executionTime || executionTimeMs || 0;
    const memory = memoryUsed || memoryUsedMb || 0;
    const isAccepted = status === 'Accepted' || (actualTotal > 0 && actualPassed === actualTotal && !error);
    const testRuns = results.length > 0 ? results : sampleTestResults;

    return (
        <div className={`coding-result-card coding-result-card--${isAccepted ? 'accepted' : 'rejected'}`}>
            <div className="coding-result-card__header">
                <div className="coding-result-card__status-group">
                    <span className={`coding-result-badge coding-result-badge--${isAccepted ? 'accepted' : 'wrong'}`}>
                        {isAccepted ? '✓' : '✕'} {status}
                    </span>
                    <span className="coding-result-summary">
                        {actualPassed} / {actualTotal} test cases passed {isSample ? '(Sample tests)' : '(All test cases)'}
                    </span>
                </div>
                <div className="coding-result-card__metrics">
                    {score !== undefined && (
                        <span className="coding-result-metric">
                            Score: <strong>{score}/100</strong>
                        </span>
                    )}
                    {time > 0 && (
                        <span className="coding-result-metric">
                            Time: <strong>{time} ms</strong>
                        </span>
                    )}
                    {memory > 0 && (
                        <span className="coding-result-metric">
                            Memory: <strong>{memory} MB</strong>
                        </span>
                    )}
                    {onClose && (
                        <button type="button" className="coding-result-close" onClick={onClose}>
                            ×
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="coding-result-error">
                    <strong>Evaluation Note:</strong> {error}
                </div>
            )}

            {testRuns.length > 0 && (
                <div className="coding-result-cases">
                    <div className="coding-result-cases__title">Sample Cases Breakdown:</div>
                    <div className="coding-result-cases__list">
                        {testRuns.map((t, idx) => (
                            <div
                                key={idx}
                                className={`coding-result-case-row ${t.passed ? 'coding-result-case-row--pass' : 'coding-result-case-row--fail'}`}
                            >
                                <span className="coding-result-case-status">
                                    {t.passed ? '✓ Passed' : '✕ Failed'}
                                </span>
                                <div className="coding-result-case-details">
                                    <span className="coding-result-case-input">Input: <code>{t.input}</code></span>
                                    <span className="coding-result-case-expected">Expected: <code>{t.expectedOutput}</code></span>
                                    <span className="coding-result-case-actual">Actual: <code>{t.actualOutput || 'N/A'}</code></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionResult;
