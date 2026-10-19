import React from 'react'
import Avatar from '../../../components/common/Avatar'

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
)

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
)

export const ProfileOverviewCard = ({ userMeta, profile, completeness, onNavigateTab }) => {
    const avatarId = userMeta?.avatar || profile?.user?.avatar || 'avatar-1'
    const displayName = profile?.personal?.fullName || userMeta?.username || 'Candidate'
    const email = userMeta?.email || profile?.user?.email || 'Authenticated Candidate'
    const gender = userMeta?.gender || profile?.user?.gender || 'Prefer not to say'
    const headline = profile?.personal?.headline || profile?.careerPreferences?.targetRole || 'CareerAI Candidate'

    const hasResume = !!profile?.resume?.fileName
    const resumeFileName = profile?.resume?.fileName

    return (
        <div className="profile-overview-card">
            <div className="overview-avatar-wrapper">
                <div className="overview-avatar-ring">
                    <Avatar avatarId={avatarId} size={76} alt={displayName} />
                </div>
            </div>

            <div className="overview-info-col">
                <div className="overview-name-row">
                    <h2 className="overview-name">{displayName}</h2>
                    <span className="overview-badge">Candidate Account</span>
                </div>

                <p className="overview-headline">{headline}</p>

                <div className="overview-meta-row">
                    <span className="overview-email">
                        <MailIcon />
                        <span>{email}</span>
                    </span>
                    <span className="overview-separator">•</span>
                    <span className="overview-gender">
                        Gender: <strong>{gender}</strong>
                    </span>
                </div>
            </div>

            <div className="overview-status-col">
                {/* Profile Completeness Pill */}
                <div className="overview-status-item">
                    <span className="status-item-label">PROFILE STATUS</span>
                    <span className="status-item-val status-item-val--highlight">
                        Profile {completeness?.score ?? 0}% complete
                    </span>
                </div>

                {/* Resume Status Pill */}
                <div className="overview-status-item">
                    <span className="status-item-label">RESUME</span>
                    {hasResume ? (
                        <div className="resume-status-badge resume-status-badge--ready">
                            <CheckIcon />
                            <span className="resume-name-truncate" title={resumeFileName}>
                                {resumeFileName}
                            </span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="resume-upload-cta-btn"
                            onClick={() => onNavigateTab('resume')}
                        >
                            <FileIcon />
                            <span>Upload Resume →</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfileOverviewCard
