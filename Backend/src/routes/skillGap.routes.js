const { Router } = require("express")
const skillGapController = require("../controllers/skillGap.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const skillRouter = Router()

// All skill matrix operations require authenticated candidate
skillRouter.use(authMiddleware.authUser)

// Retrieve current analysis
skillRouter.get("/gap", skillGapController.getSkillGapController)

// Target job-specific analysis
skillRouter.get("/gap/:jobId", (req, res, next) => {
    req.query.jobId = req.params.jobId
    return skillGapController.getSkillGapController(req, res, next)
})

// Force recalculation or target switch
skillRouter.post("/analyze", skillGapController.analyzeSkillGapController)

// Update candidate learning progress for a skill
skillRouter.patch("/progress", skillGapController.updateSkillProgressController)

module.exports = skillRouter
