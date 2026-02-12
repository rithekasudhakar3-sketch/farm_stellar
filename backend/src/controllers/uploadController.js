const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { cloudinary } = require('../config/cloudinary');
const { Readable } = require('stream');

const logDebug = (msg) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(__dirname, '..', '..', 'debug_upload.log');
    fs.appendFileSync(logPath, new Date().toISOString() + ' ' + msg + '\n');
  } catch (e) {
    console.error('Logging failed', e);
  }
};

const isCloudinaryConfigured = () => {
  // Check minimal requirements
  const hasUrl = !!process.env.CLOUDINARY_URL;
  const hasCreds = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
  const result = hasUrl || hasCreds;

  logDebug(`isCloudinaryConfigured Check: URL=${hasUrl}, Creds=${hasCreds}, Result=${result}`);
  logDebug(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Present' : 'Missing'}`);

  return result;
};

const uploadToCloudinary = (buffer, folder = 'uploads') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          key: result.public_id,
          url: result.secure_url,
          result
        });
      }
    );
    Readable.from(buffer).pipe(stream);
  });
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

// Handle file upload to Cloudinary (no S3)
exports.uploadFile = async (req, res) => {
  try {
    logDebug('uploadFile called');
    if (!req.file) {
      logDebug('No file provided');
      return res.status(400).json({ message: 'No file provided' });
    }

    const { buffer, mimetype, size } = req.file;
    const fileType = req.body.fileType || 'general';

    // Prioritize Cloudinary if configured
    if (isCloudinaryConfigured()) {
      logDebug('Cloudinary configured, uploading to Cloudinary...');
      console.log('Cloudinary configured, uploading to Cloudinary...');
      const folder = fileType === 'community' ? 'community' : fileType === 'submissions' ? 'submissions' : 'uploads';
      try {
        const { key, url } = await uploadToCloudinary(buffer, `farm_stellar/${folder}`);
        logDebug(`File uploaded to Cloudinary: ${key}`);
        console.log('File uploaded to Cloudinary:', key);
        return res.status(200).json({ key, url, mimetype, size });
      } catch (uploadError) {
        logDebug(`Cloudinary upload failed: ${uploadError.message}`);
        console.error('Cloudinary upload failed:', uploadError);
        // Fallback to local if Cloudinary fails? Maybe user wants ONLY Cloudinary.
        // But throwing allows debugging 'Invalid cloud name' etc.
        throw uploadError;
      }
    } else {
      // Fallback to local storage (S3 removed)
      logDebug('Cloudinary not configured, saving locally...');
      console.log('Cloudinary not configured, saving locally...');
      const { key, url } = await saveLocally(buffer, mimetype, fileType);
      console.log('File saved locally:', key);
      res.status(200).json({ key, url, mimetype, size });
    }

  } catch (error) {
    logDebug(`File upload error: ${error.message}`);
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPresignedUrl = async (req, res) => {
  // S3 removed. Return error or suggest proxy.
  res.status(501).json({ message: 'S3 presigned URLs not supported. Use /api/uploads/proxy or direct upload.' });
};

exports.proxyUpload = async (req, res) => {
  try {
    logDebug('proxyUpload called');
    const { mimeType, sizeBytes, fileData } = req.body;

    if (!fileData) {
      logDebug('No file data provided');
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

    // Prioritize Cloudinary
    if (isCloudinaryConfigured()) {
      logDebug('Cloudinary configured (proxy), uploading...');
      try {
        const { key, url } = await uploadToCloudinary(buffer, 'farm_stellar/manual_uploads');
        logDebug(`Proxy file uploaded to Cloudinary: ${key}`);
        return res.status(200).json({ key, url });
      } catch (e) {
        logDebug(`Proxy Cloudinary upload failed: ${e.message}`);
        throw e;
      }
    } else {
      logDebug('Cloudinary not configured (proxy), saving locally...');
      console.log('Cloudinary not configured (proxy), saving locally...');
      const { key, url } = await saveLocally(buffer, mimeType);
      res.status(200).json({ key, url });
    }
  } catch (error) {
    logDebug(`Proxy upload error: ${error.message}`);
    console.error('Proxy upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
