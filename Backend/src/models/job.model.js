const mongoose = require("mongoose")

const eligibilityRequirementsSchema = new mongoose.Schema({
    minSscPercentage: {
        type: Number,
        default: null
    },
    minHscPercentage: {
        type: Number,
        default: null
    },
    minDiplomaPercentage: {
        type: Number,
        default: null
    },
    minUndergraduateCgpa: {
        type: Number,
        default: null
    },
    minUndergraduatePercentage: {
        type: Number,
        default: null
    },
    allowedStreams: [{
        type: String,
        trim: true
    }],
    allowedPassingYears: [{
        type: Number
    }],
    additionalCriteria: {
        type: String,
        default: ""
    }
}, { _id: false })

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    company: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    companyLogo: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    workMode: {
        type: String,
        enum: ["Remote", "Hybrid", "On-site", "Any"],
        default: "On-site",
        index: true
    },
    employmentType: {
        type: String,
        enum: ["Full-time", "Part-time", "Internship", "Contract"],
        default: "Full-time",
        index: true
    },
    experienceRequired: {
        type: String,
        default: "0-2 years",
        trim: true
    },
    minExperienceYears: {
        type: Number,
        default: 0
    },
    salaryRange: {
        type: String,
        default: "",
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    responsibilities: [{
        type: String,
        trim: true
    }],
    requiredSkills: [{
        type: String,
        trim: true
    }],
    preferredSkills: [{
        type: String,
        trim: true
    }],
    educationRequirements: {
        type: String,
        default: "Bachelor's Degree in Computer Science, IT, or related technical field",
        trim: true
    },
    eligibilityRequirements: {
        type: eligibilityRequirementsSchema,
        default: () => ({})
    },
    applicationDeadline: {
        type: Date,
        default: null
    },
    applicationUrl: {
        type: String,
        default: ""
    },
    source: {
        type: String,
        default: "CareerAI Placement Cell"
    },
    sourceJobId: {
        type: String,
        default: ""
    },
    isSample: {
        type: Boolean,
        default: true
    },
    sampleLabel: {
        type: String,
        default: "Demo Opportunity"
    },
    status: {
        type: String,
        enum: ["Active", "Closed", "Draft"],
        default: "Active",
        index: true
    },
    postedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, { timestamps: true })

// Full-text search index on key discovery fields
jobSchema.index({
    title: "text",
    company: "text",
    location: "text",
    requiredSkills: "text",
    description: "text"
})

const jobModel = mongoose.model("Job", jobSchema)

module.exports = jobModel
