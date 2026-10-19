const mongoose = require('mongoose');

const assessmentAnswerSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingQuestion',
        required: true
    },
    language: {
        type: String,
        default: 'javascript'
    },
    code: {
        type: String,
        default: ''
    },
    isSolved: {
        type: Boolean,
        default: false
    },
    score: {
        type: Number,
        default: 0
    },
    submission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingSubmission',
        default: null
    }
}, { _id: false });

const codingAssessmentSchema = new mongoose.Schema({
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
    targetRole: {
        type: String,
        default: 'Full Stack Developer'
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingQuestion'
    }],
    durationMinutes: {
        type: Number,
        default: 60
    },
    startedAt: {
        type: Date,
        default: null
    },
    submittedAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started',
        index: true
    },
    score: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    solvedQuestions: {
        type: Number,
        default: 0
    },
    difficultyBreakdown: {
        easy: { total: { type: Number, default: 0 }, solved: { type: Number, default: 0 } },
        medium: { total: { type: Number, default: 0 }, solved: { type: Number, default: 0 } },
        hard: { total: { type: Number, default: 0 }, solved: { type: Number, default: 0 } }
    },
    topicBreakdown: [{
        topic: { type: String, required: true },
        total: { type: Number, default: 0 },
        solved: { type: Number, default: 0 }
    }],
    answers: [assessmentAnswerSchema]
}, {
    timestamps: true
});

codingAssessmentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('CodingAssessment', codingAssessmentSchema);
