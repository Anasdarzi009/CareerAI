const express = require('express');
const router = express.Router();
const placementAnalyticsController = require('../controllers/placementAnalytics.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * Protected routes for candidate placement analytics and offer forecasting
 */
router.get('/', authMiddleware.authUser, placementAnalyticsController.getAnalytics);
router.post('/simulate-what-if', authMiddleware.authUser, placementAnalyticsController.simulateWhatIf);

/**
 * Public route for authentic placement credential verification
 */
router.get('/verify/:token', placementAnalyticsController.verifyCredential);

module.exports = router;
