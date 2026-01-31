'use client';

import { motion } from 'framer-motion';

export default function Loader({ size = 'md', text = '' }) {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <motion.div
                className={`${sizes[size]} border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 rounded-full`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            {text && (
                <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                    {text}
                </p>
            )}
        </div>
    );
}
