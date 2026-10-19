const mongoose = require("mongoose")

const skillEvidenceSchema = new mongoose.Schema({
    source: {
        type: String,
        enum: ["profile_skill", "resume_text", "project", "experience", "interview_report"],
        required: true
    },
    detail: {
        type: String,
        default: ""
    }
}, { _id: false })

const evaluatedSkillItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        default: "General"
    },
    status: {
        type: String,
        enum: ["MATCHED", "MISSING", "WEAK_EVIDENCE"],
        required: true
    },
    priority: {
        type: String,
        enum: ["HIGH", "MEDIUM", "LOW"],
        default: "MEDIUM"
    },
    whyItMatters: {
        type: String,
        default: ""
    },
    evidenceStatus: {
        type: String,
        enum: ["VERIFIED", "PARTIAL_EVIDENCE", "NO_EVIDENCE"],
        default: "NO_EVIDENCE"
    },
    candidateEvidence: [skillEvidenceSchema],
    learningAction: {
        type: String,
        default: ""
    },
    progressState: {
        type: String,
        enum: ["Not Started", "Learning", "Practicing", "Completed"],
        default: "Not Started"
    },
    addedToLearningPlan: {
        type: Boolean,
        default: false
    }
}, { _id: false })

const learningMilestoneSchema = new mongoose.Schema({
    step: {
        type: Number,
        required: true
    },
    skill: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ["HIGH", "MEDIUM", "LOW"],
        default: "MEDIUM"
    },
    curriculum: {
        type: String,
        default: ""
    },
    action: {
        type: String,
        default: ""
    }
}, { _id: false })

const skillCategorySummarySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    totalRequired: {
        type: Number,
        default: 0
    },
    matchedCount: {
        type: Number,
        default: 0
    },
    weakCount: {
        type: Number,
        default: 0
    },
    gapCount: {
        type: Number,
        default: 0
    }
}, { _id: false })

const skillGapAnalysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
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
        ref: "Job",
        default: null
    },
    targetJobTitle: {
        type: String,
        default: ""
    },
    targetCompany: {
        type: String,
        default: ""
    },
    overallCoverage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    totalRequiredSkills: {
        type: Number,
        default: 0
    },
    matchedSkillsCount: {
        type: Number,
        default: 0
    },
    weakSkillsCount: {
        type: Number,
        default: 0
    },
    gapSkillsCount: {
        type: Number,
        default: 0
    },
    categorySummaries: [skillCategorySummarySchema],
    skills: [evaluatedSkillItemSchema],
    learningRoadmap: [learningMilestoneSchema],
    analyzedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

// Compound index for quick lookup per user and target
skillGapAnalysisSchema.index({ user: 1, targetRole: 1, targetJob: 1 })

const skillGapModel = mongoose.model("SkillGapAnalysis", skillGapAnalysisSchema)

module.exports = skillGapModel
