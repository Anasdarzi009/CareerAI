import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useCoding } from '../hooks/useCoding';
import CodingRoundHeader from '../components/CodingRoundHeader';
import CodingStats from '../components/CodingStats';
import CodingFilterBar from '../components/CodingFilterBar';
import CodingQuestionCard from '../components/CodingQuestionCard';
import CodingPerformance from '../components/CodingPerformance';
import AssessmentCard from '../components/AssessmentCard';
import Pagination from '../../../components/common/Pagination';
import '../style/coding.scss';

const CodingRound = () => {
    const [activeTab, setActiveTab] = useState('practice');
    const {
        questions,
        pagination,
        filters,
        setFilters,
        loadingQuestions,
        fetchQuestions,
        stats,
        loadingStats,
        fetchStats,
        submissions,
        loadingSubmissions,
        fetchSubmissions,
        assessments,
        fetchAssessmentsList,
        handleStartAssessment,
        handleCreateAssessment
    } = useCoding();

    const [creatingAssessment, setCreatingAssessment] = useState(false);
    const [assessmentForm, setAssessmentForm] = useState({
        title: 'Full Stack Algorithmic Assessment',
        targetRole: 'Full Stack Developer',
        difficulty: 'Medium',
        numberOfQuestions: 4,
        duration: 60
    });

    useEffect(() => {
        fetchStats();
        fetchQuestions();
    }, [fetchStats, fetchQuestions]);

    useEffect(() => {
        if (activeTab === 'assessments') {
            fetchAssessmentsList();
        } else if (activeTab === 'history') {
            fetchSubmissions();
        } else if (activeTab === 'performance') {
            fetchStats();
        }
    }, [activeTab, fetchAssessmentsList, fetchSubmissions, fetchStats]);

    const handleFilterChange = (newFilters) => {
        const updated = { ...filters, ...newFilters };
        setFilters(updated);
        fetchQuestions(updated);
    };

    const handlePageChange = (newPage) => {
        handleFilterChange({ page: newPage });
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    const handleStartAssessmentClick = async (assessmentId) => {
        const started = await handleStartAssessment(assessmentId);
        if (started) {
            window.location.href = `/coding/assessment/${assessmentId}`;
        }
    };

    const handleCreateNewAssessment = async (e) => {
        e.preventDefault();
        setCreatingAssessment(true);
        const created = await handleCreateAssessment(assessmentForm);
        setCreatingAssessment(false);
        if (created) {
            fetchAssessmentsList();
        }
    };

    // Quick lookup for solved questions
    const solvedQuestionIds = new Set(
        submissions.filter(s => s.status === 'Accepted').map(s => s.question?._id || s.question)
    );
    const attemptedQuestionIds = new Set(
        submissions.map(s => s.question?._id || s.question)
    );

    const totalQuestions = pagination.total || questions.length;
    const currentPage = pagination.page || 1;
    const totalPages = pagination.totalPages || pagination.pages || 1;
    const startItem = totalQuestions > 0 ? (currentPage - 1) * 20 + 1 : 0;
    const endItem = totalQuestions > 0 ? Math.min(currentPage * 20, totalQuestions) : 0;

    return (
        <div className="coding-container">
            <CodingRoundHeader activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Always visible candidate statistics */}
            <section className="coding-stats-section" aria-label="Coding statistics">
                <CodingStats stats={stats} loading={loadingStats} />
            </section>

            {/* Tab 1: Practice Questions */}
            {activeTab === 'practice' && (
                <div className="coding-tab-pane">
                    <div className="coding-pane-header">
                        <div>
                            <div className="coding-pane-header__badge-row">
                                <h2 className="coding-pane-title">Company-Specific Coding Question Bank</h2>
                                <span className="coding-bank-total-pill">
                                    {totalQuestions} Questions · 10 Companies
                                </span>
                            </div>
                            <p className="coding-pane-subtitle">
                                Real reported and pattern-based placement coding questions from TCS, Deloitte, Accenture, LTIMindtree, HCL, Wipro, Google, Infosys, Zensar, and IBM.
                            </p>
                        </div>
                    </div>

                    <CodingFilterBar filters={filters} onFilterChange={handleFilterChange} />

                    {/* Filter count indicator */}
                    <div className="coding-results-bar">
                        <span className="coding-results-count">
                            Showing <strong>{startItem}–{endItem}</strong> of <strong>{totalQuestions}</strong> questions
                            {filters.company && <span className="coding-active-filter-tag"> · {filters.company}</span>}
                            {filters.difficulty && <span className="coding-active-filter-tag"> · {filters.difficulty}</span>}
                            {filters.topic && <span className="coding-active-filter-tag"> · {filters.topic}</span>}
                        </span>
                    </div>

                    {loadingQuestions ? (
                        <div className="coding-loading-state">
                            <div className="coding-spinner coding-spinner--large"></div>
                            <p>Loading company coding questions...</p>
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="coding-empty-questions">
                            <p>No questions matched your filter criteria.</p>
                            <button
                                type="button"
                                className="coding-btn coding-btn--secondary"
                                onClick={() => handleFilterChange({ company: '', difficulty: '', topic: '', search: '', language: '', page: 1 })}
                            >
                                Reset All Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="coding-questions-grid">
                                {questions.map(q => (
                                    <CodingQuestionCard
                                        key={q._id || q.questionId}
                                        question={q}
                                        isSolved={solvedQuestionIds.has(q._id)}
                                        isAttempted={attemptedQuestionIds.has(q._id)}
                                    />
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
                    )}
                </div>
            )}

            {/* Tab 2: Timed Assessments */}
            {activeTab === 'assessments' && (
                <div className="coding-tab-pane">
                    <div className="coding-pane-header">
                        <div>
                            <h2 className="coding-pane-title">Corporate Coding Assessments</h2>
                            <p className="coding-pane-subtitle">
                                Simulated timed technical screening tests configured according to actual campus placement patterns.
                            </p>
                        </div>
                    </div>

                    {/* Quick Create Assessment Banner */}
                    <div className="coding-create-assessment-box">
                        <div className="coding-create-assessment-box__desc">
                            <h4>Generate New Custom Assessment</h4>
                            <p>Configure role-tailored technical screening with randomized algorithmic problems.</p>
                        </div>
                        <form onSubmit={handleCreateNewAssessment} className="coding-assessment-quickform">
                            <input
                                type="text"
                                placeholder="Assessment Title"
                                value={assessmentForm.title}
                                onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })}
                                className="coding-input-sm"
                                required
                            />
                            <select
                                value={assessmentForm.targetRole}
                                onChange={(e) => setAssessmentForm({ ...assessmentForm, targetRole: e.target.value })}
                                className="coding-select-sm"
                            >
                                <option value="Full Stack Developer">Full Stack Developer</option>
                                <option value="Frontend Engineer">Frontend Engineer</option>
                                <option value="Backend Engineer">Backend Engineer</option>
                                <option value="Data Structures & Algorithms">DSA Core Placement</option>
                            </select>
                            <select
                                value={assessmentForm.duration}
                                onChange={(e) => setAssessmentForm({ ...assessmentForm, duration: Number(e.target.value) })}
                                className="coding-select-sm"
                            >
                                <option value={45}>45 Minutes (3 Questions)</option>
                                <option value={60}>60 Minutes (4 Questions)</option>
                                <option value={90}>90 Minutes (5 Questions)</option>
                            </select>
                            <button
                                type="submit"
                                className="coding-btn coding-btn--primary coding-btn--sm"
                                disabled={creatingAssessment}
                            >
                                {creatingAssessment ? 'Generating...' : '+ Create Assessment'}
                            </button>
                        </form>
                    </div>

                    <div className="coding-assessments-grid">
                        {assessments.length === 0 ? (
                            <div className="coding-empty-assessments">
                                <p>No assessments scheduled or created yet.</p>
                            </div>
                        ) : (
                            assessments.map(a => (
                                <AssessmentCard
                                    key={a._id}
                                    assessment={a}
                                    onStart={handleStartAssessmentClick}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Tab 3: Submissions History */}
            {activeTab === 'history' && (
                <div className="coding-tab-pane">
                    <div className="coding-pane-header">
                        <div>
                            <h2 className="coding-pane-title">Submission History</h2>
                            <p className="coding-pane-subtitle">
                                Chronological audit trail of all code evaluations, execution times, and pass rates.
                            </p>
                        </div>
                    </div>

                    {loadingSubmissions ? (
                        <div className="coding-loading-state">
                            <div className="coding-spinner coding-spinner--large"></div>
                            <p>Loading submission log...</p>
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="coding-empty-history">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 14 14" />
                            </svg>
                            <p>No coding submissions recorded yet.</p>
                            <button
                                type="button"
                                className="coding-btn coding-btn--primary"
                                onClick={() => setActiveTab('practice')}
                            >
                                Start Practicing Problems →
                            </button>
                        </div>
                    ) : (
                        <div className="coding-table-wrapper">
                            <table className="coding-submissions-table">
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Problem Title</th>
                                        <th>Difficulty</th>
                                        <th>Language</th>
                                        <th>Test Cases</th>
                                        <th>Runtime</th>
                                        <th>Submitted At</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map(sub => {
                                        const isAccepted = sub.status === 'Accepted';
                                        return (
                                            <tr key={sub._id}>
                                                <td>
                                                    <span className={`coding-result-badge coding-result-badge--${isAccepted ? 'accepted' : 'wrong'}`}>
                                                        {isAccepted ? '✓' : '✕'} {sub.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong>{sub.question?.title || 'Practice Problem'}</strong>
                                                </td>
                                                <td>
                                                    <span className={`coding-diff-badge coding-diff-badge--${(sub.question?.difficulty || 'easy').toLowerCase()}`}>
                                                        {sub.question?.difficulty || 'Easy'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <code className="coding-lang-badge">{sub.language}</code>
                                                </td>
                                                <td>
                                                    {sub.testCasesPassed} / {sub.testCasesTotal}
                                                </td>
                                                <td>
                                                    {sub.executionTimeMs ? `${sub.executionTimeMs} ms` : 'N/A'}
                                                </td>
                                                <td>
                                                    {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td>
                                                    {sub.question?._id && (
                                                        <Link
                                                            to={`/coding/practice/${sub.question._id}`}
                                                            className="coding-link-btn"
                                                        >
                                                            Open Problem
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Tab 4: Performance Analytics */}
            {activeTab === 'performance' && (
                <div className="coding-tab-pane">
                    <div className="coding-pane-header">
                        <div>
                            <h2 className="coding-pane-title">Coding Performance Analytics</h2>
                            <p className="coding-pane-subtitle">
                                Algorithmic accuracy, topic strengths, and verified evidence feeding your Skill Gap Matrix & Placement Readiness.
                            </p>
                        </div>
                    </div>
                    <CodingPerformance stats={stats} loading={loadingStats} />
                </div>
            )}
        </div>
    );
};

export default CodingRound;
