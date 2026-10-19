const mongoose = require('mongoose');

const dimensionSchema = new mongoose.Schema({
    score: { type: Number, required: true, min: 0, max: 100 },
    weight: { type: Number, required: true },
    status: {
        type: String,
        enum: ['EXCELLENT', 'GOOD', 'NEEDS_ATTENTION', 'CRITICAL', 'NOT_STARTED'],
        required: true
    },
    summary: { type: String, default: '' },
    metrics: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { _id: false });

const blockerSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    severity: {
        type: String,
        enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
        required: true
    },
    explanation: { type: String, required: true },
    recommendedAction: { type: String, required: true },
    ctaText: { type: String, default: 'Fix Now' },
    ctaPath: { type: String, required: true }
}, { _id: false });

const strengthSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    evidence: { type: String, required: true },
    category: { type: String, default: 'General' }
}, { _id: false });

const checklistItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    label: { type: String, required: true },
    isComplete: { type: Boolean, default: false },
    category: { type: String, default: 'General' },
    detail: { type: String, default: '' },
    ctaPath: { type: String, default: '/resume-profile' }
}, { _id: false });

const jobReadinessItemSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: '' },
    eligibilityStatus: {
        type: String,
        enum: ['ELIGIBLE', 'INELIGIBLE', 'UNVERIFIED'],
        required: true
    },
    statusMessage: { type: String, default: '' },
    matchScore: { type: Number, default: 0 },
    missingCriteria: [{ type: String }],
    missingSkills: [{ type: String }]
}, { _id: false });

const placementReadinessSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    overallReadiness: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 0
    },
    readinessLevel: {
        type: String,
        enum: ['Not Ready', 'Getting Ready', 'Placement Ready', 'Highly Ready'],
        default: 'Not Ready'
    },
    isAssessed: {
        type: Boolean,
        default: false
    },
    dimensions: {
        profile: dimensionSchema,
        resume: dimensionSchema,
        skills: dimensionSchema,
        projects: dimensionSchema,
        experience: dimensionSchema,
        interviews: dimensionSchema,
        eligibility: dimensionSchema,
        roadmap: dimensionSchema
    },
    eligibleJobsCount: { type: Number, default: 0 },
    ineligibleJobsCount: { type: Number, default: 0 },
    unverifiedJobsCount: { type: Number, default: 0 },
    blockers: [blockerSchema],
    strengths: [strengthSchema],
    checklist: [checklistItemSchema],
    jobReadiness: [jobReadinessItemSchema],
    nextActions: [{
        title: { type: String, required: true },
        impact: { type: String, enum: ['HIGH', 'MEDIUM', 'CRITICAL'], default: 'HIGH' },
        description: { type: String, default: '' },
        path: { type: String, required: true },
        ctaText: { type: String, default: 'Take Action' }
    }],
    lastCalculatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PlacementReadiness', placementReadinessSchema);
