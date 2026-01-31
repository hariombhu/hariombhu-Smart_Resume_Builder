const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

// Admin login (public)
router.post('/login', validate(schemas.login), adminController.adminLogin);

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/users', adminController.getAllUsers);
router.get('/analytics', adminController.getAnalytics);
router.get('/resumes', adminController.getAllResumes);

// Template management
router.post(
    '/template',
    validate(schemas.createTemplate),
    adminController.createTemplate
);
router.put('/template/:id', adminController.updateTemplate);
router.delete('/template/:id', adminController.deleteTemplate);
router.patch('/template/:id/toggle', adminController.toggleTemplate);

module.exports = router;
