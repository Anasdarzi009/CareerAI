const mongoose = require("mongoose")

const applicationStatusHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["Not Applied", "Applied", "Assessment", "Interview", "Offer", "Rejected", "Withdrawn"],
        required: true
    },
    changedAt: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        default: ""
    }
}, { _id: false })

const jobApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ["Not Applied", "Applied", "Assessment", "Interview", "Offer", "Rejected", "Withdrawn"],
        default: "Applied",
        index: true
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ""
    },
    statusHistory: [applicationStatusHistorySchema]
}, { timestamps: true })

// Ensure a user has only one application record per job
jobApplicationSchema.index({ user: 1, job: 1 }, { unique: true })

const jobApplicationModel = mongoose.model("JobApplication", jobApplicationSchema)

module.exports = jobApplicationModel
