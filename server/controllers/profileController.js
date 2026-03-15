const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/profile/me
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            skills: user.skills || [],
            experienceYears: user.experienceYears || 0,
            location: user.location || 'Remote',
            bio: user.bio || '',
            phone: user.phone || '',
            linkedin: user.linkedin || '',
            github: user.github || '',
            portfolio: user.portfolio || '',
            avatar: user.avatar || '',
            createdAt: user.createdAt
        }
    });
});

// @desc    Update profile
// @route   PUT /api/profile/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const allowedFields = [
        'name', 'skills', 'experienceYears', 'location',
        'bio', 'phone', 'linkedin', 'github', 'portfolio', 'avatar'
    ];

    const updates = {};
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    // Handle skills as comma-separated or array
    if (updates.skills && typeof updates.skills === 'string') {
        updates.skills = updates.skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true
    });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Update localStorage user data on frontend by returning full user
    res.json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            skills: user.skills || [],
            experienceYears: user.experienceYears || 0,
            location: user.location || 'Remote',
            bio: user.bio || '',
            phone: user.phone || '',
            linkedin: user.linkedin || '',
            github: user.github || '',
            portfolio: user.portfolio || '',
            avatar: user.avatar || '',
            createdAt: user.createdAt
        }
    });
});

module.exports = { getProfile, updateProfile };
