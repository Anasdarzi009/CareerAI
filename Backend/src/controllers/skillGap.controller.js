const skillGapModel = require("../models/skillGap.model")
const candidateProfileModel = require("../models/candidateProfile.model")
const { analyzeSkillGaps } = require("../services/skillGap.service")

/**
 * @name getSkillGapController
 * @description Get or auto-generate current Skill Gap Matrix analysis for authenticated candidate.
 * @access private
 */
async function getSkillGapController(req, res) {
    try {
        const userId = req.user.id
        const { jobId } = req.query

        const profile = await candidateProfileModel.findOne({ user: userId })

        // Check if candidate profile has sufficient information
        if (!profile) {
            return res.status(200).json({
                status: "PROFILE_INCOMPLETE",
                message: "Complete your Candidate Profile to unlock your Skill Gap Matrix.",
                missingElements: ["Target Role", "Technical Skills", "Resume Document"],
                overallCoverage: 0,
                skills: [],
                learningRoadmap: []
            })
        }

        // Check for existing saved analysis if not looking for a different job
        const targetQuery = { user: userId }
        if (jobId) {
            targetQuery.targetJob = jobId
        }

        let existing = await skillGapModel.findOne(targetQuery).sort({ analyzedAt: -1 })

        // If existing is found and still fresh (or same day), return it
        if (existing) {
            return res.status(200).json({
                message: "Skill gap analysis retrieved successfully",
                analysis: existing
            })
        }

        // Otherwise generate a fresh analysis
        const analysisData = await analyzeSkillGaps(profile, { jobId })

        if (analysisData.status === "PROFILE_INCOMPLETE") {
            return res.status(200).json(analysisData)
        }

        const newAnalysis = await skillGapModel.create({
            user: userId,
            targetRole: analysisData.targetRole,
            targetJob: analysisData.targetJob,
            targetJobTitle: analysisData.targetJobTitle,
            targetCompany: analysisData.targetCompany,
            overallCoverage: analysisData.overallCoverage,
            totalRequiredSkills: analysisData.totalRequiredSkills,
            matchedSkillsCount: analysisData.matchedSkillsCount,
            weakSkillsCount: analysisData.weakSkillsCount,
            gapSkillsCount: analysisData.gapSkillsCount,
            categorySummaries: analysisData.categorySummaries,
            skills: analysisData.skills,
            learningRoadmap: analysisData.learningRoadmap,
            analyzedAt: new Date()
        })

        return res.status(200).json({
            message: "Skill gap analysis calculated successfully",
            analysis: newAnalysis
        })
    } catch (err) {
        console.error("getSkillGapController error:", err)
        return res.status(500).json({ message: "Internal server error fetching skill gap matrix" })
    }
}

/**
 * @name analyzeSkillGapController
 * @description Recalculate or target-shift Skill Gap Matrix analysis.
 * @access private
 */
async function analyzeSkillGapController(req, res) {
    try {
        const userId = req.user.id
        const { targetRole, jobId } = req.body

        const profile = await candidateProfileModel.findOne({ user: userId })
        if (!profile) {
            return res.status(200).json({
                status: "PROFILE_INCOMPLETE",
                message: "Please complete your Candidate Profile first.",
                missingElements: ["Target Role", "Technical Skills", "Resume Document"]
            })
        }

        const analysisData = await analyzeSkillGaps(profile, { targetRole, jobId })

        if (analysisData.status === "PROFILE_INCOMPLETE") {
            return res.status(200).json(analysisData)
        }

        // Upsert or create new record
        const savedAnalysis = await skillGapModel.findOneAndUpdate(
            {
                user: userId,
                targetRole: analysisData.targetRole,
                targetJob: analysisData.targetJob
            },
            {
                $set: {
                    targetJobTitle: analysisData.targetJobTitle,
                    targetCompany: analysisData.targetCompany,
                    overallCoverage: analysisData.overallCoverage,
                    totalRequiredSkills: analysisData.totalRequiredSkills,
                    matchedSkillsCount: analysisData.matchedSkillsCount,
                    weakSkillsCount: analysisData.weakSkillsCount,
                    gapSkillsCount: analysisData.gapSkillsCount,
                    categorySummaries: analysisData.categorySummaries,
                    skills: analysisData.skills,
                    learningRoadmap: analysisData.learningRoadmap,
                    analyzedAt: new Date()
                }
            },
            { upsert: true, new: true }
        )

        return res.status(200).json({
            message: "Skill gap matrix recalculated successfully",
            analysis: savedAnalysis
        })
    } catch (err) {
        console.error("analyzeSkillGapController error:", err)
        return res.status(500).json({ message: "Internal server error recalculating skill gap matrix" })
    }
}

/**
 * @name updateSkillProgressController
 * @description Update candidate learning status for a specific skill in their matrix.
 * @access private
 */
async function updateSkillProgressController(req, res) {
    try {
        const userId = req.user.id
        const { skillName, progressState, addedToLearningPlan, targetRole, jobId } = req.body

        if (!skillName) {
            return res.status(400).json({ message: "Skill name is required" })
        }

        const validStates = ["Not Started", "Learning", "Practicing", "Completed"]
        if (progressState && !validStates.includes(progressState)) {
            return res.status(400).json({ message: `Invalid progress state. Valid options: ${validStates.join(", ")}` })
        }

        // Find active analysis
        const query = { user: userId }
        if (targetRole) query.targetRole = targetRole
        if (jobId) query.targetJob = jobId

        const analysis = await skillGapModel.findOne(query).sort({ analyzedAt: -1 })
        if (!analysis) {
            return res.status(404).json({ message: "Skill gap analysis record not found" })
        }

        // Update matching skill item
        const skillItem = analysis.skills.find(
            s => s.name.toLowerCase() === skillName.toLowerCase()
        )

        if (!skillItem) {
            return res.status(404).json({ message: `Skill "${skillName}" not found in current analysis` })
        }

        if (progressState) skillItem.progressState = progressState
        if (addedToLearningPlan !== undefined) skillItem.addedToLearningPlan = addedToLearningPlan

        analysis.markModified("skills")
        await analysis.save()

        return res.status(200).json({
            message: `Progress updated for "${skillName}"`,
            skill: skillItem,
            analysis
        })
    } catch (err) {
        console.error("updateSkillProgressController error:", err)
        return res.status(500).json({ message: "Internal server error updating skill progress" })
    }
}

module.exports = {
    getSkillGapController,
    analyzeSkillGapController,
    updateSkillProgressController
}
