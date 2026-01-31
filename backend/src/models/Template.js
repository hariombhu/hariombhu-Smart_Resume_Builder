const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Template name is required'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Template description is required'],
        },
        thumbnail: {
            type: String,
            default: null,
        },
        category: {
            type: String,
            enum: ['modern', 'classic', 'creative', 'minimal', 'ats', 'custom'],
            default: 'modern',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isATS: {
            type: Boolean,
            default: false,
        },
        isCustom: {
            type: Boolean,
            default: false,
        },
        customTemplateUrl: {
            type: String,
            default: null,
        },
        cloudinaryId: {
            type: String,
            default: null,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        layout: {
            type: String,
            required: true,
            enum: ['modern', 'minimal', 'creative', 'classic', 'custom'],
        },
        styles: {
            primaryColor: { type: String, default: '#3b82f6' },
            secondaryColor: { type: String, default: '#1e40af' },
            fontFamily: { type: String, default: 'Inter' },
            fontSize: { type: String, default: '14px' },
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        usageCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Increment usage count
templateSchema.methods.incrementUsage = async function () {
    this.usageCount += 1;
    await this.save();
};

module.exports = mongoose.model('Template', templateSchema);
