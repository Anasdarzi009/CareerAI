import React from 'react';

export const GateBottleneckRadar = ({ gates = [] }) => {
    if (!gates || gates.length === 0) {
        return null;
    }

    const getGateBadge = (status) => {
        switch (status) {
            case 'CLEARED':
                return { label: 'CLEARED', className: 'status-badge--cleared' };
            case 'COMPETITIVE':
                return { label: 'COMPETITIVE', className: 'status-badge--competitive' };
            case 'RISK':
                return { label: 'BORDERLINE RISK', className: 'status-badge--risk' };
            default:
                return { label: 'BLOCKED', className: 'status-badge--blocked' };
        }
    };

    return (
        <section className="gate-bottlenecks-section">
            <div className="section-title-row">
                <div className="title-block">
                    <span className="section-eyebrow">RECRUITMENT GATEWAYS</span>
                    <h2 className="section-heading">Recruitment Gates &amp; Critical Bottlenecks</h2>
                </div>
                <span className="section-note">Evaluation against direct company screening filters</span>
            </div>

            <div className="gates-list">
                {gates.map((gate, idx) => {
                    const badge = getGateBadge(gate.status);
                    return (
                        <div key={gate.gateName} className={`gate-item-card gate-item--${gate.status.toLowerCase()}`}>
                            <div className="gate-item-top">
                                <div className="gate-index-title">
                                    <span className="gate-number">0{idx + 1}</span>
                                    <div className="gate-text-group">
                                        <h4 className="gate-display-name">{gate.displayName}</h4>
                                        <span className="gate-evidence-text">{gate.evidence}</span>
                                    </div>
                                </div>
                                <div className="gate-status-group">
                                    <span className={`gate-status-pill ${badge.className}`}>{badge.label}</span>
                                    <div className="gate-score-pill">
                                        <span className="score-val">{gate.score}</span>
                                        <span className="score-denom">/100</span>
                                    </div>
                                </div>
                            </div>

                            {/* Score Progress Bar */}
                            <div className="gate-progress-bar">
                                <div
                                    className="gate-progress-fill"
                                    style={{
                                        width: `${gate.score}%`,
                                        backgroundColor:
                                            gate.status === 'CLEARED' ? 'var(--success-color, #10b981)' :
                                            gate.status === 'COMPETITIVE' ? 'var(--accent-color, #f43f5e)' :
                                            gate.status === 'RISK' ? 'var(--warning-color, #f59e0b)' : 'var(--danger-color, #ef4444)'
                                    }}
                                />
                            </div>

                            {/* Bottleneck Warning */}
                            {gate.bottleneckReason && (
                                <div className="gate-bottleneck-alert">
                                    <div className="bottleneck-icon">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                            <line x1="12" y1="9" x2="12" y2="13" />
                                            <line x1="12" y1="17" x2="12.01" y2="17" />
                                        </svg>
                                    </div>
                                    <div className="bottleneck-content">
                                        <span className="bottleneck-tag">RECRUITER BOTTLENECK:</span>
                                        <p className="bottleneck-desc">{gate.bottleneckReason}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default GateBottleneckRadar;
