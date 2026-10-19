const jobModel = require("../models/job.model")
const savedJobModel = require("../models/savedJob.model")
const jobApplicationModel = require("../models/jobApplication.model")
const candidateProfileModel = require("../models/candidateProfile.model")
const { evaluateEligibility } = require("../services/eligibility.service")
const { calculateJobMatch, rankRecommendedJobs } = require("../services/jobRecommendation.service")

/**
 * @name getJobsController
 * @description Browse, search, filter and sort jobs with real-time candidate eligibility audit.
 * @access private
 */
async function getJobsController(req, res) {
    try {
        const userId = req.user.id
        const {
            search,
            location,
            workMode,
            employmentType,
            eligibility,
            saved,
            sortBy
        } = req.query

        // Fetch candidate profile for eligibility audit
        const profile = await candidateProfileModel.findOne({ user: userId })

        // Build database query
        const query = { status: "Active" }

        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), "i")
            query.$or = [
                { title: regex },
                { company: regex },
                { location: regex },
                { requiredSkills: regex },
                { description: regex }
            ]
        }

        if (location && location.trim()) {
            query.location = new RegExp(location.trim(), "i")
        }

        if (workMode && workMode !== "All") {
            query.workMode = workMode
        }

        if (employmentType && employmentType !== "All") {
            query.employmentType = employmentType
        }

        let jobs = await jobModel.find(query).sort({ postedAt: -1 })

        // Fetch user's saved jobs and applications in bulk
        const userSavedJobIds = new Set(
            (await savedJobModel.find({ user: userId }).select("job")).map(s => s.job.toString())
        )

        const userApplications = await jobApplicationModel.find({ user: userId }).select("job status appliedAt")
        const applicationMap = new Map(
            userApplications.map(a => [a.job.toString(), { status: a.status, appliedAt: a.appliedAt, applicationId: a._id }])
        )

        // Augment each job with server-side eligibility and user bookmark/application context
        let evaluatedJobs = jobs.map(job => {
            const jobIdStr = job._id.toString()
            const eligibilityResult = evaluateEligibility(job, profile)
            const matchResult = calculateJobMatch(job, profile)
            const isSaved = userSavedJobIds.has(jobIdStr)
            const app = applicationMap.get(jobIdStr) || null

            return {
                ...job.toObject(),
                eligibility: eligibilityResult,
                matchScore: matchResult.matchScore,
                matchFactors: matchResult.matchFactors,
                isSaved,
                application: app
            }
        })

        // Filter by saved status if requested
        if (saved === "true") {
            evaluatedJobs = evaluatedJobs.filter(j => j.isSaved)
        }

        // Filter by eligibility if requested
        if (eligibility && eligibility !== "All") {
            const eligFilterUpper = eligibility.toUpperCase()
            evaluatedJobs = evaluatedJobs.filter(j => j.eligibility.status === eligFilterUpper)
        }

        // Sorting
        if (sortBy === "bestMatch") {
            evaluatedJobs.sort((a, b) => b.matchScore - a.matchScore)
        } else if (sortBy === "deadline") {
            evaluatedJobs.sort((a, b) => {
                const aTime = a.applicationDeadline ? new Date(a.applicationDeadline).getTime() : Infinity
                const bTime = b.applicationDeadline ? new Date(b.applicationDeadline).getTime() : Infinity
                return aTime - bTime
            })
        } else {
            // Default newest
            evaluatedJobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
        }

        return res.status(200).json({
            message: "Jobs fetched successfully",
            count: evaluatedJobs.length,
            jobs: evaluatedJobs
        })
    } catch (err) {
        console.error("getJobsController error:", err)
        return res.status(500).json({ message: "Internal server error fetching opportunities" })
    }
}

/**
 * @name getJobByIdController
 * @description Get complete job details with comprehensive eligibility breakdown.
 * @access private
 */
async function getJobByIdController(req, res) {
    try {
        const userId = req.user.id
        const { id } = req.params

        const job = await jobModel.findById(id)
        if (!job) {
            return res.status(404).json({ message: "Job opportunity not found" })
        }

        const profile = await candidateProfileModel.findOne({ user: userId })
        const eligibility = evaluateEligibility(job, profile)
        const match = calculateJobMatch(job, profile)

        const savedRecord = await savedJobModel.findOne({ user: userId, job: id })
        const application = await jobApplicationModel.findOne({ user: userId, job: id })

        return res.status(200).json({
            message: "Job details fetched successfully",
            job: {
                ...job.toObject(),
                eligibility,
                matchScore: match.matchScore,
                matchFactors: match.matchFactors,
                isSaved: !!savedRecord,
                application: application ? {
                    applicationId: application._id,
                    status: application.status,
                    appliedAt: application.appliedAt,
                    statusHistory: application.statusHistory,
                    notes: application.notes
                } : null
            }
        })
    } catch (err) {
        console.error("getJobByIdController error:", err)
        return res.status(500).json({ message: "Internal server error fetching job details" })
    }
}

/**
 * @name getRecommendedJobsController
 * @description Return personalized job recommendations with eligibility priority.
 * @access private
 */
async function getRecommendedJobsController(req, res) {
    try {
        const userId = req.user.id
        const profile = await candidateProfileModel.findOne({ user: userId })

        const activeJobs = await jobModel.find({ status: "Active" }).limit(20)
        const ranked = rankRecommendedJobs(activeJobs, profile)

        // Enrich with saved/applied context
        const userSavedJobIds = new Set(
            (await savedJobModel.find({ user: userId }).select("job")).map(s => s.job.toString())
        )
        const userApplications = await jobApplicationModel.find({ user: userId }).select("job status appliedAt")
        const applicationMap = new Map(
            userApplications.map(a => [a.job.toString(), { status: a.status, appliedAt: a.appliedAt }])
        )

        const enrichedRanked = ranked.map(item => {
            const jobIdStr = item.job._id.toString()
            return {
                ...item.job.toObject(),
                eligibility: item.eligibility,
                matchScore: item.matchScore,
                matchFactors: item.matchFactors,
                isSaved: userSavedJobIds.has(jobIdStr),
                application: applicationMap.get(jobIdStr) || null
            }
        })

        return res.status(200).json({
            message: "Recommended jobs fetched successfully",
            jobs: enrichedRanked
        })
    } catch (err) {
        console.error("getRecommendedJobsController error:", err)
        return res.status(500).json({ message: "Internal server error fetching recommendations" })
    }
}

/**
 * @name saveJobController
 * @description Bookmark a job for the candidate.
 * @access private
 */
async function saveJobController(req, res) {
    try {
        const userId = req.user.id
        const { id } = req.params

        const job = await jobModel.findById(id)
        if (!job) {
            return res.status(404).json({ message: "Job not found" })
        }

        await savedJobModel.findOneAndUpdate(
            { user: userId, job: id },
            { $set: { savedAt: new Date() } },
            { upsert: true, new: true }
        )

        return res.status(200).json({
            message: "Job saved to your bookmarks",
            isSaved: true
        })
    } catch (err) {
        console.error("saveJobController error:", err)
        return res.status(500).json({ message: "Internal server error saving job" })
    }
}

/**
 * @name unsaveJobController
 * @description Remove job from candidate's bookmarks.
 * @access private
 */
async function unsaveJobController(req, res) {
    try {
        const userId = req.user.id
        const { id } = req.params

        await savedJobModel.findOneAndDelete({ user: userId, job: id })

        return res.status(200).json({
            message: "Job removed from bookmarks",
            isSaved: false
        })
    } catch (err) {
        console.error("unsaveJobController error:", err)
        return res.status(500).json({ message: "Internal server error removing saved job" })
    }
}

/**
 * @name getSavedJobsController
 * @description Get all bookmarked jobs for the candidate.
 * @access private
 */
async function getSavedJobsController(req, res) {
    try {
        const userId = req.user.id
        const savedRecords = await savedJobModel.find({ user: userId }).populate("job").sort({ savedAt: -1 })
        const profile = await candidateProfileModel.findOne({ user: userId })

        const savedJobs = savedRecords
            .filter(r => r.job) // Ensure populated job exists
            .map(r => {
                const job = r.job
                const eligibility = evaluateEligibility(job, profile)
                const match = calculateJobMatch(job, profile)
                return {
                    ...job.toObject(),
                    eligibility,
                    matchScore: match.matchScore,
                    isSaved: true,
                    savedAt: r.savedAt
                }
            })

        return res.status(200).json({
            message: "Saved jobs fetched successfully",
            count: savedJobs.length,
            jobs: savedJobs
        })
    } catch (err) {
        console.error("getSavedJobsController error:", err)
        return res.status(500).json({ message: "Internal server error fetching saved jobs" })
    }
}

/**
 * @name applyJobController
 * @description Create or mark application for a job with initial status.
 * @access private
 */
async function applyJobController(req, res) {
    try {
        const userId = req.user.id
        const { id } = req.params
        const { notes = "", status = "Applied" } = req.body

        const job = await jobModel.findById(id)
        if (!job) {
            return res.status(404).json({ message: "Job not found" })
        }

        const validStatuses = ["Not Applied", "Applied", "Assessment", "Interview", "Offer", "Rejected", "Withdrawn"]
        const chosenStatus = validStatuses.includes(status) ? status : "Applied"

        const initialHistory = [{
            status: chosenStatus,
            changedAt: new Date(),
            note: notes || "Application registered in CareerAI"
        }]

        const application = await jobApplicationModel.findOneAndUpdate(
            { user: userId, job: id },
            {
                $set: {
                    status: chosenStatus,
                    appliedAt: new Date(),
                    notes
                },
                $push: {
                    statusHistory: { $each: initialHistory }
                }
            },
            { upsert: true, new: true }
        )

        return res.status(200).json({
            message: `Application status set to "${chosenStatus}"`,
            application
        })
    } catch (err) {
        console.error("applyJobController error:", err)
        return res.status(500).json({ message: "Internal server error submitting application" })
    }
}

/**
 * @name getApplicationsController
 * @description Get all tracked applications for the candidate.
 * @access private
 */
async function getApplicationsController(req, res) {
    try {
        const userId = req.user.id
        const applications = await jobApplicationModel.find({ user: userId })
            .populate("job")
            .sort({ updatedAt: -1 })

        const profile = await candidateProfileModel.findOne({ user: userId })

        const formatted = applications
            .filter(a => a.job)
            .map(a => {
                const eligibility = evaluateEligibility(a.job, profile)
                return {
                    applicationId: a._id,
                    status: a.status,
                    appliedAt: a.appliedAt,
                    updatedAt: a.updatedAt,
                    notes: a.notes,
                    statusHistory: a.statusHistory,
                    job: {
                        ...a.job.toObject(),
                        eligibility
                    }
                }
            })

        return res.status(200).json({
            message: "Applications fetched successfully",
            count: formatted.length,
            applications: formatted
        })
    } catch (err) {
        console.error("getApplicationsController error:", err)
        return res.status(500).json({ message: "Internal server error fetching applications" })
    }
}

/**
 * @name updateApplicationStatusController
 * @description Update application status and append to status history.
 * @access private
 */
async function updateApplicationStatusController(req, res) {
    try {
        const userId = req.user.id
        const { applicationId } = req.params
        const { status, note = "" } = req.body

        const validStatuses = ["Not Applied", "Applied", "Assessment", "Interview", "Offer", "Rejected", "Withdrawn"]
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Valid values: ${validStatuses.join(", ")}` })
        }

        const application = await jobApplicationModel.findOne({ _id: applicationId, user: userId })
        if (!application) {
            return res.status(404).json({ message: "Application record not found" })
        }

        application.status = status
        application.statusHistory.push({
            status,
            changedAt: new Date(),
            note: note || `Status updated to ${status}`
        })

        await application.save()

        return res.status(200).json({
            message: `Application updated to ${status}`,
            application
        })
    } catch (err) {
        console.error("updateApplicationStatusController error:", err)
        return res.status(500).json({ message: "Internal server error updating application" })
    }
}

module.exports = {
    getJobsController,
    getJobByIdController,
    getRecommendedJobsController,
    saveJobController,
    unsaveJobController,
    getSavedJobsController,
    applyJobController,
    getApplicationsController,
    updateApplicationStatusController
}
