import React from 'react';

const AptitudeStats = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="aptitude-stats aptitude-stats--loading">
                <div className="aptitude-stat-card skeleton-stat" />
                <div className="aptitude-stat-card skeleton-stat" />
                <div className="aptitude-stat-card skeleton-stat" />
                <div className="aptitude-stat-card skeleton-stat" />
            </div>
        );
    }

    const hasData = stats?.hasData;

    return (
        <section className="aptitude-stats-container" aria-label="Aptitude Performance Metrics">
            <div className="aptitude-stats-grid">
                {/* 1. Overall Accuracy */}
                <div className="aptitude-stat-card">
                    <div className="aptitude-stat-card__top">
                        <span className="aptitude-stat-label">OVERALL ACCURACY</span>
                        <span className="aptitude-stat-badge">Screening Precision</span>
                    </div>
                    <div className="aptitude-stat-value">
                        {hasData ? `${stats.overallAccuracy}%` : '—'}
                    </div>
                    <div className="aptitude-stat-footer">
                        {hasData ? (
                            <span>{stats.questionsSolved} of {stats.totalAttempts} questions answered correctly</span>
                        ) : (
                            <span className="aptitude-empty-hint">No aptitude attempts recorded yet</span>
                        )}
                    </div>
                </div>

                {/* 2. Quantitative Accuracy */}
                <div className="aptitude-stat-card">
                    <div className="aptitude-stat-card__top">
                        <span className="aptitude-stat-label">QUANTITATIVE</span>
                        <span className="aptitude-stat-badge aptitude-stat-badge--quant">Math &amp; Numbers</span>
                    </div>
                    <div className="aptitude-stat-value">
                        {hasData ? `${stats.quantitativeAccuracy}%` : '—'}
                    </div>
                    <div className="aptitude-stat-footer">
                        {hasData ? (
                            <span>Percentages, Time &amp; Work, Ratios</span>
                        ) : (
                            <span className="aptitude-empty-hint">Practice to benchmark Quant</span>
                        )}
                    </div>
                </div>

                {/* 3. Logical Reasoning */}
                <div className="aptitude-stat-card">
                    <div className="aptitude-stat-card__top">
                        <span className="aptitude-stat-label">LOGICAL REASONING</span>
                        <span className="aptitude-stat-badge aptitude-stat-badge--logic">Analytical Rigor</span>
                    </div>
                    <div className="aptitude-stat-value">
                        {hasData ? `${stats.logicalAccuracy}%` : '—'}
                    </div>
                    <div className="aptitude-stat-footer">
                        {hasData ? (
                            <span>Series, Syllogisms, Arrangement</span>
                        ) : (
                            <span className="aptitude-empty-hint">Practice to benchmark Logic</span>
                        )}
                    </div>
                </div>

                {/* 4. Verbal Ability */}
                <div className="aptitude-stat-card">
                    <div className="aptitude-stat-card__top">
                        <span className="aptitude-stat-label">VERBAL ABILITY</span>
                        <span className="aptitude-stat-badge aptitude-stat-badge--verbal">Grammar &amp; Vocab</span>
                    </div>
                    <div className="aptitude-stat-value">
                        {hasData ? `${stats.verbalAccuracy}%` : '—'}
                    </div>
                    <div className="aptitude-stat-footer">
                        {hasData ? (
                            <span>Comprehension, Correction, Vocab</span>
                        ) : (
                            <span className="aptitude-empty-hint">Practice to benchmark Verbal</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="aptitude-evidence-bar">
                <span className="aptitude-evidence-dot"></span>
                <span className="aptitude-evidence-text">
                    {hasData
                        ? `Evidence verified from ${stats.totalAttempts} practice attempt(s) and ${stats.completedAssessmentsCount} timed assessment(s). No simulated values.`
                        : 'No aptitude attempts recorded yet. Start practicing below to establish candidate screening evidence.'}
                </span>
            </div>
        </section>
    );
};

export default AptitudeStats;
