
require('dotenv').config();

const requiredKeys = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_S3_BUCKET',
    'AWS_REGION',
    'GOOGLE_API_KEY'
];

console.log("--- ENV CHECK START ---");
requiredKeys.forEach(key => {
    if (process.env[key]) {
        console.log(`${key}: PRESENT`);
    } else {
        console.log(`${key}: MISSING`);
    }
});
console.log("--- ENV CHECK END ---");
