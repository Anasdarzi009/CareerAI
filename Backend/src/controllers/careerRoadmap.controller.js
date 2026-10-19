const careerRoadmapService = require('../services/careerRoadmap.service');

/**
 * GET /api/roadmap
 * Retrieve current career roadmap for authenticated user
 */
async function getRoadmapController(req, res) {
    try {
        const userId = req.user._id;
        const { jobId, targetRole } = req.query;

        const roadmap = await careerRoadmapService.getRoadmap(userId, { jobId, targetRole });

        return res.status(200).json({
            success: true,
            message: 'Career roadmap retrieved successfully.',
            data: roadmap
        });
    } catch (err) {
        if (err.code === 'PROFILE_INCOMPLETE') {
            return res.status(400).json({
                success: false,
                code: 'PROFILE_INCOMPLETE',
                message: err.message,
                missingFields: err.missingFields || []
            });
        }
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to retrieve career roadmap.'
        });
    }
}

/**
 * POST /api/roadmap/generate
 * Recalculate or generate new career roadmap with specified target role or job
 */
async function generateRoadmapController(req, res) {
    try {
        const userId = req.user._id;
        const { targetRole, jobId } = req.body;

        const roadmap = await careerRoadmapService.generateRoadmap(userId, { targetRole, jobId });

        return res.status(200).json({
            success: true,
            message: 'Career roadmap generated successfully.',
            data: roadmap
        });
    } catch (err) {
        if (err.code === 'PROFILE_INCOMPLETE') {
            return res.status(400).json({
                success: false,
                code: 'PROFILE_INCOMPLETE',
                message: err.message,
                missingFields: err.missingFields || []
            });
        }
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to generate career roadmap.'
        });
    }
}

/**
 * GET /api/roadmap/:jobId
 * Get or generate roadmap targeting a specific job
 */
async function getJobRoadmapController(req, res) {
    try {
        const userId = req.user._id;
        const { jobId } = req.params;

        const roadmap = await careerRoadmapService.generateRoadmap(userId, { jobId });

        return res.status(200).json({
            success: true,
            message: 'Job-specific career roadmap retrieved successfully.',
            data: roadmap
        });
    } catch (err) {
        if (err.code === 'PROFILE_INCOMPLETE') {
            return res.status(400).json({
                success: false,
                code: 'PROFILE_INCOMPLETE',
                message: err.message,
                missingFields: err.missingFields || []
            });
        }
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to retrieve job-specific career roadmap.'
        });
    }
}

/**
 * PATCH /api/roadmap/action
 * Toggle or update an action's completion state
 */
async function updateActionController(req, res) {
    try {
        const userId = req.user._id;
        const { roadmapId, stageNumber, actionId, isCompleted } = req.body;

        if (!roadmapId || !stageNumber || !actionId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: roadmapId, stageNumber, and actionId are required.'
            });
        }

        const roadmap = await careerRoadmapService.toggleAction(
            userId,
            roadmapId,
            stageNumber,
            actionId,
            isCompleted
        );

        return res.status(200).json({
            success: true,
            message: 'Roadmap action updated successfully.',
            data: roadmap
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to update roadmap action.'
        });
    }
}

/**
 * PATCH /api/roadmap/stage
 * Update a stage's status
 */
async function updateStageController(req, res) {
    try {
        const userId = req.user._id;
        const { roadmapId, stageNumber, status } = req.body;

        if (!roadmapId || !stageNumber || !status) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: roadmapId, stageNumber, and status are required.'
            });
        }

        const roadmap = await careerRoadmapService.updateStageStatus(
            userId,
            roadmapId,
            stageNumber,
            status
        );

        return res.status(200).json({
            success: true,
            message: 'Stage status updated successfully.',
            data: roadmap
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to update stage status.'
        });
    }
}

module.exports = {
    getRoadmapController,
    generateRoadmapController,
    getJobRoadmapController,
    updateActionController,
    updateStageController
};
