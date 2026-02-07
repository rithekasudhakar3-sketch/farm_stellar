
require('dotenv').config();
const s3Service = require('./services/s3Service');

async function testS3() {
    console.log("Testing S3 Upload with dummy buffer...");
    try {
        const buffer = Buffer.from("Hello S3 World");
        const mimeType = "text/plain";

        console.log("Calling uploadFile...");
        const result = await s3Service.uploadFile(buffer, mimeType, 'test');
        console.log("Upload Result:", result);

        console.log("S3 Test SUCCESS");
    } catch (error) {
        console.error("S3 Test FAILED:", error);
    }
}

testS3();
