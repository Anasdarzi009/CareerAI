const candidateProfileModel = require("../models/candidateProfile.model")
const userModel = require("../models/user.model")
const pdfParse = require("pdf-parse")
const fs = require("fs")
const path = require("path")

// Upload directory for persistent resumes
const UPLOADS_DIR = path.join(__dirname, "../../uploads/resumes")
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

/**
 * @name getProfileController
 * @description Get candidate profile for authenticated user. Creates default if none exists.
 * @access private
 */
async function getProfileController(req, res) {
    try {
        const userId = req.user.id
        const user = await userModel.findById(userId).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        let profile = await candidateProfileModel.findOne({ user: userId })

        if (!profile) {
            profile = await candidateProfileModel.create({
                user: userId,
                personal: {
                    fullName: user.username || "",
                    phoneNumber: "",
                    location: "",
                    headline: ""
                }
            })
        }

        return res.status(200).json({
            message: "Candidate profile fetched successfully",
            profile,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar || "avatar-1",
                gender: user.gender || "Prefer not to say"
            }
        })
    } catch (err) {
        console.error("getProfileController error:", err)
        return res.status(500).json({ message: "Internal server error fetching candidate profile" })
    }
}

/**
 * @name updateProfileController
 * @description Update candidate profile fields with validation and deep unwrapping.
 * @access private
 */
async function updateProfileController(req, res) {
    try {
        const userId = req.user.id

        // 1. Unwrap sections in case payload is nested or wrapped
        let rawPersonal = req.body.personal
        if (rawPersonal && typeof rawPersonal === 'object' && rawPersonal.personal && typeof rawPersonal.personal === 'object') {
            rawPersonal = rawPersonal.personal
        }
        // Support top-level personal fields if passed flatly
        if (!rawPersonal && (req.body.phoneNumber !== undefined || req.body.location !== undefined || req.body.headline !== undefined)) {
            rawPersonal = {
                fullName: req.body.fullName,
                phoneNumber: req.body.phoneNumber,
                location: req.body.location,
                headline: req.body.headline
            }
        }

        let rawAcademics = req.body.academics
        if (rawAcademics && typeof rawAcademics === 'object' && rawAcademics.academics && typeof rawAcademics.academics === 'object') {
            rawAcademics = rawAcademics.academics
        }

        let rawSkills = req.body.skills
        if (rawSkills && typeof rawSkills === 'object' && !Array.isArray(rawSkills) && Array.isArray(rawSkills.skills)) {
            rawSkills = rawSkills.skills
        }

        let rawExperience = req.body.experience
        if (rawExperience && typeof rawExperience === 'object' && !Array.isArray(rawExperience) && Array.isArray(rawExperience.experience)) {
            rawExperience = rawExperience.experience
        }

        let rawProjects = req.body.projects
        if (rawProjects && typeof rawProjects === 'object' && !Array.isArray(rawProjects) && Array.isArray(rawProjects.projects)) {
            rawProjects = rawProjects.projects
        }

        let rawCertifications = req.body.certifications
        if (rawCertifications && typeof rawCertifications === 'object' && !Array.isArray(rawCertifications) && Array.isArray(rawCertifications.certifications)) {
            rawCertifications = rawCertifications.certifications
        }

        let rawLanguages = req.body.languages
        if (rawLanguages && typeof rawLanguages === 'object' && !Array.isArray(rawLanguages) && Array.isArray(rawLanguages.languages)) {
            rawLanguages = rawLanguages.languages
        }

        let rawPreferences = req.body.careerPreferences
        if (rawPreferences && typeof rawPreferences === 'object' && rawPreferences.careerPreferences && typeof rawPreferences.careerPreferences === 'object') {
            rawPreferences = rawPreferences.careerPreferences
        }

        // 2. Academic bound validations
        if (rawAcademics) {
            if (rawAcademics.ssc?.percentage !== undefined && rawAcademics.ssc.percentage !== null && rawAcademics.ssc.percentage !== "") {
                const sscP = Number(rawAcademics.ssc.percentage)
                if (isNaN(sscP) || sscP < 0 || sscP > 100) {
                    return res.status(400).json({ message: "10th / SSC percentage must be between 0 and 100" })
                }
            }

            if (rawAcademics.hsc?.percentage !== undefined && rawAcademics.hsc.percentage !== null && rawAcademics.hsc.percentage !== "") {
                const hscP = Number(rawAcademics.hsc.percentage)
                if (isNaN(hscP) || hscP < 0 || hscP > 100) {
                    return res.status(400).json({ message: "12th / HSC percentage must be between 0 and 100" })
                }
            }

            if (rawAcademics.undergraduate?.cgpaOrPercentage !== undefined && rawAcademics.undergraduate.cgpaOrPercentage !== null && rawAcademics.undergraduate.cgpaOrPercentage !== "") {
                const ugScore = Number(rawAcademics.undergraduate.cgpaOrPercentage)
                if (isNaN(ugScore) || ugScore < 0 || ugScore > 100) {
                    return res.status(400).json({ message: "Undergraduate CGPA or Percentage must be a valid positive score" })
                }
            }
        }

        // 3. Build update payload using dot notation for subdocuments to prevent accidental data erasure
        const updateData = {}

        if (rawPersonal && typeof rawPersonal === 'object') {
            if (rawPersonal.fullName !== undefined) updateData["personal.fullName"] = String(rawPersonal.fullName).trim()
            if (rawPersonal.phoneNumber !== undefined) updateData["personal.phoneNumber"] = String(rawPersonal.phoneNumber).trim()
            if (rawPersonal.location !== undefined) updateData["personal.location"] = String(rawPersonal.location).trim()
            if (rawPersonal.headline !== undefined) updateData["personal.headline"] = String(rawPersonal.headline).trim()
        }

        if (rawAcademics && typeof rawAcademics === 'object') {
            if (rawAcademics.ssc !== undefined) updateData["academics.ssc"] = rawAcademics.ssc
            if (rawAcademics.hsc !== undefined) updateData["academics.hsc"] = rawAcademics.hsc
            if (rawAcademics.diploma !== undefined) updateData["academics.diploma"] = rawAcademics.diploma
            if (rawAcademics.undergraduate !== undefined) updateData["academics.undergraduate"] = rawAcademics.undergraduate
            if (rawAcademics.postgraduate !== undefined) updateData["academics.postgraduate"] = rawAcademics.postgraduate
        }

        if (Array.isArray(rawSkills)) updateData.skills = rawSkills
        if (Array.isArray(rawExperience)) updateData.experience = rawExperience
        if (Array.isArray(rawProjects)) updateData.projects = rawProjects
        if (Array.isArray(rawCertifications)) updateData.certifications = rawCertifications
        if (Array.isArray(rawLanguages)) updateData.languages = rawLanguages

        if (rawPreferences && typeof rawPreferences === 'object') {
            if (rawPreferences.targetRole !== undefined) updateData["careerPreferences.targetRole"] = String(rawPreferences.targetRole).trim()
            if (rawPreferences.preferredIndustry !== undefined) updateData["careerPreferences.preferredIndustry"] = String(rawPreferences.preferredIndustry).trim()
            if (rawPreferences.preferredLocation !== undefined) updateData["careerPreferences.preferredLocation"] = String(rawPreferences.preferredLocation).trim()
            if (rawPreferences.workMode !== undefined) updateData["careerPreferences.workMode"] = rawPreferences.workMode
            if (rawPreferences.experienceLevel !== undefined) updateData["careerPreferences.experienceLevel"] = rawPreferences.experienceLevel
        }

        const profile = await candidateProfileModel.findOneAndUpdate(
            { user: userId },
            { $set: updateData },
            { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
        )

        return res.status(200).json({
            message: "Candidate profile updated successfully",
            profile
        })
    } catch (err) {
        console.error("updateProfileController error:", err)
        return res.status(500).json({ message: "Internal server error updating candidate profile" })
    }
}

/**
 * @name uploadResumeController
 * @description Upload candidate resume (PDF or DOCX), validate file size/type, extract text, and update profile.
 * @access private
 */
async function uploadResumeController(req, res) {
    try {
        const userId = req.user.id

        if (!req.file) {
            return res.status(400).json({ message: "Please select a resume file to upload" })
        }

        const allowedMimeTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword"
        ]

        const originalName = req.file.originalname || "resume.pdf"
        const ext = path.extname(originalName).toLowerCase()

        if (!allowedMimeTypes.includes(req.file.mimetype) && ext !== ".pdf" && ext !== ".docx" && ext !== ".doc") {
            return res.status(400).json({ message: "Invalid file type. Only PDF and DOCX files are allowed." })
        }

        const maxSizeBytes = 5 * 1024 * 1024
        if (req.file.size > maxSizeBytes) {
            return res.status(400).json({ message: "File size exceeds 5MB limit. Please upload a smaller file." })
        }

        // Generate safe unique filename
        const safeFilename = `${userId}-${Date.now()}${ext}`
        const targetPath = path.join(UPLOADS_DIR, safeFilename)

        // Save file to disk
        fs.writeFileSync(targetPath, req.file.buffer)

        // Extract text if PDF
        let rawText = ""
        if (req.file.mimetype === "application/pdf" || ext === ".pdf") {
            try {
                const pdf = new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))
                const textResult = await pdf.getText()
                rawText = textResult?.text || ""
            } catch (pdfErr) {
                console.warn("Could not extract text from PDF resume:", pdfErr.message)
            }
        }

        // Check if there was an existing resume file and remove it
        const existingProfile = await candidateProfileModel.findOne({ user: userId })
        if (existingProfile?.resume?.filePath && fs.existsSync(existingProfile.resume.filePath)) {
            try {
                fs.unlinkSync(existingProfile.resume.filePath)
            } catch (unlinkErr) {
                console.warn("Could not delete old resume file:", unlinkErr.message)
            }
        }

        const resumeMetadata = {
            fileName: originalName,
            fileType: req.file.mimetype || "application/pdf",
            fileSize: req.file.size,
            filePath: targetPath,
            fileUrl: `/uploads/resumes/${safeFilename}`,
            uploadedAt: new Date(),
            rawText
        }

        const updatedProfile = await candidateProfileModel.findOneAndUpdate(
            { user: userId },
            { $set: { resume: resumeMetadata } },
            { returnDocument: 'after', upsert: true }
        )

        return res.status(200).json({
            message: "Resume uploaded and saved successfully",
            resume: updatedProfile.resume,
            profile: updatedProfile
        })
    } catch (err) {
        console.error("uploadResumeController error:", err)
        return res.status(500).json({ message: "Internal server error uploading resume" })
    }
}

/**
 * @name deleteResumeController
 * @description Remove uploaded resume file from disk and clear profile metadata.
 * @access private
 */
async function deleteResumeController(req, res) {
    try {
        const userId = req.user.id

        const profile = await candidateProfileModel.findOne({ user: userId })
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" })
        }

        if (profile.resume?.filePath && fs.existsSync(profile.resume.filePath)) {
            try {
                fs.unlinkSync(profile.resume.filePath)
            } catch (unlinkErr) {
                console.warn("Could not delete resume file from disk:", unlinkErr.message)
            }
        }

        profile.resume = {
            fileName: "",
            fileType: "",
            fileSize: 0,
            filePath: "",
            fileUrl: "",
            uploadedAt: null,
            rawText: ""
        }

        await profile.save()

        return res.status(200).json({
            message: "Resume removed successfully",
            profile
        })
    } catch (err) {
        console.error("deleteResumeController error:", err)
        return res.status(500).json({ message: "Internal server error removing resume" })
    }
}

module.exports = {
    getProfileController,
    updateProfileController,
    uploadResumeController,
    deleteResumeController
}
