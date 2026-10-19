import { useState, useEffect, useCallback } from 'react';
import {
    getCodingQuestions,
    getCodingQuestionById,
    runSampleTests,
    submitCodingCode,
    getCodingSubmissions,
    getCodingStats,
    getCodingAssessments,
    getCodingAssessmentById,
    startCodingAssessment,
    submitCodingAssessment,
    createCodingAssessment
} from '../services/coding.api';

export const useCoding = () => {
    // Practice Questions List State
    const [questions, setQuestions] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
    const [filters, setFilters] = useState({ company: '', difficulty: '', topic: '', language: '', search: '', page: 1, limit: 20 });
    const [loadingQuestions, setLoadingQuestions] = useState(false);

    // Current Question / Practice State
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [codeCache, setCodeCache] = useState({}); // { [lang]: code }
    const [loadingQuestion, setLoadingQuestion] = useState(false);

    // Run / Submit State
    const [runningSample, setRunningSample] = useState(false);
    const [submittingCode, setSubmittingCode] = useState(false);
    const [sampleResult, setSampleResult] = useState(null);
    const [submissionResult, setSubmissionResult] = useState(null);

    // Stats State
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);

    // Submissions History State
    const [submissions, setSubmissions] = useState([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);

    // Assessment State
    const [assessments, setAssessments] = useState([]);
    const [currentAssessment, setCurrentAssessment] = useState(null);
    const [loadingAssessment, setLoadingAssessment] = useState(false);
    const [submittingAssessment, setSubmittingAssessment] = useState(false);
    const [assessmentResult, setAssessmentResult] = useState(null);

    const [error, setError] = useState(null);

    // Fetch Questions
    const fetchQuestions = useCallback(async (customFilters = {}) => {
        setLoadingQuestions(true);
        setError(null);
        try {
            const query = { ...filters, ...customFilters, limit: 20 };
            const res = await getCodingQuestions(query);
            const questionList = res.questions || res.data?.questions || [];
            const pageData = res.pagination || res.data?.pagination || {
                total: questionList.length,
                page: query.page || 1,
                limit: 20,
                totalPages: Math.ceil(questionList.length / 20) || 1
            };
            setQuestions(questionList);
            setPagination(pageData);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch coding questions');
        } finally {
            setLoadingQuestions(false);
        }
    }, [filters]);

    // Fetch Stats
    const fetchStats = useCallback(async () => {
        setLoadingStats(true);
        try {
            const res = await getCodingStats();
            setStats(res.data || null);
        } catch (err) {
            console.error('Error fetching coding stats:', err);
        } finally {
            setLoadingStats(false);
        }
    }, []);

    // Fetch Submissions
    const fetchSubmissions = useCallback(async (params = {}) => {
        setLoadingSubmissions(true);
        try {
            const res = await getCodingSubmissions(params);
            setSubmissions(res.submissions || []);
        } catch (err) {
            console.error('Error fetching submissions:', err);
        } finally {
            setLoadingSubmissions(false);
        }
    }, []);

    // Load a single question
    const loadQuestion = useCallback(async (id) => {
        setLoadingQuestion(true);
        setError(null);
        setSampleResult(null);
        setSubmissionResult(null);
        try {
            const res = await getCodingQuestionById(id);
            const q = res.data;
            setCurrentQuestion(q);
            const initialLang = q.supportedLanguages?.[0] || 'javascript';
            setSelectedLanguage(initialLang);
            const initialStarter = q.starterCode?.[initialLang] || '';
            setCode(initialStarter);
            setCodeCache({ [initialLang]: initialStarter });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load question details');
        } finally {
            setLoadingQuestion(false);
        }
    }, []);

    // Handle language switch
    const changeLanguage = useCallback((lang) => {
        if (!currentQuestion) return;
        // Save current code to cache
        setCodeCache(prev => ({
            ...prev,
            [selectedLanguage]: code
        }));

        setSelectedLanguage(lang);
        // Load cached code or starter code for the new language
        if (codeCache[lang] !== undefined) {
            setCode(codeCache[lang]);
        } else {
            const starter = currentQuestion.starterCode?.[lang] || '';
            setCode(starter);
        }
    }, [currentQuestion, selectedLanguage, code, codeCache]);

    // Reset code
    const resetCode = useCallback(() => {
        if (!currentQuestion) return;
        const starter = currentQuestion.starterCode?.[selectedLanguage] || '';
        setCode(starter);
        setCodeCache(prev => ({
            ...prev,
            [selectedLanguage]: starter
        }));
    }, [currentQuestion, selectedLanguage]);

    // Run Sample Tests
    const handleRunSample = useCallback(async () => {
        if (!currentQuestion) return;
        setRunningSample(true);
        setError(null);
        try {
            const res = await runSampleTests({
                questionId: currentQuestion._id,
                language: selectedLanguage,
                code
            });
            setSampleResult(res.result);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to run sample tests');
        } finally {
            setRunningSample(false);
        }
    }, [currentQuestion, selectedLanguage, code]);

    // Submit Code
    const handleSubmitCode = useCallback(async (assessmentId = null) => {
        if (!currentQuestion) return;
        setSubmittingCode(true);
        setError(null);
        try {
            const res = await submitCodingCode({
                questionId: currentQuestion._id,
                language: selectedLanguage,
                code,
                assessmentId
            });
            setSubmissionResult(res.submission);
            // Refresh stats in background
            fetchStats();
            return res.submission;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit solution');
            return null;
        } finally {
            setSubmittingCode(false);
        }
    }, [currentQuestion, selectedLanguage, code, fetchStats]);

    // Assessment Methods
    const fetchAssessmentsList = useCallback(async () => {
        try {
            const res = await getCodingAssessments();
            setAssessments(res.assessments || []);
        } catch (err) {
            console.error('Error fetching assessments:', err);
        }
    }, []);

    const loadAssessment = useCallback(async (id) => {
        setLoadingAssessment(true);
        setError(null);
        try {
            const res = await getCodingAssessmentById(id);
            setCurrentAssessment(res.data);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load assessment');
            return null;
        } finally {
            setLoadingAssessment(false);
        }
    }, []);

    const handleStartAssessment = useCallback(async (id) => {
        try {
            const res = await startCodingAssessment(id);
            setCurrentAssessment(res.assessment);
            return res.assessment;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to start assessment');
            return null;
        }
    }, []);

    const handleSubmitAssessment = useCallback(async (id, answers) => {
        setSubmittingAssessment(true);
        try {
            const res = await submitCodingAssessment(id, { answers });
            setAssessmentResult(res.result);
            setCurrentAssessment(res.result);
            fetchStats();
            return res.result;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit assessment');
            return null;
        } finally {
            setSubmittingAssessment(false);
        }
    }, [fetchStats]);

    const handleCreateAssessment = useCallback(async (payload) => {
        try {
            const res = await createCodingAssessment(payload);
            setAssessments(prev => [res.assessment, ...prev]);
            return res.assessment;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create assessment');
            return null;
        }
    }, []);

    return {
        // Practice Questions
        questions,
        pagination,
        filters,
        setFilters,
        loadingQuestions,
        fetchQuestions,

        // Current Question & Workspace
        currentQuestion,
        selectedLanguage,
        code,
        setCode,
        changeLanguage,
        resetCode,
        loadQuestion,
        loadingQuestion,

        // Test runner & submission
        runningSample,
        submittingCode,
        sampleResult,
        submissionResult,
        handleRunSample,
        handleSubmitCode,

        // Statistics & History
        stats,
        loadingStats,
        fetchStats,
        submissions,
        loadingSubmissions,
        fetchSubmissions,

        // Assessments
        assessments,
        currentAssessment,
        loadingAssessment,
        submittingAssessment,
        assessmentResult,
        fetchAssessmentsList,
        loadAssessment,
        handleStartAssessment,
        handleSubmitAssessment,
        handleCreateAssessment,

        // General Error
        error,
        setError
    };
};
