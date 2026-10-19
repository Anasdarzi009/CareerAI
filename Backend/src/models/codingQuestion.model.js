const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, default: '' }
}, { _id: false });

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    explanation: { type: String, default: '' }
}, { _id: false });

const starterCodeSchema = new mongoose.Schema({
    javascript: { type: String, default: '' },
    python: { type: String, default: '' },
    java: { type: String, default: '' },
    cpp: { type: String, default: '' }
}, { _id: false });

const codingQuestionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
        index: true
    },
    topics: [{
        type: String,
        trim: true,
        index: true
    }],
    supportedLanguages: [{
        type: String,
        enum: ['javascript', 'python', 'java', 'cpp'],
        default: ['javascript', 'python', 'java', 'cpp']
    }],
    functionSignature: {
        name: { type: String, required: true },
        params: [{
            name: { type: String, required: true },
            type: { type: String, default: 'any' }
        }],
        returnType: { type: String, default: 'any' }
    },
    starterCode: {
        type: starterCodeSchema,
        required: true
    },
    examples: [exampleSchema],
    constraints: [{
        type: String
    }],
    testCases: [testCaseSchema],
    hints: [{
        type: String
    }],
    timeLimitSeconds: {
        type: Number,
        default: 2
    },
    memoryLimitMb: {
        type: Number,
        default: 256
    },
    company: {
        type: String,
        trim: true,
        default: 'General',
        index: true
    },
    questionId: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        index: true
    },
    questionType: {
        type: String,
        default: 'CODING'
    },
    sourceType: {
        type: String,
        enum: [
            'official_company',
            'candidate_interview_experience',
            'placement_paper',
            'reputable_placement_resource',
            'pattern_based',
            'original'
        ],
        default: 'candidate_interview_experience'
    },
    sourceName: {
        type: String,
        trim: true,
        default: ''
    },
    sourceUrl: {
        type: String,
        trim: true,
        default: ''
    },
    reportedYear: {
        type: Number,
        default: null
    },
    reportedDate: {
        type: String,
        default: null
    },
    yearConfidence: {
        type: String,
        enum: ['VERIFIED', 'ESTIMATED', 'UNKNOWN'],
        default: 'UNKNOWN'
    },
    verificationStatus: {
        type: String,
        enum: ['REPORTED', 'PATTERN_BASED', 'ORIGINAL'],
        default: 'REPORTED',
        index: true
    },
    sourceNotes: {
        type: String,
        default: ''
    },
    explanation: {
        type: String,
        default: ''
    },
    isDemo: {
        type: Boolean,
        default: true
    },
    active: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true
});

// Indexes for performant filtering
codingQuestionSchema.index({ company: 1, active: 1 });
codingQuestionSchema.index({ company: 1, difficulty: 1, active: 1 });
codingQuestionSchema.index({ difficulty: 1, active: 1 });
codingQuestionSchema.index({ topics: 1, active: 1 });

module.exports = mongoose.model('CodingQuestion', codingQuestionSchema);
