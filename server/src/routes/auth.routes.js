const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, updateProfile, updatePassword, deleteAccount } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

router.post(
    '/register',
    [
        body('name', 'Name is required').notEmpty(),
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    validate,
    register
);

router.post(
    '/login',
    [
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password is required').exists()
    ],
    validate,
    login
);

router.get('/me', protect, getMe);

router.put(
    '/profile',
    [
        body('name', 'Name is required').notEmpty()
    ],
    validate,
    protect,
    updateProfile
);

router.put(
    '/password',
    [
        body('currentPassword', 'Current password is required').exists(),
        body('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    validate,
    protect,
    updatePassword
);

router.delete(
    '/profile',
    [
        body('password', 'Password is required to delete account').exists()
    ],
    validate,
    protect,
    deleteAccount
);

module.exports = router;
