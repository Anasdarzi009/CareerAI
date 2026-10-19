const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const aptitudeController = require('../controllers/aptitude.controller');

// All aptitude endpoints require authenticated user
router.get('/questions', authMiddleware.authUser, aptitudeController.getQuestionsController);
router.get('/questions/:id', authMiddleware.authUser, aptitudeController.getQuestionByIdController);
router.post('/questions/:id/answer', authMiddleware.authUser, aptitudeController.answerQuestionController);

router.get('/attempts', authMiddleware.authUser, aptitudeController.getAttemptsController);
router.get('/stats', authMiddleware.authUser, aptitudeController.getAptitudeStatsController);

// Timed Assessments
router.post('/assessments', authMiddleware.authUser, aptitudeController.createAssessmentController);
router.get('/assessments', authMiddleware.authUser, aptitudeController.getAssessmentsController);
router.get('/assessments/:id', authMiddleware.authUser, aptitudeController.getAssessmentByIdController);
router.post('/assessments/:id/start', authMiddleware.authUser, aptitudeController.startAssessmentController);
router.post('/assessments/:id/submit', authMiddleware.authUser, aptitudeController.submitAssessmentController);

module.exports = router;
