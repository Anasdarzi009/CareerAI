import React from 'react';

const DriveTemplateCard = ({ template, onStartDrive, isStarting }) => {
    const {
        id,
        title,
        companyName,
        targetRole,
        tier,
        description,
        totalDurationMinutes,
        roundsSummary = []
    } = template;

    const getTierClass = (tierName) => {
        if (tierName.includes('Product')) return 'drives-tier--product';
        if (tierName.includes('Service')) return 'drives-tier--service';
        return 'drives-tier--startup';
    };

    return (
        <div className="drives-template-card">
            <div className="drives-template-card__header">
                <span className={`drives-tier-badge ${getTierClass(tier)}`}>
                    {tier}
                </span>
                <span className="drives-template-meta-time">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {totalDurationMinutes} mins total
                </span>
            </div>

            <div className="drives-template-card__body">
                <div className="drives-company-badge">
                    {companyName}
                </div>
                <h3 className="drives-template-title">{title}</h3>
                <div className="drives-template-role">Target Role: <strong>{targetRole}</strong></div>
                <p className="drives-template-desc">{description}</p>
            </div>

            <div className="drives-template-rounds-preview">
                <div className="drives-rounds-preview-title">Hiring Pipeline Stages:</div>
                <div className="drives-rounds-preview-list">
                    {roundsSummary.map(r => (
                        <div key={r.roundNumber} className="drives-round-preview-item">
                            <span className="round-num">0{r.roundNumber}</span>
                            <span className="round-name">{r.title.split(':')[0]}</span>
                            <span className="round-dur">{r.durationMinutes}m</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="drives-template-card__footer">
                <button
                    type="button"
                    className="drives-btn drives-btn--primary"
                    onClick={() => onStartDrive(id)}
                    disabled={isStarting}
                >
                    {isStarting ? (
                        <>
                            <span className="drives-spinner"></span>
                            <span>Setting up Drive Environment...</span>
                        </>
                    ) : (
                        <>
                            <span>Enter Placement Drive</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DriveTemplateCard;
