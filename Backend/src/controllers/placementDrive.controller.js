const placementDriveService = require('../services/placementDrive.service');

/**
 * GET /api/drives/templates
 * Retrieve available corporate placement drive templates
 */
exports.getDriveTemplatesController = async (req, res) => {
    try {
        const templates = placementDriveService.getAvailableTemplates();
        return res.status(200).json({
            success: true,
            templates
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to fetch placement drive templates'
        });
    }
};

/**
 * POST /api/drives/start
 * Start a new simulated corporate placement drive session
 */
exports.startDriveController = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { templateId } = req.body;
        if (!templateId) {
            return res.status(400).json({
                success: false,
                message: 'templateId is required to start a placement drive.'
            });
        }

        const drive = await placementDriveService.startDrive(userId, templateId);
        return res.status(201).json({
            success: true,
            message: 'Placement drive session initialized successfully.',
            drive
        });
    } catch (err) {
        return res.status(err.message.includes('not found') ? 404 : 500).json({
            success: false,
            message: err.message || 'Failed to start placement drive session'
        });
    }
};

/**
 * GET /api/drives/history
 * Retrieve authenticated candidate's placement drive history and summary metrics
 */
exports.getUserDrivesController = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const data = await placementDriveService.getCandidateDrives(userId);
        return res.status(200).json({
            success: true,
            ...data
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to fetch candidate placement drive history'
        });
    }
};

/**
 * GET /api/drives/:id
 * Retrieve a specific placement drive session
 */
exports.getDriveController = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { id } = req.params;
        const drive = await placementDriveService.getDriveById(userId, id);
        return res.status(200).json({
            success: true,
            drive
        });
    } catch (err) {
        return res.status(err.message.includes('unauthorized') || err.message.includes('not found') ? 404 : 500).json({
            success: false,
            message: err.message || 'Failed to retrieve placement drive session'
        });
    }
};

/**
 * POST /api/drives/:id/rounds/:roundNumber/submit
 * Submit answers for an active drive round and trigger automated evaluation
 */
exports.submitRoundController = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { id, roundNumber } = req.params;
        const updatedDrive = await placementDriveService.submitRound(userId, id, roundNumber, req.body);
        return res.status(200).json({
            success: true,
            message: `Round ${roundNumber} evaluated successfully.`,
            drive: updatedDrive
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Error submitting round answers'
        });
    }
};
