const { Router } = require("express")
const multer = require("multer")
const profileController = require("../controllers/profile.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const profileRouter = Router()

// Configure multer for resume upload (up to 5MB memory storage for parsing and safe saving)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})

/**
 * @route GET /api/profile
 * @description Get candidate profile for authenticated user
 * @access private
 */
profileRouter.get("/", authMiddleware.authUser, profileController.getProfileController)

/**
 * @route PATCH /api/profile
 * @description Update candidate profile fields
 * @access private
 */
profileRouter.patch("/", authMiddleware.authUser, profileController.updateProfileController)

/**
 * @route POST /api/profile/resume
 * @description Upload candidate resume (PDF or DOCX)
 * @access private
 */
profileRouter.post("/resume", authMiddleware.authUser, upload.single("resume"), profileController.uploadResumeController)

/**
 * @route DELETE /api/profile/resume
 * @description Delete uploaded candidate resume
 * @access private
 */
profileRouter.delete("/resume", authMiddleware.authUser, profileController.deleteResumeController)

module.exports = profileRouter
