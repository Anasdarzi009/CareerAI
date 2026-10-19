const mongoose = require('mongoose');

const assessmentItemAnswerSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AptitudeQuestion',
        required: true
    },
    selectedOptionIndex: {
        type: Number,
        default: -1
    },
    isMarkedForReview: {
        type: Boolean,
        default: false
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    score: {
        type: Number,
        default: 0
    },
    timeSpentSeconds: {
        type: Number,
        default: 0
    }
}, { _id: false });

const categoryStatSchema = new mongoose.Schema({
    category: { type: String, required: true },
    total: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }
}, { _id: false });

const difficultyStatSchema = new mongoose.Schema({
    difficulty: { type: String, required: true },
    total: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }
}, { _id: false });

const aptitudeAssessmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        default: 'Comprehensive Aptitude Screening'
    },
    durationMinutes: {
        type: Number,
        default: 20
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AptitudeQuestion'
    }],
    answers: [assessmentItemAnswerSchema],
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed', 'Expired'],
        default: 'Not Started',
        index: true
    },
    startedAt: {
        type: Date,
        default: null
    },
    submittedAt: {
        type: Date,
        default: null
    },
    expiresAt: {
        type: Date,
        default: null
    },
    overallScore: {
        type: Number,
        default: 0
    },
    accuracy: {
        type: Number,
        default: 0
    },
    correctCount: {
        type: Number,
        default: 0
    },
    incorrectCount: {
        type: Number,
        default: 0
    },
    unattemptedCount: {
        type: Number,
        default: 0
    },
    timeUsedSeconds: {
        type: Number,
        default: 0
    },
    categoryBreakdown: [categoryStatSchema],
    difficultyBreakdown: [difficultyStatSchema],
    strongestAreas: [{
        type: String
    }],
    weakestAreas: [{
        type: String
    }],
    recommendedPractice: [{
        type: String
    }]
}, {
    timestamps: true
});

aptitudeAssessmentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('AptitudeAssessment', aptitudeAssessmentSchema);
