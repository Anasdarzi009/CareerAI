const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const placementReadinessController = require('../controllers/placementReadiness.controller');

// All placement readiness endpoints require authenticated user
router.get('/readiness', authMiddleware.authUser, placementReadinessController.getPlacementReadinessController);
router.post('/readiness/recalculate', authMiddleware.authUser, placementReadinessController.recalculatePlacementReadinessController);
router.get('/readiness/jobs', authMiddleware.authUser, placementReadinessController.getJobReadinessController);

module.exports = router;
