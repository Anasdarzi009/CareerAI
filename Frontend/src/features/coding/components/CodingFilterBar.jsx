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

const TOPICS = [
    'All Topics',
    'Arrays',
    'Strings',
    'Hashing',
    'Searching',
    'Sorting',
    'Two Pointers',
    'Sliding Window',
    'Stack',
    'Queue',
    'Linked List',
    'Recursion',
    'Binary Search',
    'Trees',
    'Graphs',
    'Dynamic Programming',
    'Greedy',
    'Mathematics',
    'Bit Manipulation'
];

const DIFFICULTIES = ['All Difficulties', 'Easy', 'Medium', 'Hard'];

const LANGUAGES = [
    { label: 'All Languages', value: 'All Languages' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'cpp' },
    { label: 'C', value: 'c' },
    { label: 'JavaScript', value: 'javascript' }
];

const CodingFilterBar = ({ filters, onFilterChange }) => {
    return (
        <div className="coding-filter-bar">
            <div className="coding-filter-bar__search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder="Search by problem title, company, or concept..."
                    value={filters.search || ''}
                    onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
                    className="coding-filter-bar__input"
                />
                {filters.search && (
                    <button
                        type="button"
                        className="coding-filter-bar__clear"
                        onClick={() => onFilterChange({ search: '', page: 1 })}
                        aria-label="Clear search"
                    >
                        ×
                    </button>
                )}
            </div>

            <div className="coding-filter-bar__dropdowns">
                {/* Company Filter */}
                <select
                    className="coding-select"
                    value={filters.company || 'All Companies'}
                    onChange={(e) => onFilterChange({
                        company: e.target.value === 'All Companies' ? '' : e.target.value,
                        page: 1
                    })}
                    aria-label="Filter by Company"
                >
                    {COMPANIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                {/* Difficulty Filter */}
                <select
                    className="coding-select"
                    value={filters.difficulty || 'All Difficulties'}
                    onChange={(e) => onFilterChange({
                        difficulty: e.target.value === 'All Difficulties' ? '' : e.target.value,
                        page: 1
                    })}
                    aria-label="Filter by Difficulty"
                >
                    {DIFFICULTIES.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>

                {/* Topic Filter */}
                <select
                    className="coding-select"
                    value={filters.topic || 'All Topics'}
                    onChange={(e) => onFilterChange({
                        topic: e.target.value === 'All Topics' ? '' : e.target.value,
                        page: 1
                    })}
                    aria-label="Filter by Topic"
                >
                    {TOPICS.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                {/* Language Filter */}
                <select
                    className="coding-select"
                    value={filters.language || 'All Languages'}
                    onChange={(e) => onFilterChange({
                        language: e.target.value === 'All Languages' ? '' : e.target.value,
                        page: 1
                    })}
                    aria-label="Filter by Language"
                >
                    {LANGUAGES.map(l => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default CodingFilterBar;
