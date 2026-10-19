const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const careerRoadmapController = require('../controllers/careerRoadmap.controller');

// All roadmap endpoints require authenticated user
router.get('/', authMiddleware.authUser, careerRoadmapController.getRoadmapController);
router.post('/generate', authMiddleware.authUser, careerRoadmapController.generateRoadmapController);
router.patch('/action', authMiddleware.authUser, careerRoadmapController.updateActionController);
router.patch('/stage', authMiddleware.authUser, careerRoadmapController.updateStageController);
router.get('/:jobId', authMiddleware.authUser, careerRoadmapController.getJobRoadmapController);

module.exports = router;
