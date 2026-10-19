import React, { useRef, useState } from 'react'

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
)

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)

const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
)

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
)

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
)

const AlertCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
)

export const ResumeSection = ({ resume, onUpload, onDelete, uploading }) => {
    const fileInputRef = useRef(null)
    const [dragOver, setDragOver] = useState(false)
    const [fileError, setFileError] = useState('')

    const hasResume = !!resume?.fileName

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
    }

    const validateAndProcessFile = (file) => {
        setFileError('')
        if (!file) return

        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ]
        const validExts = ['.pdf', '.docx', '.doc']
        const fileNameLower = file.name.toLowerCase()

        const hasValidExt = validExts.some(ext => fileNameLower.endsWith(ext))
        const hasValidType = validTypes.includes(file.type) || hasValidExt

        if (!hasValidType) {
            setFileError('Invalid format. Please upload a PDF or DOCX file.')
            return
        }

        const maxBytes = 5 * 1024 * 1024 // 5MB
        if (file.size > maxBytes) {
            setFileError('File size exceeds 5MB limit. Please upload a smaller file.')
            return
        }

        onUpload(file)
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) validateAndProcessFile(file)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files?.[0]
        if (file) validateAndProcessFile(file)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setDragOver(false)
    }

    const formattedDate = resume?.uploadedAt
        ? new Date(resume.uploadedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
          })
        : 'Recently uploaded'

    return (
        <div className="profile-section-card" id="section-resume">
            <div className="section-card-header">
                <div className="card-title-group">
                    <span className="card-step-num">01</span>
                    <div>
                        <h3>Candidate Resume</h3>
                        <p className="card-subtitle">
                            Upload your professional resume. CareerAI parses your background to personalize interviews and evaluate placement cutoffs.
                        </p>
                    </div>
                </div>
                {hasResume ? (
                    <span className="section-pill section-pill--ready">
                        <CheckCircleIcon />
                        <span>Resume Ready</span>
                    </span>
                ) : (
                    <span className="section-pill section-pill--action">Pending Upload</span>
                )}
            </div>

            <div className="section-card-body">
                {fileError && (
                    <div className="resume-error-banner">
                        <AlertCircleIcon />
                        <span>{fileError}</span>
                    </div>
                )}

                {/* Hidden native input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    style={{ display: 'none' }}
                />

                {hasResume ? (
                    /* Active Resume Display Card */
                    <div className="resume-active-card">
                        <div className="resume-file-info">
                            <div className="resume-file-icon">
                                <FileTextIcon />
                            </div>
                            <div className="resume-meta">
                                <div className="resume-title-row">
                                    <h4 className="resume-filename">{resume.fileName}</h4>
                                    <span className="resume-ext-badge">
                                        {resume.fileName.endsWith('.docx') ? 'DOCX' : 'PDF'}
                                    </span>
                                </div>
                                <div className="resume-sub-row">
                                    <span>{formatFileSize(resume.fileSize)}</span>
                                    <span className="dot">•</span>
                                    <span>Uploaded on {formattedDate}</span>
                                    {resume.rawText && (
                                        <>
                                            <span className="dot">•</span>
                                            <span className="resume-parsed-tag">AI Ready (Text Extracted)</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="resume-actions-group">
                            <button
                                type="button"
                                className="button secondary-button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                <RefreshIcon />
                                <span>{uploading ? 'Processing...' : 'Replace Resume'}</span>
                            </button>

                            <button
                                type="button"
                                className="button danger-button"
                                onClick={onDelete}
                                disabled={uploading}
                            >
                                <TrashIcon />
                                <span>Remove</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Dropzone when no resume is uploaded */
                    <div
                        className={`resume-dropzone ${dragOver ? 'resume-dropzone--dragover' : ''}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="dropzone-icon">
                            <UploadIcon />
                        </div>
                        <div className="dropzone-text">
                            <h4>{uploading ? 'Processing resume...' : 'Upload your resume'}</h4>
                            <p>Drag and drop your file here, or click to browse</p>
                            <span className="dropzone-format-tag">
                                PDF or DOCX · Maximum 5 MB
                            </span>
                        </div>
                        <button
                            type="button"
                            className="button primary-button dropzone-cta-btn"
                            disabled={uploading}
                            onClick={(e) => {
                                e.stopPropagation()
                                fileInputRef.current?.click()
                            }}
                        >
                            <span>{uploading ? 'Uploading...' : 'Browse Files'}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResumeSection
