import React, { useState } from 'react';

const COMMON_ROLES = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Software Engineer',
    'Data Scientist',
    'DevOps Engineer',
    'AI / Machine Learning Engineer',
    'Mobile Application Developer',
    'Cloud Solutions Architect'
];

const RoadmapTargetSelector = ({
    currentTargetRole,
    targetCompany,
    selectedJobId,
    availableJobs = [],
    onSelectRole,
    onSelectJob,
    isGenerating = false
}) => {
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [customRoleInput, setCustomRoleInput] = useState('');

    const handleJobChange = (e) => {
        const jobId = e.target.value;
        onSelectJob(jobId);
    };

    const handleRoleSubmit = (e) => {
        e.preventDefault();
        const role = customRoleInput.trim();
        if (role) {
            onSelectRole(role);
            setIsCustomMode(false);
            setCustomRoleInput('');
        }
    };

    return (
        <section className="roadmap-target-selector">
            <div className="roadmap-target-selector__header">
                <div className="roadmap-target-selector__info">
                    <span className="roadmap-target-selector__label">CAREER CALIBRATION</span>
                    <h3 className="roadmap-target-selector__title">Target Role & Opportunity Benchmark</h3>
                </div>

                {targetCompany && (
                    <div className="roadmap-target-selector__status-tag">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Roadmap optimized for this opportunity
                    </div>
                )}
            </div>

            <div className="roadmap-target-selector__controls">
                {/* Specific Job Selector */}
                <div className="roadmap-control-group">
                    <label className="roadmap-control-group__label">Target Specific Job Opportunity</label>
                    <select
                        className="roadmap-select"
                        value={selectedJobId || ''}
                        onChange={handleJobChange}
                        disabled={isGenerating}
                    >
                        <option value="">-- General Role Benchmark (No specific job) --</option>
                        {availableJobs.map(job => (
                            <option key={job._id} value={job._id}>
                                {job.title} — {job.company} ({job.location || 'Remote/Campus'})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Role Switcher */}
                <div className="roadmap-control-group">
                    <label className="roadmap-control-group__label">Standard Target Role</label>
                    {!isCustomMode ? (
                        <div className="roadmap-role-pill-group">
                            <select
                                className="roadmap-select"
                                value={currentTargetRole || ''}
                                onChange={(e) => onSelectRole(e.target.value)}
                                disabled={isGenerating || Boolean(selectedJobId)}
                            >
                                {COMMON_ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                                {!COMMON_ROLES.includes(currentTargetRole) && currentTargetRole && (
                                    <option value={currentTargetRole}>{currentTargetRole}</option>
                                )}
                            </select>
                            <button
                                type="button"
                                className="roadmap-btn roadmap-btn--ghost"
                                onClick={() => {
                                    setIsCustomMode(true);
                                    setCustomRoleInput(currentTargetRole || '');
                                }}
                                disabled={isGenerating}
                            >
                                Custom Role
                            </button>
                        </div>
                    ) : (
                        <form className="roadmap-custom-form" onSubmit={handleRoleSubmit}>
                            <input
                                type="text"
                                className="roadmap-input"
                                placeholder="e.g. Site Reliability Engineer"
                                value={customRoleInput}
                                onChange={(e) => setCustomRoleInput(e.target.value)}
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="roadmap-btn roadmap-btn--primary"
                                disabled={isGenerating || !customRoleInput.trim()}
                            >
                                Apply
                            </button>
                            <button
                                type="button"
                                className="roadmap-btn roadmap-btn--ghost"
                                onClick={() => setIsCustomMode(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default RoadmapTargetSelector;
