const { Router } = require("express")
const jobController = require("../controllers/job.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const jobRouter = Router()

// All job operations require authenticated user
jobRouter.use(authMiddleware.authUser)

// Specialized collection routes (MUST precede parameterized :id)
jobRouter.get("/recommended", jobController.getRecommendedJobsController)
jobRouter.get("/saved", jobController.getSavedJobsController)
jobRouter.get("/applications", jobController.getApplicationsController)
jobRouter.patch("/applications/:applicationId", jobController.updateApplicationStatusController)

// General job browse & search
jobRouter.get("/", jobController.getJobsController)

// Single job & resource actions
jobRouter.get("/:id", jobController.getJobByIdController)
jobRouter.post("/:id/save", jobController.saveJobController)
jobRouter.delete("/:id/save", jobController.unsaveJobController)
jobRouter.post("/:id/application", jobController.applyJobController)

module.exports = jobRouter
