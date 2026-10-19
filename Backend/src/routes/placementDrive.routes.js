const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const placementDriveController = require('../controllers/placementDrive.controller');

// All placement drive simulator routes require authenticated candidate
router.get('/templates', authMiddleware.authUser, placementDriveController.getDriveTemplatesController);
router.post('/start', authMiddleware.authUser, placementDriveController.startDriveController);
router.get('/history', authMiddleware.authUser, placementDriveController.getUserDrivesController);
router.get('/:id', authMiddleware.authUser, placementDriveController.getDriveController);
router.post('/:id/rounds/:roundNumber/submit', authMiddleware.authUser, placementDriveController.submitRoundController);

module.exports = router;
