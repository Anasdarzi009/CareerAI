import React, { useState } from 'react'

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const SUGGESTED_SKILLS = [
    { name: 'Java', category: 'Programming' },
    { name: 'Python', category: 'Programming' },
    { name: 'JavaScript', category: 'Programming' },
    { name: 'C++', category: 'Programming' },
    { name: 'SQL', category: 'Programming' },
    { name: 'React', category: 'Web' },
    { name: 'Node.js', category: 'Web' },
    { name: 'Express', category: 'Web' },
    { name: 'HTML & CSS', category: 'Web' },
    { name: 'Machine Learning', category: 'Data / AI' },
    { name: 'Generative AI', category: 'Data / AI' },
    { name: 'Power BI', category: 'Data / AI' },
    { name: 'Data Analytics', category: 'Data / AI' },
    { name: 'Git & GitHub', category: 'Tools' },
    { name: 'Docker', category: 'Tools' },
    { name: 'AWS Cloud', category: 'Tools' }
]

export const SkillsSection = ({ skills = [], onSave, saving }) => {
    const [currentSkills, setCurrentSkills] = useState(skills)
    const [customSkillName, setCustomSkillName] = useState('')
    const [customCategory, setCustomCategory] = useState('Programming')

    // Keep state in sync if prop changes
    React.useEffect(() => {
        setCurrentSkills(skills)
    }, [skills])

    const handleAddSkill = (name, category = 'Other') => {
        const trimmed = name.trim()
        if (!trimmed) return
        if (currentSkills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) return

        const updated = [...currentSkills, { name: trimmed, category }]
        setCurrentSkills(updated)
        onSave({ skills: updated })
    }

    const handleRemoveSkill = (skillNameToRemove) => {
        const updated = currentSkills.filter(s => s.name !== skillNameToRemove)
        setCurrentSkills(updated)
        onSave({ skills: updated })
    }

    const handleCustomSubmit = (e) => {
        e.preventDefault()
        if (!customSkillName.trim()) return
        handleAddSkill(customSkillName, customCategory)
        setCustomSkillName('')
    }

    return (
        <div className="profile-section-card" id="section-skills">
            <div className="section-card-header">
                <div className="card-title-group">
                    <span className="card-step-num">04</span>
                    <div>
                        <h3>Skills &amp; Technologies</h3>
                        <p className="card-subtitle">
                            Individual verified technical competencies used by CareerAI's Skill Gap Matrix and interview question generators.
                        </p>
                    </div>
                </div>
                <span className="section-pill section-pill--counter">{currentSkills.length} Added</span>
            </div>

            <div className="section-card-body">
                {/* Active Skills List */}
                <div className="skills-active-wrap">
                    <label className="skills-sublabel">Your Technical Stack</label>
                    {currentSkills.length > 0 ? (
                        <div className="skills-chips-flow">
                            {currentSkills.map((skill) => (
                                <span key={skill.name} className="skill-chip">
                                    <span className="skill-chip-name">{skill.name}</span>
                                    {skill.category && (
                                        <span className="skill-chip-cat">{skill.category}</span>
                                    )}
                                    <button
                                        type="button"
                                        className="skill-chip-remove"
                                        onClick={() => handleRemoveSkill(skill.name)}
                                        aria-label={`Remove ${skill.name}`}
                                    >
                                        <CloseIcon />
                                    </button>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="skills-empty-state">
                            <p>No skills added yet. Choose from suggestions below or add custom competencies.</p>
                        </div>
                    )}
                </div>

                {/* Quick Add Custom Skill Form */}
                <form className="add-custom-skill-form" onSubmit={handleCustomSubmit}>
                    <div className="custom-skill-inputs">
                        <input
                            type="text"
                            className="profile-input"
                            value={customSkillName}
                            onChange={(e) => setCustomSkillName(e.target.value)}
                            placeholder="Add custom skill (e.g. Kubernetes, Flutter, Django...)"
                        />
                        <select
                            className="profile-select"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                        >
                            <option value="Programming">Programming</option>
                            <option value="Web">Web Development</option>
                            <option value="Data / AI">Data / AI</option>
                            <option value="Tools">Tools &amp; DevOps</option>
                            <option value="Core Engineering">Core Engineering</option>
                            <option value="Other">Other</option>
                        </select>
                        <button
                            type="submit"
                            className="button secondary-button add-skill-btn"
                            disabled={!customSkillName.trim() || saving}
                        >
                            <PlusIcon />
                            <span>Add Skill</span>
                        </button>
                    </div>
                </form>

                {/* Suggested Common Skills */}
                <div className="suggested-skills-block">
                    <label className="skills-sublabel">Quick Add Suggestions</label>
                    <div className="suggested-chips-flow">
                        {SUGGESTED_SKILLS.map((s) => {
                            const isAdded = currentSkills.some(cs => cs.name.toLowerCase() === s.name.toLowerCase())
                            if (isAdded) return null

                            return (
                                <button
                                    key={s.name}
                                    type="button"
                                    className="suggested-chip"
                                    onClick={() => handleAddSkill(s.name, s.category)}
                                    disabled={saving}
                                >
                                    <PlusIcon />
                                    <span>{s.name}</span>
                                    <span className="suggested-chip-cat">{s.category}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkillsSection
