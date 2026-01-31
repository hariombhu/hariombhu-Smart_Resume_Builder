const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

// Public routes
router.post('/register', validate(schemas.register), authController.register);
router.post('/login', validate(schemas.login), authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put(
    '/update-profile',
    protect,
    validate(schemas.updateProfile),
    authController.updateProfile
);

module.exports = router;
