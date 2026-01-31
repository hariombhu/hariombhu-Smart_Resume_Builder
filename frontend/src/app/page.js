'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Sparkles, Zap, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function HomePage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const features = [
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: 'AI-Powered Suggestions',
            description: 'Get intelligent recommendations to improve your resume content',
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: 'Professional Templates',
            description: 'Choose from ATS-friendly templates designed by experts',
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: 'Quick & Easy',
            description: 'Create your resume in minutes with our step-by-step wizard',
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: 'ATS Optimized',
            description: 'Ensure your resume passes through Applicant Tracking Systems',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
                        Build Your Dream Resume
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
                        Create professional, ATS-friendly resumes with AI assistance.
                        <br />
                        Perfect for students and job seekers.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            href="/login"
                            className="px-8 py-4 bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 dark:hover:bg-dark-700 transition-all"
                        >
                            Sign In
                        </Link>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="glass-card p-6 hover-lift"
                        >
                            <div className="text-primary-600 dark:text-primary-400 mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-24 glass-card p-12 max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl font-bold mb-4">Ready to stand out?</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        Join thousands of job seekers who've landed their dream jobs with Resume Planner
                    </p>
                    <Link
                        href="/register"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                        Create Your Resume Now →
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
