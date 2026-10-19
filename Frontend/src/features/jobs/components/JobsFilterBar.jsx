import React from 'react'

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

export const JobsFilterBar = ({
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
    onResetFilters,
    totalCount
}) => {
    const isFiltered =
        search !== '' ||
        workMode !== 'All' ||
        employmentType !== 'All' ||
        eligibilityFilter !== 'All' ||
        sortBy !== 'newest'

    return (
        <div className="jobs-filter-bar">
            {/* Search Input */}
            <div className="search-input-group">
                <span className="search-icon"><SearchIcon /></span>
                <input
                    type="text"
                    className="search-field"
                    placeholder="Search opportunities by title, company, skills, or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button
                        type="button"
                        className="search-clear-btn"
                        onClick={() => setSearch('')}
                        aria-label="Clear search query"
                    >
                        <CloseIcon />
                    </button>
                )}
            </div>

            {/* Filter Controls Row */}
            <div className="filters-controls-row">
                {/* Work Mode */}
                <div className="filter-select-wrapper">
                    <label htmlFor="filter-workmode" className="filter-label">Work Mode</label>
                    <select
                        id="filter-workmode"
                        className="filter-select"
                        value={workMode}
                        onChange={(e) => setWorkMode(e.target.value)}
                    >
                        <option value="All">All Modes</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                    </select>
                </div>

                {/* Employment Type */}
                <div className="filter-select-wrapper">
                    <label htmlFor="filter-type" className="filter-label">Job Type</label>
                    <select
                        id="filter-type"
                        className="filter-select"
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                    </select>
                </div>

                {/* Eligibility Filter */}
                <div className="filter-select-wrapper">
                    <label htmlFor="filter-eligibility" className="filter-label">Eligibility</label>
                    <select
                        id="filter-eligibility"
                        className="filter-select filter-select--eligibility"
                        value={eligibilityFilter}
                        onChange={(e) => setEligibilityFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="ELIGIBLE">✓ Eligible Only</option>
                        <option value="UNVERIFIED">? Needs Profile Info</option>
                        <option value="INELIGIBLE">✕ Ineligible</option>
                    </select>
                </div>

                {/* Sort By */}
                <div className="filter-select-wrapper">
                    <label htmlFor="filter-sort" className="filter-label">Sort By</label>
                    <select
                        id="filter-sort"
                        className="filter-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="bestMatch">Best Match Score</option>
                        <option value="deadline">Application Deadline</option>
                    </select>
                </div>

                {/* Reset Filters */}
                {isFiltered && (
                    <button
                        type="button"
                        className="reset-filters-btn"
                        onClick={onResetFilters}
                    >
                        <span>Reset</span>
                    </button>
                )}

                <div className="filter-count-badge">
                    <span>{totalCount} {totalCount === 1 ? 'Opportunity' : 'Opportunities'}</span>
                </div>
            </div>
        </div>
    )
}

export default JobsFilterBar
