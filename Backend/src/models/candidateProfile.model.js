const mongoose = require("mongoose")

const sscSchema = new mongoose.Schema({
    percentage: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },
    passingYear: {
        type: Number,
        default: null
    },
    board: {
        type: String,
        default: ""
    }
}, { _id: false })

const hscSchema = new mongoose.Schema({
    percentage: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },
    passingYear: {
        type: Number,
        default: null
    },
    stream: {
        type: String,
        default: ""
    },
    board: {
        type: String,
        default: ""
    }
}, { _id: false })

const diplomaSchema = new mongoose.Schema({
    percentageOrCgpa: {
        type: Number,
        default: null
    },
    passingYear: {
        type: Number,
        default: null
    },
    specialization: {
        type: String,
        default: ""
    }
}, { _id: false })

const undergraduateSchema = new mongoose.Schema({
    degree: {
        type: String,
        default: ""
    },
    branch: {
        type: String,
        default: ""
    },
    college: {
        type: String,
        default: ""
    },
    cgpaOrPercentage: {
        type: Number,
        default: null
    },
    passingYear: {
        type: Number,
        default: null
    }
}, { _id: false })

const postgraduateSchema = new mongoose.Schema({
    degree: {
        type: String,
        default: ""
    },
    specialization: {
        type: String,
        default: ""
    },
    college: {
        type: String,
        default: ""
    },
    cgpaOrPercentage: {
        type: Number,
        default: null
    },
    passingYear: {
        type: Number,
        default: null
    }
}, { _id: false })

const skillItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        default: "Other"
    }
}, { _id: false })

const experienceItemSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    employmentType: {
        type: String,
        enum: ["Internship", "Full-time", "Part-time", "Freelance", "Contract"],
        default: "Internship"
    },
    startDate: {
        type: String,
        default: ""
    },
    endDate: {
        type: String,
        default: ""
    },
    currentlyWorking: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: ""
    }
})

const projectItemSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    technologies: [{
        type: String,
        trim: true
    }],
    projectUrl: {
        type: String,
        default: ""
    },
    githubUrl: {
        type: String,
        default: ""
    },
    startDate: {
        type: String,
        default: ""
    },
    endDate: {
        type: String,
        default: ""
    }
})

const certificationItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    issuingOrganization: {
        type: String,
        default: ""
    },
    issueDate: {
        type: String,
        default: ""
    },
    credentialId: {
        type: String,
        default: ""
    },
    credentialUrl: {
        type: String,
        default: ""
    }
})

const languageItemSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true,
        trim: true
    },
    proficiency: {
        type: String,
        enum: ["Basic", "Conversational", "Professional", "Fluent", "Native"],
        default: "Professional"
    }
}, { _id: false })

const candidateProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true
    },

    personal: {
        fullName: {
            type: String,
            default: ""
        },
        phoneNumber: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            default: ""
        },
        headline: {
            type: String,
            default: ""
        }
    },

    academics: {
        ssc: {
            type: sscSchema,
            default: () => ({})
        },
        hsc: {
            type: hscSchema,
            default: () => ({})
        },
        diploma: {
            type: diplomaSchema,
            default: () => ({})
        },
        undergraduate: {
            type: undergraduateSchema,
            default: () => ({})
        },
        postgraduate: {
            type: postgraduateSchema,
            default: () => ({})
        }
    },

    skills: [skillItemSchema],

    experience: [experienceItemSchema],

    projects: [projectItemSchema],

    certifications: [certificationItemSchema],

    languages: [languageItemSchema],

    careerPreferences: {
        targetRole: {
            type: String,
            default: ""
        },
        preferredIndustry: {
            type: String,
            default: ""
        },
        preferredLocation: {
            type: String,
            default: ""
        },
        workMode: {
            type: String,
            enum: ["On-site", "Hybrid", "Remote", "Any", ""],
            default: "Any"
        },
        experienceLevel: {
            type: String,
            enum: ["Fresher", "Entry Level", "Mid Level", "Experienced", ""],
            default: "Fresher"
        }
    },

    resume: {
        fileName: {
            type: String,
            default: ""
        },
        fileType: {
            type: String,
            default: ""
        },
        fileSize: {
            type: Number,
            default: 0
        },
        filePath: {
            type: String,
            default: ""
        },
        fileUrl: {
            type: String,
            default: ""
        },
        uploadedAt: {
            type: Date,
            default: null
        },
        rawText: {
            type: String,
            default: ""
        }
    }
}, { timestamps: true })

const candidateProfileModel = mongoose.model("CandidateProfile", candidateProfileSchema)

module.exports = candidateProfileModel
