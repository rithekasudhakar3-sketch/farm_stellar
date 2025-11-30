const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, submissionController.createSubmission);
router.get('/:submissionId', authMiddleware, submissionController.getSubmissionById);

module.exports = router;
