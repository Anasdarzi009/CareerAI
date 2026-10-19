const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()



/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


/**
 * @route POST /api/interview/:interviewId/regenerate-questions
 * @description regenerate technical and behavioral questions for an existing interview report.
 * @access private
 */
interviewRouter.post("/:interviewId/regenerate-questions", authMiddleware.authUser, interviewController.regenerateQuestionsController)

/**
 * @route GET /api/interview/master-resume
 * @description Get user's persistent master resume
 * @access private
 */
interviewRouter.get("/master-resume", authMiddleware.authUser, interviewController.getMasterResumeController)

/**
 * @route POST /api/interview/master-resume/replace
 * @description Intentionally replace master resume with a new upload
 * @access private
 */
interviewRouter.post("/master-resume/replace", authMiddleware.authUser, upload.single("resume"), interviewController.replaceMasterResumeController)

/**
 * @route POST /api/interview/:interviewId/recommendations/:projectId/action
 * @description Handle project recommendation action (add, reject, mark_completed, undo)
 * @access private
 */
interviewRouter.post("/:interviewId/recommendations/:projectId/action", authMiddleware.authUser, interviewController.handleProjectActionController)

/**
 * @route POST /api/interview/:interviewId/regenerate-tailored-resume
 * @description Regenerate tailored resume version starting from master resume
 * @access private
 */
interviewRouter.post("/:interviewId/regenerate-tailored-resume", authMiddleware.authUser, interviewController.regenerateTailoredResumeController)

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

// ── Mock Interview Execution Endpoints ────────────────────────────────────────

/**
 * @route POST /api/interview/start
 * @description Start a new mock interview attempt
 * @access private
 */
interviewRouter.post("/start", authMiddleware.authUser, interviewController.startMockInterviewController)

/**
 * @route POST /api/interview/:id/answer
 * @description Submit candidate answer and evaluate voice/content/video metrics
 * @access private
 */
interviewRouter.post("/:id/answer", authMiddleware.authUser, interviewController.submitInterviewAnswerController)

/**
 * @route POST /api/interview/:id/transcript
 * @description Process/sanitize speech transcript
 * @access private
 */
interviewRouter.post("/:id/transcript", authMiddleware.authUser, interviewController.uploadInterviewTranscriptController)

/**
 * @route POST /api/interview/:id/finish
 * @description Finalize and grade completed mock interview
 * @access private
 */
interviewRouter.post("/:id/finish", authMiddleware.authUser, interviewController.finishMockInterviewController)

/**
 * @route POST /api/interview/:id/terminate
 * @description Terminate interview session due to monitoring violation (e.g. tab switch)
 * @access private
 */
interviewRouter.post("/:id/terminate", authMiddleware.authUser, interviewController.terminateInterviewSessionController)

/**
 * @route GET /api/interview/history
 * @description Get candidate interview attempt history
 * @access private
 */
interviewRouter.get("/history", authMiddleware.authUser, interviewController.getInterviewHistoryController)

/**
 * @route GET /api/interview/attempts/:id
 * @description Get single interview attempt by ID
 * @access private
 */
interviewRouter.get("/attempts/:id", authMiddleware.authUser, interviewController.getInterviewAttemptByIdController)

/**
 * @route GET /api/interview/stats
 * @description Get candidate interview statistics
 * @access private
 */
interviewRouter.get("/stats", authMiddleware.authUser, interviewController.getInterviewStatsController)

/**
 * @route GET /api/interview/questions
 * @description Get question catalog metadata
 * @access private
 */
interviewRouter.get("/questions", authMiddleware.authUser, interviewController.getInterviewQuestionsCatalogController)

module.exports = interviewRouter