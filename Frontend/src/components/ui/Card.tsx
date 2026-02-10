import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    glass?: boolean;
}

export const Card = ({ children, className, glass = false }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
        rounded-[2rem] p-6 shadow-sm border
        ${glass
                    ? 'bg-white/40 backdrop-blur-md border-white/20'
                    : 'bg-white border-slate-100 shadow-slate-200/50'}
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
};
