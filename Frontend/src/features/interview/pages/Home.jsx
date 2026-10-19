import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import AILoadingScreen from '../components/AILoadingScreen.jsx'

// ── Icons ─────────────────────────────────────────────────────────────────────
const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 16 12 12 8 16" />
        <line x1="12" y1="12" x2="12" y2="21" />
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
)

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)

const SparkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
)

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
)

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
)

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
)

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [fileError, setFileError] = useState("")
    const [isDragging, setIsDragging] = useState(false)
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const validateAndSelectFile = (file) => {
        if (!file) return false
        setFileError("")

        const validExtensions = ['.pdf', '.docx']
        const fileNameLower = file.name.toLowerCase()
        const isValidType = validExtensions.some(ext => fileNameLower.endsWith(ext)) ||
            file.type === 'application/pdf' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

        if (!isValidType) {
            setFileError("Invalid file type. Only PDF and DOCX files are allowed.")
            setSelectedFile(null)
            if (resumeInputRef.current) resumeInputRef.current.value = ""
            return false
        }

        const maxSizeInBytes = 5 * 1024 * 1024
        if (file.size > maxSizeInBytes) {
            setFileError("File size exceeds 5MB limit. Please select a smaller file.")
            setSelectedFile(null)
            if (resumeInputRef.current) resumeInputRef.current.value = ""
            return false
        }

        setSelectedFile(file)
        return true
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) validateAndSelectFile(file)
    }

    const handleDragOver = (e) => {
        e.preventDefault(); e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault(); e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation()
        setIsDragging(false)
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0]
            const success = validateAndSelectFile(file)
            if (success && resumeInputRef.current) {
                try {
                    const dt = new DataTransfer()
                    dt.items.add(file)
                    resumeInputRef.current.files = dt.files
                } catch (err) { /* DataTransfer fallback */ }
            }
        }
    }

    const handleRemoveFile = (e) => {
        e.preventDefault(); e.stopPropagation()
        setSelectedFile(null)
        setFileError("")
        if (resumeInputRef.current) resumeInputRef.current.value = ""
    }

    const handleGenerateReport = async () => {
        const resumeFile = selectedFile || (resumeInputRef.current && resumeInputRef.current.files[0])
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (data && data._id) navigate(`/interview/${data._id}`)
    }

    if (loading) {
        return <AILoadingScreen title="Building Your Interview Strategy" subtitle="Our AI is analyzing job requirements and creating a tailored preparation plan." />
    }

    return (
        <div className="workspace-page">

            {/* ── Page Header ─────────────────────────────────────────────────── */}
            <div className="workspace-header">
                <div className="header-info">
                    <span className="header-tag">Strategy Workspace</span>
                    <h1>Interview Preparation</h1>
                    <p>
                        Create a personalized preparation plan for a specific job opportunity. The system extracts role requirements, evaluates academic eligibility criteria, and compiles customized technical and behavioral interview questions.
                    </p>
                </div>

                <div className="header-stats">
                    <div className="stat-badge">
                        <span className="stat-value">{reports.length}</span>
                        <span className="stat-label">Saved Plans</span>
                    </div>
                </div>
            </div>

            {/* ── Two-Section Workspace Grid ─────────────────────────────────── */}
            <div className="workspace-grid">

                {/* Section 1: Job Target & Role Requirements */}
                <div className="workspace-panel">
                    <div className="panel-header">
                        <div className="panel-title-group">
                            <span className="panel-step-num">01</span>
                            <h2>Target Role &amp; Job Description</h2>
                        </div>
                        <span className="panel-pill panel-pill--required">Required</span>
                    </div>

                    <div className="panel-body">
                        <div className="field-group">
                            <label htmlFor="job-desc-input">Job Description / Requirements</label>
                            <textarea
                                id="job-desc-input"
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="workspace-textarea"
                                placeholder={`Paste full job description here...\n\nExample:\n"Google is hiring a Software Engineer (Backend). Minimum requirements: 75% in 10th and 12th, B.Tech CS, proficiency in Node.js, distributed systems, and API design..."`}
                                maxLength={5000}
                                value={jobDescription}
                            />
                            <div className="field-meta-row">
                                <span>Include company name and explicit academic criteria for eligibility audits</span>
                                <span>{jobDescription.length} / 5000 chars</span>
                            </div>
                        </div>

                        <div className="detection-tags">
                            <div className="detection-tag"><span className="dot" /> Company Context Detection</div>
                            <div className="detection-tag"><span className="dot" /> 10th / 12th / CGPA Extraction</div>
                            <div className="detection-tag"><span className="dot" /> Technical Competencies</div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Candidate Profile & Verification */}
                <div className="workspace-panel">
                    <div className="panel-header">
                        <div className="panel-title-group">
                            <span className="panel-step-num">02</span>
                            <h2>Candidate Profile &amp; Verification</h2>
                        </div>
                        <span className="panel-pill panel-pill--optional">Resume or Notes</span>
                    </div>

                    <div className="panel-body">
                        {/* Profile availability indicator */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: 'var(--bg-elevated)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.45rem 0.75rem',
                            marginBottom: '0.75rem',
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-secondary)'
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)', flexShrink: 0 }} />
                                <span>Your CareerAI candidate profile is active</span>
                            </span>
                            <button
                                type="button"
                                onClick={() => navigate('/resume-profile')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--accent)',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    padding: '2px 4px',
                                    textDecoration: 'underline',
                                    textUnderlineOffset: '2px'
                                }}
                            >
                                View Profile →
                            </button>
                        </div>

                        <div className="resume-upload-zone">
                            <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                                Resume Document
                            </label>

                            {selectedFile ? (
                                <div className="upload-dropzone upload-dropzone--selected">
                                    <span className="dropzone-icon dropzone-icon--success">
                                        <CheckCircleIcon />
                                    </span>
                                    <p className="dropzone-title dropzone-title--success">Resume Attached &amp; Validated</p>
                                    <p className="dropzone-filename" title={selectedFile.name}>{selectedFile.name}</p>
                                    <span className="dropzone-subtitle">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                                    <div className="dropzone-actions">
                                        <label htmlFor="resume-file-input" className="dropzone-btn dropzone-btn--change">
                                            Change File
                                        </label>
                                        <button type="button" onClick={handleRemoveFile} className="dropzone-btn dropzone-btn--remove">
                                            Remove
                                        </button>
                                    </div>
                                    <input ref={resumeInputRef} hidden type="file" id="resume-file-input" name="resume" accept=".pdf,.docx" onChange={handleFileChange} />
                                </div>
                            ) : (
                                <label
                                    className={`upload-dropzone ${isDragging ? 'upload-dropzone--dragging' : ''}`}
                                    htmlFor="resume-file-input"
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <span className="dropzone-icon"><UploadIcon /></span>
                                    <p className="dropzone-title">Upload Candidate Resume</p>
                                    <p className="dropzone-subtitle">PDF or DOCX format (Max 5MB)</p>
                                    <input ref={resumeInputRef} hidden type="file" id="resume-file-input" name="resume" accept=".pdf,.docx" onChange={handleFileChange} />
                                </label>
                            )}

                            {fileError && <p className="upload-error-msg">{fileError}</p>}
                        </div>

                        <div className="or-separator"><span>OR Profile Summary</span></div>

                        <div className="field-group">
                            <label htmlFor="self-desc-input">Candidate Background &amp; Skill Summary</label>
                            <textarea
                                id="self-desc-input"
                                onChange={(e) => setSelfDescription(e.target.value)}
                                className="workspace-textarea workspace-textarea--short"
                                placeholder="If you do not have a resume ready, briefly state your academic scores (10th/12th/CGPA), degree, years of experience, and primary tech stack..."
                                value={selfDescription}
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* ── Generation Action Bar ──────────────────────────────────────── */}
            <div className="workspace-actions-bar">
                <div className="action-note">
                    <span className="note-icon"><InfoIcon /></span>
                    <span>
                        Our engine evaluates <strong>academic eligibility</strong>, calculates <strong>competency match</strong>, and generates <strong>10+ technical and 10+ behavioral questions</strong>.
                    </span>
                </div>

                <button
                    onClick={handleGenerateReport}
                    className="generate-strategy-btn"
                    id="generate-strategy-btn"
                >
                    <SparkIcon />
                    <span>Generate Preparation Plan</span>
                </button>
            </div>

            {/* ── Recent Interview Plans Data Table ─────────────────────────── */}
            <section className="recent-plans-section">
                <div className="section-title-row">
                    <div className="section-heading-group">
                        <h2>Recent Interview Plans</h2>
                        <span className="plans-count-tag">{reports.length} Generated</span>
                    </div>
                </div>

                {reports.length > 0 ? (
                    <div className="plans-data-table">
                        {/* Table Header */}
                        <div className="data-table-row data-table-row--head">
                            <span className="col-th">Target Role / Position</span>
                            <span className="col-th">Company</span>
                            <span className="col-th">Match</span>
                            <span className="col-th">Eligibility</span>
                            <span className="col-th">Generated</span>
                            <span className="col-th" style={{ textAlign: 'right' }}>Action</span>
                        </div>

                        {/* Table Rows */}
                        {reports.map((r) => {
                            const eligibilityStatus = r.eligibility?.status || 'unverified'
                            const matchClass = r.matchScore >= 80 ? 'high' : r.matchScore >= 60 ? 'mid' : 'low'

                            return (
                                <div
                                    key={r._id}
                                    className="data-table-row data-table-row--body"
                                    onClick={() => navigate(`/interview/${r._id}`)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/interview/${r._id}`)}
                                >
                                    <div className="col-role" title={r.title || 'Untitled Position'}>
                                        {r.title || 'Untitled Position'}
                                    </div>

                                    <div className="col-company">
                                        {r.companyName ? (
                                            <span className="company-tag">🏢 {r.companyName}</span>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)' }}>General Role</span>
                                        )}
                                    </div>

                                    <div className="col-match">
                                        <span className={`match-pill match-pill--${matchClass}`}>
                                            {r.matchScore}%
                                        </span>
                                    </div>

                                    <div className="col-eligibility">
                                        <span className={`status-pill status-pill--${eligibilityStatus === 'eligible' ? 'eligible' : eligibilityStatus === 'ineligible' ? 'ineligible' : 'verify'}`}>
                                            {eligibilityStatus === 'eligible' ? '✓ Eligible' : eligibilityStatus === 'ineligible' ? '✕ Ineligible' : '? Unverified'}
                                        </span>
                                    </div>

                                    <div className="col-date">
                                        {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>

                                    <div className="col-action">
                                        <span className="action-link">
                                            Open <ArrowRightIcon />
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="plans-empty-container">
                        <div className="empty-icon-box">
                            <FileIcon />
                        </div>
                        <h3>No Interview Plans Created Yet</h3>
                        <p>
                            Paste a job description and attach your resume above to create your first targeted interview preparation strategy.
                        </p>
                    </div>
                )}
            </section>

        </div>
    )
}

export default Home