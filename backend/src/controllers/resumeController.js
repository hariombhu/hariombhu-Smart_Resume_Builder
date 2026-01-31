const Resume = require('../models/Resume');
const Template = require('../models/Template');
const pdfService = require('../services/pdfService');
const qrCodeService = require('../utils/qrCode');

/**
 * @desc    Create new resume
 * @route   POST /api/resume/create
 * @access  Private
 */
exports.createResume = async (req, res, next) => {
    try {
        const resumeData = {
            ...req.body,
            userId: req.user.id,
        };

        const resume = await Resume.create(resumeData);

        // Increment template usage
        await Template.findByIdAndUpdate(resume.templateId, {
            $inc: { usageCount: 1 },
        });

        // Generate QR code for shareable link
        const shareableUrl = `${process.env.FRONTEND_URL}/share/${resume.shareableLink}`;
        const qrCodeDataUrl = await qrCodeService.generateQRCode(shareableUrl);
        resume.qrCode = qrCodeDataUrl;
        await resume.save();

        const populatedResume = await Resume.findById(resume._id).populate('templateId');

        res.status(201).json({
            success: true,
            message: 'Resume created successfully',
            data: populatedResume,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all user resumes
 * @route   GET /api/resume
 * @access  Private
 */
exports.getMyResumes = async (req, res, next) => {
    try {
        const resumes = await Resume.find({ userId: req.user.id })
            .populate('templateId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: resumes.length,
            data: resumes,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single resume
 * @route   GET /api/resume/:id
 * @access  Private
 */
exports.getResume = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.id).populate('templateId');

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }

        // Make sure user owns this resume
        if (resume.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resume',
            });
        }

        res.status(200).json({
            success: true,
            data: resume,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update resume
 * @route   PUT /api/resume/:id
 * @access  Private
 */
exports.updateResume = async (req, res, next) => {
    try {
        let resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }

        // Make sure user owns this resume
        if (resume.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this resume',
            });
        }

        resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('templateId');

        res.status(200).json({
            success: true,
            message: 'Resume updated successfully',
            data: resume,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete resume
 * @route   DELETE /api/resume/:id
 * @access  Private
 */
exports.deleteResume = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }

        // Make sure user owns this resume
        if (resume.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this resume',
            });
        }

        await resume.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Resume deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Duplicate resume
 * @route   POST /api/resume/:id/duplicate
 * @access  Private
 */
exports.duplicateResume = async (req, res, next) => {
    try {
        const originalResume = await Resume.findById(req.params.id);

        if (!originalResume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }

        // Make sure user owns this resume
        if (originalResume.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to duplicate this resume',
            });
        }

        // Create a copy
        const resumeCopy = originalResume.toObject();
        delete resumeCopy._id;
        delete resumeCopy.shareableLink;
        delete resumeCopy.qrCode;
        delete resumeCopy.createdAt;
        delete resumeCopy.updatedAt;

        const newResume = await Resume.create(resumeCopy);

        // Generate QR code
        const shareableUrl = `${process.env.FRONTEND_URL}/share/${newResume.shareableLink}`;
        const qrCodeDataUrl = await qrCodeService.generateQRCode(shareableUrl);
        newResume.qrCode = qrCodeDataUrl;
        await newResume.save();

        const populatedResume = await Resume.findById(newResume._id).populate('templateId');

        res.status(201).json({
            success: true,
            message: 'Resume duplicated successfully',
            data: populatedResume,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Download resume as PDF
 * @route   GET /api/resume/:id/pdf
 * @access  Private
 */
exports.downloadPDF = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.id).populate('templateId');

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }

        // Make sure user owns this resume or it's public
        if (resume.userId.toString() !== req.user.id && !resume.isPublic) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to download this resume',
            });
        }

        const pdfBuffer = await pdfService.generatePDF(resume);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${resume.personalInfo.fullName}_Resume.pdf"`
        );
        res.send(pdfBuffer);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get public resume by shareable link
 * @route   GET /api/resume/share/:shareableLink
 * @access  Public
 */
exports.getSharedResume = async (req, res, next) => {
    try {
        const resume = await Resume.findOne({
            shareableLink: req.params.shareableLink,
            isPublic: true,
        }).populate('templateId');

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found or not public',
            });
        }

        res.status(200).json({
            success: true,
            data: resume,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Calculate resume score
 * @route   POST /api/resume/:id/calculate-score
 * @access  Private
 */
exports.calculateScore = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }

        // Score is calculated automatically in pre-save hook
        await resume.save();

        res.status(200).json({
            success: true,
            data: {
                completeness: resume.completeness,
            },
        });
    } catch (error) {
        next(error);
    }
};
