const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }
}, { _id: false });

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }
}, { _id: false });

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [ true, "Skill is required" ]
    },
    severity: {
        type: String,
        enum: [ "low", "medium", "high" ],
        required: [ true, "Severity is required" ]
    }
}, { _id: false });

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [ true, "Day is required" ]
    },
    focus: {
        type: String,
        required: [ true, "Focus is required" ]
    },
    tasks: [ {
        type: String,
        required: [ true, "Task is required" ]
    } ]
});

const eligibilityDetailSchema = new mongoose.Schema({
    criterion: {
        type: String,
        required: true
    },
    required: {
        type: String,
        required: true
    },
    candidate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [ "met", "failed", "missing" ],
        required: true
    }
}, { _id: false });

const eligibilitySchema = new mongoose.Schema({
    status: {
        type: String,
        enum: [ "eligible", "ineligible", "unable_to_verify" ],
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    details: [ eligibilityDetailSchema ]
}, { _id: false });

const projectRecommendationSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    targetRoleRelevance: {
        type: String,
        default: ""
    },
    whyRecommended: {
        type: String,
        default: ""
    },
    jdRequirementsAddressed: [String],
    techStack: [String],
    coreFeatures: [String],
    roadmap: [String],
    repoStructure: {
        type: String,
        default: ""
    },
    milestones: [String],
    skillsGained: [String],
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Intermediate'
    },
    draftResumeEntry: {
        title: { type: String, default: "" },
        meta: { type: String, default: "" },
        role: { type: String, default: "" },
        proposedBullets: [String]
    },
    status: {
        type: String,
        enum: ['RECOMMENDED', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'],
        default: 'RECOMMENDED'
    },
    completedDetails: {
        implementedFeatures: { type: String, default: "" },
        technologiesUsed: { type: String, default: "" },
        personalContribution: { type: String, default: "" },
        testingAndDeployment: { type: String, default: "" },
        verifiableResults: { type: String, default: "" },
        completedAt: { type: Date, default: null }
    }
}, { _id: false });

const resumeVersionSchema = new mongoose.Schema({
    versionNumber: {
        type: Number,
        required: true
    },
    filePath: String,
    fileName: String,
    fileType: { type: String, default: 'application/pdf' },
    tailoredSummary: String,
    tailoredTechnicalSkills: [mongoose.Schema.Types.Mixed],
    activeProjectIds: [String],
    atsScore: Number,
    potentialAtsScore: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const atsAnalysisSchema = new mongoose.Schema({
    currentMatchScore: { type: Number, default: 0 },
    potentialMatchScore: { type: Number, default: 0 },
    keywordAlignment: [
        {
            keyword: String,
            foundInResume: Boolean,
            requiredInJD: Boolean
        }
    ],
    technicalSkillsMatch: {
        score: { type: Number, default: 0 },
        matched: [String],
        missing: [String]
    },
    roleResponsibilityAlignment: { type: String, default: "" },
    existingProjectRelevance: { type: String, default: "" },
    educationAlignment: { type: String, default: "" }
}, { _id: false });

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [ true, "Job description is required" ]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [ technicalQuestionSchema ],
    behavioralQuestions: [ behavioralQuestionSchema ],
    skillGaps: [ skillGapSchema ],
    preparationPlan: [ preparationPlanSchema ],
    eligibility: eligibilitySchema,
    companyName: {
        type: String,
    },
    questionSource: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [ true, "Job title is required" ]
    },
    masterResume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MasterResume"
    },
    masterResumePath: {
        type: String,
    },
    resumeFileName: {
        type: String,
    },
    resumeFileType: {
        type: String, // 'docx' | 'pdf'
    },
    resumeOriginalPath: {
        type: String,
    },
    tailoredResumePath: {
        type: String,
    },
    tailoredResumeMimeType: {
        type: String,
    },
    tailoredResumeFileName: {
        type: String,
    },

    // Tailored content draft
    tailoredSummary: {
        type: String,
        default: ""
    },
    tailoredTechnicalSkills: [
        {
            label: String,
            skills: String
        }
    ],
    tailoredProjects: [
        {
            title: String,
            meta: String,
            bullets: [String]
        }
    ],

    // Project recommendations
    projectRecommendations: [projectRecommendationSchema],
    activeProjectIds: [String],
    rejectedProjectIds: [String],
    undoHistory: [mongoose.Schema.Types.Mixed],

    // ATS analysis
    atsAnalysis: atsAnalysisSchema,

    // Version management
    versions: [resumeVersionSchema],
    currentVersionNumber: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;