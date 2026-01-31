/**
 * AI Service for resume suggestions and improvements
 * This is a simplified version - in production, integrate with OpenAI/Gemini API
 */

/**
 * Get AI suggestions for resume content
 * @param {Object} resume - Resume data
 * @returns {Object} Suggestions
 */
const getResumeSuggestions = async (resume) => {
    // Simulated AI suggestions
    // In production, integrate with actual AI API
    const suggestions = {
        summary: [],
        experience: [],
        skills: [],
        general: [],
    };

    // Check professional summary
    if (!resume.personalInfo.summary || resume.personalInfo.summary.length < 100) {
        suggestions.summary.push({
            type: 'improvement',
            message: 'Add a compelling professional summary (100-200 words) highlighting your key achievements and career goals.',
        });
    }

    // Check work experience
    if (resume.experience && resume.experience.length > 0) {
        resume.experience.forEach((exp, index) => {
            if (!exp.achievements || exp.achievements.length === 0) {
                suggestions.experience.push({
                    type: 'improvement',
                    section: `Experience ${index + 1}`,
                    message: 'Add quantifiable achievements (e.g., "Increased sales by 25%", "Reduced costs by $50K")',
                });
            }
            if (exp.description && exp.description.length < 50) {
                suggestions.experience.push({
                    type: 'improvement',
                    section: `Experience ${index + 1}`,
                    message: 'Expand job description to better showcase your responsibilities and impact.',
                });
            }
        });
    } else {
        suggestions.experience.push({
            type: 'warning',
            message: 'Add work experience to make your resume more competitive.',
        });
    }

    // Check skills
    if (!resume.skills || resume.skills.length < 5) {
        suggestions.skills.push({
            type: 'improvement',
            message: 'Add more relevant skills. Aim for 8-12 skills that match your target role.',
        });
    }

    // General recommendations
    if (resume.completeness < 80) {
        suggestions.general.push({
            type: 'info',
            message: 'Complete all sections to increase your resume score above 80%.',
        });
    }

    if (!resume.projects || resume.projects.length === 0) {
        suggestions.general.push({
            type: 'suggestion',
            message: 'Add projects to showcase your practical skills and initiative.',
        });
    }

    if (!resume.certifications || resume.certifications.length === 0) {
        suggestions.general.push({
            type: 'suggestion',
            message: 'Add relevant certifications to strengthen your credentials.',
        });
    }

    return suggestions;
};

/**
 * Suggest keywords based on role
 * @param {string} role - Job role/position
 * @returns {Array} Suggested keywords
 */
const suggestKeywords = (role) => {
    const keywordMap = {
        'software engineer': ['Agile', 'Git', 'CI/CD', 'Testing', 'Code Review', 'APIs', 'Databases'],
        'frontend developer': ['React', 'Vue', 'Angular', 'HTML/CSS', 'JavaScript', 'Responsive Design', 'UI/UX'],
        'backend developer': ['Node.js', 'Python', 'Java', 'Databases', 'APIs', 'Microservices', 'Cloud'],
        'data scientist': ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization', 'R', 'TensorFlow'],
        'product manager': ['Roadmap', 'Stakeholder Management', 'Agile', 'Analytics', 'User Research', 'Strategy'],
        'designer': ['Figma', 'Adobe XD', 'UI/UX', 'Prototyping', 'User Research', 'Design Systems'],
    };

    const roleLower = role.toLowerCase();
    for (const [key, keywords] of Object.entries(keywordMap)) {
        if (roleLower.includes(key)) {
            return keywords;
        }
    }

    return ['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Project Management'];
};

/**
 * Improve text using AI suggestions
 * @param {string} text - Original text
 * @param {string} type - Type of improvement (action-oriented, quantifiable, etc.)
 * @returns {string} Improved text
 */
const improveText = (text, type = 'general') => {
    // Simulated text improvement
    // In production, use actual AI API

    const actionVerbs = [
        'Developed', 'Implemented', 'Designed', 'Led', 'Managed', 'Created',
        'Improved', 'Optimized', 'Streamlined', 'Increased', 'Reduced', 'Achieved'
    ];

    if (type === 'action-oriented') {
        // Check if starts with action verb
        const startsWithAction = actionVerbs.some(verb =>
            text.trim().toLowerCase().startsWith(verb.toLowerCase())
        );

        if (!startsWithAction) {
            return `Developed ${text}`;
        }
    }

    return text;
};

module.exports = {
    getResumeSuggestions,
    suggestKeywords,
    improveText,
};
