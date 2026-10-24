import React, { useState, useEffect } from 'react'

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const WORK_MODES = ['Any', 'Hybrid', 'Remote', 'On-site']
const EXPERIENCE_LEVELS = ['Fresher', 'Entry Level', 'Mid Level', 'Experienced']

export const PreferencesSection = ({ preferences = {}, onSave, saving }) => {
    const [targetRole, setTargetRole] = useState(preferences?.targetRole || '')
    const [preferredIndustry, setPreferredIndustry] = useState(preferences?.preferredIndustry || '')
    const [preferredLocation, setPreferredLocation] = useState(preferences?.preferredLocation || '')
    const [workMode, setWorkMode] = useState(preferences?.workMode || 'Any')
    const [experienceLevel, setExperienceLevel] = useState(preferences?.experienceLevel || 'Fresher')
    const [savedSuccess, setSavedSuccess] = useState(false)

    useEffect(() => {
        if (preferences?.targetRole !== undefined) setTargetRole(preferences.targetRole || '')
        if (preferences?.preferredIndustry !== undefined) setPreferredIndustry(preferences.preferredIndustry || '')
        if (preferences?.preferredLocation !== undefined) setPreferredLocation(preferences.preferredLocation || '')
        if (preferences?.workMode !== undefined) setWorkMode(preferences.workMode || 'Any')
        if (preferences?.experienceLevel !== undefined) setExperienceLevel(preferences.experienceLevel || 'Fresher')
    }, [
        preferences?.targetRole,
        preferences?.preferredIndustry,
        preferences?.preferredLocation,
        preferences?.workMode,
        preferences?.experienceLevel
    ])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await onSave({
                careerPreferences: {
                    targetRole: targetRole.trim(),
                    preferredIndustry: preferredIndustry.trim(),
                    preferredLocation: preferredLocation.trim(),
                    workMode,
                    experienceLevel
                }
            })
            setSavedSuccess(true)
            setTimeout(() => setSavedSuccess(false), 3500)
        } catch {
            // Error handled by parent hook, preserve entered values in state
        }
    }

    return (
        <form className="profile-section-card" id="section-preferences" onSubmit={handleSubmit}>
            <div className="section-card-header">
                <div className="card-title-group">
                    <span className="card-step-num">08</span>
                    <div>
                        <h3>Career Preferences</h3>
                        <p className="card-subtitle">
                            Target roles and work preferences used by CareerAI's Jobs &amp; Opportunities and Roadmap modules.
                        </p>
                    </div>
                </div>
            </div>

            <div className="section-card-body">
                <div className="form-grid-2col">
                    {/* Target Job Role */}
                    <div className="form-group">
                        <label htmlFor="pref-target-role">Primary Target Role *</label>
                        <input
                            id="pref-target-role"
                            type="text"
                            className="profile-input"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            placeholder="e.g. Full Stack Developer / SDE-1"
                            required
                        />
                    </div>

                    {/* Preferred Industry */}
                    <div className="form-group">
                        <label htmlFor="pref-industry">Preferred Industry</label>
                        <input
                            id="pref-industry"
                            type="text"
                            className="profile-input"
                            value={preferredIndustry}
                            onChange={(e) => setPreferredIndustry(e.target.value)}
                            placeholder="e.g. Information Technology / FinTech / SaaS"
                        />
                    </div>

                    {/* Preferred Work Location */}
                    <div className="form-group">
                        <label htmlFor="pref-location">Preferred Work Location</label>
                        <input
                            id="pref-location"
                            type="text"
                            className="profile-input"
                            value={preferredLocation}
                            onChange={(e) => setPreferredLocation(e.target.value)}
                            placeholder="e.g. Bengaluru / Hyderabad / Mumbai / Open"
                        />
                    </div>

                    {/* Work Mode */}
                    <div className="form-group">
                        <label>Preferred Work Mode</label>
                        <div className="radio-pills-row">
                            {WORK_MODES.map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    className={`pill-choice ${workMode === mode ? 'pill-choice--active' : ''}`}
                                    onClick={() => setWorkMode(mode)}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Experience Level */}
                    <div className="form-group form-group--full">
                        <label>Candidate Experience Bracket</label>
                        <div className="radio-pills-row">
                            {EXPERIENCE_LEVELS.map((lvl) => (
                                <button
                                    key={lvl}
                                    type="button"
                                    className={`pill-choice ${experienceLevel === lvl ? 'pill-choice--active' : ''}`}
                                    onClick={() => setExperienceLevel(lvl)}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                        <span className="field-subtext">Selecting "Fresher" calibrates campus placement eligibility requirements.</span>
                    </div>
                </div>

                <div className="section-card-footer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        type="submit"
                        id="save-preferences-btn"
                        className="button primary-button"
                        disabled={saving}
                    >
                        <span>{saving ? 'Saving...' : 'Save Career Preferences'}</span>
                    </button>
                    {savedSuccess && (
                        <span style={{ color: '#34d399', fontSize: 'var(--text-sm)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500 }}>
                            <CheckIcon /> Preferences saved successfully
                        </span>
                    )}
                </div>
            </div>
        </form>
    )
}

export default PreferencesSection
