import React, { useState } from 'react'

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="12" y2="19" />
    </svg>
)

const CodeFolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        <polyline points="8 11 10 13 8 15" />
        <line x1="13" y1="15" x2="16" y2="15" />
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

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
)

export const ProjectsSection = ({ projects = [], onSave, saving }) => {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState(null)

    // Form state
    const [projectName, setProjectName] = useState('')
    const [description, setDescription] = useState('')
    const [techInput, setTechInput] = useState('')
    const [projectUrl, setProjectUrl] = useState('')
    const [githubUrl, setGithubUrl] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const openAddForm = () => {
        setProjectName('')
        setDescription('')
        setTechInput('')
        setProjectUrl('')
        setGithubUrl('')
        setStartDate('')
        setEndDate('')
        setEditingIndex(null)
        setIsFormOpen(true)
    }

    const openEditForm = (index) => {
        const p = projects[index]
        if (!p) return
        setProjectName(p.projectName || '')
        setDescription(p.description || '')
        setTechInput(p.technologies ? p.technologies.join(', ') : '')
        setProjectUrl(p.projectUrl || '')
        setGithubUrl(p.githubUrl || '')
        setStartDate(p.startDate || '')
        setEndDate(p.endDate || '')
        setEditingIndex(index)
        setIsFormOpen(true)
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        if (!projectName.trim()) return

        const technologies = techInput
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0)

        const entry = {
            projectName: projectName.trim(),
            description: description.trim(),
            technologies,
            projectUrl: projectUrl.trim(),
            githubUrl: githubUrl.trim(),
            startDate: startDate.trim(),
            endDate: endDate.trim()
        }

        let updated
        if (editingIndex !== null) {
            updated = [...projects]
            updated[editingIndex] = entry
        } else {
            updated = [...projects, entry]
        }

        onSave({ projects: updated })
        setIsFormOpen(false)
    }

    const handleDelete = (index) => {
        const updated = projects.filter((_, idx) => idx !== index)
        onSave({ projects: updated })
    }

    return (
        <div className="profile-section-card" id="section-projects">
            <div className="section-card-header">
                <div className="card-title-group">
                    <span className="card-step-num">06</span>
                    <div>
                        <h3>Technical Projects</h3>
                        <p className="card-subtitle">
                            Showcase software repositories, capstone projects, and applications for AI question generation.
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    className="button secondary-button add-entry-header-btn"
                    onClick={openAddForm}
                >
                    <PlusIcon />
                    <span>Add Project</span>
                </button>
            </div>

            <div className="section-card-body">
                {isFormOpen && (
                    <form className="entry-form-block" onSubmit={handleFormSubmit}>
                        <h4 className="entry-form-title">
                            {editingIndex !== null ? 'Edit Project' : 'Add New Project'}
                        </h4>
                        <div className="form-grid-2col">
                            <div className="form-group">
                                <label>Project Name *</label>
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="e.g. AI-Powered Placement Prep Engine"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Technologies Used (comma separated)</label>
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    placeholder="e.g. React, Node.js, MongoDB, Gemini API"
                                />
                            </div>

                            <div className="form-group">
                                <label>Live Project URL (Optional)</label>
                                <input
                                    type="url"
                                    className="profile-input"
                                    value={projectUrl}
                                    onChange={(e) => setProjectUrl(e.target.value)}
                                    placeholder="https://myproject.app"
                                />
                            </div>

                            <div className="form-group">
                                <label>GitHub Repository URL (Optional)</label>
                                <input
                                    type="url"
                                    className="profile-input"
                                    value={githubUrl}
                                    onChange={(e) => setGithubUrl(e.target.value)}
                                    placeholder="https://github.com/username/repo"
                                />
                            </div>

                            <div className="form-group form-group--full">
                                <label>Project Description &amp; Architecture</label>
                                <textarea
                                    className="profile-textarea"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Explain the problem solved, architecture choices, database schema, and key achievements..."
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
                                <span>{saving ? 'Saving...' : editingIndex !== null ? 'Save Changes' : 'Add Project'}</span>
                            </button>
                        </div>
                    </form>
                )}

                {projects.length > 0 ? (
                    <div className="projects-cards-grid">
                        {projects.map((proj, idx) => (
                            <div key={idx} className="project-display-card">
                                <div className="project-card-top">
                                    <div className="project-title-row">
                                        <div className="project-icon-badge">
                                            <CodeFolderIcon />
                                        </div>
                                        <h4 className="project-name">{proj.projectName}</h4>
                                    </div>
                                    <div className="project-actions-row">
                                        <button
                                            type="button"
                                            className="entry-action-btn"
                                            onClick={() => openEditForm(idx)}
                                            title="Edit project"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            type="button"
                                            className="entry-action-btn entry-action-btn--delete"
                                            onClick={() => handleDelete(idx)}
                                            title="Delete project"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>

                                {proj.description && (
                                    <p className="project-desc">{proj.description}</p>
                                )}

                                {proj.technologies && proj.technologies.length > 0 && (
                                    <div className="project-tech-chips">
                                        {proj.technologies.map((t, ti) => (
                                            <span key={ti} className="project-tech-tag">{t}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="project-links-row">
                                    {proj.projectUrl && (
                                        <a
                                            href={proj.projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="project-link"
                                        >
                                            <span>Live Demo</span>
                                            <ExternalLinkIcon />
                                        </a>
                                    )}
                                    {proj.githubUrl && (
                                        <a
                                            href={proj.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="project-link"
                                        >
                                            <span>GitHub Repo</span>
                                            <ExternalLinkIcon />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !isFormOpen && (
                        <div className="section-empty-state">
                            <CodeFolderIcon />
                            <h4>NO PROJECTS ADDED</h4>
                            <p>Add personal, academic, or open-source software projects to enrich your technical interview questions.</p>
                            <button
                                type="button"
                                className="button secondary-button"
                                onClick={openAddForm}
                            >
                                <PlusIcon />
                                <span>Add Project</span>
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default ProjectsSection
