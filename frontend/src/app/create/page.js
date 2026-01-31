'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Save, Download, Check, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import toast from 'react-hot-toast';

const steps = [
    { id: 1, title: 'Personal Info', description: 'Tell us about yourself', icon: '👤' },
    { id: 2, title: 'Education', description: 'Your academic background', icon: '🎓' },
    { id: 3, title: 'Experience', description: 'Work history & achievements', icon: '💼' },
    { id: 4, title: 'Skills', description: 'Your expertise & abilities', icon: '⚡' },
    { id: 5, title: 'Projects', description: 'Showcase your work', icon: '🚀' },
    { id: 6, title: 'Template', description: 'Choose your design', icon: '🎨' },
];

export default function CreateResumePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [uploadingTemplate, setUploadingTemplate] = useState(false);
    const [customTemplateFile, setCustomTemplateFile] = useState(null);

    const [formData, setFormData] = useState({
        templateId: '',
        personalInfo: {
            fullName: user?.name || '',
            email: user?.email || '',
            phone: '',
            location: '',
            title: '',
            summary: '',
            linkedIn: '',
            github: '',
            portfolio: '',
        },
        education: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await api.get('/template');
            setTemplates(response.data.data || []);
        } catch (error) {
            console.error('Failed to load templates');
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSave = async () => {
        // Validation
        if (!formData.personalInfo.fullName || !formData.personalInfo.email) {
            toast.error('Please fill in your name and email');
            return;
        }

        if (!formData.templateId) {
            toast.error('Please select a template');
            setCurrentStep(6);
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/resume/create', formData);
            toast.success('🎉 Resume created successfully!');
            setTimeout(() => router.push('/dashboard'), 1000);
        } catch (error) {
            console.error('Error:', error.response?.data);
            const errorMsg = error.response?.data?.errors
                ? error.response.data.errors.join(', ')
                : error.response?.data?.message || 'Failed to save resume';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const updatePersonalInfo = (field, value) => {
        setFormData({
            ...formData,
            personalInfo: { ...formData.personalInfo, [field]: value },
        });
    };

    // Education handlers
    const addEducation = () => {
        setFormData({
            ...formData,
            education: [...formData.education, {
                institution: '',
                degree: '',
                field: '',
                startDate: '',
                endDate: '',
                grade: '',
                description: '',
            }],
        });
    };

    const updateEducation = (index, field, value) => {
        const newEducation = [...formData.education];
        newEducation[index][field] = value;
        setFormData({ ...formData, education: newEducation });
    };

    const removeEducation = (index) => {
        setFormData({
            ...formData,
            education: formData.education.filter((_, i) => i !== index),
        });
    };

    // Experience handlers
    const addExperience = () => {
        setFormData({
            ...formData,
            experience: [...formData.experience, {
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
            }],
        });
    };

    const updateExperience = (index, field, value) => {
        const newExperience = [...formData.experience];
        newExperience[index][field] = value;
        setFormData({ ...formData, experience: newExperience });
    };

    const removeExperience = (index) => {
        setFormData({
            ...formData,
            experience: formData.experience.filter((_, i) => i !== index),
        });
    };

    // Skills handlers - NOW WITH CORRECT FORMAT
    const addSkill = (skillName) => {
        if (skillName && !formData.skills.find(s => s.name === skillName)) {
            setFormData({
                ...formData,
                skills: [...formData.skills, { name: skillName, level: 'intermediate' }]
            });
        }
    };

    const removeSkill = (skillName) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(s => s.name !== skillName),
        });
    };

    // Projects handlers - NOW WITH CORRECT FORMAT (title not name)
    const addProject = () => {
        setFormData({
            ...formData,
            projects: [...formData.projects, {
                title: '',
                description: '',
                technologies: [],
                link: '',
            }],
        });
    };

    const updateProject = (index, field, value) => {
        const newProjects = [...formData.projects];
        newProjects[index][field] = value;
        setFormData({ ...formData, projects: newProjects });
    };

    const removeProject = (index) => {
        setFormData({
            ...formData,
            projects: formData.projects.filter((_, i) => i !== index),
        });
    };

    // Certifications handlers
    const addCertification = () => {
        setFormData({
            ...formData,
            certifications: [...formData.certifications, {
                name: '',
                issuer: '',
                date: '',
                link: '',
            }],
        });
    };

    const updateCertification = (index, field, value) => {
        const newCerts = [...formData.certifications];
        newCerts[index][field] = value;
        setFormData({ ...formData, certifications: newCerts });
    };

    const removeCertification = (index) => {
        setFormData({
            ...formData,
            certifications: formData.certifications.filter((_, i) => i !== index),
        });
    };

    const selectTemplate = (templateId) => {
        setFormData({ ...formData, templateId });
    };

    const handleCustomTemplateUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a PDF or DOC file');
            return;
        }

        setUploadingTemplate(true);
        const formDataUpload = new FormData();
        formDataUpload.append('template', file);
        formDataUpload.append('name', file.name.replace(/\.[^/.]+$/, ''));
        formDataUpload.append('description', 'Custom uploaded template');
        formDataUpload.append('isCustom', 'true');

        try {
            const response = await api.post('/template/upload-custom', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const newTemplate = response.data.data;
            setTemplates([...templates, newTemplate]);
            setFormData({ ...formData, templateId: newTemplate._id });
            setCustomTemplateFile(file);
            toast.success('✨ Custom template uploaded successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload template');
        } finally {
            setUploadingTemplate(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-8">
            <div className="container mx-auto px-4">
                {/* Progress Bar */}
                <div className="max-w-6xl mx-auto mb-8">
                    <div className="flex justify-between items-center mb-2">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`flex items-center ${step.id < steps.length ? 'flex-1' : ''}`}
                            >
                                <div className="flex flex-col items-center relative">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 cursor-pointer ${currentStep >= step.id
                                            ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg'
                                            : 'bg-gray-200 dark:bg-dark-700 text-gray-500 dark:text-gray-400'
                                            }`}
                                        onClick={() => setCurrentStep(step.id)}
                                    >
                                        {currentStep > step.id ? <Check className="w-6 h-6" /> : step.icon}
                                    </motion.div>
                                    <div className="text-xs mt-2 text-center hidden sm:block max-w-[80px]">
                                        <div className={`font-medium ${currentStep >= step.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'}`}>
                                            {step.title}
                                        </div>
                                    </div>
                                </div>
                                {step.id < steps.length && (
                                    <div className={`h-1 flex-1 mx-2 rounded transition-all duration-300 ${currentStep > step.id
                                        ? 'bg-gradient-to-r from-primary-600 to-purple-600'
                                        : 'bg-gray-200 dark:bg-dark-700'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
                        </p>
                    </div>
                </div>

                {/* Form Content */}
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="glass-card p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-4xl">{steps[currentStep - 1].icon}</span>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {steps[currentStep - 1].title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {steps[currentStep - 1].description}
                                    </p>
                                </div>
                            </div>

                            {/* Step 1: Personal Info */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Full Name *"
                                            value={formData.personalInfo.fullName}
                                            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                                            placeholder="John Doe"
                                            required
                                        />
                                        <Input
                                            label="Email *"
                                            type="email"
                                            value={formData.personalInfo.email}
                                            onChange={(e) => updatePersonalInfo('email', e.target.value)}
                                            placeholder="john@example.com"
                                            required
                                        />
                                        <Input
                                            label="Phone Number"
                                            value={formData.personalInfo.phone}
                                            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                                            placeholder="+1 (234) 567-8900"
                                        />
                                        <Input
                                            label="Location"
                                            value={formData.personalInfo.location}
                                            onChange={(e) => updatePersonalInfo('location', e.target.value)}
                                            placeholder="San Francisco, CA"
                                        />
                                    </div>

                                    <Input
                                        label="Professional Title"
                                        value={formData.personalInfo.title}
                                        onChange={(e) => updatePersonalInfo('title', e.target.value)}
                                        placeholder="Senior Software Engineer"
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Professional Summary
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                                            rows={4}
                                            value={formData.personalInfo.summary}
                                            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                                            placeholder="Brief professional summary highlighting your experience and achievements..."
                                        />
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-dark-600 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Links</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Input
                                                label="LinkedIn"
                                                value={formData.personalInfo.linkedIn}
                                                onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
                                                placeholder="https://linkedin.com/in/yourprofile"
                                            />
                                            <Input
                                                label="GitHub"
                                                value={formData.personalInfo.github}
                                                onChange={(e) => updatePersonalInfo('github', e.target.value)}
                                                placeholder="https://github.com/yourusername"
                                            />
                                            <Input
                                                label="Portfolio"
                                                value={formData.personalInfo.portfolio}
                                                onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                                                placeholder="https://yourportfolio.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Education */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    {formData.education.map((edu, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-6 border-2 border-gray-200 dark:border-dark-600 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-dark-800 dark:to-dark-700"
                                        >
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Education #{index + 1}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    label="Institution"
                                                    value={edu.institution}
                                                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                                    placeholder="University of California"
                                                />
                                                <Input
                                                    label="Degree"
                                                    value={edu.degree}
                                                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                    placeholder="Bachelor of Science"
                                                />
                                                <Input
                                                    label="Field of Study"
                                                    value={edu.field}
                                                    onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                                    placeholder="Computer Science"
                                                />
                                                <Input
                                                    label="Grade/GPA"
                                                    value={edu.grade}
                                                    onChange={(e) => updateEducation(index, 'grade', e.target.value)}
                                                    placeholder="3.8/4.0"
                                                />
                                                <Input
                                                    label="Start Date"
                                                    type="month"
                                                    value={edu.startDate}
                                                    onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                                                />
                                                <Input
                                                    label="End Date"
                                                    type="month"
                                                    value={edu.endDate}
                                                    onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                                                />
                                            </div>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => removeEducation(index)}
                                                className="mt-4"
                                            >
                                                Remove Education
                                            </Button>
                                        </motion.div>
                                    ))}
                                    <Button onClick={addEducation} className="w-full">
                                        + Add Education
                                    </Button>
                                </div>
                            )}

                            {/* Step 3: Experience */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    {formData.experience.map((exp, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-6 border-2 border-gray-200 dark:border-dark-600 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-dark-800 dark:to-dark-700"
                                        >
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Experience #{index + 1}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    label="Company"
                                                    value={exp.company}
                                                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                                    placeholder="Google Inc."
                                                />
                                                <Input
                                                    label="Position"
                                                    value={exp.position}
                                                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                                    placeholder="Senior Software Engineer"
                                                />
                                                <Input
                                                    label="Start Date"
                                                    type="month"
                                                    value={exp.startDate}
                                                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                                />
                                                <Input
                                                    label="End Date"
                                                    type="month"
                                                    value={exp.endDate}
                                                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                                    disabled={exp.current}
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={exp.current}
                                                        onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                                                        className="mr-2 w-4 h-4"
                                                    />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                        I currently work here
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Description & Achievements
                                                </label>
                                                <textarea
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none"
                                                    rows={4}
                                                    value={exp.description}
                                                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                                    placeholder="• Led a team of 5 engineers...&#10;• Increased system performance by 40%...&#10;• Implemented microservices architecture..."
                                                />
                                            </div>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => removeExperience(index)}
                                                className="mt-4"
                                            >
                                                Remove Experience
                                            </Button>
                                        </motion.div>
                                    ))}
                                    <Button onClick={addExperience} className="w-full">
                                        + Add Experience
                                    </Button>
                                </div>
                            )}

                            {/* Step 4: Skills */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                        <p className="text-sm text-blue-800 dark:text-blue-300">
                                            💡 Add relevant skills for your role. Press Enter after typing each skill.
                                        </p>
                                    </div>

                                    <Input
                                        placeholder="Type a skill and press Enter (e.g., JavaScript, Python, Leadership)"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSkill(e.target.value.trim());
                                                e.target.value = '';
                                            }
                                        }}
                                    />

                                    <div className="flex flex-wrap gap-3">
                                        {formData.skills.map((skill, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-full text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                                            >
                                                {skill.name}
                                                <button
                                                    onClick={() => removeSkill(skill.name)}
                                                    className="hover:bg-white/20 rounded-full p-1 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </motion.span>
                                        ))}
                                    </div>

                                    {formData.skills.length === 0 && (
                                        <p className="text-gray-500 text-center py-8">No skills added yet. Start typing to add your first skill!</p>
                                    )}
                                </div>
                            )}

                            {/* Step 5: Projects */}
                            {currentStep === 5 && (
                                <div className="space-y-6">
                                    {formData.projects.map((project, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-6 border-2 border-gray-200 dark:border-dark-600 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-dark-800 dark:to-dark-700"
                                        >
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Project #{index + 1}</h3>
                                            <Input
                                                label="Project Title"
                                                value={project.title}
                                                onChange={(e) => updateProject(index, 'title', e.target.value)}
                                                placeholder="E-commerce Platform"
                                            />
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none"
                                                    rows={3}
                                                    value={project.description}
                                                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                                                    placeholder="Built a full-stack e-commerce platform with React and Node.js..."
                                                />
                                            </div>
                                            <Input
                                                label="Project Link (GitHub, Live Demo, etc.)"
                                                value={project.link}
                                                onChange={(e) => updateProject(index, 'link', e.target.value)}
                                                placeholder="https://github.com/username/project"
                                                className="mt-4"
                                            />
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => removeProject(index)}
                                                className="mt-4"
                                            >
                                                Remove Project
                                            </Button>
                                        </motion.div>
                                    ))}
                                    <Button onClick={addProject} className="w-full">
                                        + Add Project
                                    </Button>
                                </div>
                            )}

                            {/* Step 6: Template Selection */}
                            {currentStep === 6 && (
                                <div className="space-y-6">
                                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                                        <p className="text-sm text-purple-800 dark:text-purple-300">
                                            🎨 Choose a template that matches your style, or upload your own custom template!
                                        </p>
                                    </div>

                                    {/* Custom Template Upload */}
                                    <div className="border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-xl p-8 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/10 dark:to-purple-900/10">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                            <span className="text-2xl">📤</span>
                                            Upload Your Own Template
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            Upload your custom PDF or Word template with placeholders like <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">{'{{fullName}}'}</code>, <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">{'{{email}}'}</code>, etc.
                                        </p>

                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                                            <p className="text-xs text-blue-800 dark:text-blue-300 font-medium mb-2">📝 Available Placeholders:</p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                                <code className="px-2 py-1 bg-white dark:bg-gray-800 rounded">{'{{fullName}}'}</code>
                                                <code className="px-2 py-1 bg-white dark:bg-gray-800 rounded">{'{{email}}'}</code>
                                                <code className="px-2 py-1 bg-white dark:bg-gray-800 rounded">{'{{phone}}'}</code>
                                                <code className="px-2 py-1 bg-white dark:bg-gray-800 rounded">{'{{location}}'}</code>
                                                <code className="px-2 py-1 bg-white dark:bg-gray-800 rounded">{'{{title}}'}</code>
                                                <code className="px-2 py-1 bg-white dark:bg-gray-800 rounded">{'{{summary}}'}</code>
                                                <code className="px-2 py-1 bg-white dark:bg-gray-800 rounded">{'{{skills}}'}</code>
                                                <code className="px-2 py-1 bg-white dark:bg-gray-800 rounded">{'{{experience}}'}</code>
                                            </div>
                                        </div>

                                        <label className="cursor-pointer">
                                            <div className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
                                                {uploadingTemplate ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                        <span className="font-medium">Uploading...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download className="w-5 h-5" />
                                                        <span className="font-medium">
                                                            {customTemplateFile ? `Uploaded: ${customTemplateFile.name}` : 'Choose PDF or Word File'}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleCustomTemplateUpload}
                                                className="hidden"
                                                disabled={uploadingTemplate}
                                            />
                                        </label>
                                    </div>

                                    {/* Divider */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-4 bg-white dark:bg-dark-900 text-gray-500">OR choose a pre-made template</span>
                                        </div>
                                    </div>

                                    {/* Pre-made Templates */}
                                    {templates.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {templates.map((template) => (
                                                <motion.div
                                                    key={template._id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => selectTemplate(template._id)}
                                                    className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all ${formData.templateId === template._id
                                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-xl'
                                                        : 'border-gray-200 dark:border-dark-600 hover:border-primary-400 hover:shadow-lg'
                                                        }`}
                                                >
                                                    {formData.templateId === template._id && (
                                                        <div className="absolute top-3 right-3 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                                                            <Check className="w-5 h-5 text-white" />
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-3 mb-3">
                                                        <FileText className="w-10 h-10 text-primary-600" />
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                                {template.name}
                                                            </h3>
                                                            <p className="text-xs text-gray-500">{template.category || 'Custom'}</p>
                                                        </div>
                                                    </div>

                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                        {template.description}
                                                    </p>

                                                    {template.isATS && (
                                                        <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-medium rounded">
                                                            ✓ ATS Friendly
                                                        </span>
                                                    )}

                                                    {template.isCustom && (
                                                        <span className="inline-flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 text-xs font-medium rounded ml-2">
                                                            📤 Custom Upload
                                                        </span>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                                            <p className="text-gray-500">Loading templates...</p>
                                        </div>
                                    )}

                                    {formData.templateId && (
                                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                            <p className="text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                                                <Check className="w-4 h-4" />
                                                Template selected! Click "Create Resume" to finish.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-8 max-w-6xl mx-auto">
                        <Button
                            variant="secondary"
                            icon={<ArrowLeft className="w-5 h-5" />}
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                        >
                            Previous
                        </Button>

                        <div className="flex gap-3">
                            {currentStep < steps.length ? (
                                <Button
                                    icon={<ArrowRight className="w-5 h-5" />}
                                    onClick={handleNext}
                                    iconPosition="right"
                                >
                                    Next Step
                                </Button>
                            ) : (
                                <Button
                                    icon={<Download className="w-5 h-5" />}
                                    onClick={handleSave}
                                    loading={loading}
                                    disabled={!formData.templateId}
                                >
                                    Create Resume
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
