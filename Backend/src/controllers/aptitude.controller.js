const mongoose = require('mongoose');
const AptitudeQuestion = require('../models/aptitudeQuestion.model');
const AptitudeAttempt = require('../models/aptitudeAttempt.model');
const AptitudeAssessment = require('../models/aptitudeAssessment.model');
const aptitudeEvaluationService = require('../services/aptitudeEvaluation.service');
const { aptitudeSeedQuestions } = require('../config/seedAptitudeQuestions');
const { COMPANY_APTITUDE_QUESTIONS } = require('../data/companyAptitudeQuestions');

/**
 * GET /api/aptitude/questions
 */
async function getQuestionsController(req, res) {
    try {
        const { company, category, topic, difficulty, search, page = 1, limit = 20 } = req.query;
        const query = { active: true };

        if (company && company !== 'All' && company !== 'All Companies') {
            query.company = new RegExp(`^${company.trim()}$`, 'i');
        }

        if (category && category !== 'All' && category !== 'All Categories' && category !== 'All Domains') {
            query.category = new RegExp(`^${category.trim()}$`, 'i');
        }

        if (topic && topic.trim() && topic !== 'All' && topic !== 'All Topics') {
            query.topic = { $regex: topic.trim(), $options: 'i' };
        }

        if (difficulty && difficulty !== 'All' && difficulty !== 'All Difficulties' && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
            query.difficulty = difficulty;
        }

        if (search && search.trim()) {
            const cleanSearch = search.trim();
            query.$or = [
                { questionText: { $regex: cleanSearch, $options: 'i' } },
                { topic: { $regex: cleanSearch, $options: 'i' } },
                { company: { $regex: cleanSearch, $options: 'i' } },
                { category: { $regex: cleanSearch, $options: 'i' } }
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
                    AptitudeQuestion.find(query)
                        .select('-correctOptionIndex -explanation')
                        .sort({ createdAt: -1, category: 1, difficulty: 1 })
                        .skip(skip)
                        .limit(parsedLimit),
                    AptitudeQuestion.countDocuments(query)
                ]);
            } catch (dbErr) {
                console.warn('[Aptitude] DB query failed, falling back to master dataset:', dbErr.message);
                total = 0;
                questions = [];
            }
        }

        // If DB has 0 matching questions or DB is unseeded, fallback to in-memory master dataset
        if (total === 0) {
            let inMemory = [
                ...aptitudeSeedQuestions.map((q, idx) => ({
                    ...q,
                    _id: q._id || `orig-apt-${idx + 1}`,
                    questionId: q.questionId || `ORIGINAL-APT-${String(idx + 1).padStart(3, '0')}`,
                    questionType: 'APTITUDE',
                    verificationStatus: q.verificationStatus || 'ORIGINAL',
                    sourceType: q.sourceType || 'original',
                    reportedYear: q.reportedYear || null,
                    yearConfidence: q.yearConfidence || 'UNKNOWN',
                    questionText: q.questionText || q.question
                })),
                ...COMPANY_APTITUDE_QUESTIONS.map((q, idx) => ({
                    ...q,
                    _id: q._id || `comp-apt-${idx + 1}`,
                    questionText: q.questionText || q.question
                }))
            ];

            if (company && company !== 'All' && company !== 'All Companies') {
                inMemory = inMemory.filter(q => q.company && q.company.toLowerCase() === company.trim().toLowerCase());
            }
            if (category && category !== 'All' && category !== 'All Categories' && category !== 'All Domains') {
                inMemory = inMemory.filter(q => q.category && q.category.toLowerCase().includes(category.trim().toLowerCase()));
            }
            if (topic && topic.trim() && topic !== 'All' && topic !== 'All Topics') {
                inMemory = inMemory.filter(q => q.topic && q.topic.toLowerCase().includes(topic.trim().toLowerCase()));
            }
            if (difficulty && difficulty !== 'All' && difficulty !== 'All Difficulties') {
                inMemory = inMemory.filter(q => q.difficulty === difficulty);
            }
            if (search && search.trim()) {
                const s = search.trim().toLowerCase();
                inMemory = inMemory.filter(q =>
                    (q.questionText && q.questionText.toLowerCase().includes(s)) ||
                    (q.topic && q.topic.toLowerCase().includes(s)) ||
                    (q.company && q.company.toLowerCase().includes(s)) ||
                    (q.category && q.category.toLowerCase().includes(s))
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

        const userId = req.user._id || req.user.id;
        const questionIds = questions.map(q => q._id);
        const userAttempts = await AptitudeAttempt.find({
            user: userId,
            question: { $in: questionIds }
        });

        const attemptMap = new Map();
        userAttempts.forEach(att => {
            attemptMap.set(att.question.toString(), att);
        });

        const enriched = questions.map(q => {
            const obj = q.toObject();
            const att = attemptMap.get(q._id.toString());
            obj.isAttempted = Boolean(att);
            obj.isSolved = Boolean(att?.isCorrect);
            obj.userSelectedOptionIndex = att ? att.selectedOptionIndex : null;
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
            questions: enriched,
            pagination,
            data: {
                questions: enriched,
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
            message: 'Failed to retrieve aptitude questions.'
        });
    }
}

/**
 * GET /api/aptitude/questions/:id
 */
async function getQuestionByIdController(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid question ID.' });
        }

        const question = await AptitudeQuestion.findById(id);
        if (!question || !question.active) {
            return res.status(404).json({ success: false, message: 'Question not found.' });
        }

        const userAttempt = await AptitudeAttempt.findOne({ user: userId, question: id });
        const includeSolution = Boolean(userAttempt);
        const sanitized = aptitudeEvaluationService.sanitizeQuestion(question, includeSolution);

        return res.status(200).json({
            success: true,
            data: {
                question: sanitized,
                attempt: userAttempt || null
            }
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
 * POST /api/aptitude/questions/:id/answer
 */
async function answerQuestionController(req, res) {
    try {
        const { id } = req.params;
        const { selectedOptionIndex, timeSpentSeconds = 0 } = req.body;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid question ID.' });
        }

        const question = await AptitudeQuestion.findById(id);
        if (!question || !question.active) {
            return res.status(404).json({ success: false, message: 'Question not found.' });
        }

        const evalResult = aptitudeEvaluationService.evaluateAnswer(question, selectedOptionIndex);

        const attempt = await AptitudeAttempt.findOneAndUpdate(
            { user: userId, question: id },
            {
                user: userId,
                question: id,
                selectedOptionIndex: Number(selectedOptionIndex),
                isCorrect: evalResult.isCorrect,
                score: evalResult.score,
                timeSpentSeconds: Number(timeSpentSeconds) || 0
            },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            success: true,
            message: evalResult.isCorrect ? 'Correct answer!' : 'Incorrect answer.',
            data: {
                attempt,
                evaluation: evalResult
            }
        });
    } catch (err) {
        console.error('answerQuestionController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to evaluate answer.'
        });
    }
}

/**
 * GET /api/aptitude/attempts
 */
async function getAttemptsController(req, res) {
    try {
        const userId = req.user.id;
        const attempts = await AptitudeAttempt.find({ user: userId })
            .populate('question', 'questionText category topic difficulty marks negativeMarks')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: {
                attempts,
                total: attempts.length
            }
        });
    } catch (err) {
        console.error('getAttemptsController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch candidate attempts.'
        });
    }
}

/**
 * GET /api/aptitude/stats
 */
async function getAptitudeStatsController(req, res) {
    try {
        const userId = req.user.id;
        const stats = await aptitudeEvaluationService.getCandidateAptitudeStats(userId);

        return res.status(200).json({
            success: true,
            data: stats
        });
    } catch (err) {
        console.error('getAptitudeStatsController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve aptitude statistics.'
        });
    }
}

/**
 * POST /api/aptitude/assessments
 * Creates a timed corporate assessment
 */
async function createAssessmentController(req, res) {
    try {
        const userId = req.user.id;
        const {
            title = 'Campus Placement Screening Assessment',
            category = 'All Categories',
            durationMinutes = 15,
            questionCount = 10
        } = req.body;

        const filter = { active: true };
        if (category && category !== 'All Categories') {
            filter.category = category;
        }

        const count = Math.min(Math.max(Number(questionCount) || 10, 5), 25);
        let sampledQuestions = [];

        if (category === 'All Categories') {
            // Balanced sampling: Quant, Logical, Verbal
            const [quant, logic, verbal] = await Promise.all([
                AptitudeQuestion.aggregate([{ $match: { category: 'Quantitative Aptitude', active: true } }, { $sample: { size: Math.ceil(count / 3) } }]),
                AptitudeQuestion.aggregate([{ $match: { category: 'Logical Reasoning', active: true } }, { $sample: { size: Math.ceil(count / 3) } }]),
                AptitudeQuestion.aggregate([{ $match: { category: 'Verbal Ability', active: true } }, { $sample: { size: Math.ceil(count / 3) } }])
            ]);
            sampledQuestions = [...quant, ...logic, ...verbal].slice(0, count);
        } else {
            sampledQuestions = await AptitudeQuestion.aggregate([
                { $match: filter },
                { $sample: { size: count } }
            ]);
        }

        if (sampledQuestions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No questions available for the specified criteria.'
            });
        }

        const questionIds = sampledQuestions.map(q => q._id);

        const assessment = await AptitudeAssessment.create({
            user: userId,
            title,
            category,
            durationMinutes: Number(durationMinutes) || 15,
            totalQuestions: questionIds.length,
            questions: questionIds,
            status: 'Not Started',
            answers: []
        });

        return res.status(201).json({
            success: true,
            message: 'Timed assessment configured successfully.',
            data: { assessment }
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
 * GET /api/aptitude/assessments
 */
async function getAssessmentsController(req, res) {
    try {
        const userId = req.user.id;
        const assessments = await AptitudeAssessment.find({ user: userId })
            .select('-answers')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: { assessments }
        });
    } catch (err) {
        console.error('getAssessmentsController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch assessments.'
        });
    }
}

/**
 * GET /api/aptitude/assessments/:id
 */
async function getAssessmentByIdController(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid assessment ID.' });
        }

        const assessment = await AptitudeAssessment.findOne({ _id: id, user: userId })
            .populate('questions');

        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Assessment not found.' });
        }

        const isCompleted = assessment.status === 'Completed';
        const sanitizedQuestions = (assessment.questions || []).map(q =>
            aptitudeEvaluationService.sanitizeQuestion(q, isCompleted)
        );

        const assessmentObj = assessment.toObject();
        assessmentObj.questions = sanitizedQuestions;

        return res.status(200).json({
            success: true,
            data: { assessment: assessmentObj }
        });
    } catch (err) {
        console.error('getAssessmentByIdController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve assessment details.'
        });
    }
}

/**
 * POST /api/aptitude/assessments/:id/start
 */
async function startAssessmentController(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const assessment = await AptitudeAssessment.findOne({ _id: id, user: userId });
        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Assessment not found.' });
        }

        if (assessment.status === 'Completed') {
            return res.status(400).json({ success: false, message: 'Assessment has already been completed and finalized.' });
        }

        if (assessment.status === 'Not Started') {
            const now = new Date();
            assessment.status = 'In Progress';
            assessment.startedAt = now;
            assessment.expiresAt = new Date(now.getTime() + (assessment.durationMinutes * 60 * 1000));
            await assessment.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Assessment started.',
            data: { assessment }
        });
    } catch (err) {
        console.error('startAssessmentController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to start assessment.'
        });
    }
}

/**
 * POST /api/aptitude/assessments/:id/submit
 */
async function submitAssessmentController(req, res) {
    try {
        const { id } = req.params;
        const { answers = [] } = req.body;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid assessment ID.' });
        }

        const assessment = await AptitudeAssessment.findOne({ _id: id, user: userId });
        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Assessment not found or ownership mismatch.' });
        }

        if (assessment.status === 'Completed') {
            return res.status(400).json({ success: false, message: 'Assessment has already been submitted and cannot be modified.' });
        }

        // Server-side scoring and completion
        const evaluated = await aptitudeEvaluationService.evaluateAssessment(id, answers, userId);

        return res.status(200).json({
            success: true,
            message: 'Assessment evaluated and submitted successfully.',
            data: { assessment: evaluated }
        });
    } catch (err) {
        console.error('submitAssessmentController error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to submit assessment.'
        });
    }
}

module.exports = {
    getQuestionsController,
    getQuestionByIdController,
    answerQuestionController,
    getAttemptsController,
    getAptitudeStatsController,
    createAssessmentController,
    getAssessmentsController,
    getAssessmentByIdController,
    startAssessmentController,
    submitAssessmentController
};
