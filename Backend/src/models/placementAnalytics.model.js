const mongoose = require('mongoose');

const gateScoreSchema = new mongoose.Schema({
    gateName: {
        type: String,
        required: true,
        enum: ['ACADEMIC_CRITERIA', 'CODING_RIGOR', 'DOMAIN_SKILLS', 'INTERVIEW_DEPTH', 'DRIVE_VALIDATION']
    },
    displayName: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    status: {
        type: String,
        enum: ['CLEARED', 'COMPETITIVE', 'RISK', 'BLOCKED'],
        required: true
    },
    evidence: {
        type: String,
        default: ''
    },
    bottleneckReason: {
        type: String,
        default: null
    }
}, { _id: false });

const tierProbabilitySchema = new mongoose.Schema({
    tierKey: {
        type: String,
        required: true,
        enum: ['TIER_1_PRODUCT', 'TIER_1_STARTUP', 'TIER_2_DIGITAL', 'TIER_3_SERVICES']
    },
    tierName: {
        type: String,
        required: true
    },
    targetCompanies: [{
        type: String
    }],
    ctcRange: {
        type: String,
        required: true
    },
    probabilityPercentage: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    status: {
        type: String,
        enum: ['HIGH', 'MODERATE', 'LOW', 'UNLIKELY'],
        required: true
    },
    primaryBlocker: {
        type: String,
        default: null
    },
    keyStrengths: [{
        type: String
    }]
}, { _id: false });

const placementAnalyticsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    predictedCtc: {
        minLpa: { type: Number, default: 0 },
        maxLpa: { type: Number, default: 0 },
        medianLpa: { type: Number, default: 0 },
        formattedRange: { type: String, default: '₹0 - ₹0 LPA' }
    },
    overallMarketReadinessScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    topTierFit: {
        type: String,
        default: 'TIER_3_SERVICES'
    },
    tierProbabilities: [tierProbabilitySchema],
    recruitmentGates: [gateScoreSchema],
    verificationDossier: {
        verificationToken: { type: String, default: null },
        issuedAt: { type: Date, default: null },
        isVerified: { type: Boolean, default: false },
        certificateUrl: { type: String, default: null }
    },
    calculatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PlacementAnalytics', placementAnalyticsSchema);
