const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Farm = require('../models/Farm');
const twilioService = require('../services/twilioService');

exports.signup = async (req, res) => {
  console.log('--- SIGNUP REQUEST RECEIVED ---');
  console.log('Body:', JSON.stringify(req.body, null, 2));

  try {
    const { name, email, password, location, phone, city, state, district, panchayat } = req.body;

    // Basic Validation
    if (!phone || !name || !password) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ message: 'Missing required fields (name, phone, or password)' });
    }

    // Check if user exists by email or phone
    const existingUser = await User.findOne({
      $or: [
        { email: email },
        { phone: phone }
      ]
    });

    if (existingUser) {
      console.log('User already exists:', existingUser._id);
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ name, email, phone, passwordHash, location, city, state, district, panchayat });
    await user.save();
    console.log('User created:', user._id);

    const farm = new Farm({ userId: user._id, name: `${name}'s Farm` });
    await farm.save();
    console.log('Farm created:', farm._id);

    user.farm = farm._id;
    await user.save();
    console.log('User updated with farm ID.');

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Signup error:', error);
    // Ensure error object is useful
    const errorMsg = error.message || String(error);
    const errorStack = error.stack;
    res.status(500).json({
      message: 'Server error during signup',
      error: errorMsg,
      details: errorStack
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Find user by phone number
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    console.log('User logged in:', user._id);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send OTP for phone verification
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    console.log('Send OTP request:', { phone });

    if (!phone) {
      console.log('Error: Phone number missing');
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // Validate phone format (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      console.log('Error: Invalid phone format:', phone);
      return res.status(400).json({ success: false, message: 'Invalid phone number format' });
    }

    console.log('Sending OTP to:', phone);
    const result = await twilioService.sendOTP(phone);
    console.log('Send OTP result:', result);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    console.log('Verify OTP request:', { phone, otp });

    if (!phone || !otp) {
      console.log('Missing phone or OTP');
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    // Validate phone format
    if (!/^\d{10}$/.test(phone)) {
      console.log('Invalid phone format:', phone);
      return res.status(400).json({ success: false, message: 'Invalid phone number format' });
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      console.log('Invalid OTP format:', otp);
      return res.status(400).json({ success: false, message: 'Invalid OTP format' });
    }

    const result = await twilioService.verifyOTP(phone, otp);
    console.log('Verification result:', result);

    if (result.success) {
      // Check if user exists
      const user = await User.findOne({ phone });

      if (user) {
        // Existing user - generate token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log('Existing user logged in:', user._id);
        return res.status(200).json({
          success: true,
          token,
          isNewUser: false,
          message: 'OTP verified successfully'
        });
      } else {
        // New user - return success but no token (they need to complete signup)
        console.log('New user verified:', phone);
        return res.status(200).json({
          success: true,
          isNewUser: true,
          message: 'OTP verified. Please complete your profile.'
        });
      }
    } else {
      console.log('OTP verification failed:', result.message);
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP', error: error.message });
  }
};
