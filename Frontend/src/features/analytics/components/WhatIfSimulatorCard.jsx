import React from 'react';

export const WhatIfSimulatorCard = ({
    simulation,
    simulating,
    simParams,
    onSimulate,
    onReset
}) => {
    const handleCodingChange = (e) => {
        onSimulate({ boostCodingScore: Number(e.target.value) });
    };

    const handleDriveToggle = () => {
        onSimulate({ clearPlacementDrive: !simParams.clearPlacementDrive });
    };

    const handleSkillsChange = (e) => {
        onSimulate({ closeSkillGapsCount: Number(e.target.value) });
    };

    const hasSimulated = Boolean(simulation);
    const tier1Boost = simulation?.deltas?.tier1Boost || 0;
    const ctcGain = simulation?.deltas?.ctcGainLpa || 0;

    return (
        <section className="what-if-section">
            <div className="section-title-row">
                <div className="title-block">
                    <span className="section-eyebrow">SENSITIVITY ENGINE</span>
                    <h2 className="section-heading">Interactive What-If Placement Simulator</h2>
                </div>
                {hasSimulated && (
                    <button className="btn-reset-sim" onClick={onReset}>
                        Reset Simulation
                    </button>
                )}
            </div>

            <div className="what-if-container">
                {/* Control Panel */}
                <div className="simulator-controls-card">
                    <h3 className="controls-heading">Simulate Profile Enhancements</h3>
                    <p className="controls-desc">
                        Adjust variables to see how targeted preparation directly expands your offer probability and compensation bracket.
                    </p>

                    <div className="control-group">
                        <div className="control-label-row">
                            <label htmlFor="coding-boost" className="control-label">Algorithmic Problem-Solving Boost</label>
                            <span className="control-value">+{simParams.boostCodingScore} pts</span>
                        </div>
                        <input
                            id="coding-boost"
                            type="range"
                            min="0"
                            max="40"
                            step="5"
                            value={simParams.boostCodingScore}
                            onChange={handleCodingChange}
                            className="sim-slider"
                        />
                        <span className="control-hint">Practice Hard DP &amp; Graph questions in Coding Round</span>
                    </div>

                    <div className="control-group">
                        <div className="control-label-row">
                            <label className="control-label">Clear Corporate Placement Drive</label>
                            <button
                                type="button"
                                className={`sim-toggle-btn ${simParams.clearPlacementDrive ? 'sim-toggle--active' : ''}`}
                                onClick={handleDriveToggle}
                            >
                                {simParams.clearPlacementDrive ? '✓ Cleared Direct Hire' : 'Not Cleared'}
                            </button>
                        </div>
                        <span className="control-hint">Simulate clearing all 3 rounds of Amazon or Google track</span>
                    </div>

                    <div className="control-group">
                        <div className="control-label-row">
                            <label htmlFor="skills-boost" className="control-label">Close Missing Skill Gaps</label>
                            <span className="control-value">+{simParams.closeSkillGapsCount} Skills</span>
                        </div>
                        <input
                            id="skills-boost"
                            type="range"
                            min="0"
                            max="5"
                            step="1"
                            value={simParams.closeSkillGapsCount}
                            onChange={handleSkillsChange}
                            className="sim-slider"
                        />
                        <span className="control-hint">Fulfill required technologies identified in Skill Gap Matrix</span>
                    </div>
                </div>

                {/* Simulation Projection Display */}
                <div className="simulator-projection-card">
                    <div className="projection-header">
                        <span className="projection-pill">PROJECTED IMPACT</span>
                        {simulating && <span className="simulating-text">Calculating...</span>}
                    </div>

                    {hasSimulated ? (
                        <div className="projection-results">
                            <div className="projection-stat-box">
                                <span className="proj-label">Product Tier-1 Offer Probability</span>
                                <div className="proj-val-row">
                                    <span className="proj-current">{simulation.simulatedTiers[0].probabilityPercentage}%</span>
                                    {tier1Boost > 0 && (
                                        <span className="proj-delta proj-delta--positive">+{tier1Boost}% Surge</span>
                                    )}
                                </div>
                            </div>

                            <div className="projection-stat-box">
                                <span className="proj-label">Projected Compensation Bracket</span>
                                <div className="proj-val-row">
                                    <span className="proj-current proj-current--ctc">{simulation.simulatedCtc.formattedRange}</span>
                                    {ctcGain > 0 && (
                                        <span className="proj-delta proj-delta--ctc">+{ctcGain} LPA Potential</span>
                                    )}
                                </div>
                            </div>

                            <div className="projection-advice">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                                <span>
                                    {tier1Boost >= 20
                                        ? 'Significant upgrade! This profile configuration unlocks direct campus shortlists for Tier-1 Product firms.'
                                        : 'Progressive lift. Prioritize clearing a simulated placement drive for the strongest probability multiplier.'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="projection-placeholder">
                            <div className="placeholder-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <line x1="18" y1="20" x2="18" y2="10" />
                                    <line x1="12" y1="20" x2="12" y2="4" />
                                    <line x1="6" y1="20" x2="6" y2="14" />
                                </svg>
                            </div>
                            <p className="placeholder-title">Interactive Simulation Standby</p>
                            <p className="placeholder-sub">
                                Adjust sliders above to project how closing skill gaps or practicing algorithms shifts your placement trajectory.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default WhatIfSimulatorCard;
