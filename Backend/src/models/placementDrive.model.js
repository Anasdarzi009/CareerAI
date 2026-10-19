const mongoose = require('mongoose');

const driveRoundSchema = new mongoose.Schema({
    roundNumber: {
        type: Number,
        required: true
    },
    roundType: {
        type: String,
        enum: ['APTITUDE_CS', 'CODING_ASSESSMENT', 'TECHNICAL_HR_INTERVIEW'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    durationMinutes: {
        type: Number,
        default: 30
    },
    status: {
        type: String,
        enum: ['LOCKED', 'ACTIVE', 'SUBMITTED', 'EVALUATED'],
        default: 'LOCKED'
    },
    score: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    passed: {
        type: Boolean,
        default: false
    },
    startedAt: {
        type: Date,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    },
    // Round-specific data payload
    data: {
        // For APTITUDE_CS: questions array with options, candidate answers, and results
        questions: [{
            id: String,
            category: String, // Quantitative, Logical, CS_Core
            questionText: String,
            options: [String],
            selectedOptionIndex: { type: Number, default: -1 },
            correctOptionIndex: Number, // Sanitized on client retrieval
            isCorrect: Boolean,
            explanation: String
        }],
        // For CODING_ASSESSMENT: coding question ref, submitted code, language, test cases passed
        codingQuestion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CodingQuestion'
        },
        codingTitle: String,
        submittedCode: String,
        language: String,
        testCasesPassed: Number,
        testCasesTotal: Number,
        executionTimeMs: Number,
        // For TECHNICAL_HR_INTERVIEW: questions asked, answers given, feedback, star ratings
        interviewQuestions: [{
            questionText: String,
            category: String, // Technical, Architecture, Behavioral
            candidateAnswer: String,
            feedback: String,
            score: Number
        }]
    },
    feedback: {
        type: String,
        default: ''
    }
}, { _id: false });

const placementDriveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    templateId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    targetRole: {
        type: String,
        required: true,
        trim: true
    },
    tier: {
        type: String,
        enum: ['Product Tier-1', 'Service / IT Enterprise', 'High-Growth Tech'],
        default: 'Product Tier-1'
    },
    status: {
        type: String,
        enum: ['Scheduled', 'In Progress', 'Completed', 'Abandoned'],
        default: 'Scheduled',
        index: true
    },
    currentRoundIndex: {
        type: Number,
        default: 0
    },
    rounds: [driveRoundSchema],
    overallScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    hiringVerdict: {
        type: String,
        enum: ['PENDING', 'RECOMMENDED FOR HIRE', 'BORDERLINE / EXTENDED EVALUATION', 'NOT CLEARED'],
        default: 'PENDING'
    },
    verdictSummary: {
        type: String,
        default: ''
    },
    strengths: [{
        type: String
    }],
    criticalGaps: [{
        type: String
    }],
    startedAt: {
        type: Date,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

placementDriveSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
