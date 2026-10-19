import { useState, useEffect, useCallback, useRef } from 'react';
import * as aptitudeApi from '../services/aptitude.api';

export const useAptitude = () => {
    const [questions, setQuestions] = useState([]);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filter states
    const [companyFilter, setCompanyFilter] = useState('All Companies');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Single question practice state
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentAttempt, setCurrentAttempt] = useState(null);
    const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

    // Timed Assessment states
    const [assessments, setAssessments] = useState([]);
    const [activeAssessment, setActiveAssessment] = useState(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [assessmentAnswers, setAssessmentAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);

    // Candidate stats
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);

    const timerRef = useRef(null);

    // ── Fetch Questions ───────────────────────────────────────────────────────
    const fetchQuestions = useCallback(async (overrides = {}) => {
        setLoading(true);
        setError(null);
        try {
            const pageNum = overrides.page !== undefined ? overrides.page : currentPage;
            const params = {
                page: pageNum,
                limit: 20
            };

            const comp = overrides.company !== undefined ? overrides.company : companyFilter;
            if (comp && comp !== 'All' && comp !== 'All Companies') params.company = comp;

            const cat = overrides.category !== undefined ? overrides.category : categoryFilter;
            if (cat && cat !== 'All' && cat !== 'All Categories') params.category = cat;

            const diff = overrides.difficulty !== undefined ? overrides.difficulty : difficultyFilter;
            if (diff && diff !== 'All' && diff !== 'All Difficulties') params.difficulty = diff;

            const search = overrides.search !== undefined ? overrides.search : searchTerm;
            if (search && search.trim()) params.search = search.trim();

            const res = await aptitudeApi.getAptitudeQuestions(params);
            const questionList = res.questions || res.data?.questions || [];
            const total = res.pagination?.total || res.data?.total || questionList.length;
            setQuestions(questionList);
            setTotalQuestions(total);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch aptitude questions.');
        } finally {
            setLoading(false);
        }
    }, [companyFilter, categoryFilter, difficultyFilter, searchTerm, currentPage]);

    // ── Fetch Single Question ─────────────────────────────────────────────────
    const fetchQuestion = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const res = await aptitudeApi.getAptitudeQuestionById(id);
            if (res.success) {
                setCurrentQuestion(res.data.question);
                setCurrentAttempt(res.data.attempt);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load question details.');
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Answer Single Practice Question ───────────────────────────────────────
    const answerQuestion = useCallback(async (questionId, selectedOptionIndex, timeSpentSeconds = 0) => {
        setIsSubmittingAnswer(true);
        try {
            const res = await aptitudeApi.submitAptitudeAnswer(questionId, {
                selectedOptionIndex,
                timeSpentSeconds
            });
            if (res.success) {
                setCurrentAttempt(res.data.attempt);
                if (currentQuestion && currentQuestion._id === questionId) {
                    setCurrentQuestion(prev => ({
                        ...prev,
                        correctOptionIndex: res.data.evaluation.correctOptionIndex,
                        explanation: res.data.evaluation.explanation
                    }));
                }
                // Refresh list item state locally
                setQuestions(prev => prev.map(q => {
                    if (q._id === questionId) {
                        return {
                            ...q,
                            isAttempted: true,
                            isSolved: res.data.evaluation.isCorrect,
                            userSelectedOptionIndex: selectedOptionIndex
                        };
                    }
                    return q;
                }));
                return res.data;
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to record answer.');
        } finally {
            setIsSubmittingAnswer(false);
        }
    }, [currentQuestion]);

    // ── Fetch Assessments ─────────────────────────────────────────────────────
    const fetchAssessments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await aptitudeApi.getAptitudeAssessments();
            if (res.success) {
                setAssessments(res.data.assessments || []);
            }
        } catch (err) {
            console.error('fetchAssessments error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Load Single Assessment ────────────────────────────────────────────────
    const loadAssessment = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const res = await aptitudeApi.getAptitudeAssessmentById(id);
            if (res.success) {
                const assess = res.data.assessment;
                setActiveAssessment(assess);

                // Initialize local answers
                const initAnswers = {};
                (assess.questions || []).forEach(q => {
                    initAnswers[q._id] = {
                        selectedOptionIndex: -1,
                        isMarkedForReview: false,
                        timeSpentSeconds: 0
                    };
                });

                if (assess.answers && assess.answers.length > 0) {
                    assess.answers.forEach(a => {
                        const qId = a.question?._id || a.question;
                        if (qId) {
                            initAnswers[qId] = {
                                selectedOptionIndex: a.selectedOptionIndex,
                                isMarkedForReview: a.isMarkedForReview,
                                timeSpentSeconds: a.timeSpentSeconds
                            };
                        }
                    });
                }
                setAssessmentAnswers(initAnswers);

                // Initialize countdown if in progress
                if (assess.status === 'In Progress' && assess.expiresAt) {
                    const remainingMs = new Date(assess.expiresAt).getTime() - Date.now();
                    setTimeRemaining(Math.max(0, Math.floor(remainingMs / 1000)));
                } else if (assess.status === 'Not Started') {
                    setTimeRemaining(assess.durationMinutes * 60);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load assessment.');
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Start Assessment ──────────────────────────────────────────────────────
    const startAssessment = useCallback(async (id) => {
        try {
            const res = await aptitudeApi.startAssessment(id);
            if (res.success) {
                setActiveAssessment(res.data.assessment);
                if (res.data.assessment.expiresAt) {
                    const remainingMs = new Date(res.data.assessment.expiresAt).getTime() - Date.now();
                    setTimeRemaining(Math.max(0, Math.floor(remainingMs / 1000)));
                }
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to start assessment.');
        }
    }, []);

    // ── Record Local Assessment Answer ────────────────────────────────────────
    const selectAssessmentOption = useCallback((questionId, optionIndex) => {
        setAssessmentAnswers(prev => ({
            ...prev,
            [questionId]: {
                ...(prev[questionId] || {}),
                selectedOptionIndex: optionIndex
            }
        }));
    }, []);

    const toggleMarkForReview = useCallback((questionId) => {
        setAssessmentAnswers(prev => ({
            ...prev,
            [questionId]: {
                ...(prev[questionId] || {}),
                isMarkedForReview: !prev[questionId]?.isMarkedForReview
            }
        }));
    }, []);

    // ── Submit Assessment ─────────────────────────────────────────────────────
    const submitAssessment = useCallback(async (assessmentId) => {
        if (!assessmentId && !activeAssessment) return;
        const id = assessmentId || activeAssessment._id;
        setIsSubmittingAssessment(true);
        try {
            const formattedAnswers = Object.entries(assessmentAnswers).map(([qId, ans]) => ({
                questionId: qId,
                selectedOptionIndex: ans.selectedOptionIndex,
                isMarkedForReview: ans.isMarkedForReview,
                timeSpentSeconds: ans.timeSpentSeconds || 0
            }));

            const res = await aptitudeApi.submitAptitudeAssessment(id, { answers: formattedAnswers });
            if (res.success) {
                setActiveAssessment(res.data.assessment);
                clearInterval(timerRef.current);
                return res.data.assessment;
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit assessment.');
        } finally {
            setIsSubmittingAssessment(false);
        }
    }, [activeAssessment, assessmentAnswers]);

    // Countdown Timer Effect
    useEffect(() => {
        if (activeAssessment && activeAssessment.status === 'In Progress' && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        // Auto-submit on expiry
                        submitAssessment(activeAssessment._id);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timerRef.current);
        }
    }, [activeAssessment, timeRemaining, submitAssessment]);

    // ── Fetch Candidate Stats ─────────────────────────────────────────────────
    const fetchStats = useCallback(async () => {
        setLoadingStats(true);
        try {
            const res = await aptitudeApi.getAptitudeStats();
            if (res.success) {
                setStats(res.data);
            }
        } catch (err) {
            console.error('fetchStats error:', err);
        } finally {
            setLoadingStats(false);
        }
    }, []);

    return {
        // Questions
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

        // Single Practice Question
        currentQuestion,
        currentAttempt,
        fetchQuestion,
        answerQuestion,
        isSubmittingAnswer,

        // Assessments
        assessments,
        fetchAssessments,
        activeAssessment,
        loadAssessment,
        startAssessment,
        currentQIndex,
        setCurrentQIndex,
        assessmentAnswers,
        selectAssessmentOption,
        toggleMarkForReview,
        submitAssessment,
        isSubmittingAssessment,
        timeRemaining,

        // Stats
        stats,
        loadingStats,
        fetchStats
    };
};
