import React, { useState } from 'react';

const ProblemDescription = ({ question }) => {
    const [showHints, setShowHints] = useState(false);

    if (!question) return null;

    const {
        title,
        difficulty,
        topics = [],
        description,
        examples = [],
        constraints = [],
        hints = []
    } = question;

    return (
        <div className="coding-problem-desc">
            <div className="coding-problem-desc__header">
                <div className="coding-problem-desc__meta">
                    <span className={`coding-diff-badge coding-diff-badge--${difficulty?.toLowerCase()}`}>
                        {difficulty}
                    </span>
                    <span className="coding-type-badge">CareerAI Practice Problem</span>
                </div>
                <h2 className="coding-problem-desc__title">{title}</h2>
                <div className="coding-problem-desc__topics">
                    {topics.map(t => (
                        <span key={t} className="coding-topic-chip">{t}</span>
                    ))}
                </div>
            </div>

            <div className="coding-problem-desc__body">
                <div className="coding-problem-desc__statement">
                    {description.split('\n\n').map((para, idx) => (
                        <p key={idx}>{para}</p>
                    ))}
                </div>

                {examples.length > 0 && (
                    <div className="coding-problem-desc__examples">
                        <h4 className="coding-section-title">Examples</h4>
                        {examples.map((ex, idx) => (
                            <div key={idx} className="coding-example-card">
                                <div className="coding-example-card__header">
                                    Example {idx + 1}
                                </div>
                                <div className="coding-example-card__content">
                                    <div className="coding-example-line">
                                        <span className="coding-example-label">Input:</span>
                                        <code>{ex.input}</code>
                                    </div>
                                    <div className="coding-example-line">
                                        <span className="coding-example-label">Output:</span>
                                        <code>{ex.output}</code>
                                    </div>
                                    {ex.explanation && (
                                        <div className="coding-example-line coding-example-line--exp">
                                            <span className="coding-example-label">Explanation:</span>
                                            <span>{ex.explanation}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {constraints.length > 0 && (
                    <div className="coding-problem-desc__constraints">
                        <h4 className="coding-section-title">Constraints</h4>
                        <ul className="coding-constraints-list">
                            {constraints.map((c, idx) => (
                                <li key={idx}>
                                    <code>{c}</code>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {hints.length > 0 && (
                    <div className="coding-problem-desc__hints">
                        <button
                            type="button"
                            className="coding-hints-toggle"
                            onClick={() => setShowHints(prev => !prev)}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            <span>{showHints ? 'Hide Hints' : `Show Hints (${hints.length})`}</span>
                        </button>

                        {showHints && (
                            <div className="coding-hints-panel">
                                {hints.map((hint, idx) => (
                                    <div key={idx} className="coding-hint-item">
                                        <span className="coding-hint-idx">Hint {idx + 1}:</span> {hint}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemDescription;
