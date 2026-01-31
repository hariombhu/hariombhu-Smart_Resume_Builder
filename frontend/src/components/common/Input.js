'use client';

export default function Input({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    required = false,
    disabled = false,
    className = '',
    icon = null,
    error = '',
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`
            w-full rounded-lg border border-gray-300 dark:border-dark-600
            bg-white dark:bg-dark-800
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:border-primary-500 focus:ring-2 focus:ring-primary-500
            disabled:bg-gray-100 dark:disabled:bg-dark-700 disabled:cursor-not-allowed
            transition-all duration-200
            ${icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5'}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
