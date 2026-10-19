import React from 'react';
import { useNavigate } from 'react-router';

const AptitudeQuestionCard = ({ question }) => {
    const navigate = useNavigate();

    const {
        _id,
        company,
        questionText,
        category = 'Quantitative Aptitude',
        topic,
        difficulty = 'Medium',
        reportedYear,
        verificationStatus = 'ORIGINAL',
        isSolved,
        isAttempted,
        timeAllocationSeconds = 60,
        marks = 1,
        negativeMarks = 0.25
    } = question;

    const getDiffBadgeClass = (diff) => {
        switch (diff) {
            case 'Easy': return 'diff-pill--easy';
            case 'Hard': return 'diff-pill--hard';
            default: return 'diff-pill--medium';
        }
    };

    const getCategoryBadgeClass = (cat) => {
        if (cat === 'Quantitative Aptitude') return 'cat-badge--quant';
        if (cat === 'Logical Reasoning') return 'cat-badge--logic';
        return 'cat-badge--verbal';
    };

    const getCompanyInitial = (comp) => {
        if (!comp) return 'AI';
        if (comp.length <= 4) return comp.toUpperCase();
        return comp.substring(0, 3).toUpperCase();
    };

    const renderVerificationBadge = () => {
        if (verificationStatus === 'REPORTED') {
            return (
                <span className="aptitude-provenance-badge aptitude-provenance-badge--reported" title="Directly reported from candidate interview experiences">
                    ✓ Reported Company Question
                </span>
            );
        }
        if (verificationStatus === 'PATTERN_BASED') {
            return (
                <span className="aptitude-provenance-badge aptitude-provenance-badge--pattern" title="Based on documented company exam question patterns">
                    Pattern Based
                </span>
            );
        }
        return (
            <span className="aptitude-provenance-badge aptitude-provenance-badge--original" title="CareerAI standard practice aptitude question">
                CareerAI Original
            </span>
        );
    };

    return (
        <article className={`aptitude-q-card ${isSolved ? 'aptitude-q-card--solved' : isAttempted ? 'aptitude-q-card--attempted' : ''}`}>
            {/* Top row: Company Badge & Status */}
            <div className="aptitude-q-card__header">
                <div className="aptitude-company-indicator">
                    <span className="aptitude-company-avatar" aria-hidden="true">
                        {getCompanyInitial(company)}
                    </span>
                    <span className="aptitude-company-name">
                        {company || 'CareerAI'}
                    </span>
                </div>

                <div className="aptitude-status-indicator">
                    {isSolved ? (
                        <span className="status-badge status-badge--solved">
                            ✓ Solved
                        </span>
                    ) : isAttempted ? (
                        <span className="status-badge status-badge--attempted">
                            ● Attempted
                        </span>
                    ) : (
                        <span className="status-badge status-badge--unattempted">
                            Unattempted
                        </span>
                    )}
                </div>
            </div>

            {/* Question Text */}
            <h3 className="aptitude-q-card__text">
                {questionText}
            </h3>

            {/* Tags row: Category, Topic, Difficulty */}
            <div className="aptitude-q-tags">
                <span className={`aptitude-cat-badge ${getCategoryBadgeClass(category)}`}>
                    {category}
                </span>
                {topic && <span className="aptitude-topic-tag">{topic}</span>}
                <span className={`aptitude-diff-pill ${getDiffBadgeClass(difficulty)}`}>
                    {difficulty}
                </span>
            </div>

            {/* Provenance Row */}
            <div className="aptitude-provenance-row">
                <div className="aptitude-provenance-year">
                    {reportedYear ? (
                        <span>Reported in <strong>{reportedYear}</strong></span>
                    ) : (
                        <span className="aptitude-provenance-year--unverified">Reported year: <em>Not verified</em></span>
                    )}
                </div>
                {renderVerificationBadge()}
            </div>

            {/* Card Footer */}
            <div className="aptitude-q-card__footer">
                <div className="aptitude-q-meta">
                    <span className="meta-item">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {timeAllocationSeconds}s
                    </span>
                    <span className="meta-item">
                        +{marks} mark
                    </span>
                    {negativeMarks > 0 && (
                        <span className="meta-item meta-item--negative">
                            -{negativeMarks} neg
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    className="aptitude-btn aptitude-btn--primary aptitude-btn--sm"
                    onClick={() => navigate(`/aptitude/practice/${_id}`)}
                >
                    {isSolved ? 'Review Solution →' : 'Practice Question →'}
                </button>
            </div>
        </article>
    );
};

export default AptitudeQuestionCard;
