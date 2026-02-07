
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'Stella_AI/.env') });

const requiredKeys = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_S3_BUCKET',
    'AWS_REGION',
    'GOOGLE_API_KEY'
];

console.log(`Checking Stella_AI/.env:`);
requiredKeys.forEach(key => {
    if (process.env[key]) {
        if (key.includes('AWS') && (process.env[key].includes('your-') || process.env[key].includes('YOUR_'))) {
            console.log(`${key}: PRESENT but likely placeholder`);
        } else {
            console.log(`${key}: PRESENT`);
        }
    } else {
        console.log(`${key}: MISSING`);
    }
});
