import React from 'react';
import { Link } from 'react-router';

const AssessmentResult = ({ assessment }) => {
    if (!assessment) return null;

    const {
        title,
        targetRole,
        score = 0,
        solvedQuestions = 0,
        totalQuestions = 0,
        difficultyBreakdown = {},
        topicBreakdown = {},
        startedAt,
        submittedAt,
        durationMinutes
    } = assessment;

    // Compute elapsed time in minutes
    let timeUsedMinutes = durationMinutes;
    if (startedAt && submittedAt) {
        const ms = new Date(submittedAt).getTime() - new Date(startedAt).getTime();
        timeUsedMinutes = Math.max(1, Math.round(ms / 60000));
    }

    const accuracy = totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0;
    const isPassing = score >= 60;

    return (
        <div className="coding-assessment-result">
            <div className="coding-assessment-result__hero">
                <div className={`coding-result-icon-badge ${isPassing ? 'coding-result-icon-badge--pass' : 'coding-result-icon-badge--review'}`}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        {isPassing ? (
                            <polyline points="20 6 9 17 4 12" />
                        ) : (
                            <>
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </>
                        )}
                    </svg>
                </div>
                <h2 className="coding-assessment-result__title">
                    {isPassing ? 'Assessment Completed Successfully' : 'Assessment Evaluation Complete'}
                </h2>
                <p className="coding-assessment-result__subtitle">
                    {title} — Target Role: <strong>{targetRole || 'Software Engineering'}</strong>
                </p>

                <div className="coding-assessment-result__score-circle">
                    <div className="coding-assessment-result__score-num">{score}</div>
                    <div className="coding-assessment-result__score-label">Placement Score / 100</div>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="coding-assessment-result__metrics-grid">
                <div className="coding-assessment-result-metric-card">
                    <span className="label">Questions Solved</span>
                    <strong>{solvedQuestions} / {totalQuestions}</strong>
                </div>
                <div className="coding-assessment-result-metric-card">
                    <span className="label">Solve Accuracy</span>
                    <strong>{accuracy}%</strong>
                </div>
                <div className="coding-assessment-result-metric-card">
                    <span className="label">Time Used</span>
                    <strong>{timeUsedMinutes} mins</strong>
                </div>
                <div className="coding-assessment-result-metric-card">
                    <span className="label">Readiness Verdict</span>
                    <strong className={isPassing ? 'text-success' : 'text-warning'}>
                        {isPassing ? 'Placement Ready' : 'Practice Required'}
                    </strong>
                </div>
            </div>

            {/* Topic & Difficulty Breakdown */}
            <div className="coding-assessment-result__breakdown-grid">
                <div className="coding-assessment-result__section">
                    <h4 className="coding-section-title">Difficulty Breakdown</h4>
                    <div className="coding-breakdown-list">
                        {Object.entries(difficultyBreakdown).map(([diff, data]) => (
                            <div key={diff} className="coding-breakdown-row">
                                <span className={`coding-tag coding-tag--${diff.toLowerCase()}`}>{diff}</span>
                                <span>{data.solved || 0} / {data.total || 0} Solved</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="coding-assessment-result__section">
                    <h4 className="coding-section-title">Topic Breakdown</h4>
                    <div className="coding-breakdown-list">
                        {Object.entries(topicBreakdown).map(([topic, data]) => (
                            <div key={topic} className="coding-breakdown-row">
                                <span className="coding-topic-chip">{topic}</span>
                                <span>{data.solved || 0} / {data.total || 0} Solved</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="coding-assessment-result__recommendations">
                <h4 className="coding-section-title">Next Actionable Placement Steps</h4>
                <ul className="coding-rec-list">
                    {score < 60 && (
                        <li>
                            <strong>Focus on Core Data Structures:</strong> Strengthen fundamental algorithmic patterns in Arrays, Strings, and Hashing before taking your next timed assessment.
                        </li>
                    )}
                    {accuracy < 75 && (
                        <li>
                            <strong>Edge Case Verification:</strong> Multiple test cases failed. Practice writing boundary test cases (empty inputs, single elements, large bounds) before submitting.
                        </li>
                    )}
                    <li>
                        <strong>Skill Gap Matrix Updated:</strong> Solved coding assessment questions have been registered as verified algorithmic evidence in your Skill Gap profile.
                    </li>
                </ul>
            </div>

            <div className="coding-assessment-result__actions">
                <Link to="/coding" className="coding-btn coding-btn--secondary">
                    ← Back to Coding Round
                </Link>
                <Link to="/placement-readiness" className="coding-btn coding-btn--primary">
                    View Placement Readiness →
                </Link>
            </div>
        </div>
    );
};

export default AssessmentResult;
