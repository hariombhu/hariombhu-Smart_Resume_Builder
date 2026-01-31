'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, FileText, Edit, Trash2, Download, Share2, Copy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            fetchResumes();
        }
    }, [user, authLoading, router]);

    const fetchResumes = async () => {
        try {
            const response = await api.get('/resume');
            setResumes(response.data.data);
        } catch (error) {
            toast.error('Failed to load resumes');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this resume?')) return;

        try {
            await api.delete(`/resume/${id}`);
            toast.success('Resume deleted successfully');
            fetchResumes();
        } catch (error) {
            toast.error('Failed to delete resume');
        }
    };

    const handleDuplicate = async (id) => {
        try {
            await api.post(`/resume/${id}/duplicate`);
            toast.success('Resume duplicated successfully');
            fetchResumes();
        } catch (error) {
            toast.error('Failed to duplicate resume');
        }
    };

    const handleDownload = async (id, name) => {
        try {
            const response = await api.get(`/resume/${id}/pdf`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${name}_Resume.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('Resume downloaded successfully');
        } catch (error) {
            toast.error('Failed to download resume');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
                <Loader text="Loading your resumes..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen  bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            My Resumes
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage all your professional resumes in one place
                        </p>
                    </div>
                    <Button
                        icon={<Plus className="w-5 h-5" />}
                        onClick={() => router.push('/create')}
                    >
                        Create New Resume
                    </Button>
                </div>

                {/* Resumes Grid */}
                {resumes.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-12 text-center"
                    >
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            No resumes yet
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Create your first professional resume in minutes
                        </p>
                        <Button
                            icon={<Plus className="w-5 h-5" />}
                            onClick={() => router.push('/create')}
                        >
                            Create Your First Resume
                        </Button>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume, index) => (
                            <motion.div
                                key={resume._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card p-6 hover-lift"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                            {resume.personalInfo.fullName}'s Resume
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Updated {new Date(resume.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="px-2 py-1 rounded bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                                            {resume.completeness}%
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">Template:</span> {resume.templateId?.name}
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                                        <div
                                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${resume.completeness}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        icon={<Edit className="w-4 h-4" />}
                                        onClick={() => router.push(`/edit/${resume._id}`)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        icon={<Download className="w-4 h-4" />}
                                        onClick={() => handleDownload(resume._id, resume.personalInfo.fullName)}
                                    >
                                        PDF
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        icon={<Copy className="w-4 h-4" />}
                                        onClick={() => handleDuplicate(resume._id)}
                                    >
                                        Duplicate
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        icon={<Trash2 className="w-4 h-4" />}
                                        onClick={() => handleDelete(resume._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
