const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Interview question text is required'],
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Technical', 'Behavioral', 'HR', 'System Design'],
        index: true
    },
    role: {
        type: String,
        required: true,
        default: 'General',
        index: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Entry', 'Mid', 'Senior'],
        default: 'Mid',
        index: true
    },
    expectedKeyPoints: [{
        type: String,
        required: true
    }],
    sampleAnswer: {
        type: String,
        default: ''
    },
    evaluationRubric: {
        coreConcepts: [{ type: String }],
        starMethodPreferred: { type: Boolean, default: false },
        keywords: [{ type: String }]
    },
    suggestedDurationSeconds: {
        type: Number,
        default: 90
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const InterviewQuestion = mongoose.model('InterviewQuestion', interviewQuestionSchema);
module.exports = InterviewQuestion;
