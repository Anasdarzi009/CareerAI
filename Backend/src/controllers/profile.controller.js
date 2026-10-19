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
 * @description Update candidate profile fields with validation.
 * @access private
 */
async function updateProfileController(req, res) {
    try {
        const userId = req.user.id
        const {
            personal,
            academics,
            skills,
            experience,
            projects,
            certifications,
            languages,
            careerPreferences
        } = req.body

        // Academic bound validations
        if (academics) {
            if (academics.ssc?.percentage !== undefined && academics.ssc.percentage !== null && academics.ssc.percentage !== "") {
                const sscP = Number(academics.ssc.percentage)
                if (isNaN(sscP) || sscP < 0 || sscP > 100) {
                    return res.status(400).json({ message: "10th / SSC percentage must be between 0 and 100" })
                }
            }

            if (academics.hsc?.percentage !== undefined && academics.hsc.percentage !== null && academics.hsc.percentage !== "") {
                const hscP = Number(academics.hsc.percentage)
                if (isNaN(hscP) || hscP < 0 || hscP > 100) {
                    return res.status(400).json({ message: "12th / HSC percentage must be between 0 and 100" })
                }
            }

            if (academics.undergraduate?.cgpaOrPercentage !== undefined && academics.undergraduate.cgpaOrPercentage !== null && academics.undergraduate.cgpaOrPercentage !== "") {
                const ugScore = Number(academics.undergraduate.cgpaOrPercentage)
                if (isNaN(ugScore) || ugScore < 0 || ugScore > 100) {
                    return res.status(400).json({ message: "Undergraduate CGPA or Percentage must be a valid positive score" })
                }
            }
        }

        const updateData = {}
        if (personal !== undefined) updateData.personal = personal
        if (academics !== undefined) updateData.academics = academics
        if (skills !== undefined) updateData.skills = skills
        if (experience !== undefined) updateData.experience = experience
        if (projects !== undefined) updateData.projects = projects
        if (certifications !== undefined) updateData.certifications = certifications
        if (languages !== undefined) updateData.languages = languages
        if (careerPreferences !== undefined) updateData.careerPreferences = careerPreferences

        const profile = await candidateProfileModel.findOneAndUpdate(
            { user: userId },
            { $set: updateData },
            { new: true, upsert: true }
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
            { new: true, upsert: true }
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
