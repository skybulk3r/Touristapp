const express = require('express');
const router = express.Router();
const { User, Role } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyToken, verifyAdmin, verifyUser } = require('../middleware/middleware');

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

// Register a new user (Default role: User with ID 2)
router.post('/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Validate email format
      if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
  
      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      // Hash the password and create the user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        RoleId: 2, // Default role is User with ID 2
      });
  
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          user_id: newUser.user_id,
          name: newUser.name,
          email: newUser.email,
          role: 'User',
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email }, include: [Role] });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.RoleId, // RoleId determines admin (1) or user (2)
      },
      process.env.TOKEN_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.RoleId === 1 ? 'Admin' : 'User',
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected route (User-only access)
router.get('/user-protected', verifyToken, verifyUser, async (req, res) => {
  res.status(200).json({
    message: 'Access granted to user-protected route',
    user: req.user,
  });
});

// Protected route (Admin-only access)
router.get('/admin-protected', verifyToken, verifyAdmin, async (req, res) => {
  res.status(200).json({
    message: 'Access granted to admin-protected route',
    admin: req.user,
  });
});

module.exports = router;
