'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    icon = null,
    onClick,
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg btn-glow',
        secondary: 'bg-gray-200 dark:bg-dark-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-dark-600 focus:ring-gray-400',
        outline: 'border-2 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-dark-800 focus:ring-primary-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md',
        ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const isDisabled = disabled || loading;

    return (
        <motion.button
            type={type}
            disabled={isDisabled}
            onClick={onClick}
            whileHover={!isDisabled ? { scale: 1.02 } : {}}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {!loading && icon && <span className="mr-2">{icon}</span>}
            {children}
        </motion.button>
    );
}
