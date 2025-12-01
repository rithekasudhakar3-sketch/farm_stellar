const express = require('express');
const router = express.Router();
const questController = require('../controllers/questController');
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, questController.getQuests);
router.get('/:id', authMiddleware, questController.getQuestById);
router.post('/:id/progress', authMiddleware, questController.updateQuestProgress);

router.post('/:id/submissions', authMiddleware, submissionController.createSubmission);
router.get('/:id/submissions', authMiddleware, submissionController.getSubmissionsForQuest);


module.exports = router;
