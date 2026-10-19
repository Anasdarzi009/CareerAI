import React from 'react';

const PlacementReadinessHeader = ({
    lastCalculatedAt,
    onRecalculate,
    recalculating = false
}) => {
    const formattedDate = lastCalculatedAt
        ? new Date(lastCalculatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : 'Just now';

    return (
        <header className="placement-header">
            <div className="placement-header__main">
                <div className="placement-header__titles">
                    <span className="placement-header__badge">PLACEMENT COMMAND CENTER</span>
                    <h1 className="placement-header__title">PLACEMENT READINESS</h1>
                    <p className="placement-header__subtitle">
                        Your current readiness for the placement journey, evaluated against verified profile credentials, eligibility cutoffs, and skill benchmarks.
                    </p>
                </div>

                <div className="placement-header__actions">
                    <button
                        className="placement-btn placement-btn--secondary"
                        onClick={onRecalculate}
                        disabled={recalculating}
                    >
                        {recalculating ? (
                            <>
                                <span className="placement-spinner"></span>
                                Recalculating...
                            </>
                        ) : (
                            <>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                                </svg>
                                Recalculate Assessment
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="placement-header__meta-strip">
                <span className="placement-header__timestamp">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    Last assessed: <strong>{formattedDate}</strong>
                </span>
                <span className="placement-header__disclaimer">
                    All calculations are directly derived from your verified database records and academic criteria.
                </span>
            </div>
        </header>
    );
};

export default PlacementReadinessHeader;
