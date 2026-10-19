const mongoose = require('mongoose');

const actionItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    actionType: {
        type: String,
        enum: ['LEARN', 'PROJECT', 'PROFILE', 'PRACTICE', 'APPLICATION', 'VERIFICATION'],
        default: 'LEARN'
    },
    linkedSkill: { type: String, default: null },
    resourceLink: { type: String, default: null }
}, { _id: false });

const stageProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    targetedSkills: [{ type: String }],
    deliverables: [{ type: String }],
    estimatedEffort: { type: String, default: '1-2 weeks' },
    isCompleted: { type: Boolean, default: false }
}, { _id: false });

const roadmapStageSchema = new mongoose.Schema({
    stageNumber: { type: Number, required: true },
    stageKey: {
        type: String,
        enum: ['FOUNDATION', 'CORE_SKILLS', 'ADVANCED_SKILLS', 'PROJECT_PORTFOLIO', 'INTERVIEW_PREP', 'PLACEMENT_READINESS'],
        required: true
    },
    title: { type: String, required: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    status: {
        type: String,
        enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'LOCKED'],
        default: 'NOT_STARTED'
    },
    priority: {
        type: String,
        enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'NORMAL'],
        default: 'HIGH'
    },
    estimatedDuration: { type: String, default: '2-4 weeks' },
    completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
    objectives: [{ type: String }],
    keySkills: [{ type: String }],
    actions: [actionItemSchema],
    projects: [stageProjectSchema],
    expectedOutcome: { type: String, default: '' }
}, { _id: false });

const currentPositionSchema = new mongoose.Schema({
    profileComplete: { type: Boolean, default: false },
    resumeUploaded: { type: Boolean, default: false },
    totalSkillsCount: { type: Number, default: 0 },
    skillCoverage: { type: Number, default: 0 },
    projectsCount: { type: Number, default: 0 },
    experienceCount: { type: Number, default: 0 },
    interviewPlansCount: { type: Number, default: 0 },
    lastCalculatedAt: { type: Date, default: Date.now }
}, { _id: false });

const careerRoadmapSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    targetRole: {
        type: String,
        required: true,
        trim: true
    },
    targetJob: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        default: null
    },
    targetCompany: {
        type: String,
        default: null
    },
    currentPosition: {
        type: currentPositionSchema,
        default: () => ({})
    },
    currentStage: {
        type: Number,
        default: 1
    },
    overallProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    stages: [roadmapStageSchema],
    summary: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Index for fast lookup by user and target
careerRoadmapSchema.index({ user: 1, targetRole: 1 });

module.exports = mongoose.model('CareerRoadmap', careerRoadmapSchema);
