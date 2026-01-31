const User = require('../models/User');
const Resume = require('../models/Resume');
const Template = require('../models/Template');

/**
 * @desc    Admin login
 * @route   POST /api/admin/login
 * @access  Public
 */
exports.adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find admin user
        const user = await User.findOne({ email, role: 'admin' }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials',
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials',
            });
        }

        const token = user.generateToken();

        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin
 */
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get analytics data
 * @route   GET /api/admin/analytics
 * @access  Admin
 */
exports.getAnalytics = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalResumes = await Resume.countDocuments();
        const totalTemplates = await Template.countDocuments();

        // Resumes created in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentResumes = await Resume.countDocuments({
            createdAt: { $gte: sevenDaysAgo },
        });

        // Most used templates
        const popularTemplates = await Template.find()
            .sort({ usageCount: -1 })
            .limit(5)
            .select('name usageCount');

        // Users registered per month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 },
            },
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalResumes,
                    totalTemplates,
                    recentResumes,
                },
                popularTemplates,
                userGrowth,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all resumes (admin)
 * @route   GET /api/admin/resumes
 * @access  Admin
 */
exports.getAllResumes = async (req, res, next) => {
    try {
        const resumes = await Resume.find()
            .populate('userId', 'name email')
            .populate('templateId', 'name')
            .sort({ createdAt: -1 })
            .limit(100);

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
 * @desc    Create template
 * @route   POST /api/admin/template
 * @access  Admin
 */
exports.createTemplate = async (req, res, next) => {
    try {
        const template = await Template.create({
            ...req.body,
            createdBy: req.user.id,
        });

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
 * @desc    Update template
 * @route   PUT /api/admin/template/:id
 * @access  Admin
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
 * @desc    Delete template
 * @route   DELETE /api/admin/template/:id
 * @access  Admin
 */
exports.deleteTemplate = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found',
            });
        }

        await template.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Template deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Toggle template active status
 * @route   PATCH /api/admin/template/:id/toggle
 * @access  Admin
 */
exports.toggleTemplate = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found',
            });
        }

        template.isActive = !template.isActive;
        await template.save();

        res.status(200).json({
            success: true,
            message: `Template ${template.isActive ? 'activated' : 'deactivated'} successfully`,
            data: template,
        });
    } catch (error) {
        next(error);
    }
};
