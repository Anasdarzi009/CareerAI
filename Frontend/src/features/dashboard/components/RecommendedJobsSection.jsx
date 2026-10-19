import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { getRecommendedJobs } from '../../jobs/services/jobs.api'
import EligibilityBadge from '../../jobs/components/EligibilityBadge'

export const RecommendedJobsSection = () => {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true
        getRecommendedJobs()
            .then(data => {
                if (isMounted) setJobs((data.jobs || []).slice(0, 3))
            })
            .catch(err => {
                console.warn("Recommended jobs fetch error on dashboard:", err.message)
            })
            .finally(() => {
                if (isMounted) setLoading(false)
            })
        return () => { isMounted = false }
    }, [])

    if (loading) {
        return null // Don't flash layout shift while loading
    }

    if (jobs.length === 0) {
        return (
            <div className="dashboard-recommended-card" style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                marginTop: '1.25rem'
            }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    No opportunities available yet.
                </span>
                <button
                    type="button"
                    onClick={() => navigate('/jobs')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}
                >
                    Browse All Opportunities →
                </button>
            </div>
        )
    }

    return (
        <div className="dashboard-recommended-card" style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            marginTop: '1.25rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)' }}>
                        RECOMMENDED OPPORTUNITIES
                    </span>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 750, color: 'var(--text-primary)', margin: '0.15rem 0 0 0' }}>
                        Tailored Roles for Your Profile
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={() => navigate('/jobs')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '0.25rem 0'
                    }}
                >
                    View All Opportunities →
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '0.85rem' }}>
                {jobs.map((job) => (
                    <div
                        key={job._id}
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        style={{
                            backgroundColor: 'var(--bg-base)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.85rem 1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'border-color 0.15s ease'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                {job.company}
                            </span>
                            <EligibilityBadge status={job.eligibility?.status} size="normal" />
                        </div>

                        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                            {job.title}
                        </h4>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                            <span>{job.location} ({job.workMode})</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{job.matchScore}% Match</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RecommendedJobsSection
