# OTP Development Mode

## Overview

The application is currently running in **Development Mode** for OTP authentication because Twilio credentials are not configured.

## How It Works

When a user requests an OTP:

1. The system generates a 6-digit OTP code
2. Instead of sending SMS via Twilio, the OTP is **logged to the backend console**
3. Check your backend terminal to see the OTP

## Finding the OTP

Look for this in your backend terminal:

```
═══════════════════════════════════════
📱 DEVELOPMENT MODE - OTP
Phone: 9876543210
OTP Code: 123456
Valid for: 5 minutes
═══════════════════════════════════════
```

## Testing the Flow

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Login/Signup**: Enter your phone number
4. **Check Terminal**: Look for the OTP in the backend console
5. **Enter OTP**: Use the code from the terminal
6. **Success**: You'll be logged in!

## Switching to Production Mode

To enable real SMS via Twilio:

1. Sign up at https://www.twilio.com/try-twilio
2. Get your credentials from the Twilio Console
3. Update `backend/.env`:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```
4. Restart the backend server
5. You'll see: `✓ Twilio configured successfully`

## Common Issues

### "400 Bad Request" Error
- **Cause**: Invalid phone number format
- **Solution**: Use 10-digit format without country code (e.g., 9876543210)

### OTP Not Appearing in Console
- **Check**: Make sure the backend server is running
- **Check**: Look for the boxed message with ═══ borders
- **Check**: Scroll up in the terminal - it might be above other logs

### "OTP expired" Error
- **Cause**: OTP is only valid for 5 minutes
- **Solution**: Request a new OTP by clicking "Resend OTP"

### "Invalid OTP" Error
- **Cause**: Wrong OTP entered or too many attempts (max 3)
- **Solution**: 
  - Double-check the OTP in the terminal
  - Request a new OTP if attempts exceeded

## Features

- ✅ OTP valid for 5 minutes
- ✅ Maximum 3 verification attempts
- ✅ Auto-cleanup of expired OTPs
- ✅ Works for both login and signup
- ✅ Console logging in development
- ✅ Automatic Twilio integration when configured

## Example Workflow

```
User Flow:
1. User enters: 9876543210
2. Backend generates: 234567
3. Console shows OTP: 234567
4. User enters: 234567
5. System verifies and logs in user
```

## Security Notes

- Development mode is **NOT secure** for production
- Anyone with console access can see OTPs
- Always use real Twilio in production
- Keep `.env` file in `.gitignore`
- Never commit Twilio credentials to git
