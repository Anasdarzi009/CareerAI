import React, { useState } from 'react'

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

const AwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
)

const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
)

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
)

const PROFICIENCY_OPTIONS = ['Basic', 'Conversational', 'Professional', 'Fluent', 'Native']

export const CertificationsAndLanguagesSection = ({
    certifications = [],
    languages = [],
    onSave,
    saving
}) => {
    // Cert Form state
    const [isCertFormOpen, setIsCertFormOpen] = useState(false)
    const [certName, setCertName] = useState('')
    const [certOrg, setCertOrg] = useState('')
    const [certDate, setCertDate] = useState('')
    const [certId, setCertId] = useState('')
    const [certUrl, setCertUrl] = useState('')

    // Lang Form state
    const [isLangFormOpen, setIsLangFormOpen] = useState(false)
    const [langName, setLangName] = useState('')
    const [langProf, setLangProf] = useState('Professional')

    const handleAddCert = (e) => {
        e.preventDefault()
        if (!certName.trim()) return

        const newCert = {
            name: certName.trim(),
            issuingOrganization: certOrg.trim(),
            issueDate: certDate.trim(),
            credentialId: certId.trim(),
            credentialUrl: certUrl.trim()
        }

        const updated = [...certifications, newCert]
        onSave({ certifications: updated })

        setCertName('')
        setCertOrg('')
        setCertDate('')
        setCertId('')
        setCertUrl('')
        setIsCertFormOpen(false)
    }

    const handleDeleteCert = (idx) => {
        const updated = certifications.filter((_, i) => i !== idx)
        onSave({ certifications: updated })
    }

    const handleAddLang = (e) => {
        e.preventDefault()
        if (!langName.trim()) return

        const newLang = {
            language: langName.trim(),
            proficiency: langProf
        }

        const updated = [...languages, newLang]
        onSave({ languages: updated })

        setLangName('')
        setLangProf('Professional')
        setIsLangFormOpen(false)
    }

    const handleDeleteLang = (idx) => {
        const updated = languages.filter((_, i) => i !== idx)
        onSave({ languages: updated })
    }

    return (
        <div className="profile-section-card" id="section-certifications">
            <div className="section-card-header">
                <div className="card-title-group">
                    <span className="card-step-num">07</span>
                    <div>
                        <h3>Certifications &amp; Languages</h3>
                        <p className="card-subtitle">
                            Industry certificates, cloud badges, and linguistic proficiencies.
                        </p>
                    </div>
                </div>
            </div>

            <div className="section-card-body">
                {/* ── Subblock 1: Certifications ── */}
                <div className="dual-subblock">
                    <div className="dual-subblock-header">
                        <div className="subblock-title-row">
                            <AwardIcon />
                            <h4>Certifications ({certifications.length})</h4>
                        </div>
                        <button
                            type="button"
                            className="button secondary-button add-mini-btn"
                            onClick={() => setIsCertFormOpen(!isCertFormOpen)}
                        >
                            <PlusIcon />
                            <span>{isCertFormOpen ? 'Cancel' : 'Add Certificate'}</span>
                        </button>
                    </div>

                    {isCertFormOpen && (
                        <form className="entry-form-block" onSubmit={handleAddCert}>
                            <div className="form-grid-2col">
                                <div className="form-group">
                                    <label>Certification Name *</label>
                                    <input
                                        type="text"
                                        className="profile-input"
                                        value={certName}
                                        onChange={(e) => setCertName(e.target.value)}
                                        placeholder="e.g. AWS Certified Solutions Architect"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Issuing Organization</label>
                                    <input
                                        type="text"
                                        className="profile-input"
                                        value={certOrg}
                                        onChange={(e) => setCertOrg(e.target.value)}
                                        placeholder="e.g. Amazon Web Services / Google Cloud"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Issue Date</label>
                                    <input
                                        type="text"
                                        className="profile-input"
                                        value={certDate}
                                        onChange={(e) => setCertDate(e.target.value)}
                                        placeholder="e.g. Nov 2024"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Credential ID / Verification URL</label>
                                    <input
                                        type="text"
                                        className="profile-input"
                                        value={certUrl}
                                        onChange={(e) => setCertUrl(e.target.value)}
                                        placeholder="https://credly.com/..."
                                    />
                                </div>
                            </div>
                            <div className="entry-form-actions">
                                <button
                                    type="submit"
                                    className="button primary-button"
                                    disabled={saving}
                                >
                                    Save Certificate
                                </button>
                            </div>
                        </form>
                    )}

                    {certifications.length > 0 ? (
                        <div className="cert-list">
                            {certifications.map((c, i) => (
                                <div key={i} className="cert-item-row">
                                    <div className="cert-item-info">
                                        <span className="cert-title">{c.name}</span>
                                        <span className="cert-meta">
                                            {c.issuingOrganization || 'Verified Issuer'}
                                            {c.issueDate && ` • ${c.issueDate}`}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="entry-action-btn entry-action-btn--delete"
                                        onClick={() => handleDeleteCert(i)}
                                        title="Delete"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !isCertFormOpen && (
                            <p className="subblock-empty-hint">No certifications added yet.</p>
                        )
                    )}
                </div>

                <div className="card-divider" />

                {/* ── Subblock 2: Languages ── */}
                <div className="dual-subblock">
                    <div className="dual-subblock-header">
                        <div className="subblock-title-row">
                            <GlobeIcon />
                            <h4>Languages Spoken ({languages.length})</h4>
                        </div>
                        <button
                            type="button"
                            className="button secondary-button add-mini-btn"
                            onClick={() => setIsLangFormOpen(!isLangFormOpen)}
                        >
                            <PlusIcon />
                            <span>{isLangFormOpen ? 'Cancel' : 'Add Language'}</span>
                        </button>
                    </div>

                    {isLangFormOpen && (
                        <form className="entry-form-block" onSubmit={handleAddLang}>
                            <div className="form-grid-2col">
                                <div className="form-group">
                                    <label>Language *</label>
                                    <input
                                        type="text"
                                        className="profile-input"
                                        value={langName}
                                        onChange={(e) => setLangName(e.target.value)}
                                        placeholder="e.g. English / Hindi / Spanish"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Proficiency Level</label>
                                    <select
                                        className="profile-select"
                                        value={langProf}
                                        onChange={(e) => setLangProf(e.target.value)}
                                    >
                                        {PROFICIENCY_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="entry-form-actions">
                                <button
                                    type="submit"
                                    className="button primary-button"
                                    disabled={saving}
                                >
                                    Add Language
                                </button>
                            </div>
                        </form>
                    )}

                    {languages.length > 0 ? (
                        <div className="lang-chips-wrap">
                            {languages.map((l, i) => (
                                <div key={i} className="lang-chip">
                                    <span className="lang-name">{l.language}</span>
                                    <span className="lang-level">{l.proficiency}</span>
                                    <button
                                        type="button"
                                        className="lang-delete-btn"
                                        onClick={() => handleDeleteLang(i)}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !isLangFormOpen && (
                            <p className="subblock-empty-hint">No languages listed yet.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default CertificationsAndLanguagesSection
