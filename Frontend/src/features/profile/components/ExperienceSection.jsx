import React, { useState } from 'react'

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="12" y2="19" />
    </svg>
)

const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
)

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
)

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
)

export const ExperienceSection = ({ experience = [], onSave, saving }) => {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState(null)

    // Form fields
    const [jobTitle, setJobTitle] = useState('')
    const [company, setCompany] = useState('')
    const [employmentType, setEmploymentType] = useState('Internship')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [currentlyWorking, setCurrentlyWorking] = useState(false)
    const [description, setDescription] = useState('')

    const openAddForm = () => {
        setJobTitle('')
        setCompany('')
        setEmploymentType('Internship')
        setStartDate('')
        setEndDate('')
        setCurrentlyWorking(false)
        setDescription('')
        setEditingIndex(null)
        setIsFormOpen(true)
    }

    const openEditForm = (index) => {
        const item = experience[index]
        if (!item) return
        setJobTitle(item.jobTitle || '')
        setCompany(item.company || '')
        setEmploymentType(item.employmentType || 'Internship')
        setStartDate(item.startDate || '')
        setEndDate(item.endDate || '')
        setCurrentlyWorking(!!item.currentlyWorking)
        setDescription(item.description || '')
        setEditingIndex(index)
        setIsFormOpen(true)
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        if (!jobTitle.trim() || !company.trim()) return

        const entry = {
            jobTitle: jobTitle.trim(),
            company: company.trim(),
            employmentType,
            startDate: startDate.trim(),
            endDate: currentlyWorking ? 'Present' : endDate.trim(),
            currentlyWorking,
            description: description.trim()
        }

        let updated
        if (editingIndex !== null) {
            updated = [...experience]
            updated[editingIndex] = entry
        } else {
            updated = [...experience, entry]
        }

        onSave({ experience: updated })
        setIsFormOpen(false)
    }

    const handleDelete = (index) => {
        const updated = experience.filter((_, idx) => idx !== index)
        onSave({ experience: updated })
    }

    return (
        <div className="profile-section-card" id="section-experience">
            <div className="section-card-header">
                <div className="card-title-group">
                    <span className="card-step-num">05</span>
                    <div>
                        <h3>Work &amp; Internship Experience</h3>
                        <p className="card-subtitle">
                            Professional roles, internships, and technical responsibilities.
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    className="button secondary-button add-entry-header-btn"
                    onClick={openAddForm}
                >
                    <PlusIcon />
                    <span>Add Experience</span>
                </button>
            </div>

            <div className="section-card-body">
                {/* Add / Edit Form Modal / Block */}
                {isFormOpen && (
                    <form className="entry-form-block" onSubmit={handleFormSubmit}>
                        <h4 className="entry-form-title">
                            {editingIndex !== null ? 'Edit Experience' : 'Add New Experience'}
                        </h4>
                        <div className="form-grid-2col">
                            <div className="form-group">
                                <label>Job Title / Designation *</label>
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    placeholder="e.g. Full Stack Developer Intern"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Company / Organization *</label>
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    placeholder="e.g. Acme Tech Solutions"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Employment Type</label>
                                <select
                                    className="profile-select"
                                    value={employmentType}
                                    onChange={(e) => setEmploymentType(e.target.value)}
                                >
                                    <option value="Internship">Internship</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <div className="date-input-pair">
                                    <div style={{ flex: 1 }}>
                                        <label>Start Date</label>
                                        <input
                                            type="text"
                                            className="profile-input"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            placeholder="e.g. Jan 2025"
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label>End Date</label>
                                        <input
                                            type="text"
                                            className="profile-input"
                                            value={currentlyWorking ? 'Present' : endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            disabled={currentlyWorking}
                                            placeholder="e.g. Jun 2025"
                                        />
                                    </div>
                                </div>
                                <label className="checkbox-label inline-check">
                                    <input
                                        type="checkbox"
                                        checked={currentlyWorking}
                                        onChange={(e) => setCurrentlyWorking(e.target.checked)}
                                    />
                                    <span>Currently working here</span>
                                </label>
                            </div>

                            <div className="form-group form-group--full">
                                <label>Role Description &amp; Achievements</label>
                                <textarea
                                    className="profile-textarea"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your primary technical contributions, metrics, and tools used..."
                                />
                            </div>
                        </div>

                        <div className="entry-form-actions">
                            <button
                                type="button"
                                className="button tertiary-button"
                                onClick={() => setIsFormOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="button primary-button"
                                disabled={saving}
                            >
                                <span>{saving ? 'Saving...' : editingIndex !== null ? 'Save Changes' : 'Add Experience'}</span>
                            </button>
                        </div>
                    </form>
                )}

                {/* List of Experience Entries */}
                {experience.length > 0 ? (
                    <div className="entries-list">
                        {experience.map((item, idx) => (
                            <div key={idx} className="entry-item-card">
                                <div className="entry-icon-wrap">
                                    <BriefcaseIcon />
                                </div>
                                <div className="entry-content">
                                    <div className="entry-head-row">
                                        <h4 className="entry-role-title">{item.jobTitle}</h4>
                                        <span className="entry-pill">{item.employmentType}</span>
                                    </div>
                                    <div className="entry-sub-row">
                                        <span className="entry-org">{item.company}</span>
                                        {(item.startDate || item.endDate) && (
                                            <>
                                                <span className="dot">•</span>
                                                <span className="entry-dates">
                                                    {item.startDate} — {item.currentlyWorking ? 'Present' : item.endDate}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {item.description && (
                                        <p className="entry-desc">{item.description}</p>
                                    )}
                                </div>
                                <div className="entry-actions">
                                    <button
                                        type="button"
                                        className="entry-action-btn"
                                        onClick={() => openEditForm(idx)}
                                        title="Edit entry"
                                    >
                                        <EditIcon />
                                    </button>
                                    <button
                                        type="button"
                                        className="entry-action-btn entry-action-btn--delete"
                                        onClick={() => handleDelete(idx)}
                                        title="Delete entry"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !isFormOpen && (
                        <div className="section-empty-state">
                            <BriefcaseIcon />
                            <h4>NO EXPERIENCE ADDED</h4>
                            <p>Add internships, full-time jobs, or freelance work to highlight your practical skills.</p>
                            <button
                                type="button"
                                className="button secondary-button"
                                onClick={openAddForm}
                            >
                                <PlusIcon />
                                <span>Add Experience</span>
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default ExperienceSection
