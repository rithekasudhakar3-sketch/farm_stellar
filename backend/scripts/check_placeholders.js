
require('dotenv').config();

const key = process.env.AWS_ACCESS_KEY_ID || '';
const secret = process.env.AWS_SECRET_ACCESS_KEY || '';
const bucket = process.env.AWS_S3_BUCKET || '';

console.log("Checking AWS Credential Format:");
if (key.includes('your-') || key.includes('YOUR_')) {
    console.log("AWS_ACCESS_KEY_ID seems to contain placeholder text ('your-' or 'YOUR_').");
} else {
    console.log("AWS_ACCESS_KEY_ID seems plausible (doesn't contain placeholders).");
}

if (secret.includes('your-') || secret.includes('YOUR_')) {
    console.log("AWS_SECRET_ACCESS_KEY seems to contain placeholder text.");
}

if (bucket.includes('your-') || bucket.includes('YOUR_')) {
    console.log("AWS_S3_BUCKET seems to contain placeholder text.");
}

console.log("Bucket Name Length:", bucket.length);
