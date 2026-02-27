import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = ({ label, error, className, id, ...props }: InputProps) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-slate-600 ml-1"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
          w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 
          text-slate-900 placeholder:text-slate-400
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          disabled:bg-stone-50 disabled:text-slate-400
          ${error ? 'border-alert focus:ring-alert/20 focus:border-alert' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <span className="text-xs text-alert font-medium ml-1">
                    {error}
                </span>
            )}
        </div>
    );
};
