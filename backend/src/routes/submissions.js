const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, submissionController.createSubmission);
router.post('/auto-complete', authMiddleware, submissionController.autoCompleteQuest);
router.get('/', authMiddleware, submissionController.getUserSubmissions);
router.get('/:submissionId', authMiddleware, submissionController.getSubmissionById);
router.post('/:submissionId/verify', authMiddleware, submissionController.verifySubmission); // Using POST or PUT

module.exports = router;
