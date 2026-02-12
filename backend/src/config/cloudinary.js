const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with credentials from .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up storage engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'farm_stellar_proofs', // The folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Allowed file types
        public_id: (req, file) => `proof_${Date.now()}_${file.originalname.split('.')[0]}`, // Unique filename
    },
});

// Initialize Multer with Cloudinary storage
const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
