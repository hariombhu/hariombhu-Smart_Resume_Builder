'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Loader from '@/components/common/Loader';
import toast from 'react-hot-toast';

export default function EditResumePage() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [resume, setResume] = useState(null);

    useEffect(() => {
        if (params.id) {
            fetchResume();
        }
    }, [params.id]);

    const fetchResume = async () => {
        try {
            const response = await api.get(`/resume/${params.id}`);
            setResume(response.data.data);
        } catch (error) {
            toast.error('Failed to load resume');
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put(`/resume/${params.id}`, resume);
            toast.success('Resume updated successfully!');
            router.push('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update resume');
        } finally {
            setSaving(false);
        }
    };

    const updatePersonalInfo = (field, value) => {
        setResume({
            ...resume,
            personalInfo: { ...resume.personalInfo, [field]: value },
        });
    };

    const updateEducation = (index, field, value) => {
        const newEducation = [...resume.education];
        newEducation[index][field] = value;
        setResume({ ...resume, education: newEducation });
    };

    const addEducation = () => {
        setResume({
            ...resume,
            education: [
                ...resume.education,
                {
                    institution: '',
                    degree: '',
                    field: '',
                    startDate: '',
                    endDate: '',
                    grade: '',
                },
            ],
        });
    };

    const removeEducation = (index) => {
        const newEducation = resume.education.filter((_, i) => i !== index);
        setResume({ ...resume, education: newEducation });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
                <Loader text="Loading resume..." />
            </div>
        );
    }

    if (!resume) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="secondary"
                        icon={<ArrowLeft className="w-5 h-5" />}
                        onClick={() => router.push('/dashboard')}
                    >
                        Back to Dashboard
                    </Button>
                    <Button
                        icon={<Save className="w-5 h-5" />}
                        onClick={handleSave}
                        loading={saving}
                    >
                        Save Changes
                    </Button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 space-y-8"
                >
                    {/* Personal Info Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                value={resume.personalInfo.fullName}
                                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={resume.personalInfo.email}
                                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                            />
                            <Input
                                label="Phone"
                                value={resume.personalInfo.phone}
                                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                            />
                            <Input
                                label="Location"
                                value={resume.personalInfo.location}
                                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                            />
                            <div className="md:col-span-2">
                                <Input
                                    label="Professional Title"
                                    value={resume.personalInfo.title}
                                    onChange={(e) => updatePersonalInfo('title', e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Professional Summary
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all"
                                    rows={4}
                                    value={resume.personalInfo.summary}
                                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Education Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Education
                            </h2>
                            <Button size="sm" onClick={addEducation}>
                                + Add
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {resume.education.map((edu, index) => (
                                <div
                                    key={index}
                                    className="p-4 border border-gray-200 dark:border-dark-600 rounded-lg"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Institution"
                                            value={edu.institution}
                                            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                        />
                                        <Input
                                            label="Degree"
                                            value={edu.degree}
                                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                        />
                                        <Input
                                            label="Field"
                                            value={edu.field}
                                            onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                        />
                                        <Input
                                            label="Grade"
                                            value={edu.grade}
                                            onChange={(e) => updateEducation(index, 'grade', e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeEducation(index)}
                                        className="mt-4"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button
                            icon={<Save className="w-5 h-5" />}
                            onClick={handleSave}
                            loading={saving}
                        >
                            Save Changes
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
