'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        await login(formData.email, formData.password);
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Sign in to continue building your resume
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            icon={<Mail className="w-5 h-5" />}
                            placeholder="john@example.com"
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            icon={<Lock className="w-5 h-5" />}
                            placeholder="••••••••"
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            loading={loading}
                        >
                            Sign In
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link
                            href="/register"
                            className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-center text-gray-500 dark:text-gray-500">
                            Admin? <Link href="/admin/login" className="text-primary-600 dark:text-primary-400 hover:underline">Login here</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
