const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        templateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Template',
            required: true,
        },
        personalInfo: {
            fullName: { type: String, required: true, trim: true },
            email: { type: String, required: true, trim: true },
            phone: { type: String, trim: true },
            location: { type: String, trim: true },
            profilePhoto: { type: String },
            linkedIn: { type: String },
            github: { type: String },
            portfolio: { type: String },
            summary: { type: String, maxlength: 1000 },
        },
        education: [
            {
                institution: { type: String, required: true },
                degree: { type: String, required: true },
                field: { type: String },
                startDate: { type: Date },
                endDate: { type: Date },
                grade: { type: String },
                description: { type: String },
            },
        ],
        experience: [
            {
                company: { type: String, required: true },
                position: { type: String, required: true },
                startDate: { type: Date },
                endDate: { type: Date },
                current: { type: Boolean, default: false },
                description: { type: String },
                achievements: [{ type: String }],
            },
        ],
        skills: [
            {
                name: { type: String, required: true },
                level: {
                    type: String,
                    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
                    default: 'intermediate',
                },
            },
        ],
        projects: [
            {
                title: { type: String, required: true },
                description: { type: String },
                technologies: [{ type: String }],
                link: { type: String },
                startDate: { type: Date },
                endDate: { type: Date },
            },
        ],
        certifications: [
            {
                name: { type: String, required: true },
                issuer: { type: String },
                date: { type: Date },
                link: { type: String },
            },
        ],
        completeness: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        shareableLink: {
            type: String,
            unique: true,
            default: () => nanoid(10),
        },
        qrCode: {
            type: String,
            default: null,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ shareableLink: 1 });

// Calculate completeness before saving
resumeSchema.pre('save', function (next) {
    let score = 0;
    const weights = {
        personalInfo: 20,
        education: 15,
        experience: 20,
        skills: 15,
        projects: 15,
        certifications: 15,
    };

    // Personal Info (20 points)
    if (this.personalInfo.fullName && this.personalInfo.email) score += 10;
    if (this.personalInfo.phone) score += 3;
    if (this.personalInfo.summary) score += 7;

    // Education (15 points)
    if (this.education && this.education.length > 0) score += 15;

    // Experience (20 points)
    if (this.experience && this.experience.length > 0) score += 20;

    // Skills (15 points)
    if (this.skills && this.skills.length >= 3) score += 15;
    else if (this.skills && this.skills.length > 0) score += 10;

    // Projects (15 points)
    if (this.projects && this.projects.length > 0) score += 15;

    // Certifications (15 points)
    if (this.certifications && this.certifications.length > 0) score += 15;

    this.completeness = Math.min(100, score);
    next();
});

module.exports = mongoose.model('Resume', resumeSchema);
