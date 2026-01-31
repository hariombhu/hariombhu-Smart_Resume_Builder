const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');
const {
    createTemplate,
    getAllTemplates,
    getTemplate,
    updateTemplate,
    deleteTemplate,
    uploadCustomTemplate,
} = require('../controllers/templateController');

// Public routes
router.get('/', getAllTemplates);
router.get('/:id', getTemplate);

// Protected routes
router.post('/upload-custom', protect, uploadCustomTemplate);

// Admin routes
router.post('/create', protect, authorize('admin'), validate(schemas.createTemplate), createTemplate);
router.put('/:id', protect, authorize('admin'), updateTemplate);
router.delete('/:id', protect, authorize('admin'), deleteTemplate);

module.exports = router;
