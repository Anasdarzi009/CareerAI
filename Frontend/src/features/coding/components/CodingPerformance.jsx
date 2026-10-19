import React from 'react';

const CodingPerformance = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="coding-performance-container coding-performance-container--loading">
                <div className="coding-spinner coding-spinner--large"></div>
                <p>Computing algorithmic performance analytics...</p>
            </div>
        );
    }

    if (!stats || stats.attempted === 0) {
        return (
            <div className="coding-empty-analytics">
                <div className="coding-empty-analytics__icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M18 20V10M12 20V4M6 20v-6" />
                    </svg>
                </div>
                <h3 className="coding-empty-analytics__title">No Coding Activity Recorded Yet</h3>
                <p className="coding-empty-analytics__desc">
                    Analytics require solved problem evidence. Start with an Easy problem in the Practice tab to establish your baseline.
                </p>
            </div>
        );
    }

    const {
        attempted,
        solved,
        accuracy,
        averageScore,
        easySolved,
        mediumSolved,
        hardSolved,
        topicPerformance = {},
        strengths = [],
        weakAreas = []
    } = stats;

    const topicEntries = Object.entries(topicPerformance);

    return (
        <div className="coding-performance-grid">
            {/* Overview Card */}
            <div className="coding-perf-card">
                <h3 className="coding-perf-card__title">Executive Summary</h3>
                <div className="coding-perf-summary-rows">
                    <div className="coding-perf-summary-row">
                        <span>Total Problems Solved</span>
                        <strong>{solved} / {attempted}</strong>
                    </div>
                    <div className="coding-perf-summary-row">
                        <span>Submission Accuracy</span>
                        <strong>{accuracy}%</strong>
                    </div>
                    <div className="coding-perf-summary-row">
                        <span>Average Assessment Score</span>
                        <strong>{averageScore}/100</strong>
                    </div>
                    <div className="coding-perf-summary-row">
                        <span>Evidence Confidence</span>
                        <strong>
                            {attempted >= 10 ? 'High' : attempted >= 3 ? 'Moderate' : 'Preliminary'}
                        </strong>
                    </div>
                </div>

                <div className="coding-difficulty-dist">
                    <h4 className="coding-section-title">Difficulty Solved Distribution</h4>
                    <div className="coding-diff-dist-bars">
                        <div className="coding-diff-dist-item">
                            <div className="coding-diff-dist-item__header">
                                <span className="coding-tag coding-tag--easy">Easy</span>
                                <span>{easySolved} solved</span>
                            </div>
                            <div className="coding-progress-track">
                                <div
                                    className="coding-progress-fill coding-progress-fill--easy"
                                    style={{ width: `${Math.min(100, easySolved * 15)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="coding-diff-dist-item">
                            <div className="coding-diff-dist-item__header">
                                <span className="coding-tag coding-tag--medium">Medium</span>
                                <span>{mediumSolved} solved</span>
                            </div>
                            <div className="coding-progress-track">
                                <div
                                    className="coding-progress-fill coding-progress-fill--medium"
                                    style={{ width: `${Math.min(100, mediumSolved * 12)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="coding-diff-dist-item">
                            <div className="coding-diff-dist-item__header">
                                <span className="coding-tag coding-tag--hard">Hard</span>
                                <span>{hardSolved} solved</span>
                            </div>
                            <div className="coding-progress-track">
                                <div
                                    className="coding-progress-fill coding-progress-fill--hard"
                                    style={{ width: `${Math.min(100, hardSolved * 20)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strengths and Weak Areas */}
            <div className="coding-perf-card">
                <h3 className="coding-perf-card__title">Skill Gap & Readiness Insights</h3>
                <p className="coding-perf-card__subtitle">
                    {attempted < 5
                        ? 'Current evidence suggests early patterns based on preliminary submissions:'
                        : 'Verified algorithmic capabilities based on evaluated practice submissions:'
                    }
                </p>

                <div className="coding-insights-group">
                    <h4 className="coding-insights-heading coding-insights-heading--strength">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Demonstrated Strengths
                    </h4>
                    {strengths.length > 0 ? (
                        <div className="coding-strengths-tags">
                            {strengths.map(topic => (
                                <span key={topic} className="coding-badge-verified">
                                    {topic} — Strong
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="coding-insight-empty">
                            No consistent algorithmic strengths established yet. Solve 2+ problems in a category to demonstrate proficiency.
                        </p>
                    )}

                    <h4 className="coding-insights-heading coding-insights-heading--weak">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                            <circle cx="12" cy="12" r="10" />
                        </svg>
                        Target Focus Areas
                    </h4>
                    {weakAreas.length > 0 ? (
                        <div className="coding-weak-tags">
                            {weakAreas.map(topic => (
                                <span key={topic} className="coding-badge-focus">
                                    {topic} — Needs Practice
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="coding-insight-empty">
                            No severe topic bottlenecks detected yet. Continue attempting diverse categories.
                        </p>
                    )}
                </div>
            </div>

            {/* Topic Wise Performance Table */}
            <div className="coding-perf-card coding-perf-card--full">
                <h3 className="coding-perf-card__title">Topic & Algorithmic Domain Breakdown</h3>
                {topicEntries.length === 0 ? (
                    <p className="coding-insight-empty">No topic submissions evaluated yet.</p>
                ) : (
                    <div className="coding-topic-table-wrapper">
                        <table className="coding-topic-table">
                            <thead>
                                <tr>
                                    <th>Algorithmic Topic</th>
                                    <th>Attempted</th>
                                    <th>Solved</th>
                                    <th>Topic Accuracy</th>
                                    <th>Assessment Signal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topicEntries.map(([topic, data]) => {
                                    const topicAcc = data.attempted > 0
                                        ? Math.round((data.solved / data.attempted) * 100)
                                        : 0;
                                    return (
                                        <tr key={topic}>
                                            <td><strong>{topic}</strong></td>
                                            <td>{data.attempted}</td>
                                            <td>{data.solved}</td>
                                            <td>
                                                <div className="coding-table-acc">
                                                    <span>{topicAcc}%</span>
                                                    <div className="coding-table-bar">
                                                        <div
                                                            className="coding-table-bar__fill"
                                                            style={{ width: `${topicAcc}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {data.solved >= 2 && topicAcc >= 60 ? (
                                                    <span className="coding-signal-badge coding-signal-badge--ready">Verified Skill</span>
                                                ) : data.attempted > 0 && data.solved === 0 ? (
                                                    <span className="coding-signal-badge coding-signal-badge--gap">Practice Gap</span>
                                                ) : (
                                                    <span className="coding-signal-badge coding-signal-badge--emerging">Emerging</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodingPerformance;
