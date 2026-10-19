const placementReadinessService = require('../services/placementReadiness.service');

/**
 * GET /api/placement/readiness
 * Retrieve current candidate placement readiness snapshot
 */
async function getPlacementReadinessController(req, res) {
    try {
        const userId = req.user._id;
        const readiness = await placementReadinessService.getPlacementReadiness(userId);

        return res.status(200).json({
            success: true,
            message: 'Placement readiness retrieved successfully.',
            data: readiness
        });
    } catch (err) {
        console.error('getPlacementReadinessController error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to retrieve placement readiness.'
        });
    }
}

/**
 * POST /api/placement/readiness/recalculate
 * Force recalculation of placement readiness snapshot
 */
async function recalculatePlacementReadinessController(req, res) {
    try {
        const userId = req.user._id;
        const readiness = await placementReadinessService.calculatePlacementReadiness(userId);

        return res.status(200).json({
            success: true,
            message: 'Placement readiness recalculated successfully.',
            data: readiness
        });
    } catch (err) {
        console.error('recalculatePlacementReadinessController error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to recalculate placement readiness.'
        });
    }
}

/**
 * GET /api/placement/readiness/jobs
 * Retrieve opportunities evaluated against eligibility engine
 */
async function getJobReadinessController(req, res) {
    try {
        const userId = req.user._id;
        const jobBreakdown = await placementReadinessService.getJobReadinessBreakdown(userId);

        return res.status(200).json({
            success: true,
            message: 'Job readiness breakdown retrieved successfully.',
            data: jobBreakdown
        });
    } catch (err) {
        console.error('getJobReadinessController error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to retrieve job readiness breakdown.'
        });
    }
}

module.exports = {
    getPlacementReadinessController,
    recalculatePlacementReadinessController,
    getJobReadinessController
};
