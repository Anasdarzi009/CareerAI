import React, { useState } from 'react'

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

export const ApplicationModal = ({
    isOpen,
    onClose,
    onSubmit,
    jobTitle,
    company,
    initialStatus = 'Applied',
    initialNotes = '',
    loading = false
}) => {
    const [status, setStatus] = useState(initialStatus)
    const [notes, setNotes] = useState(initialNotes)

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        await onSubmit(status, notes)
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <span className="modal-eyebrow">APPLICATION TRACKER</span>
                        <h3 className="modal-title">Track Application Stage</h3>
                        <p className="modal-subtitle">
                            {jobTitle} at <strong>{company}</strong>
                        </p>
                    </div>
                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="app-stage-select">Current Application Stage</label>
                        <select
                            id="app-stage-select"
                            className="form-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Applied">Applied (Application Submitted)</option>
                            <option value="Assessment">Assessment (Coding / OA)</option>
                            <option value="Interview">Interview (Technical / HR)</option>
                            <option value="Offer">Offer (Offer Received)</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Withdrawn">Withdrawn</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="app-notes-input">Application Notes (Optional)</label>
                        <textarea
                            id="app-notes-input"
                            className="form-textarea"
                            placeholder="e.g. Applied via university portal, referral from senior engineer, scheduled OA on Friday..."
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ApplicationModal
