const mongoose = require('mongoose');

const answeredQuestionSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InterviewQuestion'
    },
    questionText: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Technical', 'Behavioral', 'HR', 'System Design'],
        default: 'Technical'
    },
    expectedKeyPoints: [{
        type: String
    }],
    candidateAnswer: {
        type: String,
        default: ''
    },
    transcript: {
        type: String,
        default: ''
    },
    audioDurationSeconds: {
        type: Number,
        default: 0
    },
    voiceMetrics: {
        wpm: { type: Number, default: 0 },
        speechClarity: { type: Number, default: 0 },
        fluency: { type: Number, default: 0 },
        fillerCount: { type: Number, default: 0 },
        fillerRate: { type: Number, default: 0 },
        topFillers: [{ type: String }],
        pauseCount: { type: Number, default: 0 },
        longPauseCount: { type: Number, default: 0 },
        averagePauseSec: { type: Number, default: 0 }
    },
    contentMetrics: {
        technicalCorrectness: { type: Number, default: 0 },
        relevance: { type: Number, default: 0 },
        completeness: { type: Number, default: 0 },
        confidence: { type: Number, default: 0 },
        matchedConcepts: [{ type: String }],
        missingConcepts: [{ type: String }]
    },
    videoMetrics: {
        faceDetectedPercent: { type: Number, default: 0 },
        eyeContactPercent: { type: Number, default: 0 },
        headStabilityPercent: { type: Number, default: 0 },
        engagementScore: { type: Number, default: 0 },
        nervousnessIndicators: [{ type: String }]
    },
    questionScore: {
        type: Number,
        default: 0
    },
    feedback: {
        type: String,
        default: ''
    },
    isSkipped: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const interviewAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true
    },
    interviewType: {
        type: String,
        enum: ['Technical', 'Behavioral', 'HR', 'Mixed'],
        default: 'Technical'
    },
    role: {
        type: String,
        default: 'Full Stack Developer'
    },
    difficulty: {
        type: String,
        enum: ['Entry', 'Mid', 'Senior'],
        default: 'Mid'
    },
    status: {
        type: String,
        enum: ['In Progress', 'Completed', 'Abandoned', 'terminated_due_to_violation'],
        default: 'In Progress',
        index: true
    },
    terminationReason: {
        type: String,
        default: ''
    },
    tabSwitchCount: {
        type: Number,
        default: 0
    },
    focusLossCount: {
        type: Number,
        default: 0
    },
    monitoringEvents: [{
        type: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        questionIndex: {
            type: Number,
            default: 0
        },
        durationSeconds: {
            type: Number,
            default: 0
        },
        details: {
            type: String,
            default: ''
        }
    }],
    faceDetectionStats: {
        totalFrames: { type: Number, default: 0 },
        detectedFrames: { type: Number, default: 0 },
        multipleFaceFrames: { type: Number, default: 0 }
    },
    hasVideo: {
        type: Boolean,
        default: true
    },
    questions: [answeredQuestionSchema],
    currentQuestionIndex: {
        type: Number,
        default: 0
    },
    totalQuestions: {
        type: Number,
        default: 5
    },
    overallScore: {
        type: Number,
        default: 0
    },
    voiceScore: {
        type: Number,
        default: 0
    },
    contentScore: {
        type: Number,
        default: 0
    },
    videoScore: {
        type: Number,
        default: 0
    },
    voiceSummary: {
        averageWpm: { type: Number, default: 0 },
        totalFillers: { type: Number, default: 0 },
        totalPauses: { type: Number, default: 0 },
        fluencyRating: { type: String, default: 'Normal' }
    },
    contentSummary: {
        averageCorrectness: { type: Number, default: 0 },
        averageRelevance: { type: Number, default: 0 },
        averageCompleteness: { type: Number, default: 0 }
    },
    videoSummary: {
        averageEyeContact: { type: Number, default: 0 },
        averageHeadStability: { type: Number, default: 0 },
        averageEngagement: { type: Number, default: 0 }
    },
    strongestAreas: [{ type: String }],
    weakestAreas: [{ type: String }],
    recommendations: [{ type: String }],
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const InterviewAttempt = mongoose.model('InterviewAttempt', interviewAttemptSchema);
module.exports = InterviewAttempt;
