import React from 'react';
import { Link } from 'react-router';

const CodingQuestionCard = ({ question, isSolved, isAttempted }) => {
    const {
        _id,
        title,
        difficulty = 'Medium',
        topics = [],
        company,
        reportedYear,
        verificationStatus = 'ORIGINAL'
    } = question;

    const getEstimatedTime = (diff) => {
        switch (diff) {
            case 'Easy': return '15-20 mins';
            case 'Medium': return '25-35 mins';
            case 'Hard': return '40-50 mins';
            default: return '25 mins';
        }
    };

    const getCompanyInitial = (comp) => {
        if (!comp) return 'AI';
        if (comp.length <= 4) return comp.toUpperCase();
        return comp.substring(0, 3).toUpperCase();
    };

    const renderVerificationBadge = () => {
        if (verificationStatus === 'REPORTED') {
            return (
                <span className="coding-provenance-badge coding-provenance-badge--reported" title="Directly reported from candidate interview experiences">
                    ✓ Reported Company Question
                </span>
            );
        }
        if (verificationStatus === 'PATTERN_BASED') {
            return (
                <span className="coding-provenance-badge coding-provenance-badge--pattern" title="Based on documented company exam question patterns">
                    Pattern Based
                </span>
            );
        }
        return (
            <span className="coding-provenance-badge coding-provenance-badge--original" title="CareerAI standard practice problem">
                CareerAI Original
            </span>
        );
    };

    return (
        <div className="coding-question-card">
            {/* Top Bar: Company Badge + Status */}
            <div className="coding-question-card__top">
                <div className="coding-company-indicator">
                    <span className="coding-company-avatar" aria-hidden="true">
                        {getCompanyInitial(company)}
                    </span>
                    <span className="coding-company-name">
                        {company || 'CareerAI'}
                    </span>
                </div>

                <div className="coding-card-right-status">
                    {isSolved ? (
                        <span className="coding-status-pill coding-status-pill--solved" title="Solved in your submissions">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Solved
                        </span>
                    ) : isAttempted ? (
                        <span className="coding-status-pill coding-status-pill--attempted">
                            Attempted
                        </span>
                    ) : null}
                </div>
            </div>

            {/* Title */}
            <h3 className="coding-question-card__title">
                <Link to={`/coding/practice/${_id}`}>
                    {title}
                </Link>
            </h3>

            {/* Meta tags: Difficulty + Topics */}
            <div className="coding-question-card__badges">
                <span className={`coding-diff-badge coding-diff-badge--${difficulty.toLowerCase()}`}>
                    {difficulty}
                </span>
                {topics.slice(0, 3).map(t => (
                    <span key={t} className="coding-topic-chip">{t}</span>
                ))}
            </div>

            {/* Provenance Row */}
            <div className="coding-provenance-row">
                <div className="coding-provenance-year">
                    {reportedYear ? (
                        <span>Reported in <strong>{reportedYear}</strong></span>
                    ) : (
                        <span className="coding-provenance-year--unverified">Reported year: <em>Not verified</em></span>
                    )}
                </div>
                {renderVerificationBadge()}
            </div>

            {/* Footer */}
            <div className="coding-question-card__footer">
                <span className="coding-question-card__estimate">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    ~{getEstimatedTime(difficulty)}
                </span>
                <Link to={`/coding/practice/${_id}`} className="coding-btn-practice">
                    {isSolved ? 'Review Solution →' : 'View Problem →'}
                </Link>
            </div>
        </div>
    );
};

export default CodingQuestionCard;
