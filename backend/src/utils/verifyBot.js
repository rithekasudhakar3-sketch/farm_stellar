
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const SECRET_KEY = process.env.CLOUDFLARE_SECRET_KEY || '1x0000000000000000000000000000000AA'; // Test Key

/**
 * Verify Cloudflare Turnstile Token
 * @param {string} token - The token from the frontend
 * @returns {Promise<boolean>} - True if verified user, False if bot
 */
async function verifyBotToken(token) {
    if (!token) {
        console.warn("Bot verification failed: No token provided");
        return false;
    }

    // If using test keys, we can skip fetch if needed, but Cloudflare test keys work with the API.
    // We'll proceed with the fetch.

    try {
        const formData = new URLSearchParams();
        formData.append('secret', SECRET_KEY);
        formData.append('response', token);

        const fetch = require('node-fetch'); // Ensure node-fetch is available or use native fetch in Node 18+
        // Note: Node 18+ has native fetch. If on older node, might need require. 
        // Checking package.json... user has node 24.x, so native fetch is global.

        const res = await global.fetch(VERIFY_URL, {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (!data.success) {
            console.warn("Cloudflare verification failed:", data['error-codes']);
        }
        return data.success;
    } catch (e) {
        console.error("Bot verification error:", e);
        // In production, you might want to fail open or closed depending on security posture.
        // For "easiest/safe", we'll fail closed (return false) but log it.
        return false;
    }
}

module.exports = verifyBotToken;
