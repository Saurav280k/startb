import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (username, email, password)
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone ? phone.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token (email, password)
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        message: 'Signed in successfully',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password directly
// @route   PUT /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully! You can now log in with your new password.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile details (phone, username)
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { phone, username } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }
    if (username !== undefined && username.trim().length > 0) {
      user.username = username.trim();
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate or register user via Google OAuth (ID token)
// @route   POST /api/auth/google
export const googleAuth = async (req, res) => {
  try {
    const { credential, clientId } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential token is required' });
    }

    // Verify token using Google's tokeninfo endpoint
    let payload;
    try {
      const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      if (!googleRes.ok) {
        return res.status(401).json({ success: false, message: 'Invalid or expired Google authentication token' });
      }
      payload = await googleRes.json();
    } catch (fetchErr) {
      return res.status(500).json({ success: false, message: 'Failed to verify token with Google servers: ' + fetchErr.message });
    }

    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google account does not provide an email address' });
    }

    // Find existing user by googleId or email
    let user = await User.findOne({
      $or: [{ googleId }, { email: email.toLowerCase().trim() }],
    });

    if (user) {
      // If user exists, link Google ID and update avatar if missing
      if (!user.googleId) user.googleId = googleId;
      if (picture && !user.avatar) user.avatar = picture;
      await user.save();
    } else {
      // Create new user
      const baseUsername = (name || email.split('@')[0])
        .replace(/[^a-zA-Z0-9_]/g, '_')
        .toLowerCase()
        .slice(0, 20);

      let finalUsername = baseUsername.length >= 3 ? baseUsername : `user_${baseUsername}`;
      const existingUser = await User.findOne({ username: finalUsername });
      if (existingUser) {
        finalUsername = `${finalUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
      }

      user = await User.create({
        username: finalUsername,
        email: email.toLowerCase().trim(),
        googleId,
        avatar: picture || '',
        password: '',
        role: 'user',
      });
    }

    res.json({
      success: true,
      message: `Signed in successfully as ${user.username}!`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone || '',
        avatar: user.avatar || '',
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


