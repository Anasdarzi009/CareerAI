const mongoose = require("mongoose")

const savedJobSchema = new mongoose.Schema({
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
    savedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

// Ensure a user cannot save the same job multiple times
savedJobSchema.index({ user: 1, job: 1 }, { unique: true })

const savedJobModel = mongoose.model("SavedJob", savedJobSchema)

module.exports = savedJobModel
