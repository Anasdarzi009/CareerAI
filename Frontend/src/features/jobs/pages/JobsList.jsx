import React from 'react'
import { useNavigate } from 'react-router'
import useJobs from '../hooks/useJobs'
import JobsFilterBar from '../components/JobsFilterBar'
import JobCard from '../components/JobCard'
import '../style/jobs.scss'

const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
)

export const JobsList = () => {
    const navigate = useNavigate()
    const {
        activeTab,
        setActiveTab,
        jobs,
        recommendedJobs,
        savedJobs,
        loading,
        error,
        successMessage,
        search,
        setSearch,
        workMode,
        setWorkMode,
        employmentType,
        setEmploymentType,
        eligibilityFilter,
        setEligibilityFilter,
        sortBy,
        setSortBy,
        handleToggleSave,
        resetFilters,
        fetchJobs
    } = useJobs('all')

    const displayedJobs =
        activeTab === 'recommended'
            ? recommendedJobs
            : activeTab === 'saved'
            ? savedJobs
            : jobs

    return (
        <div className="jobs-page">
            {/* Success & Error alerts */}
            {error && (
                <div
                    style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        padding: '0.75rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={fetchJobs}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#f87171',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        Try Again
                    </button>
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
                    <span className="jobs-eyebrow">OPPORTUNITY DISCOVERY</span>
                    <h1 className="jobs-title">Jobs &amp; Opportunities</h1>
                    <p className="jobs-subtitle">
                        Discover opportunities aligned with your skills, education and career goals. CareerAI automatically audits mandatory placement criteria against your Candidate Profile.
                    </p>
                </div>

                <div className="jobs-header-right">
                    <button
                        type="button"
                        className="btn-track-nav"
                        onClick={() => navigate('/jobs/applications')}
                        style={{
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600,
                            padding: '0.55rem 1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem'
                        }}
                    >
                        <span>Application Tracker →</span>
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="jobs-tabs-nav" role="tablist">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'all'}
                    className={`tab-btn ${activeTab === 'all' ? 'tab-btn--active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    <span>All Opportunities</span>
                    {jobs.length > 0 && <span className="tab-badge">{jobs.length}</span>}
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'recommended'}
                    className={`tab-btn ${activeTab === 'recommended' ? 'tab-btn--active' : ''}`}
                    onClick={() => setActiveTab('recommended')}
                >
                    <span>Recommended for You</span>
                    {recommendedJobs.length > 0 && (
                        <span className="tab-badge">{recommendedJobs.length}</span>
                    )}
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'saved'}
                    className={`tab-btn ${activeTab === 'saved' ? 'tab-btn--active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                >
                    <span>Saved Bookmarks</span>
                    {savedJobs.length > 0 && <span className="tab-badge">{savedJobs.length}</span>}
                </button>
            </div>

            {/* Filter Bar (for 'all' view) */}
            {activeTab === 'all' && (
                <JobsFilterBar
                    search={search}
                    setSearch={setSearch}
                    workMode={workMode}
                    setWorkMode={setWorkMode}
                    employmentType={employmentType}
                    setEmploymentType={setEmploymentType}
                    eligibilityFilter={eligibilityFilter}
                    setEligibilityFilter={setEligibilityFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    onResetFilters={resetFilters}
                    totalCount={displayedJobs.length}
                />
            )}

            {/* Loading Skeleton */}
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            style={{
                                height: '140px',
                                backgroundColor: 'var(--bg-surface)',
                                border: '1px solid var(--border-default)',
                                borderRadius: 'var(--radius-lg)',
                                opacity: 0.6
                            }}
                        />
                    ))}
                </div>
            ) : displayedJobs.length > 0 ? (
                <div className="jobs-list-grid">
                    {displayedJobs.map((job) => (
                        <JobCard
                            key={job._id}
                            job={job}
                            onToggleSave={handleToggleSave}
                        />
                    ))}
                </div>
            ) : (
                /* Polished Empty State */
                <div className="jobs-empty-state">
                    <div className="empty-icon-wrapper">
                        <BriefcaseIcon />
                    </div>
                    <h3 className="empty-title">
                        {activeTab === 'saved'
                            ? 'No Saved Bookmarks'
                            : activeTab === 'recommended'
                            ? 'No Recommendations Yet'
                            : 'No Opportunities Found'}
                    </h3>
                    <p className="empty-desc">
                        {activeTab === 'saved'
                            ? 'You have not saved any opportunities yet. Bookmark roles to review and compare later.'
                            : activeTab === 'recommended'
                            ? 'Complete your Candidate Profile with target role and skills to receive personalized opportunities.'
                            : 'Try adjusting your search criteria or resetting filters to view available opportunities.'}
                    </p>
                    {activeTab === 'all' && (
                        <button
                            type="button"
                            className="empty-action-btn"
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </button>
                    )}
                    {activeTab === 'recommended' && (
                        <button
                            type="button"
                            className="empty-action-btn"
                            onClick={() => navigate('/resume-profile')}
                        >
                            Update Profile →
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default JobsList
