const mongoose = require('mongoose');
const CodingQuestion = require('../models/codingQuestion.model');
const CodingSubmission = require('../models/codingSubmission.model');
const CodingAssessment = require('../models/codingAssessment.model');
const codingEvaluationService = require('../services/codingEvaluation.service');
const { CODING_QUESTIONS } = require('../config/seedCodingQuestions');
const { COMPANY_CODING_QUESTIONS } = require('../data/companyCodingQuestions');

/**
 * Strips hidden test cases from question object before returning to client
 */
function sanitizeQuestionForClient(questionDoc) {
    const q = questionDoc.toObject ? questionDoc.toObject() : { ...questionDoc };
    if (q.testCases) {
        q.testCases = q.testCases.filter(tc => !tc.isHidden);
    }
    return q;
}

/**
 * GET /api/coding/questions
 * Filter questions by difficulty, topic, search query
 */
async function getQuestionsController(req, res) {
    try {
        const { company, difficulty, topic, language, search, page = 1, limit = 20 } = req.query;
        const query = { active: true };

        if (company && company !== 'All' && company !== 'All Companies') {
            query.company = new RegExp(`^${company.trim()}$`, 'i');
        }

        if (difficulty && difficulty !== 'All' && difficulty !== 'All Difficulties' && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
            query.difficulty = difficulty;
        }

        if (topic && topic !== 'All' && topic !== 'All Topics') {
            query.topics = { $in: [new RegExp(topic.trim(), 'i')] };
        }

        if (language && language !== 'All' && language !== 'All Languages') {
            query.supportedLanguages = language.toLowerCase();
        }

        if (search && search.trim()) {
            const cleanSearch = search.trim();
            query.$or = [
                { title: { $regex: cleanSearch, $options: 'i' } },
                { description: { $regex: cleanSearch, $options: 'i' } },
                { company: { $regex: cleanSearch, $options: 'i' } },
                { topics: { $in: [new RegExp(cleanSearch, 'i')] } }
            ];
        }

        const parsedPage = Math.max(1, Number(page) || 1);
        const parsedLimit = Math.max(1, Math.min(100, Number(limit) || 20));
        const skip = (parsedPage - 1) * parsedLimit;

        let questions = [];
        let total = 0;

        if (mongoose.connection.readyState === 1) {
            try {
                [questions, total] = await Promise.all([
                    CodingQuestion.find(query)
                        .select('-testCases')
                        .sort({ createdAt: -1, difficulty: 1 })
                        .skip(skip)
                        .limit(parsedLimit),
                    CodingQuestion.countDocuments(query)
                ]);
            } catch (dbErr) {
                console.warn('[Coding] DB query failed, falling back to master dataset:', dbErr.message);
                total = 0;
                questions = [];
            }
        }

        // If DB has 0 matching questions or DB is unseeded, fallback to the in-memory master dataset
        if (total === 0) {
            let inMemory = [
                ...CODING_QUESTIONS.map((q, idx) => ({
                    ...q,
                    _id: q._id || `orig-coding-${idx + 1}`,
                    questionId: q.questionId || `ORIGINAL-CODING-${String(idx + 1).padStart(3, '0')}`,
                    questionType: 'CODING',
                    verificationStatus: q.verificationStatus || 'ORIGINAL',
                    sourceType: q.sourceType || 'original',
                    reportedYear: q.reportedYear || null,
                    yearConfidence: q.yearConfidence || 'UNKNOWN'
                })),
                ...COMPANY_CODING_QUESTIONS.map((q, idx) => ({
                    ...q,
                    _id: q._id || `comp-coding-${idx + 1}`
                }))
            ];

            if (company && company !== 'All' && company !== 'All Companies') {
                inMemory = inMemory.filter(q => q.company && q.company.toLowerCase() === company.trim().toLowerCase());
            }
            if (difficulty && difficulty !== 'All' && difficulty !== 'All Difficulties') {
                inMemory = inMemory.filter(q => q.difficulty === difficulty);
            }
            if (topic && topic !== 'All' && topic !== 'All Topics') {
                inMemory = inMemory.filter(q => (q.topics && q.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))) || (q.category && q.category.toLowerCase().includes(topic.toLowerCase())));
            }
            if (language && language !== 'All' && language !== 'All Languages') {
                inMemory = inMemory.filter(q => q.supportedLanguages && q.supportedLanguages.includes(language.toLowerCase()));
            }
            if (search && search.trim()) {
                const s = search.trim().toLowerCase();
                inMemory = inMemory.filter(q =>
                    (q.title && q.title.toLowerCase().includes(s)) ||
                    (q.description && q.description.toLowerCase().includes(s)) ||
                    (q.company && q.company.toLowerCase().includes(s)) ||
                    (q.topics && q.topics.some(t => t.toLowerCase().includes(s)))
                );
            }

            const memTotal = inMemory.length;
            const memTotalPages = Math.ceil(memTotal / parsedLimit) || 1;
            const memPageItems = inMemory.slice(skip, skip + parsedLimit);

            const memPagination = {
                page: parsedPage,
                limit: parsedLimit,
                total: memTotal,
                totalPages: memTotalPages,
                hasNext: parsedPage < memTotalPages,
                hasPrevious: parsedPage > 1
            };

            return res.status(200).json({
                success: true,
                total: memTotal,
                page: parsedPage,
                totalPages: memTotalPages,
                questions: memPageItems,
                pagination: memPagination,
                data: {
                    questions: memPageItems,
                    pagination: memPagination,
                    total: memTotal,
                    page: parsedPage,
                    totalPages: memTotalPages
                }
            });
        }

        // Get user solved and attempted status for each question
        const userId = req.user._id || req.user.id;
        const [acceptedSubmissions, allSubmissions] = await Promise.all([
            CodingSubmission.find({
                user: userId,
                status: 'Accepted'
            }).distinct('question'),
            CodingSubmission.find({
                user: userId
            }).distinct('question')
        ]);

        const acceptedSet = new Set(acceptedSubmissions.map(id => id.toString()));
        const attemptedSet = new Set(allSubmissions.map(id => id.toString()));

        const enrichedQuestions = questions.map(q => {
            const obj = q.toObject();
            obj.isSolved = acceptedSet.has(q._id.toString());
            obj.isAttempted = attemptedSet.has(q._id.toString());
            return obj;
        });

        const totalPages = Math.ceil(total / parsedLimit) || 1;
        const pagination = {
            page: parsedPage,
            limit: parsedLimit,
            total,
            totalPages,
            hasNext: parsedPage < totalPages,
            hasPrevious: parsedPage > 1
        };

        return res.status(200).json({
            success: true,
            questions: enrichedQuestions,
            pagination,
            data: {
                questions: enrichedQuestions,
                pagination,
                total,
                page: parsedPage,
                totalPages
            }
        });
    } catch (err) {
        console.error('getQuestionsController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve coding questions.'
        });
    }
}

/**
 * GET /api/coding/questions/:id
 * Retrieve question details without exposing hidden test cases
 */
async function getQuestionByIdController(req, res) {
    try {
        const { id } = req.params;

        let question;
        if (mongoose.Types.ObjectId.isValid(id)) {
            question = await CodingQuestion.findById(id);
        } else {
            question = await CodingQuestion.findOne({ slug: id });
        }

        if (!question || !question.active) {
            return res.status(404).json({
                success: false,
                message: 'Coding question not found.'
            });
        }

        const userId = req.user._id;
        const previousAccepted = await CodingSubmission.findOne({
            user: userId,
            question: question._id,
            status: 'Accepted'
        });

        const sanitized = sanitizeQuestionForClient(question);
        sanitized.isSolved = Boolean(previousAccepted);

        return res.status(200).json({
            success: true,
            data: sanitized
        });
    } catch (err) {
        console.error('getQuestionByIdController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve question details.'
        });
    }
}

/**
 * POST /api/coding/run-sample
 * Run user code against public sample test cases without persisting submission
 */
async function runSampleCodeController(req, res) {
    try {
        const { questionId, language, code } = req.body;

        if (!questionId || !code || !language) {
            return res.status(400).json({
                success: false,
                message: 'questionId, language, and code are required.'
            });
        }

        const question = await CodingQuestion.findById(questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found.'
            });
        }

        const evalResult = await codingEvaluationService.runSampleTests({
            code,
            language: language.toLowerCase(),
            question
        });

        return res.status(200).json({
            success: true,
            message: 'Sample test execution complete.',
            data: evalResult
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Failed to execute sample test cases.'
        });
    }
}

/**
 * POST /api/coding/submit
 * Evaluate code against complete test suite and record submission
 */
async function submitCodeController(req, res) {
    try {
        const userId = req.user._id;
        const { questionId, language, code, assessmentId } = req.body;

        if (!questionId || !code || !language) {
            return res.status(400).json({
                success: false,
                message: 'questionId, language, and code are required.'
            });
        }

        const question = await CodingQuestion.findById(questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found.'
            });
        }

        // Run server-side evaluation
        const evalResult = await codingEvaluationService.evaluateSubmission({
            code,
            language: language.toLowerCase(),
            question
        });

        // Filter sample test results for client response (hidden test details remain hidden)
        const visibleTestResults = evalResult.testResults.map(r => {
            if (r.isHidden) {
                return {
                    testCaseIndex: r.testCaseIndex,
                    passed: r.passed,
                    input: '[Hidden Test Case]',
                    expectedOutput: '[Hidden]',
                    actualOutput: r.passed ? '[Matched]' : '[Mismatch]',
                    error: r.error ? 'Runtime Error' : null,
                    executionTimeMs: r.executionTimeMs,
                    isHidden: true
                };
            }
            return r;
        });

        // Save submission record in database
        const submission = await CodingSubmission.create({
            user: userId,
            question: question._id,
            language: language.toLowerCase(),
            submittedCode: code,
            status: evalResult.status,
            testCasesPassed: evalResult.passed,
            testCasesTotal: evalResult.total,
            score: evalResult.score,
            executionTimeMs: evalResult.executionTimeMs,
            memoryUsedMb: evalResult.memoryUsedMb,
            errorOutput: evalResult.error,
            sampleTestResults: visibleTestResults,
            assessment: assessmentId || null
        });

        // If part of an assessment, update the assessment answer
        if (assessmentId && mongoose.Types.ObjectId.isValid(assessmentId)) {
            const assessment = await CodingAssessment.findOne({ _id: assessmentId, user: userId });
            if (assessment && assessment.status === 'In Progress') {
                const answer = assessment.answers.find(a => a.question.toString() === question._id.toString());
                if (answer) {
                    answer.code = code;
                    answer.language = language;
                    answer.submission = submission._id;
                    if (evalResult.status === 'Accepted') {
                        answer.isSolved = true;
                        answer.score = 100;
                    } else {
                        answer.score = Math.max(answer.score, evalResult.score);
                    }
                }
                await assessment.save();
            }
        }

        return res.status(200).json({
            success: true,
            message: `Evaluation completed: ${evalResult.status}`,
            data: {
                submissionId: submission._id,
                status: evalResult.status,
                score: evalResult.score,
                passed: evalResult.passed,
                total: evalResult.total,
                executionTimeMs: evalResult.executionTimeMs,
                testResults: visibleTestResults,
                error: evalResult.error,
                executionMode: evalResult.executionMode
            }
        });
    } catch (err) {
        console.error('submitCodeController error:', err);
        return res.status(400).json({
            success: false,
            message: err.message || 'Failed to submit code.'
        });
    }
}

/**
 * GET /api/coding/submissions
 * Get user submission history
 */
async function getSubmissionsController(req, res) {
    try {
        const userId = req.user._id;
        const { questionId, page = 1, limit = 20 } = req.query;

        const query = { user: userId };
        if (questionId) {
            query.question = questionId;
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [submissions, total] = await Promise.all([
            CodingSubmission.find(query)
                .populate('question', 'title difficulty topics slug')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            CodingSubmission.countDocuments(query)
        ]);

        return res.status(200).json({
            success: true,
            data: {
                submissions,
                total,
                page: Number(page),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (err) {
        console.error('getSubmissionsController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve submission history.'
        });
    }
}

/**
 * GET /api/coding/submissions/:id
 * Retrieve specific submission with ownership enforcement
 */
async function getSubmissionByIdController(req, res) {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const submission = await CodingSubmission.findById(id).populate('question', 'title difficulty topics slug functionSignature');
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found.'
            });
        }

        if (!submission.user.equals(userId)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You can only inspect your own submissions.'
            });
        }

        return res.status(200).json({
            success: true,
            data: submission
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve submission details.'
        });
    }
}

/**
 * GET /api/coding/stats
 * Aggregate real coding performance metrics for candidate
 */
async function getStatsController(req, res) {
    try {
        const userId = req.user._id;

        const submissions = await CodingSubmission.find({ user: userId })
            .populate('question', 'difficulty topics')
            .sort({ createdAt: -1 });

        const totalSubmissions = submissions.length;

        if (totalSubmissions === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    isAssessed: false,
                    attemptedCount: 0,
                    solvedCount: 0,
                    accuracy: 0,
                    averageScore: 0,
                    easySolved: 0,
                    mediumSolved: 0,
                    hardSolved: 0,
                    topicBreakdown: [],
                    recentSubmissions: []
                }
            });
        }

        // Unique questions attempted & solved
        const attemptedQuestionIds = new Set();
        const solvedQuestionIds = new Set();
        let acceptedSubmissionsCount = 0;
        let totalScoreSum = 0;

        const difficultySolved = { Easy: new Set(), Medium: new Set(), Hard: new Set() };
        const topicStats = new Map(); // topic -> { attempted: Set, solved: Set }

        submissions.forEach(sub => {
            const q = sub.question;
            if (!q) return;

            const qIdStr = q._id.toString();
            attemptedQuestionIds.add(qIdStr);
            totalScoreSum += sub.score;

            if (sub.status === 'Accepted') {
                acceptedSubmissionsCount++;
                solvedQuestionIds.add(qIdStr);

                if (difficultySolved[q.difficulty]) {
                    difficultySolved[q.difficulty].add(qIdStr);
                }
            }

            (q.topics || []).forEach(topic => {
                if (!topicStats.has(topic)) {
                    topicStats.set(topic, { attempted: new Set(), solved: new Set() });
                }
                const entry = topicStats.get(topic);
                entry.attempted.add(qIdStr);
                if (sub.status === 'Accepted') {
                    entry.solved.add(qIdStr);
                }
            });
        });

        const topicBreakdown = Array.from(topicStats.entries()).map(([topic, counts]) => ({
            topic,
            attempted: counts.attempted.size,
            solved: counts.solved.size,
            accuracy: counts.attempted.size > 0 ? Math.round((counts.solved.size / counts.attempted.size) * 100) : 0
        })).sort((a, b) => b.solved - a.solved);

        const accuracy = Math.round((acceptedSubmissionsCount / totalSubmissions) * 100);
        const averageScore = Math.round(totalScoreSum / totalSubmissions);

        return res.status(200).json({
            success: true,
            data: {
                isAssessed: true,
                totalSubmissions,
                attemptedCount: attemptedQuestionIds.size,
                solvedCount: solvedQuestionIds.size,
                accuracy,
                averageScore,
                easySolved: difficultySolved.Easy.size,
                mediumSolved: difficultySolved.Medium.size,
                hardSolved: difficultySolved.Hard.size,
                topicBreakdown,
                recentSubmissions: submissions.slice(0, 5)
            }
        });
    } catch (err) {
        console.error('getStatsController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve coding statistics.'
        });
    }
}

/**
 * POST /api/coding/assessments
 * Create a timed coding assessment from question bank
 */
async function createAssessmentController(req, res) {
    try {
        const userId = req.user._id;
        const { targetRole = 'Full Stack Developer', difficulty, numberOfQuestions = 3, durationMinutes = 60 } = req.body;

        const query = { active: true };
        if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
            query.difficulty = difficulty;
        }

        const selectedQuestions = await CodingQuestion.aggregate([
            { $match: query },
            { $sample: { size: Math.min(Number(numberOfQuestions), 5) } }
        ]);

        if (selectedQuestions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient questions found to generate assessment.'
            });
        }

        const answers = selectedQuestions.map(q => ({
            question: q._id,
            language: 'javascript',
            code: q.starterCode?.javascript || '',
            isSolved: false,
            score: 0,
            submission: null
        }));

        const assessment = await CodingAssessment.create({
            user: userId,
            title: `${targetRole} Technical Coding Assessment`,
            targetRole,
            questions: selectedQuestions.map(q => q._id),
            durationMinutes: Number(durationMinutes),
            status: 'Not Started',
            totalQuestions: selectedQuestions.length,
            solvedQuestions: 0,
            answers
        });

        return res.status(201).json({
            success: true,
            message: 'Assessment created successfully.',
            data: assessment
        });
    } catch (err) {
        console.error('createAssessmentController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to create assessment.'
        });
    }
}

/**
 * GET /api/coding/assessments
 * List user assessments
 */
async function getAssessmentsController(req, res) {
    try {
        const userId = req.user._id;
        const assessments = await CodingAssessment.find({ user: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: assessments
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve assessments.'
        });
    }
}

/**
 * GET /api/coding/assessments/:id
 * Retrieve specific assessment details
 */
async function getAssessmentByIdController(req, res) {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const assessment = await CodingAssessment.findById(id).populate({
            path: 'questions',
            select: '-testCases' // hidden test cases stripped
        });

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: 'Assessment not found.'
            });
        }

        if (!assessment.user.equals(userId)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied.'
            });
        }

        return res.status(200).json({
            success: true,
            data: assessment
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve assessment details.'
        });
    }
}

/**
 * POST /api/coding/assessments/:id/start
 * Start assessment timer
 */
async function startAssessmentController(req, res) {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const assessment = await CodingAssessment.findOne({ _id: id, user: userId });
        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: 'Assessment not found.'
            });
        }

        if (assessment.status === 'Completed') {
            return res.status(400).json({
                success: false,
                message: 'Assessment has already been completed.'
            });
        }

        if (assessment.status === 'Not Started') {
            assessment.status = 'In Progress';
            assessment.startedAt = new Date();
            await assessment.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Assessment started.',
            data: assessment
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to start assessment.'
        });
    }
}

/**
 * POST /api/coding/assessments/:id/submit
 * Finalize assessment and compute scores
 */
async function submitAssessmentController(req, res) {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const assessment = await CodingAssessment.findOne({ _id: id, user: userId }).populate('questions');
        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: 'Assessment not found.'
            });
        }

        if (assessment.status === 'Completed') {
            return res.status(200).json({
                success: true,
                message: 'Assessment already completed.',
                data: assessment
            });
        }

        assessment.status = 'Completed';
        assessment.submittedAt = new Date();

        // Calculate scores
        const solvedCount = assessment.answers.filter(a => a.isSolved).length;
        const totalQuestions = assessment.questions.length;
        assessment.solvedQuestions = solvedCount;

        const totalScore = totalQuestions > 0
            ? Math.round(assessment.answers.reduce((acc, a) => acc + (a.isSolved ? 100 : (a.score || 0)), 0) / totalQuestions)
            : 0;
        assessment.score = totalScore;

        // Difficulty breakdown
        const diff = {
            easy: { total: 0, solved: 0 },
            medium: { total: 0, solved: 0 },
            hard: { total: 0, solved: 0 }
        };

        assessment.questions.forEach((q, idx) => {
            const ans = assessment.answers[idx];
            const dKey = (q.difficulty || 'Easy').toLowerCase();
            if (diff[dKey]) {
                diff[dKey].total++;
                if (ans && ans.isSolved) diff[dKey].solved++;
            }
        });
        assessment.difficultyBreakdown = diff;

        await assessment.save();

        return res.status(200).json({
            success: true,
            message: 'Assessment evaluated and submitted successfully.',
            data: assessment
        });
    } catch (err) {
        console.error('submitAssessmentController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to submit assessment.'
        });
    }
}

module.exports = {
    getQuestionsController,
    getQuestionByIdController,
    runSampleCodeController,
    submitCodeController,
    getSubmissionsController,
    getSubmissionByIdController,
    getStatsController,
    createAssessmentController,
    getAssessmentsController,
    getAssessmentByIdController,
    startAssessmentController,
    submitAssessmentController
};
