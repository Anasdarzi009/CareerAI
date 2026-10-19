import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import useJobDetails from '../hooks/useJobDetails'
import EligibilityBreakdownCard from '../components/EligibilityBreakdownCard'
import ApplicationModal from '../components/ApplicationModal'
import '../style/jobs.scss'

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
)

const BookmarkIcon = ({ filled }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
)

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
)

export const JobDetails = () => {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const {
        job,
        loading,
        error,
        actionLoading,
        successMessage,
        handleToggleSave,
        handleApply
    } = useJobDetails(jobId)

    const [isAppModalOpen, setIsAppModalOpen] = useState(false)

    if (loading) {
        return (
            <div className="job-details-page">
                <div style={{ height: '30px', width: '120px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px' }} />
                <div style={{ height: '200px', width: '100%', backgroundColor: 'var(--bg-surface)', borderRadius: '12px' }} />
            </div>
        )
    }

    if (error || !job) {
        return (
            <div className="job-details-page">
                <button
                    type="button"
                    className="details-back-link"
                    onClick={() => navigate('/jobs')}
                >
                    <ArrowLeftIcon />
                    <span>Back to Opportunities</span>
                </button>
                <div className="jobs-empty-state">
                    <h3 className="empty-title">{error || 'Opportunity Not Found'}</h3>
                    <p className="empty-desc">The requested job opportunity may have expired or been removed.</p>
                    <button
                        type="button"
                        className="empty-action-btn"
                        onClick={() => navigate('/jobs')}
                    >
                        Browse Opportunities
                    </button>
                </div>
            </div>
        )
    }

    const {
        title,
        company,
        location,
        workMode,
        employmentType,
        experienceRequired,
        salaryRange,
        description,
        responsibilities = [],
        requiredSkills = [],
        preferredSkills = [],
        educationRequirements,
        eligibility,
        matchScore,
        matchFactors = [],
        applicationDeadline,
        applicationUrl,
        isSaved,
        application,
        isSample,
        sampleLabel
    } = job

    const handleApplyClick = () => {
        if (applicationUrl) {
            window.open(applicationUrl, '_blank', 'noopener,noreferrer')
        }
        setIsAppModalOpen(true)
    }

    const onModalSubmit = async (status, notes) => {
        await handleApply(status, notes)
    }

    return (
        <div className="job-details-page">
            {/* Top Back Link */}
            <button
                type="button"
                className="details-back-link"
                onClick={() => navigate('/jobs')}
            >
                <ArrowLeftIcon />
                <span>Back to Opportunities</span>
            </button>

            {/* Success Alert */}
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

            {/* Hero Header Card */}
            <div className="job-details-hero">
                <div className="hero-top-row">
                    <div className="company-name-group">
                        <span className="company-name">{company}</span>
                        {isSample && (
                            <span className="sample-badge">{sampleLabel || 'Demo Opportunity'}</span>
                        )}
                    </div>

                    {applicationDeadline && (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Deadline: {new Date(applicationDeadline).toLocaleDateString()}
                        </span>
                    )}
                </div>

                <h1 className="hero-title">{title}</h1>

                <div className="hero-meta-grid">
                    <span className="meta-pill">{location}</span>
                    <span className={`meta-pill meta-pill--workmode meta-pill--${(workMode || '').toLowerCase()}`}>
                        {workMode}
                    </span>
                    <span className="meta-pill">{employmentType}</span>
                    {experienceRequired && (
                        <span className="meta-pill meta-pill--exp">{experienceRequired}</span>
                    )}
                    {salaryRange && (
                        <span className="meta-pill meta-pill--salary">{salaryRange}</span>
                    )}
                </div>

                {/* Hero Actions Bar */}
                <div className="hero-actions-bar">
                    <div className="action-buttons-group">
                        <button
                            type="button"
                            className="btn-apply-primary"
                            onClick={handleApplyClick}
                            disabled={actionLoading}
                        >
                            <span>Apply Now</span>
                            {applicationUrl && <ExternalLinkIcon />}
                        </button>

                        <button
                            type="button"
                            className="btn-track-application"
                            onClick={() => setIsAppModalOpen(true)}
                            disabled={actionLoading}
                        >
                            <span>{application ? 'Update Stage' : 'Track Application'}</span>
                        </button>

                        <button
                            type="button"
                            className={`btn-save-toggle ${isSaved ? 'btn-save-toggle--saved' : ''}`}
                            onClick={handleToggleSave}
                            disabled={actionLoading}
                        >
                            <BookmarkIcon filled={isSaved} />
                            <span>{isSaved ? 'Saved' : 'Save Opportunity'}</span>
                        </button>
                    </div>

                    {application && (
                        <div className="application-status-tag">
                            ● Status: {application.status}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Split Layout */}
            <div className="job-details-split">
                {/* Left Column: Full Role Content */}
                <div className="details-main-content">
                    {/* About Role */}
                    <div className="content-panel">
                        <h2 className="panel-title">About the Role</h2>
                        <div className="panel-prose">{description}</div>
                    </div>

                    {/* Key Responsibilities */}
                    {responsibilities.length > 0 && (
                        <div className="content-panel">
                            <h2 className="panel-title">Key Responsibilities</h2>
                            <ul className="bullets-list">
                                {responsibilities.map((resp, idx) => (
                                    <li key={idx} className="bullet-item">
                                        <span>{resp}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Required Skills */}
                    {requiredSkills.length > 0 && (
                        <div className="content-panel">
                            <h2 className="panel-title">Required Technical Skills</h2>
                            <div className="skills-tags-cluster">
                                {requiredSkills.map((skill, idx) => (
                                    <span key={idx} className="cluster-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Preferred Skills */}
                    {preferredSkills.length > 0 && (
                        <div className="content-panel">
                            <h2 className="panel-title">Preferred / Nice-to-Have Skills</h2>
                            <div className="skills-tags-cluster">
                                {preferredSkills.map((skill, idx) => (
                                    <span key={idx} className="cluster-tag cluster-tag--preferred">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education Requirements */}
                    {educationRequirements && (
                        <div className="content-panel">
                            <h2 className="panel-title">Education &amp; Academic Foundation</h2>
                            <p className="panel-prose">{educationRequirements}</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Dedicated CareerAI Eligibility Audit */}
                <div className="details-side-sticky">
                    <EligibilityBreakdownCard
                        eligibility={eligibility}
                        matchScore={matchScore}
                        matchFactors={matchFactors}
                    />
                </div>
            </div>

            {/* Application Modal */}
            <ApplicationModal
                isOpen={isAppModalOpen}
                onClose={() => setIsAppModalOpen(false)}
                onSubmit={onModalSubmit}
                jobTitle={title}
                company={company}
                initialStatus={application?.status || 'Applied'}
                initialNotes={application?.notes || ''}
                loading={actionLoading}
            />
        </div>
    )
}

export default JobDetails
