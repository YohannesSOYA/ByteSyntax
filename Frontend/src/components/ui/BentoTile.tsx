import React from 'react';
import { motion } from 'framer-motion';

interface BentoTileProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    className?: string;
    size?: 'small' | 'medium' | 'large' | 'tall' | 'wide';
}

export const BentoTile = ({
    children,
    title,
    subtitle,
    icon,
    className,
    size = 'medium'
}: BentoTileProps) => {
    const sizeClasses = {
        small: "col-span-1 row-span-1",
        medium: "col-span-2 row-span-1",
        large: "col-span-2 row-span-2",
        tall: "col-span-1 row-span-2",
        wide: "col-span-3 row-span-1",
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`
        relative overflow-hidden rounded-[2.5rem] p-8 
        bg-white border border-slate-100 shadow-xl shadow-slate-200/40
        ${sizeClasses[size]}
        ${className}
      `}
        >
            <div className="flex flex-col h-full gap-4">
                {(title || icon) && (
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            {title && <h3 className="text-xl font-bold text-slate-900 font-serif">{title}</h3>}
                            {subtitle && <p className="text-sm text-slate-500 font-sans">{subtitle}</p>}
                        </div>
                        {icon && (
                            <div className="p-3 bg-stone-50 rounded-2xl text-primary border border-slate-100">
                                {icon}
                            </div>
                        )}
                    </div>
                )}
                <div className="flex-1">
                    {children}
                </div>
            </div>

            {/* Decorative pulse element for "active" tiles */}
            <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-emerald-500 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
};
