const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

const router = express.Router();

// 1. USER REGISTRATION (POST /api/auth/register)
router.post('/register', async (req, res) => {
    try {
        const db = getDb();
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Please provide name, email, and password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters'
            });
        }

        // Check if user exists
        const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                error: 'User already exists with this email'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('users').insertOne(newUser);

        // Generate JWT token
        const token = jwt.sign(
            { userId: result.insertedId.toString(), email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertedId,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// 2. USER LOGIN (POST /api/auth/login)
router.post('/login', async (req, res) => {
    try {
        const db = getDb();
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Please provide email and password'
            });
        }

        // Find user
        const user = await db.collection('users').findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// 3. USER LOGOUT (POST /api/auth/logout)
// Note: With JWT, logout is client-side (delete token)
// This endpoint is for logging or server-side token blacklisting if needed
router.post('/logout', (req, res) => {
    // Client should remove token from storage
    res.json({
        message: 'Logout successful. Please remove token from client storage.'
    });
});

// Get current user (useful for checking token validity)
router.get('/me', async (req, res) => {
    try {
        const db = getDb();
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await db.collection('users').findOne(
            { _id: new ObjectId(decoded.userId) },
            { projection: { password: 0 } } // Exclude password
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });

    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
});

module.exports = router;