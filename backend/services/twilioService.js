const twilio = require('twilio');

// Check if Twilio Verify is configured with valid credentials
const isTwilioConfigured = !!(
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_VERIFY_SERVICE_SID &&
  process.env.TWILIO_ACCOUNT_SID.trim() !== '' &&
  process.env.TWILIO_AUTH_TOKEN.trim() !== '' &&
  process.env.TWILIO_VERIFY_SERVICE_SID.trim() !== '' &&
  process.env.TWILIO_ACCOUNT_SID !== 'your-twilio-account-sid' &&
  process.env.TWILIO_AUTH_TOKEN !== 'REPLACE_WITH_YOUR_ACTUAL_AUTH_TOKEN'
);

let client;
if (isTwilioConfigured) {
  try {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✓ Twilio configured successfully');
  } catch (error) {
    console.warn('⚠ Twilio initialization failed:', error.message);
    console.warn('⚠ Using development mode with console OTP.');
  }
} else {
  console.warn('⚠ Twilio not configured. Using development mode with console OTP.');
}

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Twilio Verify API
exports.sendOTP = async (phone) => {
  try {
    // Format phone number (ensure it has country code)
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    // Development mode - log OTP to console (Twilio Verify generates its own OTP)
    if (!isTwilioConfigured) {
      const otp = generateOTP();

      // Store OTP with 5 minute expiry for dev mode
      otpStore.set(formattedPhone, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        attempts: 0
      });

      console.log('═══════════════════════════════════════');
      console.log('📱 DEVELOPMENT MODE - OTP');
      console.log(`Phone: ${formattedPhone}`);
      console.log(`OTP Code: ${otp}`);
      console.log('Valid for: 5 minutes');
      console.log('═══════════════════════════════════════');
      return { success: true, message: 'OTP sent (development mode)' };
    }

    // Send OTP via Twilio Verify API
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications
      .create({
        to: formattedPhone,
        channel: 'sms'
      });

    console.log('✓ OTP sent via Twilio Verify:', verification.status);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Twilio Verify error:', error);
    throw new Error('Failed to send OTP');
  }
};

// Verify OTP
exports.verifyOTP = async (phone, otp) => {
  try {
    // Format phone number (ensure it has country code)
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    // Development mode - verify from local store
    if (!isTwilioConfigured) {
      console.log('Verifying OTP for phone:', formattedPhone);
      console.log('OTP provided:', otp);
      console.log('Stored OTPs:', Array.from(otpStore.keys()));

      const stored = otpStore.get(formattedPhone);

      if (!stored) {
        console.log('OTP not found in store for phone:', formattedPhone);
        return { success: false, message: 'OTP not found or expired' };
      }

      console.log('Stored OTP data:', { otp: stored.otp, expiresAt: new Date(stored.expiresAt), attempts: stored.attempts });

      // Check expiry
      if (Date.now() > stored.expiresAt) {
        console.log('OTP expired');
        otpStore.delete(formattedPhone);
        return { success: false, message: 'OTP expired' };
      }

      // Check attempts
      if (stored.attempts >= 3) {
        console.log('Too many attempts');
        otpStore.delete(formattedPhone);
        return { success: false, message: 'Too many failed attempts' };
      }

      // Verify OTP
      if (stored.otp === otp) {
        otpStore.delete(formattedPhone);
        return { success: true, message: 'OTP verified successfully' };
      } else {
        stored.attempts += 1;
        otpStore.set(formattedPhone, stored);
        return { success: false, message: 'Invalid OTP' };
      }
    }

    // Production mode - verify via Twilio Verify API
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks
      .create({
        to: formattedPhone,
        code: otp
      });

    if (verificationCheck.status === 'approved') {
      console.log('✓ OTP verified via Twilio Verify');
      return { success: true, message: 'OTP verified successfully' };
    } else {
      console.log('✗ OTP verification failed:', verificationCheck.status);
      return { success: false, message: 'Invalid OTP' };
    }
  } catch (error) {
    console.error('Twilio Verify error:', error);
    return { success: false, message: 'OTP verification failed' };
  }
};

// Clean up expired OTPs (run periodically)
setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(phone);
    }
  }
}, 60 * 1000); // Clean up every minute
