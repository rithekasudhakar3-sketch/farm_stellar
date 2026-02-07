const s3Service = require('../services/s3Service');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Check if S3 is configured
const isS3Configured = () => {
  return process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET &&
    process.env.AWS_REGION &&
    !process.env.AWS_ACCESS_KEY_ID.includes('your-') &&
    !process.env.AWS_SECRET_ACCESS_KEY.includes('your-');
};

const saveLocally = async (buffer, mimetype, folder = 'uploads') => {
  const fileName = `${uuidv4()}.${mimetype.split('/')[1]}`;
  const uploadDir = path.join(__dirname, '..', 'uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);

  const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`;
  return {
    key: `uploads/${fileName}`,
    url: `${backendUrl}/uploads/${fileName}`
  };
};

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Export multer middleware
exports.uploadMiddleware = upload.single('file');

// Handle file upload to S3
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const { buffer, mimetype, size } = req.file;
    const fileType = req.body.fileType || 'general';

    // Check if S3 is properly configured
    if (isS3Configured()) {
      // Upload to S3
      const { key, url } = await s3Service.uploadFile(buffer, mimetype, fileType);
      console.log('File uploaded to S3:', key);
      res.status(200).json({ key, url, mimetype, size });
    } else {
      // Fallback to local storage
      console.log('S3 not configured, saving locally...');
      const { key, url } = await saveLocally(buffer, mimetype, fileType);
      console.log('File saved locally:', key);
      res.status(200).json({ key, url, mimetype, size });
    }
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPresignedUrl = async (req, res) => {
  try {
    const { mimeType, sizeBytes } = req.body;

    if (sizeBytes > process.env.UPLOAD_MAX_BYTES) {
      return res.status(400).json({ message: 'File size exceeds limit' });
    }

    // Add more mime type validation if needed
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
    if (!allowedMimeTypes.includes(mimeType)) {
      return res.status(400).json({ message: 'Invalid mime type' });
    }

    const { uploadUrl, key } = await s3Service.getPresignedUrl(mimeType);
    res.status(200).json({ uploadUrl, key });
  } catch (error) {
    console.error('Upload presign error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.proxyUpload = async (req, res) => {
  try {
    const { mimeType, sizeBytes, fileData } = req.body;

    if (!fileData) {
      return res.status(400).json({ message: 'No file data provided' });
    }

    if (sizeBytes > process.env.UPLOAD_MAX_BYTES) {
      return res.status(400).json({ message: 'File size exceeds limit' });
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
    if (!allowedMimeTypes.includes(mimeType)) {
      return res.status(400).json({ message: 'Invalid mime type' });
    }

    // Convert base64 to buffer
    const base64Data = fileData.replace(/^data:.*?;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Upload directly to S3 or Local
    if (isS3Configured()) {
      const { key, url } = await s3Service.uploadFile(buffer, mimeType);
      res.status(200).json({ key, url });
    } else {
      console.log('S3 not configured (proxy), saving locally...');
      const { key, url } = await saveLocally(buffer, mimeType);
      res.status(200).json({ key, url });
    }
  } catch (error) {
    console.error('Proxy upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
