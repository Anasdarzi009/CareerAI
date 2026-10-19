import React from 'react';
import { Link } from 'react-router';

const DriveDossierView = ({ drive, onRetake }) => {
    if (!drive) return null;

    const {
        title,
        companyName,
        targetRole,
        tier,
        overallScore = 0,
        hiringVerdict = 'PENDING',
        verdictSummary,
        rounds = [],
        strengths = [],
        criticalGaps = [],
        startedAt,
        completedAt
    } = drive;

    const isRecommended = hiringVerdict === 'RECOMMENDED FOR HIRE';
    const isBorderline = hiringVerdict.includes('BORDERLINE');

    const getVerdictClass = () => {
        if (isRecommended) return 'drives-verdict--hire';
        if (isBorderline) return 'drives-verdict--borderline';
        return 'drives-verdict--not-cleared';
    };

    return (
        <div className="drives-dossier">
            {/* Dossier Top Banner */}
            <div className={`drives-dossier-banner ${getVerdictClass()}`}>
                <div className="drives-dossier-banner__top">
                    <span className="drives-company-badge">{companyName} Placement Drive</span>
                    <span className="drives-tier-tag">{tier}</span>
                </div>

                <div className="drives-dossier-verdict-pill">
                    {isRecommended ? '✓ ' : isBorderline ? '▲ ' : '✕ '}
                    {hiringVerdict}
                </div>

                <h2 className="drives-dossier-title">{title}</h2>
                <div className="drives-dossier-role">Target Role: <strong>{targetRole}</strong></div>

                {/* Score Dial */}
                <div className="drives-score-circle">
                    <span className="score-num">{overallScore}</span>
                    <span className="score-label">Placement Score / 100</span>
                </div>
            </div>

            {/* Recruiter Rationale Box */}
            {verdictSummary && (
                <div className="drives-dossier-section drives-dossier-section--summary">
                    <h4 className="drives-section-title">Hiring Evaluation Summary</h4>
                    <p className="drives-summary-text">{verdictSummary}</p>
                </div>
            )}

            {/* Round Breakdown Cards */}
            <div className="drives-dossier-section">
                <h4 className="drives-section-title">Round-by-Round Performance Breakdown</h4>
                <div className="drives-rounds-breakdown-grid">
                    {rounds.map(r => (
                        <div key={r.roundNumber} className={`drives-round-result-card ${r.passed ? 'pass' : 'fail'}`}>
                            <div className="drives-round-result-card__header">
                                <span className="round-idx">Round 0{r.roundNumber}</span>
                                <span className={`status-pill ${r.passed ? 'status-pill--pass' : 'status-pill--fail'}`}>
                                    {r.passed ? 'Passed' : 'Cutoff Missed'}
                                </span>
                            </div>
                            <h5 className="round-title">{r.title.split(':')[0]}</h5>
                            <div className="round-score">
                                {r.score} <span>/ 100</span>
                            </div>
                            <p className="round-feedback">{r.feedback || 'Round evaluated.'}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Strengths & Gaps Grid */}
            <div className="drives-dossier-two-col">
                <div className="drives-dossier-card drives-dossier-card--strengths">
                    <h4 className="drives-card-heading">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Demonstrated Strengths
                    </h4>
                    {strengths.length > 0 ? (
                        <ul className="drives-list">
                            {strengths.map((s, idx) => (
                                <li key={idx}><strong>{s}</strong></li>
                            ))}
                        </ul>
                    ) : (
                        <p className="drives-empty-text">No significant strengths demonstrated in this attempt.</p>
                    )}
                </div>

                <div className="drives-dossier-card drives-dossier-card--gaps">
                    <h4 className="drives-card-heading drives-card-heading--gaps">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Target Focus Areas
                    </h4>
                    {criticalGaps.length > 0 ? (
                        <ul className="drives-list drives-list--gaps">
                            {criticalGaps.map((g, idx) => (
                                <li key={idx}><strong>{g}</strong></li>
                            ))}
                        </ul>
                    ) : (
                        <p className="drives-empty-text">No major gaps identified. Ready for live corporate drive.</p>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="drives-dossier-actions">
                <Link to="/placement-drives" className="drives-btn drives-btn--secondary">
                    ← Back to Placement Drives Hub
                </Link>
                <Link to="/placement-readiness" className="drives-btn drives-btn--primary">
                    View Placement Readiness Audit →
                </Link>
                {onRetake && (
                    <button
                        type="button"
                        className="drives-btn drives-btn--ghost"
                        onClick={onRetake}
                    >
                        Retake Simulation
                    </button>
                )}
            </div>
        </div>
    );
};

export default DriveDossierView;
