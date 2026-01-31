const Template = require('../models/Template');
const uploadService = require('../services/uploadService');

/**
 * @desc    Get all active templates
 * @route   GET /api/template
 * @access  Public
 */
exports.getAllTemplates = async (req, res, next) => {
    try {
        const templates = await Template.find({ isActive: true }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: templates.length,
            data: templates,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single template
 * @route   GET /api/template/:id
 * @access  Public
 */
exports.getTemplate = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found',
            });
        }

        res.status(200).json({
            success: true,
            data: template,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new template (Admin only)
 * @route   POST /api/template/create
 * @access  Private/Admin
 */
exports.createTemplate = async (req, res, next) => {
    try {
        const template = await Template.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Template created successfully',
            data: template,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update template (Admin only)
 * @route   PUT /api/template/:id
 * @access  Private/Admin
 */
exports.updateTemplate = async (req, res, next) => {
    try {
        const template = await Template.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Template updated successfully',
            data: template,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete template (Admin only)
 * @route   DELETE /api/template/:id
 * @access  Private/Admin
 */
exports.deleteTemplate = async (req, res, next) => {
    try {
        const template = await Template.findByIdAndDelete(req.params.id);

        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Template deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Upload custom template
 * @route   POST /api/template/upload-custom
 * @access  Private
 */
exports.uploadCustomTemplate = async (req, res, next) => {
    try {
        if (!req.files || !req.files.template) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a template file',
            });
        }

        const templateFile = req.files.template;

        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
        ];

        if (!allowedTypes.includes(templateFile.mimetype)) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a PDF or Word document',
            });
        }

        // Upload to Cloudinary
        const result = await uploadService.uploadFile(templateFile.tempFilePath);

        // Create template record
        const template = await Template.create({
            name: req.body.name || templateFile.name.replace(/\.[^/.]+$/, ''),
            description: req.body.description || 'Custom uploaded template',
            category: 'custom',
            layout: 'custom',
            isATS: req.body.isATS === 'true' || false,
            isCustom: true,
            customTemplateUrl: result.secure_url,
            cloudinaryId: result.public_id,
            userId: req.user.id,
            isActive: true,
        });

        res.status(201).json({
            success: true,
            message: 'Custom template uploaded successfully',
            data: template,
        });
    } catch (error) {
        next(error);
    }
};
