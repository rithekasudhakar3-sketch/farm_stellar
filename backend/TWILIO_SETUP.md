# Twilio OTP Setup Guide

This guide will help you set up Twilio for SMS-based OTP verification in the FarmStellar application.

## Prerequisites
- Twilio Account (Sign up at https://www.twilio.com/try-twilio)
- Verified phone number for testing

## Step 1: Create Twilio Account

1. Go to https://www.twilio.com/try-twilio
2. Sign up with your email
3. Verify your email and phone number
4. You'll receive $15.50 in trial credit

## Step 2: Get Your Credentials

1. Go to your [Twilio Console](https://console.twilio.com/)
2. Find your **Account SID** and **Auth Token** on the dashboard
3. Copy these values - you'll need them for the `.env` file

## Step 3: Get a Phone Number

### Option A: Trial Phone Number (Free, Limited)
1. In the Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Select your country
3. Choose a number with SMS capability
4. Click **Buy** (free with trial credit)

### Option B: Production (Paid)
1. Upgrade your account to paid
2. Purchase a phone number with SMS capability
3. No verification restrictions

## Step 4: Configure Environment Variables

Update your `backend/.env` file with Twilio credentials:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**Important:** 
- Replace `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual Account SID
- Replace `your_auth_token_here` with your actual Auth Token
- Replace `+1234567890` with your Twilio phone number (include country code)

## Step 5: Install Twilio Package

In the backend directory, install the Twilio Node.js library:

```bash
cd backend
npm install twilio
```

## Step 6: Verify Phone Numbers (Trial Account Only)

If you're using a trial account:

1. Go to **Phone Numbers** → **Manage** → **Verified Caller IDs**
2. Add the phone numbers you want to test with
3. Verify each number via SMS or call
4. Only verified numbers can receive OTP during trial period

## Step 7: Test the Integration

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

3. Go to the login page and enter a phone number
4. You should receive an SMS with a 6-digit OTP code
5. Enter the OTP to complete verification

## API Endpoints

### Send OTP
```
POST /api/auth/send-otp
Body: { "phone": "9876543210" }
```

### Verify OTP
```
POST /api/auth/verify-otp
Body: { "phone": "9876543210", "otp": "123456" }
```

## Troubleshooting

### Error: "Unable to create record: Invalid number"
- **Solution**: Make sure the phone number includes country code (e.g., +919876543210)
- For trial accounts, verify the phone number first

### Error: "Authentication failed"
- **Solution**: Double-check your Account SID and Auth Token in `.env`
- Make sure there are no extra spaces or quotes

### OTP not received
- **Solution**: 
  - Check if the phone number is verified (trial accounts)
  - Verify your Twilio phone number has SMS capability
  - Check Twilio console logs for delivery status
  - Make sure you have trial credit remaining

### Error: "The number is unverified"
- **Solution**: Add and verify the recipient phone number in Twilio Console

## Production Considerations

1. **Upgrade to Paid Account**: Remove trial limitations
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **OTP Storage**: Use Redis instead of in-memory Map for scalability
4. **Message Templates**: Create message templates in Twilio
5. **Monitoring**: Set up alerts for failed SMS delivery
6. **International Numbers**: Enable international SMS if needed
7. **Compliance**: Follow TCPA and local regulations

## Cost Estimate

- **Trial Account**: $15.50 free credit (~500 SMS)
- **Phone Number**: $1-2/month
- **SMS Cost**: $0.0075-0.02 per message (varies by country)
- **India SMS**: ~₹0.50-1.00 per message

## Security Best Practices

1. **Never commit credentials**: Keep `.env` in `.gitignore`
2. **OTP Expiry**: OTPs expire after 5 minutes
3. **Attempt Limiting**: Max 3 verification attempts per OTP
4. **Rate Limiting**: Prevent spam by limiting OTP requests
5. **HTTPS Only**: Use HTTPS in production
6. **Sanitize Input**: Validate phone numbers before sending

## Alternative Services

If Twilio doesn't work for you, consider:
- **AWS SNS**: Good for AWS-based infrastructure
- **Firebase Auth**: Includes phone authentication
- **MSG91**: Popular in India, cost-effective
- **2Factor**: India-focused SMS service
- **Nexmo/Vonage**: Alternative to Twilio

## Support

- Twilio Documentation: https://www.twilio.com/docs/sms
- Twilio Support: https://support.twilio.com
- Twilio Console: https://console.twilio.com

## Flow Diagram

```
User enters phone → Frontend sends to /api/auth/send-otp
                 ↓
Backend generates 6-digit OTP → Stores in memory (5 min expiry)
                 ↓
Twilio sends SMS → User receives OTP
                 ↓
User enters OTP → Frontend sends to /api/auth/verify-otp
                 ↓
Backend verifies OTP → Returns JWT token if valid
                 ↓
User logged in successfully
```

## Notes

- OTPs are valid for 5 minutes
- Maximum 3 verification attempts per OTP
- After 3 failed attempts, user must request new OTP
- Old OTPs are automatically cleaned up every minute
