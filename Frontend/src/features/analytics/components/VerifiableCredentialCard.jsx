import React, { useState } from 'react';

export const VerifiableCredentialCard = ({ verification, summary }) => {
    const [copied, setCopied] = useState(false);
    const token = verification?.verificationToken;
    const isVerified = verification?.isVerified;

    const handleCopy = () => {
        if (!token) return;
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <section className="credential-section">
            <div className="credential-card">
                <div className="credential-badge-side">
                    <div className="seal-wrap">
                        <div className="official-seal">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                    </div>
                    <span className="seal-caption">CAREERAI VERIFIED</span>
                </div>

                <div className="credential-details">
                    <div className="credential-title-row">
                        <div className="title-group">
                            <span className="cert-eyebrow">OFFICIAL PLACEMENT DOSSIER</span>
                            <h3 className="cert-title">Verified Placement Readiness Credential</h3>
                        </div>
                        <span className={`cert-badge ${isVerified ? 'cert-badge--verified' : 'cert-badge--provisional'}`}>
                            {isVerified ? 'VERIFIED READY' : 'PROVISIONAL AUDIT'}
                        </span>
                    </div>

                    <p className="cert-desc">
                        This digital dossier certifies that the candidate has completed empirical evaluation across academic eligibility,
                        algorithmic problem-solving, structured technical interviews, and corporate placement drive simulations.
                    </p>

                    <div className="credential-meta-grid">
                        <div className="meta-cell">
                            <span className="meta-label">Credential Token</span>
                            <span className="meta-value meta-value--mono">{token || 'PENDING_EVALUATION'}</span>
                        </div>
                        <div className="meta-cell">
                            <span className="meta-label">Market Readiness Score</span>
                            <span className="meta-value">{summary?.overallScore || 0}/100</span>
                        </div>
                        <div className="meta-cell">
                            <span className="meta-label">Primary Tier Fit</span>
                            <span className="meta-value">{summary?.topTierFit ? summary.topTierFit.replace(/_/g, ' ') : 'N/A'}</span>
                        </div>
                        <div className="meta-cell">
                            <span className="meta-label">Predicted Bracket</span>
                            <span className="meta-value">{summary?.formattedCtc || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="credential-actions">
                        <button
                            type="button"
                            className="btn-copy-token"
                            onClick={handleCopy}
                            disabled={!token}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            <span>{copied ? 'Copied Token!' : 'Copy Verification Token'}</span>
                        </button>
                        <button
                            type="button"
                            className="btn-print-dossier"
                            onClick={handlePrint}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 6 2 18 2 18 9" />
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                <rect x="6" y="14" width="12" height="8" />
                            </svg>
                            <span>Print Dossier Summary</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VerifiableCredentialCard;
