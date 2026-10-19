const mongoose = require('mongoose');

const aptitudeQuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    topic: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
        index: true
    },
    options: [{
        type: String,
        required: true,
        trim: true
    }],
    correctOptionIndex: {
        type: Number,
        required: true,
        min: 0,
        max: 3
    },
    explanation: {
        type: String,
        required: true,
        trim: true
    },
    marks: {
        type: Number,
        default: 1
    },
    negativeMarks: {
        type: Number,
        default: 0.25
    },
    timeAllocationSeconds: {
        type: Number,
        default: 60
    },
    company: {
        type: String,
        trim: true,
        default: 'General',
        index: true
    },
    companyRelevance: [{
        type: String,
        trim: true
    }],
    questionId: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        index: true
    },
    questionType: {
        type: String,
        default: 'APTITUDE'
    },
    sourceType: {
        type: String,
        enum: [
            'official_company',
            'candidate_interview_experience',
            'reported_interview_experience',
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
    active: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true
});

// Performance indexing
aptitudeQuestionSchema.index({ company: 1, active: 1 });
aptitudeQuestionSchema.index({ company: 1, category: 1, difficulty: 1, active: 1 });
aptitudeQuestionSchema.index({ category: 1, difficulty: 1, active: 1 });
aptitudeQuestionSchema.index({ topic: 1, active: 1 });

module.exports = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);
