const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const multer = require('multer');
const { generateToken } = require('../Helpers/jwt');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Function to handle user registration

const register = async (req, res) => {
  const { fullName, email, password, phoneNumber, nationalId, role } = req.body;
  console.log(req.body);

  if (!fullName || !email || !password || !nationalId) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }

  try {
    // Import the createWallet function
    const { createWallet } = await import('../services/walletService.mjs');

    let existingUser = await User.findOne({ $or: [{ email }, { nationalId }] });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    existingUser = await User.findOne({ nationalId });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists with this national ID number' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create wallet and credit it with Ether
    const { address, privateKey, balance } = await createWallet();

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      nationalId,
      role: role || 'user',
      wallet: {
        address,
        privateKey,
        balance, // The balance is credited during wallet creation
      },
    });

    await newUser.save();

    const payload = {
      user: {
        id: newUser.id,
        role: newUser.role,
      },
    };

    const accessToken = generateToken(payload);
    const refreshToken = generateToken(payload, true);

    res.json({ accessToken, refreshToken, role: newUser.role });
  } catch (error) {
    console.error(`Error during registration: ${error.message}`);
    console.log(error);
    res.status(500).send('Server Error');
  }
};


// Function to handle user login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const accessToken = generateToken(payload); // Generate access token
    const refreshToken = generateToken(payload, true); // Generate refresh token

    res.json({ accessToken, refreshToken, role: user.role });
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    res.status(500).send('Server Error');
  }
};


// Function to handle user logout
const logout = async (req, res) => {
  res.json({ msg: 'Logged out successfully' });
};

// Function to get the current user
const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, msg: 'User not authenticated' });
    }

    // Validate user object
    if (!req.user.fullName) {
      return res.status(400).json({ success: false, msg: 'Invalid user object' });
    }

    const data = {
      fullName: req.user.fullName,
      email: req.user.email, // You can include other fields if needed
      phoneNumber: req.user.phoneNumber,
      NationalIDNumber:req.user.nationalId,
    };

    // Return user fullName
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ msg: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, 'your_refresh_secret');
    const payload = {
      user: {
        id: decoded.user.id,
        role: decoded.user.role,
      },
    };

    // Generate new access token
    const newAccessToken = generateToken(payload);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(403).json({ msg: 'Invalid or expired refresh token' });
  }
};


module.exports = {
  register,
  login,
  logout,
  upload,
  getCurrentUser,
  refreshToken,
};
