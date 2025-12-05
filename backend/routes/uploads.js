const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/presign', authMiddleware, uploadController.getPresignedUrl);
router.post('/proxy', authMiddleware, uploadController.proxyUpload);
router.post('/', authMiddleware, uploadController.uploadMiddleware, uploadController.uploadFile);

module.exports = router;
