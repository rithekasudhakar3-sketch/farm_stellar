const s3Service = require('../services/s3Service');

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

    // Upload directly to S3 through backend
    const { key, url } = await s3Service.uploadFile(buffer, mimeType);
    
    res.status(200).json({ key, url });
  } catch (error) {
    console.error('Proxy upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
