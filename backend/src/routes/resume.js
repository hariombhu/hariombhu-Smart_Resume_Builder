const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

// Public routes
router.get('/share/:shareableLink', resumeController.getSharedResume);

// Protected routes
router.post(
    '/create',
    protect,
    validate(schemas.createResume),
    resumeController.createResume
);
router.get('/', protect, resumeController.getMyResumes);
router.get('/:id', protect, resumeController.getResume);
router.put('/:id', protect, resumeController.updateResume);
router.delete('/:id', protect, resumeController.deleteResume);
router.post('/:id/duplicate', protect, resumeController.duplicateResume);
router.get('/:id/pdf', protect, resumeController.downloadPDF);
router.post('/:id/calculate-score', protect, resumeController.calculateScore);

module.exports = router;
