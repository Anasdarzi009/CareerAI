const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
    testCaseIndex: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    input: { type: String, default: '' },
    expectedOutput: { type: String, default: '' },
    actualOutput: { type: String, default: '' },
    error: { type: String, default: null },
    executionTimeMs: { type: Number, default: 0 },
    isHidden: { type: Boolean, default: false }
}, { _id: false });

const codingSubmissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingQuestion',
        required: true,
        index: true
    },
    language: {
        type: String,
        enum: ['javascript', 'python', 'java', 'cpp'],
        required: true
    },
    submittedCode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            'Accepted',
            'Wrong Answer',
            'Runtime Error',
            'Compilation Error',
            'Time Limit Exceeded',
            'Pending'
        ],
        required: true,
        index: true
    },
    testCasesPassed: {
        type: Number,
        default: 0
    },
    testCasesTotal: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    executionTimeMs: {
        type: Number,
        default: 0
    },
    memoryUsedMb: {
        type: Number,
        default: 0
    },
    errorOutput: {
        type: String,
        default: null
    },
    sampleTestResults: [testResultSchema],
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingAssessment',
        default: null
    }
}, {
    timestamps: true
});

codingSubmissionSchema.index({ user: 1, question: 1, createdAt: -1 });
codingSubmissionSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('CodingSubmission', codingSubmissionSchema);
