import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { getApplications, updateApplicationStatus } from '../services/jobs.api'
import EligibilityBadge from '../components/EligibilityBadge'
import '../style/jobs.scss'

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
)

const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
)

const STATUS_OPTIONS = [
    'Applied',
    'Assessment',
    'Interview',
    'Offer',
    'Rejected',
    'Withdrawn'
]

export const Applications = () => {
    const navigate = useNavigate()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [updatingId, setUpdatingId] = useState(null)

    const fetchApps = async () => {
        setLoading(true)
        setError('')
        try {
            const data = await getApplications()
            setApplications(data.applications || [])
        } catch (err) {
            console.error('fetchApplications error:', err)
            setError(err.response?.data?.message || 'Failed to load applications')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApps()
    }, [])

    const handleStatusChange = async (appId, newStatus) => {
        setUpdatingId(appId)
        try {
            await updateApplicationStatus(appId, { status: newStatus })
            setApplications(prev =>
                prev.map(a =>
                    a.applicationId === appId ? { ...a, status: newStatus } : a
                )
            )
            setSuccessMessage(`Application stage updated to "${newStatus}"`)
            setTimeout(() => setSuccessMessage(''), 3000)
        } catch (err) {
            console.error('handleStatusChange error:', err)
            setError('Failed to update stage')
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="applications-page">
            {/* Back to Jobs */}
            <button
                type="button"
                className="details-back-link"
                onClick={() => navigate('/jobs')}
            >
                <ArrowLeftIcon />
                <span>Back to Opportunities</span>
            </button>

            {/* Error / Success Alerts */}
            {error && (
                <div
                    style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        padding: '0.75rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)'
                    }}
                >
                    {error}
                </div>
            )}

            {successMessage && (
                <div
                    style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#4ade80',
                        padding: '0.75rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)'
                    }}
                >
                    ✓ {successMessage}
                </div>
            )}

            {/* Page Header */}
            <div className="jobs-header">
                <div className="jobs-header-left">
                    <span className="jobs-eyebrow">RECRUITMENT PIPELINE</span>
                    <h1 className="jobs-title">Application Tracker</h1>
                    <p className="jobs-subtitle">
                        Track and update recruitment stages across all roles you have applied for through CareerAI.
                    </p>
                </div>
            </div>

            {/* Content Body */}
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            style={{
                                height: '90px',
                                backgroundColor: 'var(--bg-surface)',
                                border: '1px solid var(--border-default)',
                                borderRadius: 'var(--radius-lg)'
                            }}
                        />
                    ))}
                </div>
            ) : applications.length > 0 ? (
                <div className="applications-list-table">
                    {applications.map((app) => {
                        const job = app.job || {}
                        const isUpdating = updatingId === app.applicationId

                        return (
                            <div key={app.applicationId} className="app-tracker-card">
                                <div className="app-job-col">
                                    <span className="app-company">{job.company || 'Company'}</span>
                                    <h3
                                        className="app-title"
                                        onClick={() => navigate(`/jobs/${job._id}`)}
                                    >
                                        {job.title}
                                    </h3>
                                    <span className="app-date">
                                        Applied on: {new Date(app.appliedAt).toLocaleDateString()} • {job.location} ({job.workMode})
                                    </span>
                                </div>

                                <div className="app-status-col">
                                    {job.eligibility && (
                                        <EligibilityBadge status={job.eligibility.status} size="normal" />
                                    )}

                                    <select
                                        className="status-selector"
                                        value={app.status}
                                        disabled={isUpdating}
                                        onChange={(e) =>
                                            handleStatusChange(app.applicationId, e.target.value)
                                        }
                                    >
                                        {STATUS_OPTIONS.map((st) => (
                                            <option key={st} value={st}>
                                                Stage: {st}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="jobs-empty-state">
                    <div className="empty-icon-wrapper">
                        <BriefcaseIcon />
                    </div>
                    <h3 className="empty-title">No Applications Tracked Yet</h3>
                    <p className="empty-desc">
                        When you apply for opportunities or mark them as applied, they will appear in this pipeline for easy tracking.
                    </p>
                    <button
                        type="button"
                        className="empty-action-btn"
                        onClick={() => navigate('/jobs')}
                    >
                        Browse Opportunities
                    </button>
                </div>
            )}
        </div>
    )
}

export default Applications
