const mongoose = require("mongoose");

const masterResumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    fileName: {
        type: String,
        default: "Anas_Resume.pdf"
    },
    fileType: {
        type: String,
        default: "application/pdf"
    },
    fileSize: {
        type: Number,
        default: 156557
    },
    filePath: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        default: "/uploads/master-resumes/Anas_Resume.pdf"
    },
    rawText: {
        type: String,
        default: ""
    },
    parsedData: {
        type: Object,
        default: () => ({})
    },
    isDefault: {
        type: Boolean,
        default: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const masterResumeModel = mongoose.model("MasterResume", masterResumeSchema);

module.exports = masterResumeModel;
