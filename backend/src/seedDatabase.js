const User = require('./models/User');
const Template = require('./models/Template');
const connectDB = require('./config/database');

/**
 * Seed database with initial data
 */
const seedDatabase = async () => {
    try {
        await connectDB();

        // Create admin user if doesn't exist
        const adminExists = await User.findOne({ role: 'admin' });

        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: process.env.ADMIN_EMAIL || 'admin@resumeplanner.com',
                password: process.env.ADMIN_PASSWORD || 'Admin@123',
                role: 'admin',
            });
            console.log('✅ Admin user created');
        }

        // Create default templates if none exist
        const templateCount = await Template.countDocuments();

        if (templateCount === 0) {
            const templates = [
                {
                    name: 'Modern Professional',
                    description: 'Clean and modern design perfect for tech professionals',
                    category: 'modern',
                    isATS: true,
                    layout: 'modern',
                    styles: {
                        primaryColor: '#3b82f6',
                        secondaryColor: '#1e40af',
                        fontFamily: 'Inter',
                        fontSize: '14px',
                    },
                },
                {
                    name: 'Classic Minimal',
                    description: 'Timeless and ATS-friendly template for all industries',
                    category: 'minimal',
                    isATS: true,
                    layout: 'minimal',
                    styles: {
                        primaryColor: '#000000',
                        secondaryColor: '#333333',
                        fontFamily: 'Arial',
                        fontSize: '12px',
                    },
                },
                {
                    name: 'Creative Bold',
                    description: 'Stand out with bold colors and creative layout',
                    category: 'creative',
                    isATS: false,
                    layout: 'creative',
                    styles: {
                        primaryColor: '#8b5cf6',
                        secondaryColor: '#6d28d9',
                        fontFamily: 'Poppins',
                        fontSize: '13px',
                    },
                },
                {
                    name: 'Classic Traditional',
                    description: 'Traditional resume format for conservative industries',
                    category: 'classic',
                    isATS: true,
                    layout: 'classic',
                    styles: {
                        primaryColor: '#1f2937',
                        secondaryColor: '#4b5563',
                        fontFamily: 'Times New Roman',
                        fontSize: '12px',
                    },
                },
            ];

            await Template.insertMany(templates);
            console.log('✅ Default templates created');
        }

        console.log('✅ Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;
