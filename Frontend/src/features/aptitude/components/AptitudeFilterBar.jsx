import React from 'react';

const COMPANIES = [
    'All Companies',
    'TCS',
    'Deloitte',
    'Accenture',
    'LTIMindtree',
    'HCL',
    'Wipro',
    'Google',
    'Infosys',
    'Zensar',
    'IBM'
];

const CATEGORIES = [
    'All',
    'Quantitative Aptitude',
    'Logical Reasoning',
    'Verbal Ability'
];

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const AptitudeFilterBar = ({
    company = 'All Companies',
    onCompanyChange,
    category = 'All',
    onCategoryChange,
    difficulty = 'All',
    onDifficultyChange,
    search = '',
    onSearchChange,
    onSearchSubmit,
    totalResults = 0
}) => {
    return (
        <div className="aptitude-filter-bar">
            <div className="aptitude-filter-bar__top">
                {/* Search Bar */}
                <form
                    className="aptitude-search-box"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSearchSubmit();
                    }}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search questions by topic (e.g., Percentages, Syllogisms, Series) or keywords..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        aria-label="Search aptitude questions"
                    />
                    {search && (
                        <button
                            type="button"
                            className="aptitude-search-clear"
                            onClick={() => {
                                onSearchChange('');
                                onSearchSubmit();
                            }}
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </form>

                {/* Company Dropdown Filter */}
                <div className="aptitude-company-select-wrapper">
                    <select
                        className="aptitude-company-select"
                        value={company || 'All Companies'}
                        onChange={(e) => onCompanyChange(e.target.value)}
                        aria-label="Filter by Company"
                    >
                        {COMPANIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="aptitude-filter-bar__controls">
                {/* Category Pills */}
                <div className="aptitude-category-pills">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            className={`aptitude-filter-pill ${category === cat ? 'aptitude-filter-pill--active' : ''}`}
                            onClick={() => onCategoryChange(cat)}
                        >
                            {cat === 'All' ? 'All Categories' : cat}
                        </button>
                    ))}
                </div>

                {/* Difficulty Segment */}
                <div className="aptitude-difficulty-group">
                    <span className="aptitude-group-label">Difficulty:</span>
                    <div className="aptitude-diff-segments">
                        {DIFFICULTIES.map((diff) => (
                            <button
                                key={diff}
                                type="button"
                                className={`aptitude-diff-btn ${difficulty === diff ? 'aptitude-diff-btn--active' : ''}`}
                                onClick={() => onDifficultyChange(diff)}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AptitudeFilterBar;
