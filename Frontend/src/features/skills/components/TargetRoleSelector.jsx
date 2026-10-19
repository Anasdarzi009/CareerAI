import React, { useState } from 'react'

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
)

const STANDARD_ROLES = [
    "Full Stack Developer",
    "Backend Engineer",
    "Frontend Developer",
    "Data Analyst / BI Engineer",
    "Cloud & DevOps Engineer",
    "AI / Machine Learning Engineer"
]

export const TargetRoleSelector = ({
    currentRole,
    availableJobs = [],
    selectedJobId,
    onRoleChange,
    onJobSelect,
    onReanalyze,
    reanalyzing
}) => {
    const [mode, setMode] = useState(selectedJobId ? 'job' : 'role') // 'role' | 'job'
    const [customRole, setCustomRole] = useState(currentRole || 'Full Stack Developer')

    const handleModeSwitch = (newMode) => {
        setMode(newMode)
        if (newMode === 'role') {
            onJobSelect('')
            onRoleChange(customRole)
        }
    }

    const handleRoleSelectChange = (e) => {
        const val = e.target.value
        setCustomRole(val)
        onJobSelect('')
        onRoleChange(val)
    }

    const handleJobSelectChange = (e) => {
        const jobId = e.target.value
        onJobSelect(jobId)
    }

    return (
        <div className="target-selector-card">
            <div className="selector-mode-toggle">
                <span className="selector-label">BENCHMARK BENCH:</span>
                <div className="mode-tabs">
                    <button
                        type="button"
                        className={`mode-tab-btn ${mode === 'role' ? 'mode-tab-btn--active' : ''}`}
                        onClick={() => handleModeSwitch('role')}
                    >
                        Standard Career Track
                    </button>
                    <button
                        type="button"
                        className={`mode-tab-btn ${mode === 'job' ? 'mode-tab-btn--active' : ''}`}
                        onClick={() => handleModeSwitch('job')}
                    >
                        Specific Job Opportunity
                    </button>
                </div>
            </div>

            <div className="selector-input-row">
                {mode === 'role' ? (
                    <div className="selector-control">
                        <select
                            className="role-dropdown"
                            value={customRole}
                            onChange={handleRoleSelectChange}
                        >
                            {STANDARD_ROLES.map((role) => (
                                <option key={role} value={role}>
                                    Role: {role}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="selector-control">
                        <select
                            className="role-dropdown"
                            value={selectedJobId || ''}
                            onChange={handleJobSelectChange}
                        >
                            <option value="">Select an opportunity from Jobs module...</option>
                            {availableJobs.map((job) => (
                                <option key={job._id} value={job._id}>
                                    {job.company} — {job.title} ({job.location})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button
                    type="button"
                    className="btn-reanalyze"
                    onClick={() => onReanalyze(mode === 'role' ? customRole : null, mode === 'job' ? selectedJobId : null)}
                    disabled={reanalyzing || (mode === 'job' && !selectedJobId)}
                >
                    <RefreshIcon />
                    <span>{reanalyzing ? 'Analyzing...' : 'Recalculate Matrix'}</span>
                </button>
            </div>
        </div>
    )
}

export default TargetRoleSelector
