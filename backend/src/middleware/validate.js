const Joi = require('joi');

/**
 * Validation middleware factory
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors,
            });
        }

        next();
    };
};

/**
 * Validation schemas
 */
const schemas = {
    register: Joi.object({
        name: Joi.string().required().max(100).trim(),
        email: Joi.string().email().required().lowercase().trim(),
        password: Joi.string().min(6).required(),
    }),

    login: Joi.object({
        email: Joi.string().email().required().lowercase().trim(),
        password: Joi.string().required(),
    }),

    updateProfile: Joi.object({
        name: Joi.string().max(100).trim(),
        email: Joi.string().email().lowercase().trim(),
        profilePhoto: Joi.string().uri(),
    }),

    createResume: Joi.object({
        templateId: Joi.string().required(),
        personalInfo: Joi.object({
            fullName: Joi.string().required().trim(),
            email: Joi.string().email().required().trim(),
            phone: Joi.string().trim(),
            location: Joi.string().trim(),
            profilePhoto: Joi.string().uri(),
            linkedIn: Joi.string().uri(),
            github: Joi.string().uri(),
            portfolio: Joi.string().uri(),
            summary: Joi.string().max(1000),
        }).required(),
        education: Joi.array().items(
            Joi.object({
                institution: Joi.string().required(),
                degree: Joi.string().required(),
                field: Joi.string(),
                startDate: Joi.date(),
                endDate: Joi.date(),
                grade: Joi.string(),
                description: Joi.string(),
            })
        ),
        experience: Joi.array().items(
            Joi.object({
                company: Joi.string().required(),
                position: Joi.string().required(),
                startDate: Joi.date(),
                endDate: Joi.date(),
                current: Joi.boolean(),
                description: Joi.string(),
                achievements: Joi.array().items(Joi.string()),
            })
        ),
        skills: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert'),
            })
        ),
        projects: Joi.array().items(
            Joi.object({
                title: Joi.string().required(),
                description: Joi.string(),
                technologies: Joi.array().items(Joi.string()),
                link: Joi.string().uri(),
                startDate: Joi.date(),
                endDate: Joi.date(),
            })
        ),
        certifications: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                issuer: Joi.string(),
                date: Joi.date(),
                link: Joi.string().uri(),
            })
        ),
        isPublic: Joi.boolean(),
    }),

    createTemplate: Joi.object({
        name: Joi.string().required().trim(),
        description: Joi.string().required(),
        thumbnail: Joi.string().uri(),
        category: Joi.string().valid('modern', 'classic', 'creative', 'minimal', 'ats'),
        isATS: Joi.boolean(),
        layout: Joi.string().valid('modern', 'minimal', 'creative', 'classic').required(),
        styles: Joi.object({
            primaryColor: Joi.string(),
            secondaryColor: Joi.string(),
            fontFamily: Joi.string(),
            fontSize: Joi.string(),
        }),
    }),
};

module.exports = { validate, schemas };
