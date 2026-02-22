const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const upload = require('../middleware/imageUpload');


// POST /api/auth/register
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      companyName,
      phoneNumber,
      email,
      country,
      district,
      city,
      password
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      companyName,
      phoneNumber,
      email,
      country,
      district,
      city,
      password: hashedPassword,
      profilePicture: req.file ? `/uploads/${req.file.filename}` : null

    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Registration failed',
      details: err.message
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    req.session.user = {
  id: user._id,
  name: user.name,
  email: user.email,
  district: user.district,
  city: user.city,
  volunteerHours: user.volunteerHours || 0,
  eventsParticipated: user.eventsParticipated || 0
};

req.session.save(err => {
  if (err) {
    return res.status(500).json({ message: 'Failed to save session', error: err.message });
  }

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: req.session.user
  });
});

  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// GET /api/auth/status
router.get('/status', (req, res) => {
  if (req.session && req.session.user) {
    return res.status(200).json({
      loggedIn: true,
      user: req.session.user
    });
  } else {
    return res.status(200).json({ loggedIn: false });
  }
});



module.exports = router;
