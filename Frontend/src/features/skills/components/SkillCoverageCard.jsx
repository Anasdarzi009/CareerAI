import React from 'react'

export const SkillCoverageCard = ({ analysis, onReanalyze, reanalyzing }) => {
    if (!analysis) return null

    const {
        targetRole,
        targetJobTitle,
        targetCompany,
        overallCoverage = 0,
        totalRequiredSkills = 0,
        matchedSkillsCount = 0,
        weakSkillsCount = 0,
        gapSkillsCount = 0,
        analyzedAt
    } = analysis

    const isJobSpecific = !!targetCompany

    return (
        <div className="skill-coverage-card">
            <div className="coverage-card-top">
                <div className="coverage-target-info">
                    <span className="coverage-eyebrow">
                        {isJobSpecific ? 'BENCHMARKED OPPORTUNITY' : 'TARGET CAREER ROLE'}
                    </span>
                    <h2 className="coverage-role-title">
                        {isJobSpecific ? `${targetJobTitle} at ${targetCompany}` : targetRole}
                    </h2>
                    {analyzedAt && (
                        <span className="coverage-timestamp">
                            Last Analyzed: {new Date(analyzedAt).toLocaleDateString()} at{' '}
                            {new Date(analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>

                <div className="coverage-score-group">
                    <div className="score-top">
                        <span className="score-label">OVERALL SKILL COVERAGE</span>
                        <span className="score-number">{overallCoverage}%</span>
                    </div>

                    <div className="score-progress-track">
                        <div
                            className="score-progress-fill"
                            style={{ width: `${overallCoverage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Metric Pills Grid */}
            <div className="coverage-metrics-grid">
                <div className="metric-box">
                    <span className="metric-box-label">REQUIRED</span>
                    <span className="metric-box-val">{totalRequiredSkills}</span>
                    <span className="metric-box-sub">Role competencies</span>
                </div>

                <div className="metric-box metric-box--matched">
                    <span className="metric-box-label">MATCHED</span>
                    <span className="metric-box-val">{matchedSkillsCount}</span>
                    <span className="metric-box-sub">Verified skills</span>
                </div>

                <div className="metric-box metric-box--weak">
                    <span className="metric-box-label">PARTIAL</span>
                    <span className="metric-box-val">{weakSkillsCount}</span>
                    <span className="metric-box-sub">Weak evidence</span>
                </div>

                <div className="metric-box metric-box--gaps">
                    <span className="metric-box-label">GAPS</span>
                    <span className="metric-box-val">{gapSkillsCount}</span>
                    <span className="metric-box-sub">Critical missing</span>
                </div>
            </div>
        </div>
    )
}

export default SkillCoverageCard
