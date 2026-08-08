const User = require('../models/User');
const Report = require('../models/Report');
const { generateToken } = require('../utils/jwt.utils');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = req.body.name || user.name;
            const updatedUser = await user.save();
            res.status(200).json({
                success: true,
                user: updatedUser
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');
        if (user) {
            const { currentPassword, newPassword } = req.body;
            if (!(await user.matchPassword(currentPassword))) {
                res.status(401);
                throw new Error('Incorrect current password');
            }
            user.password = newPassword;
            await user.save();
            res.status(200).json({ success: true, message: 'Password updated successfully' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete account
// @route   DELETE /api/auth/profile
// @access  Private
const deleteAccount = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');
        if (user) {
            const { password } = req.body;
            if (!(await user.matchPassword(password))) {
                res.status(401);
                throw new Error('Incorrect password');
            }
            await Report.deleteMany({ user: req.user.id });
            await User.findByIdAndDelete(req.user.id);
            res.status(200).json({ success: true, message: 'Account and data deleted' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
    updateProfile,
    updatePassword,
    deleteAccount
};
