import React from 'react';
import { useNavigate } from 'react-router';

const AptitudePerformance = ({ stats, loading }) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="aptitude-perf-loading">
                <p>Loading candidate aptitude performance metrics...</p>
            </div>
        );
    }

    if (!stats || !stats.hasData) {
        return (
            <div className="aptitude-empty-perf">
                <div className="empty-perf-icon">📊</div>
                <h3>No Aptitude Attempts Recorded Yet</h3>
                <p>
                    Aptitude metrics are evidence-based and require genuine candidate practice activity. Start solving questions or take a timed assessment to build your placement screening profile.
                </p>
                <button
                    type="button"
                    className="aptitude-btn aptitude-btn--primary"
                    onClick={() => navigate('/aptitude')}
                >
                    Start Aptitude Practice Now →
                </button>
            </div>
        );
    }

    const {
        overallAccuracy = 0,
        quantitativeAccuracy = 0,
        logicalAccuracy = 0,
        verbalAccuracy = 0,
        questionsSolved = 0,
        totalAttempts = 0,
        averageTimeSeconds = 0,
        latestAssessmentScore = null,
        completedAssessmentsCount = 0,
        weakestAreas = [],
        recentPerformance = []
    } = stats;

    return (
        <div className="aptitude-performance-view">
            <div className="perf-summary-banner">
                <div>
                    <h3>CANDIDATE APTITUDE PERFORMANCE AUDIT</h3>
                    <p>Evidence-backed analytics compiled from actual stored submissions and completed assessments.</p>
                </div>
                <div className="perf-banner-badge">
                    <span>Verified Placement Screening Data</span>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="perf-cards-grid">
                <div className="perf-card">
                    <span className="perf-card-title">OVERALL ACCURACY</span>
                    <div className="perf-card-num">{overallAccuracy}%</div>
                    <span className="perf-card-sub">{questionsSolved} of {totalAttempts} questions answered correctly</span>
                </div>

                <div className="perf-card">
                    <span className="perf-card-title">AVERAGE RESPONSE SPEED</span>
                    <div className="perf-card-num">{averageTimeSeconds}s</div>
                    <span className="perf-card-sub">Per question across all attempts</span>
                </div>

                <div className="perf-card">
                    <span className="perf-card-title">LATEST ASSESSMENT SCORE</span>
                    <div className="perf-card-num">
                        {latestAssessmentScore !== null ? `${latestAssessmentScore}%` : 'N/A'}
                    </div>
                    <span className="perf-card-sub">{completedAssessmentsCount} completed corporate assessment(s)</span>
                </div>
            </div>

            {/* Category Accuracy Bars */}
            <div className="perf-section-card">
                <h4>DOMAIN ACCURACY AUDIT</h4>
                <div className="perf-bars-list">
                    <div className="perf-bar-row">
                        <div className="perf-bar-label">
                            <span>Quantitative Aptitude</span>
                            <strong>{quantitativeAccuracy}%</strong>
                        </div>
                        <div className="perf-track">
                            <div className="perf-fill perf-fill--quant" style={{ width: `${quantitativeAccuracy}%` }} />
                        </div>
                    </div>

                    <div className="perf-bar-row">
                        <div className="perf-bar-label">
                            <span>Logical Reasoning</span>
                            <strong>{logicalAccuracy}%</strong>
                        </div>
                        <div className="perf-track">
                            <div className="perf-fill perf-fill--logic" style={{ width: `${logicalAccuracy}%` }} />
                        </div>
                    </div>

                    <div className="perf-bar-row">
                        <div className="perf-bar-label">
                            <span>Verbal Ability</span>
                            <strong>{verbalAccuracy}%</strong>
                        </div>
                        <div className="perf-track">
                            <div className="perf-fill perf-fill--verbal" style={{ width: `${verbalAccuracy}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Weakest Areas Alert */}
            {weakestAreas.length > 0 && (
                <div className="perf-weakness-alert">
                    <span className="alert-icon">⚠</span>
                    <div>
                        <strong>Identified Screening Risk Areas:</strong>
                        <span> Below 60% accuracy detected in: {weakestAreas.join(', ')}. Practice targeted questions to elevate eligibility confidence.</span>
                    </div>
                </div>
            )}

            {/* Recent Assessments Table */}
            <div className="perf-section-card">
                <h4>RECENT TIMED ASSESSMENTS</h4>
                {recentPerformance.length > 0 ? (
                    <table className="perf-table">
                        <thead>
                            <tr>
                                <th>Assessment Title</th>
                                <th>Score</th>
                                <th>Accuracy</th>
                                <th>Date Completed</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentPerformance.map((item, idx) => (
                                <tr key={item.id || idx}>
                                    <td className="table-title-cell">{item.title}</td>
                                    <td>
                                        <span className={`table-score-pill ${item.score >= 70 ? 'pill--green' : 'pill--orange'}`}>
                                            {item.score}%
                                        </span>
                                    </td>
                                    <td>{item.accuracy}%</td>
                                    <td>{item.date ? new Date(item.date).toLocaleDateString() : 'Recent'}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="table-action-btn"
                                            onClick={() => navigate(`/aptitude/assessment/${item.id}`)}
                                        >
                                            View Report →
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="perf-empty-table">No timed assessments completed yet. Take an assessment to record official score records.</p>
                )}
            </div>
        </div>
    );
};

export default AptitudePerformance;
