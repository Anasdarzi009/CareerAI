import React from 'react'
import { useNavigate } from 'react-router'

const SparkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
)

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
)

export const RecentActivity = ({ reports = [] }) => {
    const navigate = useNavigate()

    if (!reports || reports.length === 0) {
        return (
            <div className="activity-card activity-card--empty">
                <div className="activity-card-header">
                    <span className="activity-card-title">RECENT ACTIVITY</span>
                </div>
                <div className="activity-empty-state">
                    <p className="empty-activity-title">No recent activity yet.</p>
                    <p className="empty-activity-sub">
                        Generate your first interview preparation plan to view activity tracking here.
                    </p>
                </div>
            </div>
        )
    }

    // Generate up to 5 real events from reports
    const activities = reports.slice(0, 4).map((r, i) => {
        const timeFormatted = r.createdAt
            ? new Date(r.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
              })
            : 'Recent'

        const techCount = r.technicalQuestions?.length ?? 10
        const behCount = r.behavioralQuestions?.length ?? 10

        return {
            id: r._id,
            title: `Interview Strategy: ${r.title}`,
            company: r.companyName || 'Target Role',
            detail: `${techCount} technical & ${behCount} behavioral questions generated`,
            date: timeFormatted,
            matchScore: r.matchScore,
            planId: r._id
        }
    })

    return (
        <div className="activity-card">
            <div className="activity-card-header">
                <div className="activity-title-group">
                    <span className="activity-card-title">RECENT ACTIVITY</span>
                    <span className="activity-count-tag">{reports.length} Logs</span>
                </div>
            </div>

            <div className="activity-list">
                {activities.map((item) => (
                    <div
                        key={item.id}
                        className="activity-item"
                        onClick={() => navigate(`/interview/${item.planId}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && navigate(`/interview/${item.planId}`)}
                    >
                        <div className="activity-item-icon">
                            <SparkIcon />
                        </div>
                        <div className="activity-item-content">
                            <div className="activity-item-top">
                                <span className="activity-item-heading">{item.title}</span>
                                <span className="activity-item-date">{item.date}</span>
                            </div>
                            <span className="activity-item-sub">{item.detail}</span>
                        </div>
                        <span className="activity-item-arrow">
                            <ArrowRightIcon />
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RecentActivity
