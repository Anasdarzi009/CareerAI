const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const codingController = require('../controllers/coding.controller');

// All coding round endpoints require authenticated user
router.get('/questions', authMiddleware.authUser, codingController.getQuestionsController);
router.get('/questions/:id', authMiddleware.authUser, codingController.getQuestionByIdController);
router.post('/run-sample', authMiddleware.authUser, codingController.runSampleCodeController);
router.post('/submit', authMiddleware.authUser, codingController.submitCodeController);
router.get('/submissions', authMiddleware.authUser, codingController.getSubmissionsController);
router.get('/submissions/:id', authMiddleware.authUser, codingController.getSubmissionByIdController);
router.get('/stats', authMiddleware.authUser, codingController.getStatsController);

// Assessments
router.post('/assessments', authMiddleware.authUser, codingController.createAssessmentController);
router.get('/assessments', authMiddleware.authUser, codingController.getAssessmentsController);
router.get('/assessments/:id', authMiddleware.authUser, codingController.getAssessmentByIdController);
router.post('/assessments/:id/start', authMiddleware.authUser, codingController.startAssessmentController);
router.post('/assessments/:id/submit', authMiddleware.authUser, codingController.submitAssessmentController);

module.exports = router;
