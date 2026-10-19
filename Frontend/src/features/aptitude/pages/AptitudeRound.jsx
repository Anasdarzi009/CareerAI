import React, { useState, useEffect } from 'react';
import AptitudeRoundHeader from '../components/AptitudeRoundHeader';
import AptitudeStats from '../components/AptitudeStats';
import AptitudeFilterBar from '../components/AptitudeFilterBar';
import AptitudeQuestionCard from '../components/AptitudeQuestionCard';
import AptitudeAssessmentCard from '../components/AptitudeAssessmentCard';
import AptitudePerformance from '../components/AptitudePerformance';
import Pagination from '../../../components/common/Pagination';
import { useAptitude } from '../hooks/useAptitude';
import '../style/aptitude.scss';

const AptitudeRound = () => {
    const [activeTab, setActiveTab] = useState('practice');
    const {
        questions,
        totalQuestions,
        loading,
        error,
        fetchQuestions,
        companyFilter,
        setCompanyFilter,
        categoryFilter,
        setCategoryFilter,
        difficultyFilter,
        setDifficultyFilter,
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        assessments,
        fetchAssessments,
        stats,
        loadingStats,
        fetchStats
    } = useAptitude();

    useEffect(() => {
        fetchQuestions({ page: 1 });
        fetchStats();
    }, [fetchQuestions, fetchStats]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        if (tabId === 'assessments') {
            fetchAssessments();
        } else if (tabId === 'performance') {
            fetchStats();
        }
    };

    const handleCompanyChange = (comp) => {
        setCompanyFilter(comp);
        setCurrentPage(1);
        fetchQuestions({ company: comp, page: 1 });
    };

    const handleCategoryChange = (cat) => {
        setCategoryFilter(cat);
        setCurrentPage(1);
        fetchQuestions({ category: cat, page: 1 });
    };

    const handleDifficultyChange = (diff) => {
        setDifficultyFilter(diff);
        setCurrentPage(1);
        fetchQuestions({ difficulty: diff, page: 1 });
    };

    const handleSearchSubmit = () => {
        setCurrentPage(1);
        fetchQuestions({ search: searchTerm, page: 1 });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchQuestions({ page: newPage });
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    const handleResetFilters = () => {
        setCompanyFilter('All Companies');
        setCategoryFilter('All');
        setDifficultyFilter('All');
        setSearchTerm('');
        setCurrentPage(1);
        fetchQuestions({ company: 'All Companies', category: 'All', difficulty: 'All', search: '', page: 1 });
    };

    const totalPages = Math.ceil(totalQuestions / 20) || 1;
    const startItem = totalQuestions > 0 ? (currentPage - 1) * 20 + 1 : 0;
    const endItem = totalQuestions > 0 ? Math.min(currentPage * 20, totalQuestions) : 0;

    return (
        <div className="aptitude-workspace">
            <AptitudeRoundHeader
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            {activeTab === 'practice' && (
                <main className="aptitude-main-content">
                    <AptitudeStats stats={stats} loading={loadingStats} />

                    {/* Question Bank Header Banner */}
                    <div className="aptitude-bank-header">
                        <div className="aptitude-bank-header__left">
                            <h2 className="aptitude-bank-title">Company-Specific Aptitude Bank</h2>
                            <p className="aptitude-bank-subtitle">
                                Verified Quantitative, Logical Reasoning, and Verbal Ability placement questions asked by top corporate recruiters.
                            </p>
                        </div>
                        <div className="aptitude-bank-badge">
                            {totalQuestions} Questions · 10 Companies
                        </div>
                    </div>

                    <AptitudeFilterBar
                        company={companyFilter}
                        onCompanyChange={handleCompanyChange}
                        category={categoryFilter}
                        onCategoryChange={handleCategoryChange}
                        difficulty={difficultyFilter}
                        onDifficultyChange={handleDifficultyChange}
                        search={searchTerm}
                        onSearchChange={setSearchTerm}
                        onSearchSubmit={handleSearchSubmit}
                        totalResults={totalQuestions}
                    />

                    {/* Results count status bar */}
                    <div className="aptitude-results-bar">
                        <span className="aptitude-results-count">
                            Showing <strong>{startItem}–{endItem}</strong> of <strong>{totalQuestions}</strong> questions
                            {companyFilter && companyFilter !== 'All Companies' && (
                                <span className="aptitude-active-filter-tag"> · {companyFilter}</span>
                            )}
                            {categoryFilter && categoryFilter !== 'All' && (
                                <span className="aptitude-active-filter-tag"> · {categoryFilter}</span>
                            )}
                            {difficultyFilter && difficultyFilter !== 'All' && (
                                <span className="aptitude-active-filter-tag"> · {difficultyFilter}</span>
                            )}
                        </span>
                    </div>

                    {error && (
                        <div className="aptitude-error-banner">
                            <span>⚠ {error}</span>
                        </div>
                    )}

                    {loading ? (
                        <div className="aptitude-loading-grid">
                            <div className="skeleton-card" />
                            <div className="skeleton-card" />
                            <div className="skeleton-card" />
                        </div>
                    ) : questions.length > 0 ? (
                        <>
                            <div className="aptitude-questions-list">
                                {questions.map((q) => (
                                    <AptitudeQuestionCard key={q._id || q.questionId} question={q} />
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalQuestions}
                                pageSize={20}
                                onPageChange={handlePageChange}
                            />
                        </>
                    ) : (
                        <div className="aptitude-empty-state">
                            <h3>No Questions Found</h3>
                            <p>No questions matched your filter criteria.</p>
                            <button
                                type="button"
                                className="aptitude-btn aptitude-btn--secondary"
                                onClick={handleResetFilters}
                            >
                                Reset All Filters
                            </button>
                        </div>
                    )}
                </main>
            )}

            {activeTab === 'assessments' && (
                <main className="aptitude-main-content">
                    <AptitudeAssessmentCard
                        assessments={assessments}
                        onAssessmentCreated={fetchAssessments}
                    />
                </main>
            )}

            {activeTab === 'performance' && (
                <main className="aptitude-main-content">
                    <AptitudePerformance
                        stats={stats}
                        loading={loadingStats}
                    />
                </main>
            )}
        </div>
    );
};

export default AptitudeRound;
