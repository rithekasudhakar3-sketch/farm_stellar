require('dotenv').config();
const cloudinary = require('cloudinary').v2;

console.log('--- Cloudinary Verification ---');
console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('URL defined:', !!process.env.CLOUDINARY_URL);

// Ensure config is set
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.api.ping((error, result) => {
    if (error) {
        console.error('Ping Error:', error);
    } else {
        console.log('Ping Success! Connection Verified.');
        console.log(result);
    }
});
