import React from 'react';
import { useNavigate } from 'react-router';

const AptitudeResult = ({ assessment }) => {
    const navigate = useNavigate();

    if (!assessment) return null;

    const {
        title,
        overallScore = 0,
        accuracy = 0,
        correctCount = 0,
        incorrectCount = 0,
        unattemptedCount = 0,
        totalQuestions = 0,
        timeUsedSeconds = 0,
        categoryBreakdown = [],
        difficultyBreakdown = [],
        strongestAreas = [],
        weakestAreas = [],
        recommendedPractice = []
    } = assessment;

    const attemptedCount = correctCount + incorrectCount;
    const mins = Math.floor(timeUsedSeconds / 60);
    const secs = timeUsedSeconds % 60;
    const timeFormatted = `${mins}m ${secs}s`;

    const getScoreBadgeClass = (s) => {
        if (s >= 75) return 'score-pill--high';
        if (s >= 50) return 'score-pill--mid';
        return 'score-pill--low';
    };

    return (
        <div className="aptitude-result-report">
            {/* Header / Verdict Card */}
            <div className="aptitude-result-hero">
                <div className="result-hero-top">
                    <span className="result-badge">Official Assessment Result</span>
                    <h2 className="result-title">{title}</h2>
                    <p className="result-subtitle">
                        Server-side verified aptitude screening evaluation. All metrics computed from official answer records.
                    </p>
                </div>

                <div className="result-kpis-grid">
                    {/* Overall Score */}
                    <div className="result-kpi-card">
                        <span className="kpi-label">OVERALL SCORE</span>
                        <div className={`kpi-big-number ${getScoreBadgeClass(overallScore)}`}>
                            {overallScore}%
                        </div>
                        <span className="kpi-note">
                            {overallScore >= 70 ? '✓ Placement Cutoff Cleared' : 'Below 70% Corporate Cutoff'}
                        </span>
                    </div>

                    {/* Accuracy */}
                    <div className="result-kpi-card">
                        <span className="kpi-label">ACCURACY</span>
                        <div className="kpi-big-number">
                            {accuracy}%
                        </div>
                        <span className="kpi-note">
                            {correctCount} correct of {attemptedCount} attempted
                        </span>
                    </div>

                    {/* Questions Attempted */}
                    <div className="result-kpi-card">
                        <span className="kpi-label">ATTEMPTED</span>
                        <div className="kpi-big-number">
                            {attemptedCount}/{totalQuestions}
                        </div>
                        <span className="kpi-note">
                            {unattemptedCount} left unattempted
                        </span>
                    </div>

                    {/* Time Used */}
                    <div className="result-kpi-card">
                        <span className="kpi-label">TIME USED</span>
                        <div className="kpi-big-number">
                            {timeFormatted}
                        </div>
                        <span className="kpi-note">
                            Avg: {attemptedCount > 0 ? Math.round(timeUsedSeconds / attemptedCount) : 0}s per question
                        </span>
                    </div>
                </div>
            </div>

            {/* Middle Section: Breakdowns & Diagnostics */}
            <div className="result-analytics-row">
                {/* Category Breakdown */}
                <div className="result-card">
                    <h3 className="result-card-title">DOMAIN PERFORMANCE BREAKDOWN</h3>
                    <div className="result-breakdown-list">
                        {categoryBreakdown.map((cat, idx) => (
                            <div key={idx} className="breakdown-item">
                                <div className="breakdown-item__top">
                                    <span className="breakdown-name">{cat.category}</span>
                                    <span className="breakdown-stats">
                                        {cat.correct}/{cat.total} ({cat.accuracy}%)
                                    </span>
                                </div>
                                <div className="breakdown-bar">
                                    <div
                                        className="breakdown-bar-fill"
                                        style={{ width: `${cat.accuracy}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Difficulty Breakdown */}
                <div className="result-card">
                    <h3 className="result-card-title">DIFFICULTY BREAKDOWN</h3>
                    <div className="result-breakdown-list">
                        {difficultyBreakdown.map((diff, idx) => (
                            <div key={idx} className="breakdown-item">
                                <div className="breakdown-item__top">
                                    <span className="breakdown-name">{diff.difficulty}</span>
                                    <span className="breakdown-stats">
                                        {diff.correct}/{diff.total} ({diff.accuracy}%)
                                    </span>
                                </div>
                                <div className="breakdown-bar">
                                    <div
                                        className="breakdown-bar-fill breakdown-bar-fill--diff"
                                        style={{ width: `${diff.accuracy}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Diagnostic Section: Strengths, Weaknesses, Recommended Practice */}
            <div className="result-diagnostics-grid">
                {/* Strongest Areas */}
                <div className="diagnostic-card diagnostic-card--strength">
                    <h4 className="diagnostic-title">
                        <span className="diag-icon">★</span> STRONGEST AREAS
                    </h4>
                    {strongestAreas.length > 0 ? (
                        <ul className="diag-list">
                            {strongestAreas.map((area, idx) => (
                                <li key={idx}>✓ {area}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="diag-empty">Consistent practice needed to establish high-confidence strengths.</p>
                    )}
                </div>

                {/* Weakest Areas */}
                <div className="diagnostic-card diagnostic-card--weakness">
                    <h4 className="diagnostic-title">
                        <span className="diag-icon">⚠</span> WEAKEST AREAS
                    </h4>
                    {weakestAreas.length > 0 ? (
                        <ul className="diag-list">
                            {weakestAreas.map((area, idx) => (
                                <li key={idx}>✕ {area}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="diag-empty">No critical topic deficiencies identified in this assessment.</p>
                    )}
                </div>

                {/* Recommended Practice */}
                <div className="diagnostic-card diagnostic-card--action">
                    <h4 className="diagnostic-title">
                        <span className="diag-icon">➔</span> RECOMMENDED ROADMAP ACTIONS
                    </h4>
                    {recommendedPractice.length > 0 ? (
                        <ul className="diag-list">
                            {recommendedPractice.map((rec, idx) => (
                                <li key={idx}>• {rec}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="diag-empty">Practice regular timed screening assessments to maintain speed.</p>
                    )}
                </div>
            </div>

            {/* Actions Bar */}
            <div className="result-action-footer">
                <button
                    type="button"
                    className="aptitude-btn aptitude-btn--secondary"
                    onClick={() => navigate('/aptitude')}
                >
                    ← Back to Aptitude Hub
                </button>
                <button
                    type="button"
                    className="aptitude-btn aptitude-btn--primary"
                    onClick={() => navigate('/placement-readiness')}
                >
                    View Updated Placement Readiness →
                </button>
            </div>
        </div>
    );
};

export default AptitudeResult;
